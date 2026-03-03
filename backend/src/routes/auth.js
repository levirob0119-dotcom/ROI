import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 获取当前 SSO 登录用户信息
router.get('/me', authMiddleware, (req, res) => {
    res.json({
        username: req.user.username,
        displayName: req.user.displayName,
    });
});

export default router;
