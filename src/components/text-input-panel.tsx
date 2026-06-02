"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";

export function TextInputPanel() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleGenerate = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    router.push(`/text-to-speech?text=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div
      className="
  rounded-[22px]
  bg-linear-185
  from-[#8b5cf6] from-15%
  via-[#f472b6] via-45%
  to-[#22d3ee] to-85%
  p-0.5
  shadow-[0_0_30px_rgba(139,92,246,0.45)]
"
    >
      {/* Using px value for border-radius to ensure proper gradient border math (outer-padding = inner).
      Standard classes like rounded-4xl use CSS calc() which can cause the gradient border to be misaligned.
       */}
      <div className="rounded-[20px] bg-[#f9f9f9] p-1">
        <div className="space-y-4 rounded-2xl bg-white p-4 drop-shadow-xs">
          <Textarea
            placeholder="Start typing or paste your text here..."
            className="min-h-[35px] resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={TEXT_MAX_LENGTH}
          />

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="gap-1.5 border-dashed">
              <Coins className="size-3 text-chart-5" />
              <span className="text-xs">
                {text.length === 0 ? (
                  "Start typing to estimate"
                ) : (
                    <>
                      <span className="tabular-nums">
                        ${(text.length * 0.0003).toFixed(4)}
                      </span>{" "}
                      estimated
                    </>
                )}
              </span>
            </Badge>
            <span className="text-sm text-muted-foreground">
              {text.length.toLocaleString()}/{TEXT_MAX_LENGTH.toLocaleString()} characters
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end p-3">
          <Button
            size="sm"
            disabled={!text.trim()}
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}
