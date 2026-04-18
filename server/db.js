import fs from 'fs'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 👇 أضف هذا
const dataDir = path.join(__dirname, 'data')
const file = path.join(dataDir, 'db.json')

const adapter = new JSONFile(file)

export const db = new Low(adapter, {
  users: [],
  bookings: [],
  notifications: [],
  tests: [],
  reviews: []
})

// 👇 عدل هذا
export async function initDb() {
  // تأكد المجلد موجود
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  await db.read()
  db.data ||= {
    users: [],
    bookings: [],
    notifications: [],
    tests: [],
    reviews: []
  }
  await db.write()
}
