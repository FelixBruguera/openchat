import { PGlite } from '@electric-sql/pglite'
import { live } from '@electric-sql/pglite/live'

const initializeDatabase = async () => {
    const db = await PGlite.create({
        dataDir: 'idb://chat',
        extensions: {
            live,
        },
        relaxedDurability: true,
    })

    db.exec('CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, message TEXT NOT NULL, model TEXT, tokens INT, chat_id INT NOT NULL);')
    db.exec('CREATE TABLE IF NOT EXISTS chats (id SERIAL PRIMARY KEY, title TEXT NOT NULL)')
    db.exec('CREATE TABLE IF NOT EXISTS favorite_models (id SERIAL PRIMARY KEY, openrouter_id TEXT NOT NULL, name TEXT NOT NULL, isDefault BOOLEAN)')
    return db
}

export default initializeDatabase