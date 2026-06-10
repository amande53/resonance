"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"
import {cn} from "@/lib/utils"
import { useVoiceAvatar } from "@/components/voice-avatar/use-voice-avatar"

interface VoiceAvatarProps {
  seed: string
  name?: string | null
  className?: string
}

export function VoiceAvatar({
  seed,
  name,
  className
}: VoiceAvatarProps) {
  const avatarUrl = useVoiceAvatar(seed)
  const displayName = name ?? ""
  const fallbackName = displayName.trim()
  const fallbackInitials =
    fallbackName.length === 0
      ? "??"
      : fallbackName.length === 1
        ? fallbackName.toUpperCase()
        : fallbackName.slice(0, 2).toUpperCase()

  return (
    <Avatar
      className={cn("size-4 border-white shadow-xs", className)}
    >
      <AvatarImage src={avatarUrl} alt={displayName} />
      <AvatarFallback className="text-[8px]">
        {fallbackInitials}
        </AvatarFallback>
    </Avatar>
  )
}
