import type { QuadrantId } from '@/features/tasks/task-types'

export type MatrixLaneId = 'urgent' | 'not-urgent'

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

export interface MatrixLane {
  id: MatrixLaneId
  label: string
  hint: string
  tone: string
}

export const MATRIX_LANES: MatrixLane[] = [
  {
    id: 'urgent',
    label: 'Urgent',
    hint: 'Higher = more important',
    tone: 'border-accent/35 bg-accent-soft/55',
  },
  {
    id: 'not-urgent',
    label: 'Not urgent',
    hint: 'Plan, park, or lower',
    tone: 'border-success/25 bg-paper',
  },
]

export function matrixLaneForQuadrant(quadrant: QuadrantId | null): MatrixLaneId {
  return quadrant === 'ui' || quadrant === 'uni' ? 'urgent' : 'not-urgent'
}

export function quadrantForMatrixLane(lane: MatrixLaneId): QuadrantId {
  return lane === 'urgent' ? 'ui' : 'nui'
}
