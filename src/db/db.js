import Dexie from 'dexie'

export const db = new Dexie('myDatabase')
db.version(1).stores({
  chats: '++id',
  messages: '++id, chat_id, timestamp',
  favorite_models: 'id, is_default',
})
