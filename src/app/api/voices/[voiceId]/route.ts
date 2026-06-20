import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getSignedAudioUrl } from "@/lib/r2";

export async function GET(_request: Request, { params }: { params: Promise<{ voiceId: string }> }) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { voiceId } = await params;

  const voice = await prisma.voice.findUnique({
    where: { id: voiceId },
    select: {
      variant: true,
      orgId: true,
      r2ObjectKey: true,
    },
  });

  if (!voice) {
    return new Response("Not found", { status: 404 });
  }

  if (voice.variant === "CUSTOM" && voice.orgId !== orgId) {
    return new Response("Not Found", { status: 404 });
  }

  if (!voice.r2ObjectKey) {
    return new Response("Audio is not available yet", { status: 409 });
  }

  let audioResponse: Response;

  try {
    const signedUrl = await getSignedAudioUrl(voice.r2ObjectKey);
    audioResponse = await fetch(signedUrl, {
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return new Response("Failed to fetch audio", { status: 502 });
  }

  if (!audioResponse.ok) {
    return new Response("Failed to fetch audio", { status: 502 });
  }

  const contentType = audioResponse.headers.get("content-type") || "audio/wav";

  return new Response(audioResponse.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control":
        voice.variant === "SYSTEM" ? "public, max-age=86400" : "private, max-age=3600",
    },
  });
}
