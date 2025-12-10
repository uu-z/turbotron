import { remultExpress } from 'remult/remult-express'
import { Task } from '../shared/Task'
import { JsonEntityFileStorage } from 'remult/server'
import { JsonDataProvider } from 'remult'
import { app } from 'electron'
import { join } from 'path'
import { promises as fs } from 'fs'

// 获取用户数据目录路径
const dataPath = join(app.getPath('userData'), 'remult-data')

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.mkdir(dataPath, { recursive: true })
  } catch (err) {
    console.error('Failed to create data directory:', err)
  }
}

ensureDataDir()

console.log('Data path:', dataPath)

export const api = remultExpress({
  dataProvider: async () => new JsonDataProvider(new JsonEntityFileStorage(dataPath)),
  entities: [Task],
})
