import { DEFAULT_SETTINGS } from '@/features/settings/settings-types'
import { PROJECTS, SEED_TAGS, SEED_TASKS } from '@/data/seed'
import { getDb } from './client'
import { SEED_VERSION } from './schema'

export async function bootstrapDatabase() {
  const db = await getDb()
  const seeded = await db.get('meta', 'seededVersion')
  if (seeded?.value === SEED_VERSION) return

  const tx = db.transaction(['projects', 'tags', 'tasks', 'settings', 'meta'], 'readwrite')
  await Promise.all([
    ...PROJECTS.filter((p) => p.id !== 'all').map((project) => tx.objectStore('projects').put(project)),
    ...SEED_TAGS.map((tag) => tx.objectStore('tags').put(tag)),
    ...SEED_TASKS.map((task) => tx.objectStore('tasks').put(task)),
    tx.objectStore('settings').put(DEFAULT_SETTINGS),
    tx.objectStore('meta').put({ key: 'seededVersion', value: SEED_VERSION }),
  ])
  await tx.done
}
