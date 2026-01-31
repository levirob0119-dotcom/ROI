
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dataService } from './data';
import api from './api';

// Mock the api module
vi.mock('./api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('dataService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getVehicles fetches data correctly', async () => {
        const mockVehicles = [{ id: 'v1', name: 'Vehicle 1' }];
        (api.get as any).mockResolvedValue({ data: mockVehicles });

        const result = await dataService.getVehicles();

        expect(api.get).toHaveBeenCalledWith('/data/vehicles');
        expect(result).toEqual(mockVehicles);
    });

    it('getPets fetches data correctly', async () => {
        const mockPets = [{ id: 'p1', name: 'Pet 1' }];
        (api.get as any).mockResolvedValue({ data: mockPets });

        const result = await dataService.getPets();

        expect(api.get).toHaveBeenCalledWith('/data/pets');
        expect(result).toEqual(mockPets);
    });

    it('getUVData fetches data correctly', async () => {
        const mockUVData = [{ l1_id: 1, l1_name: 'L1', l2_items: [] }];
        (api.get as any).mockResolvedValue({ data: mockUVData });

        const result = await dataService.getUVData();

        expect(api.get).toHaveBeenCalledWith('/data/uv');
        expect(result).toEqual(mockUVData);
    });

    it('calculateUVA sends correct payload', async () => {
        const payload = { projectId: '123', vehicle: 'leo' };
        const mockResponse = { result: 100 };
        (api.post as any).mockResolvedValue({ data: mockResponse });

        const result = await dataService.calculateUVA(payload);

        expect(api.post).toHaveBeenCalledWith('/uva/calculate', payload);
        expect(result).toEqual(mockResponse);
    });
});
