import { useEffect, useState } from "react"
import { createAvatar } from "@dicebear/core"
import {glass} from "@dicebear/collection"

export function useVoiceAvatar(seed: string) {
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const avatar = createAvatar(glass, {
        seed,
        size: 128,
      }).toDataUri()

      setAvatarUrl(avatar)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [seed])

  return avatarUrl
}
