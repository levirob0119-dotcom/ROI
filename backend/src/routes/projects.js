import express from 'express';
import { projects, uvaAnalyses } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 所有方案路由都需要认证
router.use(authMiddleware);

// 获取当前用户的所有方案
router.get('/', (req, res) => {
    const userProjects = projects.findByUserId(req.user.id);
    res.json(userProjects);
});

// 创建方案
router.post('/', (req, res) => {
    const { name, description, vehicles } = req.body;

    if (!name) {
        return res.status(400).json({ error: '方案名称不能为空' });
    }

    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
        return res.status(400).json({ error: '请至少选择一个车型' });
    }

    const project = projects.create({
        userId: req.user.id,
        name,
        description: description || '',
        vehicles
    });

    res.status(201).json(project);
});

// 获取单个方案
router.get('/:id', (req, res) => {
    const project = projects.findByIdAndUserId(req.params.id, req.user.id);

    if (!project) {
        return res.status(404).json({ error: '方案不存在' });
    }

    // 获取该方案的所有 UVA 分析
    const analyses = uvaAnalyses.findByProjectId(project.id);

    res.json({
        ...project,
        uvaAnalyses: analyses
    });
});

// 更新方案
router.put('/:id', (req, res) => {
    const { name, description, vehicles } = req.body;

    const existing = projects.findByIdAndUserId(req.params.id, req.user.id);

    if (!existing) {
        return res.status(404).json({ error: '方案不存在' });
    }

    const updated = projects.update(req.params.id, {
        name: name || existing.name,
        description: description !== undefined ? description : existing.description,
        vehicles: vehicles || existing.vehicles
    });

    res.json(updated);
});

// 删除方案
router.delete('/:id', (req, res) => {
    const existing = projects.findByIdAndUserId(req.params.id, req.user.id);

    if (!existing) {
        return res.status(404).json({ error: '方案不存在' });
    }

    projects.delete(req.params.id);

    res.json({ success: true });
});

export default router;
