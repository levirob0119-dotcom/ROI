import express from 'express';
import bcrypt from 'bcryptjs';
import { users } from '../database/db.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const MIN_PASSWORD_LENGTH = 6;

function normalizeUsername(value) {
    return typeof value === 'string' ? value.trim() : '';
}

// 登录
router.post('/login', (req, res) => {
    const username = normalizeUsername(req.body?.username);
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const user = users.findByUsername(username);

    if (!user) {
        return res.status(401).json({ error: '用户名或密码错误' });
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);

    if (!isValid) {
        return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = generateToken(user);

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName
        }
    });
});

// 注册
router.post('/register', (req, res) => {
    const username = normalizeUsername(req.body?.username);
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const displayName = typeof req.body?.displayName === 'string' ? req.body.displayName.trim() : '';

    if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({ error: `密码长度不能少于 ${MIN_PASSWORD_LENGTH} 位` });
    }

    const existing = users.findByUsername(username);

    if (existing) {
        return res.status(400).json({ error: '用户名已存在' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = users.create({
        username,
        passwordHash,
        displayName: displayName || username
    });

    const token = generateToken(user);

    res.status(201).json({
        token,
        user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName
        }
    });
});

// 获取当前用户信息
router.get('/me', authMiddleware, (req, res) => {
    const user = users.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        createdAt: user.createdAt
    });
});

export default router;
