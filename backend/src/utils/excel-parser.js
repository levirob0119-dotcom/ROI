import XLSX from 'xlsx';

/**
 * Excel 中文列名 → JSON pets_scores 字段映射
 */
const PETS_COLUMN_MAP = {
    '智能驾驶': 'intelligent_driving',
    '智能座舱': 'intelligent_cockpit',
    '安全体验': 'safety',
    '外观设计及车身外部功能件': 'exterior_design',
    '内饰设计': 'interior_design',
    '驾驶体验': 'driving_experience',
    '乘坐体验': 'riding_experience',
    '空间体验': 'space',
    '座舱环境与舒适': 'cabin_comfort',
    '续航 & 补能体验': 'range_charging',
};

/**
 * 解析 UVA Excel 底表
 *
 * @param {Buffer} buffer - Excel 文件 Buffer
 * @returns {{ vehicleId: string, sheetName: string, data: object[] }[]}
 *
 * 支持一个文件多个 Sheet，每个 Sheet 名称格式："{车型}数据底表"
 * 例如 "Cetus数据底表" → vehicleId = "cetus"
 *
 * 输出每行格式：
 * {
 *   l1_name: string,
 *   l1_category: string,
 *   l1_weight: number,
 *   l2_name: string,
 *   l2_weight: number,
 *   pets_scores: { [petsId: string]: number }
 * }
 */
export function parseUvaExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const results = [];

    for (const sheetName of workbook.SheetNames) {
        if (!sheetName.includes('数据底表')) continue;

        // 提取车型名称：如 "Cetus数据底表" → "cetus"
        const vehicleId = sheetName.replace('数据底表', '').trim().toLowerCase();
        if (!vehicleId) continue;

        const ws = workbook.Sheets[sheetName];
        // defval: null 使空单元格返回 null 而不是 undefined
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

        if (rows.length < 2) continue;

        const headers = rows[0]; // 第 1 行为表头
        const dataRows = rows.slice(1);

        // 建立 PETS 列的索引映射 { petsId: colIndex }
        const petsColIndices = {};
        headers.forEach((h, i) => {
            const trimmed = h ? String(h).trim() : '';
            if (PETS_COLUMN_MAP[trimmed]) {
                petsColIndices[PETS_COLUMN_MAP[trimmed]] = i;
            }
        });

        // 合并单元格的 L1 相关列（A/B/C）需要向下填充（fill-down）
        let lastL1Name = null;
        let lastL1Category = null;
        let lastL1Weight = null;

        const matrixData = [];

        for (const row of dataRows) {
            // L2 名称（D 列, index 3）为空则跳过（空行 / 合计行等）
            if (!row[3]) continue;

            // fill-down：有值时更新，无值时沿用上一行
            if (row[0] !== null && row[0] !== '') lastL1Name = row[0];
            if (row[1] !== null && row[1] !== '') lastL1Category = row[1];
            if (row[2] !== null && row[2] !== '') lastL1Weight = row[2];

            // 收集所有 PETS 分数
            const pets_scores = {};
            for (const [petsId, colIdx] of Object.entries(petsColIndices)) {
                pets_scores[petsId] = Number(row[colIdx]) || 0;
            }

            matrixData.push({
                l1_name: lastL1Name ? String(lastL1Name).trim() : '',
                l1_category: lastL1Category ? String(lastL1Category).trim() : '',
                l1_weight: Number(lastL1Weight) || 0,
                l2_name: String(row[3]).trim(),
                l2_weight: Number(row[4]) || 0,
                pets_scores,
            });
        }

        if (matrixData.length > 0) {
            results.push({ vehicleId, sheetName, data: matrixData });
        }
    }

    return results;
}
