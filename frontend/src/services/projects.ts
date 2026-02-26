/**
 * 方案服务
 *
 * 优先使用后端 REST API（axios）。
 * 若后端不可达（网络错误，如域名 T+1 未生效），自动降级到 localStorage。
 * SSO Cookie 通过 withCredentials 自动携带，后端 authMiddleware 负责校验。
 */
import type { Project } from '@/types/models';
import api from './api';
import { localProjectService } from './local-db';

export interface CreateProjectData {
    name: string;
    description?: string;
    vehicles: string[];
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    vehicles?: string[];
}

/**
 * 网络级别的错误（DNS 未解析、连接超时、CORS 预检失败等）
 * axios 特征：err.response 为 undefined
 */
function isNetworkError(err: unknown): boolean {
    return !!(err && typeof err === 'object' && !('response' in err && (err as any).response));
}

async function withFallback<T>(apiFn: () => Promise<T>, localFn: () => Promise<T>): Promise<T> {
    try {
        return await apiFn();
    } catch (err) {
        if (isNetworkError(err)) {
            console.warn('[projectService] 后端不可达，降级使用本地存储');
            return localFn();
        }
        throw err;
    }
}

export const projectService = {
    getAll: (): Promise<Project[]> =>
        withFallback(
            () => api.get<Project[]>('/projects').then(r => r.data),
            () => localProjectService.getAll(),
        ),

    getById: (id: string): Promise<Project> =>
        withFallback(
            () => api.get<Project>(`/projects/${id}`).then(r => r.data),
            () => localProjectService.getById(id),
        ),

    create: (data: CreateProjectData): Promise<Project> =>
        withFallback(
            () => api.post<Project>('/projects', data).then(r => r.data),
            () => localProjectService.create(data),
        ),

    update: (id: string, data: UpdateProjectData): Promise<Project> =>
        withFallback(
            () => api.put<Project>(`/projects/${id}`, data).then(r => r.data),
            () => localProjectService.update(id, data),
        ),

    delete: (id: string): Promise<void> =>
        withFallback(
            () => api.delete(`/projects/${id}`).then(() => undefined),
            () => localProjectService.delete(id),
        ),
};
