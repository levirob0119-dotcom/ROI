/**
 * 方案服务
 *
 * 当前使用 localStorage 实现（localProjectService）。
 * 后续后端实例到位后，将 localProjectService 换回 API 调用，
 * 组件层无需改动。
 */
import type { Project } from '@/types/models';
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

export const projectService = {
    getAll: (): Promise<Project[]> =>
        localProjectService.getAll(),

    getById: (id: string): Promise<Project> =>
        localProjectService.getById(id),

    create: (data: CreateProjectData): Promise<Project> =>
        localProjectService.create(data),

    update: (id: string, data: UpdateProjectData): Promise<Project> =>
        localProjectService.update(id, data),

    delete: (id: string): Promise<void> =>
        localProjectService.delete(id),
};
