import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export default async function TestPage() {
  const { orgId } = await auth();

  const voices = await prisma.voice.findMany({
    where: {
      OR: [{ variant: "SYSTEM" }, { orgId }],
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Voices ({voices.length})</h1>
      <ul className="space-y-2">
        {voices.map((voice) => (
          <li key={voice.id}>
            {voice.name} - {voice.variant}
          </li>
        ))}
      </ul>
    </div>
  );
}
