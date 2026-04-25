import { deleteDB } from 'idb'
import { beforeEach, describe, expect, it } from 'vitest'
import { bootstrapDatabase } from './bootstrap'
import { getDb, resetDbConnectionForTests } from './client'
import { DB_NAME } from './schema'

beforeEach(async () => {
  resetDbConnectionForTests()
  await deleteDB(DB_NAME)
  resetDbConnectionForTests()
})

describe('bootstrapDatabase', () => {
  it('seeds once and never persists the all sentinel as a project', async () => {
    await bootstrapDatabase()
    const db = await getDb()
    const projects = await db.getAll('projects')
    expect(projects.some((project) => project.id === 'all')).toBe(false)
    const firstCount = (await db.getAll('tasks')).length
    await bootstrapDatabase()
    expect((await db.getAll('tasks')).length).toBe(firstCount)
  })
})
