import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TextSizePreference = 'default' | 'large'

export type SettingsState = {
  soundEnabled: boolean
  musicVolume: number
  effectsVolume: number
  reducedMotion: boolean
  textSize: TextSizePreference
  setSoundEnabled: (enabled: boolean) => void
  setMusicVolume: (volume: number) => void
  setEffectsVolume: (volume: number) => void
  setReducedMotion: (enabled: boolean) => void
  setTextSize: (size: TextSizePreference) => void
}

const clampVolume = (value: number) => Math.min(1, Math.max(0, value))

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      musicVolume: 0.7,
      effectsVolume: 0.8,
      reducedMotion: false,
      textSize: 'default',
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setMusicVolume: (musicVolume) => set({ musicVolume: clampVolume(musicVolume) }),
      setEffectsVolume: (effectsVolume) =>
        set({ effectsVolume: clampVolume(effectsVolume) }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setTextSize: (textSize) => set({ textSize }),
    }),
    {
      name: 'evidence-room-settings',
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        musicVolume: state.musicVolume,
        effectsVolume: state.effectsVolume,
        reducedMotion: state.reducedMotion,
        textSize: state.textSize,
      }),
    },
  ),
)
