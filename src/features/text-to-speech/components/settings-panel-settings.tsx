"use client";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { useTypedAppFormContext } from "@/hooks/use-app-form";

import { sliders } from "../data/sliders";
import { ttsFormOptions } from "@/features/text-to-speech/components/text-to-speech-form";
import { VoiceSelector } from "@/features/text-to-speech/components/voice-selector";

export function SettingsPanelSettings() {
  const form = useTypedAppFormContext(ttsFormOptions);

  return (
    <>
      {/* Voice Style Dropdown Section */}
      <div className="border-b border-dashed p-4">
        <VoiceSelector   />
      </div>

      {/* Voice Adjustments Section */}
      <div className="flex-1 p-4">
        <form.Subscribe
          selector={(state) => state.isSubmitting}
        >
          {(isSubmitting) => (
            <FieldGroup>
              {sliders.map((slider) => (
                <form.Field
                  key={slider.id}
                  name={slider.id}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel>{slider.label}</FieldLabel>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{slider.leftLabel}</span>

                        <span className="text-xs text-muted-foreground">{slider.rightLabel}</span>
                      </div>

                      <Slider
                        value={[field.state.value]}
                        onValueChange={(value) => field.handleChange(value[0])}
                        min={slider.min}
                        max={slider.max}
                        step={slider.step}
                        disabled={isSubmitting}
                        className="**:data-[slot=slider-thumb]:size-3 **:data-[slot=slider-thumb]:bg-foreground **data-[slot=slider-track]:h1"
                      />
                    </Field>
                  )}
                </form.Field>
              ))}
            </FieldGroup>
          )}
        </form.Subscribe>
      </div>
    </>
  );
}
