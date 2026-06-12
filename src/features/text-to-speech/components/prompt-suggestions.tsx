"use client";

import {
  BookOpen,
  Brain,
  Clapperboard,
  Gamepad2,
  Languages,
  Mic,
  Podcast,
  Smile,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { LucideIcon } from "lucide-react";

const PROMPT_SUGGESTIONS: {
  label: string;
  prompt: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Narrate a dreamy story",
    prompt:
      "In a tiny village wrapped in lavender fog and moonlight, there lived a clockmaker whose clocks never told the right time — they told the truth hidden inside a person’s heart. One rainy evening, a stranger in a silver coat stepped into the shop and asked for a clock that could show him the future. The clockmaker smiled softly and said, The future is easy to see. The harder question is whether you are brave enough to hear it.",
    icon: BookOpen,
  },
  {
    label: "Tell a cute silly joke",
    prompt:
      "Why did the cloud blush? Because the sky called it fluffy. Honestly, same. Then the cloud tried to act mysterious and dramatic, but one tiny breeze came through and ruined the whole aesthetic. Very main character, very soft chaos.",
    icon: Smile,
  },
  {
    label: "Record a cozy ad",
    prompt:
      "Introducing Moonberry Café — a dreamy little coffee blend made for soft mornings, late-night coding sessions, and pretending your life has a soundtrack. Smooth, sweet, and just a little magical, every cup feels like a warm hug with purple sparkles. Try Moonberry Café today and make your morning feel like a comeback stage.",
    icon: Mic,
  },
  {
    label: "Speak in different languages",
    prompt:
      "Hello and welcome, beautiful people. Today we're taking a soft little journey around the world. Bonjour, comment allez-vous? Hola, bienvenidos a todos. 안녕하세요, 만나서 반가워요. Ciao a tutti, benvenuti. Every language has its own rhythm, its own sparkle, and its own way of making the world feel a little bigger.",
    icon: Languages,
  },
  {
    label: "Direct a dramatic movie scene",
    prompt:
      "The rain painted silver lines down the window as she turned away from the city lights. You knew this would happen, didn't you? she whispered. He stepped closer, his voice low and shaking. I thought I was protecting you. She laughed once, soft and broken. No. You were protecting the version of you that couldn't tell me the truth.",
    icon: Clapperboard,
  },
  {
    label: "Hear from a fantasy game character",
    prompt:
      "Listen closely, starlight. The Kingdom of Lumeria is fading, and the Prism Heart has shattered into seven glowing pieces. Only you can restore its light. Gather your courage, trust your magic, and meet me beneath the violet moon at the Gates of Dawn. The shadows are moving quickly, but so are you.",
    icon: Gamepad2,
  },
  {
    label: "Introduce your podcast",
    prompt:
      "Hey besties, welcome back to another episode of Soft Signal — the podcast where creativity, technology, feelings, and a little bit of chaos all sit at the same table. I'm your host, and today we're talking about the ideas that make us feel brave enough to build something beautiful.",
    icon: Podcast,
  },
  {
    label: "Guide a cozy meditation",
    prompt:
      "Close your eyes and take a slow breath in. Hold it gently, like you're holding a tiny glowing star. Now release. Let your shoulders soften. Let your thoughts drift by like pastel clouds. You do not have to solve everything right now. You only have to be here. Breathe in calm. Breathe out the noise.",
    icon: Brain,
  },
];

export function PromptSuggestions({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="space-y-2.5">
      <p className="text-sm text-muted-foreground">Get started with</p>
      <div className="flex flex-wrap gap-2">
        {PROMPT_SUGGESTIONS.map((suggestion) => (
          <Badge
            key={suggestion.label}
            variant="outline"
            className="cursor-pointer gap-1.5 py-1 px-2.5 text-xs hover:bg-accent rounded-md"
            onClick={() => onSelect(suggestion.prompt)}
          >
            <suggestion.icon className="size-3.5 shrink-0" />
            {suggestion.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
