import type { QuadrantId } from '@/features/tasks/task-types'

export interface Quadrant {
  id: QuadrantId
  urgent: boolean
  important: boolean
  label: string
  hint: string
  tone: string
}

export const Q: Record<'UI' | 'NUI' | 'UNI' | 'NUNI', Quadrant> = {
  UI: { id: 'ui', urgent: true, important: true, label: 'Do now', hint: 'Urgent · Important', tone: 'border-accent/35 bg-accent-soft/55' },
  NUI: { id: 'nui', urgent: false, important: true, label: 'Schedule', hint: 'Not urgent · Important', tone: 'border-success/25 bg-paper' },
  UNI: { id: 'uni', urgent: true, important: false, label: 'Delegate', hint: 'Urgent · Not important', tone: 'border-ink-4/25 bg-paper' },
  NUNI: { id: 'nuni', urgent: false, important: false, label: 'Drop', hint: 'Neither', tone: 'border-hair bg-paper-2/70' },
}

export const QLIST = [Q.UI, Q.NUI, Q.UNI, Q.NUNI]
export const QUADRANT_ORDER: Array<QuadrantId | null> = ['ui', 'nui', 'uni', 'nuni', null]
export const quadrantRank = (q: QuadrantId | null) => QUADRANT_ORDER.indexOf(q)
