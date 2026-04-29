import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import i18n from '@/i18n'
import { bootstrapDatabase } from '@/db/bootstrap'
import { archiveProject as archiveProjectRepo, createProject, createTag, createTask, deleteTask, patchSettings, readAll, replaceProject, updateTask } from '@/db/repositories'
import { DEFAULT_SETTINGS, type Settings } from '@/features/settings/settings-types'
import type { Project, Tag, Task, TaskDraft } from './task-types'

interface TaskStoreValue {
  ready: boolean
  tasks: Task[]
  projects: Project[]
  tags: Tag[]
  settings: Settings
  reload: () => Promise<void>
  addTask: (draft: TaskDraft) => Promise<Task>
  patchTask: (id: string, patch: Partial<Task>) => Promise<Task>
  removeTask: (id: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  addTag: (name: string) => Promise<Tag>
  addProject: (name: string, color: string) => Promise<Project>
  renameProject: (id: string, patch: { name?: string; color?: string }) => Promise<Project>
  archiveProject: (id: string) => Promise<void>
  setSettings: (patch: Partial<Settings>) => Promise<Settings>
}

const TaskStoreContext = createContext<TaskStoreValue | null>(null)

export function TaskStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS)

  const reload = useCallback(async () => {
    await bootstrapDatabase()
    const next = await readAll()
    setTasks(next.tasks)
    setProjects(next.projects)
    setTags(next.tags)
    const hydratedSettings = { ...DEFAULT_SETTINGS, ...next.settings }
    setSettingsState(hydratedSettings)
    if (i18n.language !== hydratedSettings.language) await i18n.changeLanguage(hydratedSettings.language)
    setReady(true)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const addTask = useCallback(async (draft: TaskDraft) => {
    const task = await createTask(draft)
    await reload()
    return task
  }, [reload])

  const patchTask = useCallback(async (id: string, patch: Partial<Task>) => {
    const task = await updateTask(id, patch)
    await reload()
    return task
  }, [reload])

  const removeTask = useCallback(async (id: string) => {
    await deleteTask(id)
    await reload()
  }, [reload])

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find((candidate) => candidate.id === id)
    if (!task) return
    await updateTask(id, { done: !task.done })
    await reload()
  }, [reload, tasks])

  const addTag = useCallback(async (name: string) => {
    const tag = await createTag(name)
    await reload()
    return tag
  }, [reload])

  const addProject = useCallback(async (name: string, color: string) => {
    const project = await createProject(name, color)
    await patchSettings({ activeProjectId: project.id })
    await reload()
    return project
  }, [reload])

  const renameProject = useCallback(async (id: string, patch: { name?: string; color?: string }) => {
    const current = projects.find((p) => p.id === id)
    if (!current) throw new Error(`Project ${id} not found`)
    const next: Project = {
      ...current,
      ...(patch.name !== undefined ? { name: patch.name.trim() || current.name } : {}),
      ...(patch.color !== undefined ? { color: patch.color } : {}),
    }
    const saved = await replaceProject(next)
    await reload()
    return saved
  }, [projects, reload])

  const archiveProject = useCallback(async (id: string) => {
    await archiveProjectRepo(id)
    if (settings.activeProjectId === id) {
      await patchSettings({ activeProjectId: 'all' })
    }
    await reload()
  }, [reload, settings.activeProjectId])

  const setSettings = useCallback(async (patch: Partial<Settings>) => {
    const next = await patchSettings(patch)
    if (patch.language && i18n.language !== patch.language) await i18n.changeLanguage(patch.language)
    await reload()
    return next
  }, [reload])

  const value = useMemo<TaskStoreValue>(() => ({
    ready,
    tasks,
    projects,
    tags,
    settings,
    reload,
    addTask,
    patchTask,
    removeTask,
    toggleTask,
    addTag,
    addProject,
    renameProject,
    archiveProject,
    setSettings,
  }), [ready, tasks, projects, tags, settings, reload, addTask, patchTask, removeTask, toggleTask, addTag, addProject, renameProject, archiveProject, setSettings])

  return <TaskStoreContext.Provider value={value}>{children}</TaskStoreContext.Provider>
}

export function useTaskStore() {
  const value = useContext(TaskStoreContext)
  if (!value) throw new Error('useTaskStore must be used inside TaskStoreProvider')
  return value
}
