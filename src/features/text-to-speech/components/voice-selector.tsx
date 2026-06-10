"use client";

import { useStore } from "@tanstack/react-form";

import { VOICE_CATEGORY_LABELS } from "@/features/voices/data/voice-category";

import { Field, FieldLabel } from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { ttsFormOptions } from "@/features/text-to-speech/components/text-to-speech-form";
import { useTTSVoices } from "@/features/text-to-speech/contexts/tts-voices-context";
import { useTypedAppFormContext } from "@/hooks/use-app-form";

export function VoiceSelector() {
  const { customVoices, systemVoices, allVoices: voices } = useTTSVoices();

  const form = useTypedAppFormContext(ttsFormOptions);
  const voiceId = useStore(form.store, (s) => s.values.voiceId);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  const selectedVoice = voices.find((v) => v.id === voiceId);
  const hasMissingSelectedVoice = Boolean(voiceId) && !selectedVoice;
  const displayVoice = selectedVoice
    ? selectedVoice
    : hasMissingSelectedVoice
      ? {
          id: voiceId,
          name: "Unavailable Voice",
          category: null as null,
        }
      : voices.length > 0
        ? voices[0]
        : null;

  return (
    <Field>
      <FieldLabel>Voice Style</FieldLabel>
      <Select
        value={voiceId}
        onValueChange={(v) => form.setFieldValue("voiceId", v)}
        disabled={isSubmitting}
      >
        <SelectTrigger className="w-full h-auto gap-1 rounded-lg bg-white px-2 py-1">
          <SelectValue>
            {displayVoice && (
              <>
                <VoiceAvatar seed={displayVoice.id} name={displayVoice.name} />
                <span className="truncate text-sm font-medium tracking-light">
                  {displayVoice.name}
                  {displayVoice.category && ` - ${VOICE_CATEGORY_LABELS[displayVoice.category]}`}
                </span>
              </>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {hasMissingSelectedVoice && displayVoice && (
            <>
              <SelectGroup>
                <SelectLabel>Selected Voice</SelectLabel>
                <SelectItem value={displayVoice.id}>
                  <VoiceAvatar seed={displayVoice.id} name={displayVoice.name} />
                  <span className="truncate text-sm font-medium">
                    {displayVoice.name}
                    {displayVoice.category && ` - ${VOICE_CATEGORY_LABELS[displayVoice.category]}`}
                  </span>
                </SelectItem>
              </SelectGroup>
              {(customVoices.length > 0 || systemVoices.length > 0) && <SelectSeparator />}
            </>
          )}
          {customVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel>Team Voices</SelectLabel>
              {customVoices.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  <VoiceAvatar seed={v.id} name={v.name} />
                  <span className="truncate text-sm font-medium">
                    {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {customVoices.length > 0 && systemVoices.length > 0 && <SelectSeparator />}
          {systemVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel>Built-in Voices</SelectLabel>
              {systemVoices.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  <VoiceAvatar seed={v.id} name={v.name} />
                  <span className="truncate text-sm font-medium">
                    {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </Field>
  );
}
