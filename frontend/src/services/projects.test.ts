
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectService } from './projects';
import api from './api';

// Mock the api module
vi.mock('./api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('projectService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getAll fetches projects correctly', async () => {
        const mockProjects = [{ id: 'p1', name: 'Project 1' }];
        (api.get as any).mockResolvedValue({ data: mockProjects });

        const result = await projectService.getAll();

        expect(api.get).toHaveBeenCalledWith('/projects');
        expect(result).toEqual(mockProjects);
    });

    it('getById fetches a single project correctly', async () => {
        const mockProject = { id: 'p1', name: 'Project 1' };
        (api.get as any).mockResolvedValue({ data: mockProject });

        const result = await projectService.getById('p1');

        expect(api.get).toHaveBeenCalledWith('/projects/p1');
        expect(result).toEqual(mockProject);
    });

    it('create sends correct payload', async () => {
        const newProject = { name: 'New Project', vehicles: [] };
        const mockResponse = { id: 'p2', ...newProject };
        (api.post as any).mockResolvedValue({ data: mockResponse });

        const result = await projectService.create(newProject);

        expect(api.post).toHaveBeenCalledWith('/projects', newProject);
        expect(result).toEqual(mockResponse);
    });

    it('update sends correct payload', async () => {
        const updateData = { name: 'Updated Project' };
        const mockResponse = { id: 'p1', ...updateData };
        (api.put as any).mockResolvedValue({ data: mockResponse });

        const result = await projectService.update('p1', updateData);

        expect(api.put).toHaveBeenCalledWith('/projects/p1', updateData);
        expect(result).toEqual(mockResponse);
    });

    it('delete calls correct endpoint', async () => {
        (api.delete as any).mockResolvedValue({});

        await projectService.delete('p1');

        expect(api.delete).toHaveBeenCalledWith('/projects/p1');
    });
});
