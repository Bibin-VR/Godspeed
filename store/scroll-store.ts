type Listener = () => void

type ScrollState = {
  progress: number
}

const state: ScrollState = {
  progress: 0,
}

const listeners = new Set<Listener>()

export const scrollStore = {
  getState: (): ScrollState => state,
  setProgress: (nextProgress: number) => {
    const clamped = Math.max(0, Math.min(1, nextProgress))
    if (clamped === state.progress) return
    state.progress = clamped
    listeners.forEach((listener) => listener())
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
