import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import uvaRoutes from './routes/uva.js';
import dataRoutes from './routes/data.js';
import dataUploadRoutes from './routes/data-upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS：允许前端域名带 Cookie 访问
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(o => origin.startsWith(o.trim()))) {
            callback(null, true);
        } else {
            callback(new Error(`CORS not allowed: ${origin}`));
        }
    },
    credentials: true, // 允许携带 Cookie（SSO 验证需要）
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/uva', uvaRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/data', dataUploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// 只在直接执行时启动监听（非 import 导入时），避免测试环境端口冲突
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    app.listen(PORT, () => {
        console.log(`🚀 ROI Backend running on http://localhost:${PORT}`);
    });
}

export default app;
