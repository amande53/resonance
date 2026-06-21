import { VoiceCloningView } from "@/features/voices/views/voice-cloning-view";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Voice Cloning" };

export default function VoiceCloningPage() {
  return <VoiceCloningView />;
}
