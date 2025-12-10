import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import { api } from '../server/api'

const getUrl = (): string => {
  if (isDev) return 'http://localhost:3000/'

  return fileURLToPath(
    new URL(/* @vite-ignore */ '../../dist-web/index.html', import.meta.url)
  )
}

const createWindow = () => {
  const win = new BrowserWindow({
    title: 'Turbotron',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: fileURLToPath(
        new URL(/* @vite-ignore */ '../preload/index.mjs', import.meta.url)
      ),
    },
  })

  const url = getUrl()
  isDev ? win.loadURL(url) : win.loadFile(url)
}

// 启动 Express + Remult API 服务器
const startApiServer = () => {
  const expressApp = express()
  const PORT = 3001

  expressApp.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )
  expressApp.use(express.json())
  expressApp.use(api)

  expressApp.listen(PORT, () => {
    console.log(`Remult API server running on http://localhost:${PORT}`)
  })
}

app.whenReady().then(() => {
  startApiServer()
  createWindow()

  app.on('activate', () => {
    const hasNoWindows = BrowserWindow.getAllWindows().length === 0
    if (hasNoWindows) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
