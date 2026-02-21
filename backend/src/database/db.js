import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '../../data/db');

// 确保目录存在
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 数据文件路径
const USERS_FILE = join(dataDir, 'users.json');
const PROJECTS_FILE = join(dataDir, 'projects.json');
const UVA_FILE = join(dataDir, 'uva_analyses.json');

// 初始化文件
function initFile(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

initFile(USERS_FILE, []);
initFile(PROJECTS_FILE, []);
initFile(UVA_FILE, []);

// 为历史 UVA 记录补齐 userId，确保后续可以按用户维度强隔离
function backfillUvaAnalysisUserId() {
    const analyses = readData(UVA_FILE);
    const allProjects = readData(PROJECTS_FILE);
    const projectById = new Map(allProjects.map((project) => [project.id, project]));
    let changed = false;

    const nextAnalyses = analyses.map((analysis) => {
        if (analysis.userId) return analysis;

        const project = projectById.get(analysis.projectId);
        if (!project?.userId) return analysis;

        changed = true;
        return {
            ...analysis,
            userId: project.userId
        };
    });

    if (changed) {
        writeData(UVA_FILE, nextAnalyses);
    }
}

backfillUvaAnalysisUserId();

// 读取数据
function readData(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// 写入数据
function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 用户操作
export const users = {
    findAll: () => readData(USERS_FILE),

    findById: (id) => {
        const data = readData(USERS_FILE);
        return data.find(u => u.id === id);
    },

    findByUsername: (username) => {
        const data = readData(USERS_FILE);
        return data.find(u => u.username === username);
    },

    create: (user) => {
        const data = readData(USERS_FILE);
        const newUser = {
            id: uuidv4(),
            ...user,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        data.push(newUser);
        writeData(USERS_FILE, data);
        return newUser;
    }
};

// 方案操作
export const projects = {
    findAll: () => readData(PROJECTS_FILE),

    findByUserId: (userId) => {
        const data = readData(PROJECTS_FILE);
        return data.filter(p => p.userId === userId).sort((a, b) =>
            new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    },

    findById: (id) => {
        const data = readData(PROJECTS_FILE);
        return data.find(p => p.id === id);
    },

    findByIdAndUserId: (id, userId) => {
        const data = readData(PROJECTS_FILE);
        return data.find(p => p.id === id && p.userId === userId);
    },

    create: (project) => {
        const data = readData(PROJECTS_FILE);
        const newProject = {
            id: uuidv4(),
            ...project,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        data.push(newProject);
        writeData(PROJECTS_FILE, data);
        return newProject;
    },

    update: (id, updates) => {
        const data = readData(PROJECTS_FILE);
        const index = data.findIndex(p => p.id === id);
        if (index === -1) return null;

        data[index] = {
            ...data[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        writeData(PROJECTS_FILE, data);
        return data[index];
    },

    delete: (id) => {
        const data = readData(PROJECTS_FILE);
        const index = data.findIndex(p => p.id === id);
        if (index === -1) return false;

        data.splice(index, 1);
        writeData(PROJECTS_FILE, data);

        // 同时删除相关的 UVA 分析
        const uvaData = readData(UVA_FILE);
        const filtered = uvaData.filter(a => a.projectId !== id);
        writeData(UVA_FILE, filtered);

        return true;
    }
};

// UVA 分析操作
export const uvaAnalyses = {
    findByProjectId: (projectId, userId) => {
        const data = readData(UVA_FILE);
        return data.filter((analysis) =>
            analysis.projectId === projectId &&
            (userId ? analysis.userId === userId : true)
        );
    },

    findByProjectAndVehicle: (projectId, vehicle, userId) => {
        const data = readData(UVA_FILE);
        return data.find((analysis) =>
            analysis.projectId === projectId &&
            analysis.vehicle === vehicle &&
            (userId ? analysis.userId === userId : true)
        );
    },

    upsert: (projectId, vehicle, userId, analysis) => {
        const data = readData(UVA_FILE);
        const index = data.findIndex((item) =>
            item.projectId === projectId &&
            item.vehicle === vehicle &&
            item.userId === userId
        );

        const now = new Date().toISOString();

        if (index === -1) {
            // 创建新记录
            const newAnalysis = {
                id: uuidv4(),
                projectId,
                vehicle,
                userId,
                ...analysis,
                createdAt: now,
                updatedAt: now
            };
            data.push(newAnalysis);
            writeData(UVA_FILE, data);
            return newAnalysis;
        } else {
            // 更新现有记录
            data[index] = {
                ...data[index],
                ...analysis,
                updatedAt: now
            };
            writeData(UVA_FILE, data);
            return data[index];
        }
    }
};

export default { users, projects, uvaAnalyses };
