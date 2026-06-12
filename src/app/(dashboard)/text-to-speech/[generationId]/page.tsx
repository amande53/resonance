import TextToSpeechDetailView from "@/features/text-to-speech/views/text-to-speech-detail-view";
import { trpc, HydrateClient, prefetch } from "@/trpc/server";
import { TRPCError } from "@trpc/server";
import { notFound } from "next/navigation";

export default async function TextToSpeechDetailPage({
  params,
}: {
  params: Promise<{ generationId: string }>;
}) {
  const { generationId } = await params;

  try {
    await prefetch(trpc.generations.getById.queryOptions({ id: generationId }));
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound();
    }

    throw error;
  }

  await prefetch(trpc.voices.getAll.queryOptions());

  return (
    <HydrateClient>
      <TextToSpeechDetailView generationId={generationId} />
    </HydrateClient>
  );
}
