import { remult } from 'remult'

// 配置 Remult 连接到 Electron 的 API 服务器
export const repo = remult.repo
export const api = remult

// 设置 API 端点（注意要包含 /api 路径）
remult.apiClient.url = 'http://localhost:3001/api'
