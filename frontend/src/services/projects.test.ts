import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectService } from './projects';

// Mock axios api instance
vi.mock('./api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

import api from './api';

const mockProject = {
    id: 'proj-1',
    userId: 'user-1',
    name: 'Test Project',
    description: '测试',
    vehicles: ['cetus'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('projectService (API)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getAll calls GET /projects and returns data', async () => {
        vi.mocked(api.get).mockResolvedValue({ data: [mockProject] });

        const result = await projectService.getAll();

        expect(api.get).toHaveBeenCalledWith('/projects');
        expect(result).toEqual([mockProject]);
    });

    it('getById calls GET /projects/:id and returns data', async () => {
        vi.mocked(api.get).mockResolvedValue({ data: mockProject });

        const result = await projectService.getById('proj-1');

        expect(api.get).toHaveBeenCalledWith('/projects/proj-1');
        expect(result).toEqual(mockProject);
    });

    it('create calls POST /projects with payload and returns data', async () => {
        vi.mocked(api.post).mockResolvedValue({ data: mockProject });
        const payload = { name: 'Test Project', vehicles: ['cetus'], description: '测试' };

        const result = await projectService.create(payload);

        expect(api.post).toHaveBeenCalledWith('/projects', payload);
        expect(result).toEqual(mockProject);
        expect(result.id).toBeDefined();
    });

    it('update calls PUT /projects/:id with data and returns updated project', async () => {
        const updated = { ...mockProject, name: 'New Name' };
        vi.mocked(api.put).mockResolvedValue({ data: updated });

        const result = await projectService.update('proj-1', { name: 'New Name' });

        expect(api.put).toHaveBeenCalledWith('/projects/proj-1', { name: 'New Name' });
        expect(result.name).toBe('New Name');
        expect(result.id).toBe('proj-1');
    });

    it('delete calls DELETE /projects/:id and resolves void', async () => {
        vi.mocked(api.delete).mockResolvedValue({ data: { success: true } });

        const result = await projectService.delete('proj-1');

        expect(api.delete).toHaveBeenCalledWith('/projects/proj-1');
        expect(result).toBeUndefined();
    });
});
