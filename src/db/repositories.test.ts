import { deleteDB } from 'idb'
import { beforeEach, describe, expect, it } from 'vitest'
import { bootstrapDatabase } from './bootstrap'
import { getDb, resetDbConnectionForTests } from './client'
import { updateTasks } from './repositories'
import { DB_NAME } from './schema'

beforeEach(async () => {
  resetDbConnectionForTests()
  await deleteDB(DB_NAME)
  resetDbConnectionForTests()
})

describe('updateTasks', () => {
  it('persists Matrix lane membership and order in one batch', async () => {
    await bootstrapDatabase()

    await updateTasks([
      { id: 't1', patch: { quadrant: 'nui', matrixOrder: 2000 } },
      { id: 't4', patch: { quadrant: 'nui', matrixOrder: 1000 } },
    ])

    const db = await getDb()
    await expect(db.get('tasks', 't1')).resolves.toEqual(expect.objectContaining({ quadrant: 'nui', matrixOrder: 2000 }))
    await expect(db.get('tasks', 't4')).resolves.toEqual(expect.objectContaining({ quadrant: 'nui', matrixOrder: 1000 }))
  })
})
