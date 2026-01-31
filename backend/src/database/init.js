import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../data/roi.db');

// 确保 data 目录存在
const dataDir = join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

console.log('🔧 Initializing database...');

// 创建用户表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// 创建方案表
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    vehicles TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// 创建 UVA 分析表
db.exec(`
  CREATE TABLE IF NOT EXISTS uva_analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    vehicle VARCHAR(50) NOT NULL,
    enhanced_pets TEXT,
    reduced_pets TEXT,
    kano_type VARCHAR(20),
    usage_rate INTEGER DEFAULT 50,
    penetration_rate INTEGER DEFAULT 50,
    result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE(project_id, vehicle)
  )
`);

// 创建测试用户
const testPassword = bcrypt.hashSync('123456', 10);
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (username, password_hash, display_name)
  VALUES (?, ?, ?)
`);

insertUser.run('demo', testPassword, '演示用户');
insertUser.run('admin', testPassword, '管理员');

console.log('✅ Database initialized successfully!');
console.log('📍 Database path:', dbPath);
console.log('👤 Test users created: demo/123456, admin/123456');

db.close();
