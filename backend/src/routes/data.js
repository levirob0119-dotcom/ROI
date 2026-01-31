import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '../../data');

const router = express.Router();

// 获取车型列表
router.get('/vehicles', (req, res) => {
    const data = JSON.parse(fs.readFileSync(join(dataDir, 'vehicles.json'), 'utf-8'));
    res.json(data);
});

// 获取 PETS 列表
router.get('/pets', (req, res) => {
    const data = JSON.parse(fs.readFileSync(join(dataDir, 'pets.json'), 'utf-8'));
    res.json(data);
});

// 获取 UV L1/L2 数据
router.get('/uv', (req, res) => {
    const data = JSON.parse(fs.readFileSync(join(dataDir, 'uv.json'), 'utf-8'));
    res.json(data);
});

// 获取哪些车型有 UVA 数据
router.get('/vehicles-data-status', (req, res) => {
    const vehiclesData = JSON.parse(fs.readFileSync(join(dataDir, 'vehicles.json'), 'utf-8'));
    const matrixDir = join(dataDir, 'uva-matrix');

    const status = vehiclesData.map(v => {
        const filePath = join(matrixDir, `${v.id.toLowerCase()}.json`);
        return {
            id: v.id,
            name: v.name,
            hasData: fs.existsSync(filePath)
        };
    });

    res.json(status);
});

// 获取指定车型的 UVA 矩阵
router.get('/uva-matrix/:vehicle', (req, res) => {
    const vehicle = req.params.vehicle.toLowerCase();
    const filePath = join(dataDir, `uva-matrix/${vehicle}.json`);

    if (!fs.existsSync(filePath)) {
        // 如果没有该车型的数据，返回 Cetus 作为默认
        const defaultPath = join(dataDir, 'uva-matrix/cetus.json');
        if (fs.existsSync(defaultPath)) {
            const data = JSON.parse(fs.readFileSync(defaultPath, 'utf-8'));
            return res.json(data);
        }
        return res.status(404).json({ error: '车型数据不存在' });
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
});

export default router;
