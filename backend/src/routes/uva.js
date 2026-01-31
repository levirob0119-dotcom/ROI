import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { projects, uvaAnalyses } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '../../data');

const router = express.Router();

// 计算 UVA 分值（公开接口，无需认证）
router.post('/calculate', (req, res) => {
    const { vehicle, enhancedPets, reducedPets } = req.body;

    if (!vehicle) {
        return res.status(400).json({ error: '车型不能为空' });
    }

    // 加载 UVA 矩阵数据
    const matrixPath = join(dataDir, `uva-matrix/${vehicle.toLowerCase()}.json`);

    if (!fs.existsSync(matrixPath)) {
        return res.status(404).json({
            error: '该车型暂无 UVA 数据',
            vehicle: vehicle,
            hasData: false
        });
    }

    const matrixData = JSON.parse(fs.readFileSync(matrixPath, 'utf-8'));

    // 计算增强的分值
    const enhancedResult = calculatePetsScores(matrixData, enhancedPets || []);

    // 计算减弱的分值
    const reducedResult = calculatePetsScores(matrixData, reducedPets || []);

    // 合并结果
    const totalEnhanced = enhancedResult.totalScore;
    const totalReduced = reducedResult.totalScore;
    const finalScore = totalEnhanced - totalReduced;

    res.json({
        vehicle,
        enhanced: enhancedResult,
        reduced: reducedResult,
        totalEnhanced,
        totalReduced,
        finalScore
    });
});

// 保存 UVA 分析结果
router.post('/save', authMiddleware, (req, res) => {
    const { projectId, vehicle, enhancedPets, reducedPets, kanoType, usageRate, penetrationRate, result } = req.body;

    // 检查项目是否属于当前用户
    const project = projects.findByIdAndUserId(projectId, req.user.id);

    if (!project) {
        return res.status(404).json({ error: '方案不存在' });
    }

    // 检查车型是否在项目中
    if (!project.vehicles.includes(vehicle)) {
        return res.status(400).json({ error: '车型不在该方案中' });
    }

    // 插入或更新分析结果
    const analysis = uvaAnalyses.upsert(projectId, vehicle, {
        enhancedPets,
        reducedPets,
        kanoType,
        usageRate,
        penetrationRate,
        result
    });

    res.json(analysis);
});

// 获取项目的 UVA 分析
router.get('/project/:projectId', authMiddleware, (req, res) => {
    const project = projects.findByIdAndUserId(req.params.projectId, req.user.id);

    if (!project) {
        return res.status(404).json({ error: '方案不存在' });
    }

    const analyses = uvaAnalyses.findByProjectId(project.id);

    res.json(analyses);
});

// 辅助函数：计算 PETS 下的 UV 分值
function calculatePetsScores(matrixData, petsSelections) {
    const result = {
        totalScore: 0,
        petsList: []
    };

    if (!petsSelections || petsSelections.length === 0) {
        return result;
    }

    for (const petsSelection of petsSelections) {
        const { petsId, uvL2Names } = petsSelection;

        if (!uvL2Names || uvL2Names.length === 0) continue;

        const petsResult = {
            petsId,
            totalScore: 0,
            uvL1List: []
        };

        // 按 UV L1 分组
        const l1Groups = {};

        for (const l2Name of uvL2Names) {
            // 从矩阵中找到对应的 UV L2
            const l2Data = matrixData.find(item => item.l2_name === l2Name);

            if (l2Data) {
                const score = l2Data.pets_scores[petsId] || 0;
                const l1Name = l2Data.l1_name;

                if (!l1Groups[l1Name]) {
                    l1Groups[l1Name] = {
                        l1Name,
                        l1Category: l2Data.l1_category,
                        l1Weight: l2Data.l1_weight,
                        totalScore: 0,
                        l2List: []
                    };
                }

                l1Groups[l1Name].l2List.push({
                    l2Name,
                    score
                });
                l1Groups[l1Name].totalScore += score;
                petsResult.totalScore += score;
            }
        }

        // 转换为数组并按分值排序
        petsResult.uvL1List = Object.values(l1Groups).sort((a, b) => b.totalScore - a.totalScore);

        result.petsList.push(petsResult);
        result.totalScore += petsResult.totalScore;
    }

    // 按分值排序 PETS
    result.petsList.sort((a, b) => b.totalScore - a.totalScore);

    return result;
}

export default router;
