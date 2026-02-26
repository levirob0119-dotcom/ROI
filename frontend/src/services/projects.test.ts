import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectService } from './projects';
import { setCurrentUser } from './local-db';

// jsdom 测试环境的 localStorage 可能缺少完整实现，手动 mock
const store: Record<string, string> = {};
const localStorageMock = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (n: number) => Object.keys(store)[n] ?? null,
};

vi.stubGlobal('localStorage', localStorageMock);

let testId = 0;

describe('projectService (localStorage)', () => {
    beforeEach(() => {
        testId++;
        setCurrentUser(`test-user-${testId}`);
        localStorageMock.clear();
    });

    it('getAll returns empty array when no projects', async () => {
        const result = await projectService.getAll();
        expect(result).toEqual([]);
    });

    it('create and getAll work correctly', async () => {
        const created = await projectService.create({
            name: 'Test Project',
            vehicles: ['cetus'],
            description: '测试',
        });

        expect(created.name).toBe('Test Project');
        expect(created.vehicles).toEqual(['cetus']);
        expect(created.id).toBeDefined();

        const projects = await projectService.getAll();
        expect(projects).toHaveLength(1);
        expect(projects[0].name).toBe('Test Project');
    });

    it('getById returns the correct project', async () => {
        const created = await projectService.create({ name: 'Find Me', vehicles: [] });
        const found = await projectService.getById(created.id);

        expect(found.id).toBe(created.id);
        expect(found.name).toBe('Find Me');
    });

    it('update modifies the project', async () => {
        const created = await projectService.create({ name: 'Old Name', vehicles: [] });
        const updated = await projectService.update(created.id, { name: 'New Name' });

        expect(updated.name).toBe('New Name');
        expect(updated.id).toBe(created.id);
    });

    it('delete removes the project', async () => {
        const created = await projectService.create({ name: 'To Delete', vehicles: [] });
        await projectService.delete(created.id);

        const projects = await projectService.getAll();
        expect(projects).toHaveLength(0);
    });
});
