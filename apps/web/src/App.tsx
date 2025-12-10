import { useEffect, useState } from 'react'
import { repo } from './lib/remult'
import { Task } from './shared/Task'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const taskRepo = repo(Task)

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await taskRepo.find()
      setTasks(data)
    } catch (err) {
      setError('加载失败: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    try {
      setError('')
      const task = await taskRepo.insert({ title: newTaskTitle })
      setTasks([...tasks, task])
      setNewTaskTitle('')
    } catch (err) {
      setError('添加失败: ' + (err as Error).message)
    }
  }

  const toggleTask = async (task: Task) => {
    try {
      setError('')
      const updated = await taskRepo.save({ ...task, completed: !task.completed })
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)))
    } catch (err) {
      setError('更新失败: ' + (err as Error).message)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      setError('')
      await taskRepo.delete({ id: taskId })
      setTasks(tasks.filter((t) => t.id !== taskId))
    } catch (err) {
      setError('删除失败: ' + (err as Error).message)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>TURBOTRON - Remult Demo</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', background: '#fee' }}>
          {error}
        </div>
      )}

      <form onSubmit={addTask} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="输入新任务..."
          style={{ padding: '8px', marginRight: '8px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          添加任务
        </button>
        <button
          type="button"
          onClick={loadTasks}
          style={{ padding: '8px 16px', marginLeft: '8px' }}
        >
          刷新
        </button>
      </form>

      {loading ? (
        <p>加载中...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '8px',
                background: '#f5f5f5',
                borderRadius: '4px',
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
                style={{ marginRight: '10px' }}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                style={{ padding: '4px 12px', background: '#f44', color: 'white', border: 'none' }}
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      )}

      {tasks.length === 0 && !loading && <p>暂无任务</p>}

      <div style={{ marginTop: '20px', padding: '10px', background: '#eef', borderRadius: '4px' }}>
        <small>
          <strong>架构说明:</strong>
          <br />
          Web 端通过 Remult 与 Electron Main Process 的 Express 服务器 (localhost:3001) 通信
          <br />
          数据存储在本地 SQLite 数据库中
        </small>
      </div>
    </div>
  )
}
