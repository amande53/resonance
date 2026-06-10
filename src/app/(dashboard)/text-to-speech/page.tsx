import type { Metadata } from "next";

import TextToSpeechView from "@/features/text-to-speech/views/text-to-speech-view";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = { title: "Text to Speech" };

const getSearchParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default async function TextToSpeech({
  searchParams,
}: {
  searchParams: Promise<{ text?: string | string[]; voiceId?: string | string[] }>;
}) {
  const params = await searchParams;
  const text = getSearchParam(params.text);
  const voiceId = getSearchParam(params.voiceId);

  await prefetch(trpc.voices.getAll.queryOptions());
  return (
    <HydrateClient>
      <TextToSpeechView initialValue={{ text, voiceId }} />
    </HydrateClient>
  );
}
