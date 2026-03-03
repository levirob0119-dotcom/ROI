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

// 网络诊断接口（临时，用于排查容器内 page-gateway 连通性）
app.get('/api/debug/network', async (req, res) => {
    const results = {
        nodeVersion: process.version,
        hasFetch: typeof globalThis.fetch === 'function',
        env: {
            NODE_ENV: process.env.NODE_ENV,
            K8S_ENV: process.env.K8S_ENV,
            ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
        },
        cookies: req.headers.cookie ? '(present)' : '(none)',
        tests: {},
    };

    // 测试 1：DNS 解析
    try {
        const dns = await import('dns');
        const addresses = await dns.promises.resolve4('page-gateway.nioint.com');
        results.tests.dns = { ok: true, addresses };
    } catch (e) {
        results.tests.dns = { ok: false, error: e.message };
    }

    // 测试 2：fetch page-gateway（不带 cookie）
    try {
        const resp = await fetch('https://page-gateway.nioint.com/account/current');
        results.tests.fetchNoCookie = { ok: true, status: resp.status };
    } catch (e) {
        results.tests.fetchNoCookie = { ok: false, error: e.message, code: e.cause?.code };
    }

    // 测试 3：fetch page-gateway（带 cookie）
    if (req.headers.cookie) {
        try {
            const resp = await fetch('https://page-gateway.nioint.com/account/current', {
                headers: { cookie: req.headers.cookie },
            });
            const body = await resp.json().catch(() => null);
            results.tests.fetchWithCookie = { ok: true, status: resp.status, body };
        } catch (e) {
            results.tests.fetchWithCookie = { ok: false, error: e.message, code: e.cause?.code };
        }
    }

    // 测试 4：用 https 模块替代 fetch
    try {
        const https = await import('https');
        const testHttps = await new Promise((resolve, reject) => {
            const r = https.get('https://page-gateway.nioint.com/account/current', (resp) => {
                resolve({ ok: true, status: resp.statusCode });
                resp.resume(); // drain
            });
            r.on('error', (e) => reject(e));
            r.setTimeout(5000, () => { r.destroy(); reject(new Error('timeout')); });
        });
        results.tests.httpsModule = testHttps;
    } catch (e) {
        results.tests.httpsModule = { ok: false, error: e.message, code: e.code };
    }

    res.json(results);
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
