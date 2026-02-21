import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectHeader from '@/components/Project/ProjectHeader';
import AnalysisInput from '@/components/Project/AnalysisInput';
import AnalysisResult from '@/components/Project/AnalysisResult';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    {
        l1_id: 1,
        l1_name: '感知硬件',
        l2_items: [
            { id: 101, name: '激光雷达' },
            { id: 102, name: '摄像头数目' }
        ]
    },
    {
        l1_id: 2,
        l1_name: '功能体验',
        l2_items: [
            { id: 201, name: '高速 NOA' },
            { id: 202, name: '城市 NOA' },
            { id: 203, name: '自动泊车' }
        ]
    }
];

const StreamlinedView: React.FC = () => {
    const navigate = useNavigate();
    const [currentVehicle, setCurrentVehicle] = useState('NIO ET5');

    const handleBack = () => navigate('/demo');

    return (
        <div className="ds-page-bg flex h-screen flex-col overflow-hidden">
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
                <Button
                    onClick={handleBack}
                    variant="outline"
                    size="sm"
                    className="absolute left-20 top-5 z-20"
                >
                    返回实验场
                </Button>
                <Badge variant="warning" className="absolute right-6 top-5 z-20">
                    实验态
                </Badge>
            </div>

            <div className="flex-1 flex min-h-0">
                <AnalysisInput
                    petsList={MOCK_PETS}
                    uvData={MOCK_UV}
                    vehicles={['NIO ET5', 'Tesla Model 3']}
                    vehiclesDataStatus={[
                        { id: 'NIO ET5', name: 'NIO ET5', hasData: true },
                        { id: 'Tesla Model 3', name: 'Tesla Model 3', hasData: true }
                    ]}
                    currentVehicle={currentVehicle}
                    petsEntries={[]} // Mock empty entries
                    onVehicleChange={setCurrentVehicle}
                    onAddPets={() => { }}
                    onDeletePets={() => { }}
                    onToggleExpand={() => { }}
                    onToggleUV={() => { }}
                />
                <AnalysisResult
                    vehicles={[currentVehicle]}
                    currentVehicle={currentVehicle}
                    results={{
                        [currentVehicle]: { finalScore: 82, totalEnhanced: 3, totalReduced: 1, usageRate: 65 }
                    }}
                />
            </div>
        </div>
    );
};

export default StreamlinedView;
