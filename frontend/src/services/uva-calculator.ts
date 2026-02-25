/**
 * UVA 计算逻辑（从后端迁移到前端）
 * 纯函数，无副作用，直接加载本地 JSON 矩阵数据进行计算
 */
import { dataService } from './data';
import type { CalculateUvaPayload, CalculateUvaResponse } from './data';

interface L2Item { l2Name: string; score: number; fromPetsId?: string }
interface L1Group { l1Name: string; totalScore: number; l2List: L2Item[] }
interface ReqGroup { categoryName: string; totalScore: number; l1List: L1Group[] }
interface PetsResult {
    petsId: string; petsName: string; totalScore: number;
    uvL1List: unknown[]; requirementGroups: ReqGroup[];
}
interface CalcResult { totalScore: number; petsList: PetsResult[] }

interface MatrixItem {
    l2_name: string;
    l1_name: string;
    l1_category: string;
    l1_weight: number;
    pets_scores: Record<string, number>;
}

function getSelectionCount(
    enhancedPets: CalculateUvaPayload['enhancedPets'],
    reducedPets: CalculateUvaPayload['reducedPets']
) {
    const enhanced = Array.isArray(enhancedPets) ? enhancedPets : [];
    const reduced = Array.isArray(reducedPets) ? reducedPets : [];
    const pets = enhanced.length + reduced.length;
    const enhancedUv = enhanced.reduce((count, p) => count + (p.uvL2Names?.length || 0), 0);
    const reducedUv = reduced.reduce((count, p) => count + (p.uvL2Names?.length || 0), 0);
    return { pets, uv: enhancedUv + reducedUv, enhanced: enhancedUv, reduced: reducedUv };
}

function calculatePetsScores(matrixData: MatrixItem[], petsSelections: CalculateUvaPayload['enhancedPets']): CalcResult {
    const result: CalcResult = { totalScore: 0, petsList: [] };
    if (!petsSelections || petsSelections.length === 0) return result;

    for (const petsSelection of petsSelections) {
        const { petsId, petsName, uvL2Names } = petsSelection;
        if (!uvL2Names || uvL2Names.length === 0) continue;

        const petsResult: PetsResult = {
            petsId,
            petsName: petsName || `PETS-${petsId}`,
            totalScore: 0,
            uvL1List: [],
            requirementGroups: [],
        };

        const categoryAgg: Record<string, { categoryName: string; totalScore: number; l1Groups: Record<string, L1Group> }> = {};
        const l1Groups: Record<string, { l1Name: string; l1Category: string; l1Weight: number; totalScore: number; l2List: { l2Name: string; score: number }[] }> = {};

        for (const l2Name of uvL2Names) {
            const l2Data = matrixData.find(item => item.l2_name === l2Name);
            if (!l2Data) continue;

            const score = l2Data.pets_scores[petsId] || 0;
            const { l1_name: l1Name, l1_category: l1Category, l1_weight: l1Weight } = l2Data;

            if (!l1Groups[l1Name]) {
                l1Groups[l1Name] = { l1Name, l1Category, l1Weight, totalScore: 0, l2List: [] };
            }
            l1Groups[l1Name].l2List.push({ l2Name, score });
            l1Groups[l1Name].totalScore += score;
            petsResult.totalScore += score;

            if (!categoryAgg[l1Category]) {
                categoryAgg[l1Category] = { categoryName: l1Category, totalScore: 0, l1Groups: {} };
            }
            if (!categoryAgg[l1Category].l1Groups[l1Name]) {
                categoryAgg[l1Category].l1Groups[l1Name] = { l1Name, totalScore: 0, l2List: [] };
            }
            categoryAgg[l1Category].l1Groups[l1Name].l2List.push({ l2Name, score, fromPetsId: petsId });
            categoryAgg[l1Category].l1Groups[l1Name].totalScore += score;
            categoryAgg[l1Category].totalScore += score;
        }

        petsResult.uvL1List = Object.values(l1Groups).sort((a, b) => b.totalScore - a.totalScore);
        petsResult.requirementGroups = Object.values(categoryAgg)
            .map(catGroup => ({
                categoryName: catGroup.categoryName,
                totalScore: catGroup.totalScore,
                l1List: Object.values(catGroup.l1Groups)
                    .map(l1Group => ({ ...l1Group, l2List: [...l1Group.l2List].sort((a, b) => b.score - a.score) }))
                    .sort((a, b) => b.totalScore - a.totalScore),
            }))
            .sort((a: ReqGroup, b: ReqGroup) => {
                const priority: Record<string, number> = { '核心差异UV': 3, '基线UV': 2, '弱需求': 1 };
                const pA = priority[a.categoryName] || 0;
                const pB = priority[b.categoryName] || 0;
                return pA !== pB ? pB - pA : b.totalScore - a.totalScore;
            });

        result.petsList.push(petsResult);
        result.totalScore += petsResult.totalScore;
    }

    result.petsList.sort((a, b) => b.totalScore - a.totalScore);
    return result;
}

export async function calculateUVAFrontend(payload: CalculateUvaPayload): Promise<CalculateUvaResponse> {
    const { vehicle, enhancedPets, reducedPets, kanoType, usageRate, penetrationRate } = payload;

    const matrixData = (await dataService.getUvaMatrix(vehicle)) as MatrixItem[];

    const enhanced = calculatePetsScores(matrixData, enhancedPets || []);
    const reduced = calculatePetsScores(matrixData, reducedPets || []);

    const totalEnhanced = enhanced.totalScore;
    const totalReduced = reduced.totalScore;
    const finalScore = totalEnhanced - totalReduced;
    const selectionCount = getSelectionCount(enhancedPets || [], reducedPets || []);

    return {
        vehicle,
        enhanced,
        reduced,
        totalEnhanced,
        totalReduced,
        finalScore,
        meta: {
            validationSummary: {
                hasSelections: selectionCount.uv > 0,
                missingKanoType: kanoType === undefined || kanoType === null || (kanoType as string) === '',
                missingUsageRate: usageRate === undefined || usageRate === null,
                missingPenetrationRate: penetrationRate === undefined || penetrationRate === null,
            },
            selectionCount,
        },
    };
}
