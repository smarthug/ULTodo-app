import { openDB, type IDBPDatabase } from 'idb'
import { DB_NAME, DB_VERSION, type ULTodoDB } from './schema'

let dbPromise: Promise<IDBPDatabase<ULTodoDB>> | null = null

export function getDb() {
  dbPromise ??= openDB<ULTodoDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('tasks')) {
        const tasks = db.createObjectStore('tasks', { keyPath: 'id' })
        tasks.createIndex('projectId', 'projectId')
        tasks.createIndex('quadrant', 'quadrant')
        tasks.createIndex('done', 'done')
        tasks.createIndex('focus', 'focus')
        tasks.createIndex('updatedAt', 'updatedAt')
      }
      if (!db.objectStoreNames.contains('projects')) {
        const projects = db.createObjectStore('projects', { keyPath: 'id' })
        projects.createIndex('order', 'order')
        projects.createIndex('archived', 'archived')
      }
      if (!db.objectStoreNames.contains('tags')) {
        const tags = db.createObjectStore('tags', { keyPath: 'id' })
        tags.createIndex('name', 'name')
        tags.createIndex('order', 'order')
      }
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('pomodoroSessions')) {
        const sessions = db.createObjectStore('pomodoroSessions', { keyPath: 'id' })
        sessions.createIndex('taskId', 'taskId')
        sessions.createIndex('startedAt', 'startedAt')
        sessions.createIndex('status', 'status')
      }
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' })
    },
  })
  return dbPromise
}

export function resetDbConnectionForTests() {
  dbPromise = null
}
