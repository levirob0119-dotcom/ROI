import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parseUvaExcel } from '../utils/excel-parser.js';
import { authMiddleware } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// backend/data/ 目录（与 routes/data.js 保持一致）
const dataDir = join(__dirname, '../../data');

const router = express.Router();

// multer：内存存储，限制 10 MB
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        // 只接受 xlsx 文件
        if (
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.originalname.endsWith('.xlsx')
        ) {
            cb(null, true);
        } else {
            cb(new Error('只支持 .xlsx 格式的 Excel 文件'));
        }
    },
});

/**
 * POST /api/data/upload
 * 上传 UVA 数据底表 Excel 文件（需 SSO 登录）
 * multipart/form-data，字段名 "file"
 */
router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: '请上传 .xlsx 文件' });
    }

    let results;
    try {
        results = parseUvaExcel(req.file.buffer);
    } catch (err) {
        console.error('[data-upload] 解析 Excel 失败:', err);
        return res.status(400).json({ error: `Excel 解析失败：${err.message}` });
    }

    if (!results || results.length === 0) {
        return res.status(400).json({
            error: '未找到有效的数据底表 Sheet（Sheet 名称需包含"数据底表"，如"Cetus数据底表"）',
        });
    }

    // 确保 uva-matrix 目录存在
    const matrixDir = join(dataDir, 'uva-matrix');
    if (!fs.existsSync(matrixDir)) {
        fs.mkdirSync(matrixDir, { recursive: true });
    }

    const saved = [];
    for (const { vehicleId, sheetName, data } of results) {
        const filePath = join(matrixDir, `${vehicleId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        saved.push({ vehicleId, sheetName, rowCount: data.length });
    }

    console.log(`[data-upload] ${req.user.username} 上传底表成功:`, saved);

    res.json({
        success: true,
        saved,
        uploadedBy: req.user.username,
        uploadedAt: new Date().toISOString(),
    });
});

/**
 * GET /api/data/uva-matrix-list
 * 返回当前已有的 UVA 矩阵文件列表（公开，无需登录）
 */
router.get('/uva-matrix-list', (req, res) => {
    const matrixDir = join(dataDir, 'uva-matrix');

    if (!fs.existsSync(matrixDir)) {
        return res.json([]);
    }

    const files = fs.readdirSync(matrixDir)
        .filter(f => f.endsWith('.json'))
        .map(f => {
            const stat = fs.statSync(join(matrixDir, f));
            return {
                vehicleId: f.replace('.json', ''),
                updatedAt: stat.mtime.toISOString(),
                size: stat.size,
            };
        });

    res.json(files);
});

export default router;
