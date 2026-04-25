export interface Settings {
  id: 'default'
  activeProjectId: string | 'all'
  activeTagIds: string[]
  todayCount: number
  pomodoroMinutes: number
  breakMinutes: number
  theme: 'system' | 'light' | 'dark'
  brainView: 'list' | 'card'
}

export const DEFAULT_SETTINGS: Settings = {
  id: 'default',
  activeProjectId: 'all',
  activeTagIds: [],
  todayCount: 3,
  pomodoroMinutes: 25,
  breakMinutes: 5,
  theme: 'system',
  brainView: 'list',
}
