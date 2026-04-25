export type QuadrantId = 'ui' | 'nui' | 'uni' | 'nuni'
export type ProjectFilterId = string | 'all'

export interface Task {
  id: string
  title: string
  note: string
  projectId: string
  tagIds: string[]
  quadrant: QuadrantId | null
  done: boolean
  focus: boolean
  estMin: number
  createdAt: string
  updatedAt: string
  completedAt?: string | null
}

export interface Project {
  id: string
  name: string
  color: string
  order: number
  archived?: boolean
}

export interface Tag {
  id: string
  name: string
  color: string
  order: number
}

export interface TaskDraft {
  title: string
  note?: string
  projectId: string
  tagIds?: string[]
  quadrant?: QuadrantId | null
  focus?: boolean
  estMin?: number
}

export interface TaskFilters {
  projectId?: ProjectFilterId
  tagIds?: string[]
  quadrant?: QuadrantId | null
  focus?: boolean
  done?: boolean
  inbox?: boolean
  search?: string
}
