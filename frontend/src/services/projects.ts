/**
 * 方案服务
 *
 * 使用后端 REST API（axios）实现。
 * SSO Cookie 通过 withCredentials 自动携带，后端 authMiddleware 负责校验。
 */
import type { Project } from '@/types/models';
import api from './api';

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

export const projectService = {
    getAll: (): Promise<Project[]> =>
        api.get<Project[]>('/projects').then(r => r.data),

    getById: (id: string): Promise<Project> =>
        api.get<Project>(`/projects/${id}`).then(r => r.data),

    create: (data: CreateProjectData): Promise<Project> =>
        api.post<Project>('/projects', data).then(r => r.data),

    update: (id: string, data: UpdateProjectData): Promise<Project> =>
        api.put<Project>(`/projects/${id}`, data).then(r => r.data),

    delete: (id: string): Promise<void> =>
        api.delete(`/projects/${id}`).then(() => undefined),
};
