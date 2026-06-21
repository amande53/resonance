"use client"

import { useState } from "react";
import { toast } from "sonner";
import { AudioLines, Loader2, Mic, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VoiceRecorder } from "@/features/voices/components/voice-recorder";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

const MAX_AUDIO_SIZE_BYTES = 20 * 1024 * 1024;
const studioSteps = ["Record", "Label", "Create"];

type ClonedVoice = {
  id: string;
  name: string;
  description: string;
  fileName: string;
  createdAt: Date;
};

type FormErrors = {
  name?: string;
  file?: string;
  submit?: string;
};

function validateAudioFile(file: File | null) {
  if (!file) {
    return "Voice recording is required";
  }

  if (!file.type.startsWith("audio/")) {
    return "Recording must be an audio file";
  }

  if (file.size > MAX_AUDIO_SIZE_BYTES) {
    return "Recording must not exceed 20MB";
  }

  return undefined;
}

export function VoiceCloningView() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clonedVoices, setClonedVoices] = useState<ClonedVoice[]>([]);

  const handleRecordingChange = (nextFile: File | null) => {
    setFile(nextFile);
    setErrors((current) => ({
      ...current,
      file: validateAudioFile(nextFile),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {
      name: name.trim() ? undefined : "Voice name is required",
      file: validateAudioFile(file),
    };

    if (nextErrors.name || nextErrors.file || !file) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const params = new URLSearchParams({
        name: name.trim(),
        category: "GENERAL",
        language: "en-US",
      });

      if (description.trim()) {
        params.set("description", description.trim());
      }

      const response = await fetch(`/api/voices/create?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to create voice");
      }

      setClonedVoices((current) => [
        {
          id: crypto.randomUUID(),
          name: name.trim(),
          description: description.trim(),
          fileName: file.name,
          createdAt: new Date(),
        },
        ...current,
      ]);
      queryClient.invalidateQueries({
        queryKey: trpc.voices.getAll.queryKey(),
      });

      toast.success("Voice submitted successfully");
      setName("");
      setDescription("");
      setFile(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create voice";
      setErrors({ submit: message });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,hsl(262_90%_96%),transparent_34rem),radial-gradient(circle_at_top_right,hsl(188_88%_94%),transparent_30rem)] p-3 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid min-h-[calc(100dvh-8rem)] gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-stretch">
          <div className="flex flex-col justify-between rounded-[24px] border bg-white/80 p-5 shadow-sm backdrop-blur lg:p-7">
            <div className="space-y-6">
              <Badge variant="outline" className="w-fit gap-1.5 border-dashed bg-white/80">
                <Sparkles className="size-3.5 text-chart-5" />
                Voice Lab
              </Badge>
              <div className="space-y-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm">
                  <Mic className="size-6" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
                    Create custom voice
                  </h1>
                  <p className="text-sm leading-6 text-muted-foreground lg:text-base">
                    Record a clean sample, add the details that make it recognizable, and send it into your Resonance voice library.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {studioSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl border bg-white/80 p-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-col overflow-hidden rounded-[26px] bg-linear-185 from-[#8b5cf6] from-15% via-[#f472b6] via-48% to-[#22d3ee] to-90% p-0.5 shadow-[0_0_34px_rgba(139,92,246,0.28)]"
          >
            <div className="flex min-h-0 flex-1 flex-col rounded-[24px] bg-white/95 shadow-sm">
              <div className="flex flex-col gap-3 border-b p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recording studio</p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Capture the voice sample
                  </h2>
                </div>
                <div className="flex w-fit items-center gap-2 rounded-2xl border bg-[linear-gradient(145deg,hsl(0_0%_100%),hsl(220_33%_98%))] px-4 py-3 shadow-xs">
                  <AudioLines className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Recording only</span>
                </div>
              </div>

              <div className="grid flex-1 gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_360px] lg:p-6">
                <section className="flex min-h-[420px] flex-col justify-center rounded-2xl border bg-muted/20 p-4 lg:p-6">
                  <Field>
                    <FieldLabel>Voice recording</FieldLabel>
                    <VoiceRecorder
                      file={file}
                      onFileChange={handleRecordingChange}
                      isInvalid={!!errors.file}
                    />
                    <FieldDescription>
                      Record a clear audio sample. Only clone voices you own or have permission to use.
                    </FieldDescription>
                    {errors.file && <FieldError>{errors.file}</FieldError>}
                  </Field>
                </section>

                <aside className="flex flex-col gap-5 rounded-2xl border bg-white p-4 shadow-xs lg:p-5">
                  <Field>
                    <FieldLabel htmlFor="voice-name">Voice name</FieldLabel>
                    <Input
                      id="voice-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Warm narrator"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <FieldError>{errors.name}</FieldError>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="voice-description">Description</FieldLabel>
                    <Textarea
                      id="voice-description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Soft, friendly, and conversational..."
                      rows={7}
                    />
                    <FieldDescription>Optional notes to help your team recognize this voice.</FieldDescription>
                  </Field>

                  {errors.submit && <FieldError>{errors.submit}</FieldError>}

                  <Button type="submit" disabled={isSubmitting} className="mt-auto w-full">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Create voice
                      </>
                    )}
                  </Button>
                </aside>
              </div>
            </div>
          </form>
        </section>

        <section className="opacity-90">
          <Card className="rounded-2xl bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">My Cloned Voices</CardTitle>
            </CardHeader>
            <CardContent>
              {clonedVoices.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-muted/30 p-6 text-center">
                  <AudioLines className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium">No cloned voices yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Submitted voices will appear here while they process.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clonedVoices.map((voice) => (
                    <div key={voice.id} className="rounded-2xl border bg-white p-4 shadow-xs">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold tracking-tight">{voice.name}</p>
                          {voice.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {voice.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="border-dashed">
                          Processing
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                        <p className="truncate">{voice.fileName}</p>
                        <p>{voice.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
