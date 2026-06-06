export interface QuickAction {
  title: string;
  description: string;
  gradient: string;
  href: string;
}

export const quickActions: QuickAction[] = [
  {
    title: "Read a Dreamy Story",
    description: "Turn soft, magical writing into expressive AI narration",
    gradient: "from-[#c084fc] via-[#e879f9] to-[#fce7f3]",
    href: `/text-to-speech?text=Under a lavender sky, a girl found a glowing letter tucked inside an old music box. The note simply said, When the world feels too heavy, follow the song. So she did. Through moonlit streets, past sleeping gardens, and into a place where every broken dream was waiting to bloom again.`,
  },
  {
    title: "Make a Cute Promo",
    description: "Create bright, polished ads with personality and sparkle",
    gradient: "from-[#ff8ee3] via-[#f9a8d4] to-[#fff1f7]",
    href: `/text-to-speech?text=Meet GlowPop Studio, your new favorite place for dreamy designs, soft colors, and websites that actually feel like you. Whether you're building a portfolio, a shop, or your next big idea, GlowPop gives your project the sparkle it deserves. Pretty, polished, and impossible to ignore.`,
  },
  {
    title: "Direct a K-Drama Scene",
    description: "Generate emotional dialogue with main-character energy",
    gradient: "from-[#a78bfa] via-[#c4b5fd] to-[#ede9fe]",
    href: `/text-to-speech?text=The rain fell softly outside the cafe window as she looked down at the bracelet in her hand. You remembered, she said, her voice barely above a whisper. He smiled sadly. I never forgot. For a moment, neither of them moved. The whole city felt quiet, like it was waiting for her answer.`,
  },
  {
    title: "Voice a Game Hero",
    description: "Build fantasy characters with bold, dramatic voices",
    gradient: "from-[#38bdf8] via-[#818cf8] to-[#f5d0fe]",
    href: `/text-to-speech?text=Listen closely, starlight warrior. The Moon Gate has opened, and the kingdom of Luria is running out of time. Three crystals remain hidden across the dreamlands, and only you can find them. Take your courage, trust your heart, and meet me where the purple roses grow.`,
  },
  {
    title: "Start a Cozy Podcast",
    description: "Hook listeners with a warm, aesthetic intro",
    gradient: "from-[#7dd3fc] via-[#c084fc] to-[#fbcfe8]",
    href: `/text-to-speech?text=Hey besties, welcome back to Soft Launch, the cozy little podcast where we talk creativity, coding, confidence, and building a life that actually feels like yours. Grab your coffee, your notebook, or your emotional support hoodie, because today we are getting into it.`,
  },
  {
    title: "Create a Calm Moment",
    description: "Craft soothing audio for rest, focus, and reset days",
    gradient: "from-[#bae6fd] via-[#ddd6fe] to-[#ffe4f1]",
    href: `/text-to-speech?text=Take a slow breath in, and let your shoulders soften. You do not have to solve everything right now. Let the noise fade into the background. You are safe in this small quiet moment. Breathe in gently. Breathe out the pressure. You are allowed to begin again.`,
  },
];
