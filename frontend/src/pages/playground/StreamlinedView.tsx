import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectHeader from '@/components/Project/ProjectHeader';
import AnalysisInput from '@/components/Project/AnalysisInput';
import AnalysisResult from '@/components/Project/AnalysisResult';
import { type Pets, type UVL1 } from '@/services/data';

// Mock Data for Demo
const MOCK_PROJECT = {
    id: 'demo',
    name: 'NIO ET5 竞争力分析 (Demo)',
    description: '此为 T-L-R 布局的高保真交互演示',
    vehicles: ['NIO ET5', 'Tesla Model 3'],
    userId: 'demo',
    createdAt: '',
    updatedAt: ''
};

const MOCK_PETS: Pets[] = [
    { id: '1', name: '智能驾驶' },
    { id: '2', name: '智能座舱' },
    { id: '3', name: '外观设计' },
    { id: '4', name: '空间舒适' },
    { id: '5', name: '动力操控' }
];

const MOCK_UV: UVL1[] = [
    { name: '感知硬件', items: ['激光雷达', '摄像头数目'] },
    { name: '功能体验', items: ['高速 NOA', '城市 NOA', '自动泊车'] }
];

const StreamlinedView: React.FC = () => {
    const navigate = useNavigate();
    const [activeMode, setActiveMode] = useState<'enhanced' | 'reduced'>('enhanced');
    const [currentVehicle, setCurrentVehicle] = useState('NIO ET5');
    const [activePetsId, setActivePetsId] = useState<string | null>(null);
    const [selections, setSelections] = useState<string[]>([]);

    const handleBack = () => navigate('/demo');

    return (
        <div className="bg-gray-50 flex flex-col h-screen overflow-hidden">
            {/* Header override for demo back navigation */}
            <div className="relative">
                <ProjectHeader
                    project={MOCK_PROJECT}
                    currentVehicle={currentVehicle}
                    isSaving={false}
                    onEdit={() => alert('Demo Only')}
                    onSave={() => alert('Demo Saved!')}
                    onCalculate={() => alert('Calculating...')}
                />
                <button
                    onClick={handleBack}
                    className="absolute left-20 top-5 bg-black/5 text-xs px-2 py-1 rounded hover:bg-black/10 transition-colors z-20"
                >
                    Back to Demos
                </button>
            </div>

            <div className="flex-1 flex min-h-0">
                <AnalysisInput
                    project={MOCK_PROJECT}
                    petsList={MOCK_PETS}
                    uvData={MOCK_UV}
                    currentVehicle={currentVehicle}
                    activeMode={activeMode}
                    activePetsId={activePetsId}
                    currentSelections={selections}
                    onVehicleChange={setCurrentVehicle}
                    onModeChange={setActiveMode}
                    onPetsSelect={setActivePetsId}
                    onToggleUV={(uv) => {
                        setSelections(prev => prev.includes(uv) ? prev.filter(x => x !== uv) : [...prev, uv]);
                    }}
                />
                <AnalysisResult
                    result={{ finalScore: 82, totalEnhanced: 3, totalReduced: 1, usageRate: 65 }}
                />
            </div>
        </div>
    );
};

export default StreamlinedView;
