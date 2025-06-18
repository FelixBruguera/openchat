const initializeDatabase = async (db) => {
    db.exec('CREATE TABLE IF NOT EXISTS chats (id SERIAL PRIMARY KEY, title TEXT NOT NULL)')
    db.exec('CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, message TEXT NOT NULL, model TEXT, tokens INT, chat_id INT NOT NULL REFERENCES chats(id) ON DELETE CASCADE);')
    db.exec('CREATE TABLE IF NOT EXISTS favorite_models (id SERIAL PRIMARY KEY, openrouter_id TEXT NOT NULL UNIQUE, name TEXT NOT NULL, isDefault BOOLEAN)')
}

export default initializeDatabase