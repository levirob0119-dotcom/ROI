/**
 * localStorage 本地数据库
 *
 * 替代后端 API 的临时实现，接口与后端完全对齐。
 * 后续后端实例到位后，只需在 projects.ts / data.ts 中将
 * import 切换回 API 调用，无需改动组件层。
 *
 * 数据隔离：每个 SSO 用户独立存储，key 格式为 pd-uv_{namespace}_{username}
 */

import type { Project } from '@/types/models';

const uuidv4 = () => crypto.randomUUID();
import type { ProjectAnalysisRecord, SaveAnalysisPayload } from './data';

// ---------- 当前用户 ----------

let _currentUsername = '';

export function setCurrentUser(username: string) {
    _currentUsername = username;
}

function getUsername(): string {
    if (!_currentUsername) throw new Error('用户未登录');
    return _currentUsername;
}

function storageKey(namespace: string) {
    return `pd-uv_${namespace}_${getUsername()}`;
}

// ---------- 通用读写 ----------

function readList<T>(namespace: string): T[] {
    try {
        return JSON.parse(localStorage.getItem(storageKey(namespace)) || '[]');
    } catch {
        return [];
    }
}

function writeList<T>(namespace: string, data: T[]) {
    localStorage.setItem(storageKey(namespace), JSON.stringify(data));
}

// ---------- Projects ----------

export const localProjectService = {
    getAll: async (): Promise<Project[]> => {
        const list = readList<Project>('projects');
        return list.sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    },

    getById: async (id: string): Promise<Project> => {
        const list = readList<Project>('projects');
        const project = list.find(p => p.id === id && p.userId === getUsername());
        if (!project) throw new Error('方案不存在');
        return project;
    },

    create: async (data: { name: string; description?: string; vehicles: string[] }): Promise<Project> => {
        const list = readList<Project>('projects');
        const now = new Date().toISOString();
        const newProject: Project = {
            id: uuidv4(),
            userId: getUsername(),
            name: data.name,
            description: data.description || '',
            vehicles: data.vehicles,
            createdAt: now,
            updatedAt: now,
        };
        list.push(newProject);
        writeList('projects', list);
        return newProject;
    },

    update: async (id: string, data: { name?: string; description?: string; vehicles?: string[] }): Promise<Project> => {
        const list = readList<Project>('projects');
        const index = list.findIndex(p => p.id === id && p.userId === getUsername());
        if (index === -1) throw new Error('方案不存在');
        list[index] = {
            ...list[index],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        writeList('projects', list);
        return list[index];
    },

    delete: async (id: string): Promise<void> => {
        const list = readList<Project>('projects');
        const filtered = list.filter(p => !(p.id === id && p.userId === getUsername()));
        writeList('projects', filtered);
        // 同时清除该方案的分析数据
        const analyses = readList<ProjectAnalysisRecord>('analyses');
        writeList('analyses', analyses.filter(a => a.projectId !== id));
    },
};

// ---------- UVA Analyses ----------

export const localAnalysisService = {
    save: async (payload: SaveAnalysisPayload): Promise<ProjectAnalysisRecord> => {
        const list = readList<ProjectAnalysisRecord>('analyses');
        const username = getUsername();
        const now = new Date().toISOString();

        const index = list.findIndex(a =>
            a.projectId === payload.projectId &&
            a.vehicle === payload.vehicle &&
            // @ts-expect-error userId is stored for isolation but not in the type
            a.userId === username
        );

        const base = {
            projectId: payload.projectId,
            vehicle: payload.vehicle,
            enhancedPets: payload.enhancedPets,
            reducedPets: payload.reducedPets,
            kanoType: payload.kanoType,
            usageRate: payload.usageRate,
            penetrationRate: payload.penetrationRate,
            result: payload.result,
            draft: payload.draft ?? false,
            isDraft: payload.draft ?? false,
            clientUpdatedAt: payload.clientUpdatedAt || now,
            analysisMeta: {
                isDraft: payload.draft ?? false,
                updatedAt: now,
            },
        };

        if (index === -1) {
            const newRecord: ProjectAnalysisRecord = {
                id: uuidv4(),
                ...base,
                // @ts-expect-error store userId for isolation
                userId: username,
                createdAt: now,
                updatedAt: now,
            };
            list.push(newRecord);
            writeList('analyses', list);
            return newRecord;
        } else {
            list[index] = { ...list[index], ...base, updatedAt: now };
            writeList('analyses', list);
            return list[index];
        }
    },

    getByProject: async (projectId: string): Promise<ProjectAnalysisRecord[]> => {
        const username = getUsername();
        const list = readList<ProjectAnalysisRecord>('analyses');
        return list
            // @ts-expect-error userId is stored for isolation
            .filter(a => a.projectId === projectId && a.userId === username)
            .map(a => ({
                ...a,
                isDraft: !!(a.isDraft || a.draft),
                analysisMeta: {
                    isDraft: !!(a.isDraft || a.draft),
                    updatedAt: a.updatedAt,
                },
            }));
    },
};
