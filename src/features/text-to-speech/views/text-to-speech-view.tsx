"use client"

import {useSuspenseQuery} from "@tanstack/react-query"

import {useTRPC} from "@/trpc/client"
import { SettingsPanel } from "@/features/text-to-speech/components/settings-panel";
import { TextInputPanel } from "@/features/text-to-speech/components/text-input-panel";
import { VoicePreviewPlaceholder } from "@/features/text-to-speech/components/voice-preview-placeholder";
import {
  TextToSpeechForm,
  defaultTTSValues,
  type TTSFormValues
} from "../components/text-to-speech-form"
import { TTSVoiceProvider } from "../contexts/tts-voices-context"

export default function TextToSpeechView({
  initialValue,
}: {
  initialValue?: Partial<TTSFormValues>
  }) {
  const trpc = useTRPC()
  const {
    data:  voices
  } = useSuspenseQuery(trpc.voices.getAll.queryOptions())

  const {custom: customVoices, system: systemVoices} = voices

  const allVoices = [...customVoices, ...systemVoices]
  const fallbackVoiceId = allVoices[0]?.id ?? ""

  //Requested voices may no longer exist (deleted) fall back to first available
  const resolvedVoiceId =
     initialValue?.voiceId &&
  allVoices.some((v) => v.id === initialValue.voiceId)
      ? initialValue.voiceId
      :fallbackVoiceId

  const defaultValues: TTSFormValues = {
    ...defaultTTSValues,
    ...initialValue,
    voiceId: resolvedVoiceId,
  }
  
  return (
    <TTSVoiceProvider value={{customVoices, systemVoices, allVoices}}>
      <TextToSpeechForm defaultValues={defaultValues}>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col">
            <TextInputPanel />
            <VoicePreviewPlaceholder />
          </div>
          <SettingsPanel />
        </div>
      </TextToSpeechForm>
    </TTSVoiceProvider>
  );
}