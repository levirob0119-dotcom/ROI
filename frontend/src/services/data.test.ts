import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dataService } from './data';

// Mock api axios instance for saveAnalysis / getProjectAnalysis
vi.mock('./api', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

import api from './api';

// Mock uva-calculator to avoid internal fetch calls in tests
vi.mock('./uva-calculator', () => ({
    calculateUVAFrontend: vi.fn().mockResolvedValue({
        vehicle: 'cetus',
        enhanced: { totalScore: 0, petsList: [] },
        reduced: { totalScore: 0, petsList: [] },
        totalEnhanced: 0,
        totalReduced: 0,
        finalScore: 0,
        meta: {
            validationSummary: {
                hasSelections: false,
                missingKanoType: true,
                missingUsageRate: true,
                missingPenetrationRate: true,
            },
            selectionCount: { pets: 0, uv: 0, enhanced: 0, reduced: 0 },
        },
    }),
}));

describe('dataService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    const mockFetch = (data: unknown) => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(data),
            })
        );
    };

    it('getVehicles fetches data correctly', async () => {
        const mockVehicles = [{ id: 'v1', name: 'Vehicle 1' }];
        mockFetch(mockVehicles);

        const result = await dataService.getVehicles();

        // BASE_URL defaults to '/' in test environment
        expect(fetch).toHaveBeenCalledWith('/data/vehicles.json');
        expect(result).toEqual(mockVehicles);
    });

    it('getPets fetches data correctly', async () => {
        const mockPets = [{ id: 'p1', name: 'Pet 1' }];
        mockFetch(mockPets);

        const result = await dataService.getPets();

        expect(fetch).toHaveBeenCalledWith('/data/pets.json');
        expect(result).toEqual(mockPets);
    });

    it('getUVData fetches data correctly', async () => {
        const mockUVData = [{ l1_id: 1, l1_name: 'L1', l2_items: [] }];
        mockFetch(mockUVData);

        const result = await dataService.getUVData();

        expect(fetch).toHaveBeenCalledWith('/data/uv.json');
        expect(result).toEqual(mockUVData);
    });

    it('calculateUVA calls frontend calculator', async () => {
        const payload = { vehicle: 'cetus', enhancedPets: [], reducedPets: [] };

        const result = await dataService.calculateUVA(payload);

        expect(result).toBeDefined();
        expect(result.vehicle).toBe('cetus');
    });
});

describe('dataService - API methods', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockRecord = {
        id: 'analysis-1',
        projectId: 'proj-1',
        vehicle: 'cetus',
        enhancedPets: [],
        reducedPets: [],
        isDraft: false,
        analysisMeta: { isDraft: false, updatedAt: '2024-01-01T00:00:00.000Z' },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('saveAnalysis calls POST /uva/save and returns record', async () => {
        vi.mocked(api.post).mockResolvedValue({ data: mockRecord });
        const payload = { projectId: 'proj-1', vehicle: 'cetus', enhancedPets: [], reducedPets: [] };

        const result = await dataService.saveAnalysis(payload);

        expect(api.post).toHaveBeenCalledWith('/uva/save', payload);
        expect(result).toEqual(mockRecord);
        expect(result.id).toBe('analysis-1');
    });

    it('getProjectAnalysis calls GET /uva/project/:id and returns list', async () => {
        vi.mocked(api.get).mockResolvedValue({ data: [mockRecord] });

        const result = await dataService.getProjectAnalysis('proj-1');

        expect(api.get).toHaveBeenCalledWith('/uva/project/proj-1');
        expect(result).toEqual([mockRecord]);
        expect(result).toHaveLength(1);
    });
});
