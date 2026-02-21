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
    const { vehicle, enhancedPets, reducedPets, kanoType, usageRate, penetrationRate } = req.body;

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
    const selectionCount = getSelectionCount(enhancedPets || [], reducedPets || []);
    const validationSummary = {
        hasSelections: selectionCount.uv > 0,
        missingKanoType: kanoType === undefined || kanoType === null || kanoType === '',
        missingUsageRate: usageRate === undefined || usageRate === null,
        missingPenetrationRate: penetrationRate === undefined || penetrationRate === null
    };

    res.json({
        vehicle,
        enhanced: enhancedResult,
        reduced: reducedResult,
        totalEnhanced,
        totalReduced,
        finalScore,
        meta: {
            validationSummary,
            selectionCount
        }
    });
});

// 保存 UVA 分析结果
router.post('/save', authMiddleware, (req, res) => {
    const {
        projectId,
        vehicle,
        enhancedPets,
        reducedPets,
        kanoType,
        usageRate,
        penetrationRate,
        result,
        draft,
        clientUpdatedAt
    } = req.body;

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
        result,
        draft: !!draft,
        isDraft: !!draft,
        clientUpdatedAt: clientUpdatedAt || null
    });

    res.json(analysis);
});

// 获取项目的 UVA 分析
router.get('/project/:projectId', authMiddleware, (req, res) => {
    const project = projects.findByIdAndUserId(req.params.projectId, req.user.id);

    if (!project) {
        return res.status(404).json({ error: '方案不存在' });
    }

    const analyses = uvaAnalyses.findByProjectId(project.id).map((analysis) => ({
        ...analysis,
        isDraft: !!analysis.isDraft || !!analysis.draft,
        analysisMeta: {
            isDraft: !!analysis.isDraft || !!analysis.draft,
            updatedAt: analysis.updatedAt
        }
    }));

    res.json(analyses);
});

function getSelectionCount(enhancedPets, reducedPets) {
    const enhanced = Array.isArray(enhancedPets) ? enhancedPets : [];
    const reduced = Array.isArray(reducedPets) ? reducedPets : [];
    const pets = enhanced.length + reduced.length;
    const enhancedUv = enhanced.reduce((count, petsItem) => count + (petsItem.uvL2Names?.length || 0), 0);
    const reducedUv = reduced.reduce((count, petsItem) => count + (petsItem.uvL2Names?.length || 0), 0);

    return {
        pets,
        uv: enhancedUv + reducedUv,
        enhanced: enhancedUv,
        reduced: reducedUv
    };
}

// 辅助函数：计算 PETS 下的 UV 分值
function calculatePetsScores(matrixData, petsSelections) {
    const result = {
        totalScore: 0,
        petsList: []
        // requirementGroups removed from top level as it's now per-PETS
    };

    if (!petsSelections || petsSelections.length === 0) {
        return result;
    }

    // Process each PETS selection independently
    for (const petsSelection of petsSelections) {
        const { petsId, petsName, uvL2Names } = petsSelection; // Extract petsName

        if (!uvL2Names || uvL2Names.length === 0) continue;

        const petsResult = {
            petsId,
            petsName: petsName || `PETS-${petsId}`, // Fallback name if missing
            totalScore: 0,
            uvL1List: [],       // Keep for backward compatibility if needed, or remove if unused
            requirementGroups: [] // New: Aggregated Requirement Groups specific to this PETS
        };

        // Temporary storage for aggregating groups WITHIN this PETS
        // Structure: { [l1Category]: { totalScore, l1Groups: { [l1Name]: { totalScore, l2List: [] } } } }
        const categoryAgg = {};
        // Temporary storage for uvL1List (existing logic within PETS)
        const l1Groups = {};

        for (const l2Name of uvL2Names) {
            // Find corresponding UV L2 in matrix
            const l2Data = matrixData.find(item => item.l2_name === l2Name);

            if (l2Data) {
                const score = l2Data.pets_scores[petsId] || 0;
                const l1Name = l2Data.l1_name;
                const l1Category = l2Data.l1_category;

                // --- 1. Accumulate for PETS Result (Existing Logic - Flat UV L1 List) ---
                if (!l1Groups[l1Name]) {
                    l1Groups[l1Name] = {
                        l1Name,
                        l1Category,
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

                // --- 2. Accumulate for Requirement Group Aggregation (New Logic - Per PETS) ---
                // Initialize Category Group
                if (!categoryAgg[l1Category]) {
                    categoryAgg[l1Category] = {
                        categoryName: l1Category,
                        totalScore: 0,
                        l1Groups: {}
                    };
                }

                // Initialize L1 Group within Category
                if (!categoryAgg[l1Category].l1Groups[l1Name]) {
                    categoryAgg[l1Category].l1Groups[l1Name] = {
                        l1Name,
                        totalScore: 0,
                        l2List: []
                    };
                }

                // Add to Aggregation
                categoryAgg[l1Category].l1Groups[l1Name].l2List.push({
                    l2Name,
                    score,
                    fromPetsId: petsId
                });
                categoryAgg[l1Category].l1Groups[l1Name].totalScore += score;
                categoryAgg[l1Category].totalScore += score;
            }
        }

        // --- Finalize PETS Result ---

        // 1. Flatten UV L1 List (Existing)
        petsResult.uvL1List = Object.values(l1Groups).sort((a, b) => b.totalScore - a.totalScore);

        // 2. Process Requirement Groups (New)
        petsResult.requirementGroups = Object.values(categoryAgg)
            .map(catGroup => {
                // Convert l1Groups map to array and sort
                const l1List = Object.values(catGroup.l1Groups)
                    .map(l1Group => {
                        // Sort l2List by score desc
                        l1Group.l2List.sort((a, b) => b.score - a.score);
                        return l1Group;
                    })
                    .sort((a, b) => b.totalScore - a.totalScore);

                return {
                    categoryName: catGroup.categoryName,
                    totalScore: catGroup.totalScore,
                    l1List
                };
            })
            // Sort Requirement Types (Core Difference -> Baseline -> Weak)
            .sort((a, b) => {
                const priority = { "核心差异UV": 3, "基线UV": 2, "弱需求": 1 };
                const pA = priority[a.categoryName] || 0;
                const pB = priority[b.categoryName] || 0;
                if (pA !== pB) return pB - pA;
                return b.totalScore - a.totalScore;
            });

        result.petsList.push(petsResult);
        result.totalScore += petsResult.totalScore;
    }

    // Sort PETS List by Total Score Descending
    result.petsList.sort((a, b) => b.totalScore - a.totalScore);

    return result;
}

export default router;
