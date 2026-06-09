"use client";

import { createContext, useContext } from "react";
import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

type TTSVoiceItem =
  inferRouterOutputs<AppRouter>["voices"]["getAll"]["custom"][number];

interface TTSVoicesContextValue {
  customVoices: TTSVoiceItem[];
  systemVoices: TTSVoiceItem[];
  allVoices: TTSVoiceItem[];
}

const TTSVoiceContext = createContext<TTSVoicesContextValue | null>(null);

export function TTSVoiceProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: TTSVoicesContextValue
  }) { 
  return (
    <TTSVoiceContext.Provider value={value}>
      {children}
    </TTSVoiceContext.Provider>
  )
}

export function useTTSVoices() {
  const context = useContext(TTSVoiceContext)
  
  if (!context) {
    throw new Error("useTTSVoices must be used within a TTSVoiceProvider")
  }
  return context
}