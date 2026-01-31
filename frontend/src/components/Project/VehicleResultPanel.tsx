import React from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronRight, Car } from 'lucide-react';

interface VehicleResultPanelProps {
    vehicle: string;
    result: any | null;
    isActive: boolean;
}

const VehicleResultPanel: React.FC<VehicleResultPanelProps> = ({
    vehicle,
    result,
    isActive
}) => {
    const [isExpanded, setIsExpanded] = React.useState(true);

    if (!result) {
        return (
            <div className={`bg-white rounded-xl border ${isActive ? 'border-indigo-200' : 'border-gray-200'} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                    <Car size={16} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                    <span className={`font-bold ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                        {vehicle.toUpperCase()}
                    </span>
                    {isActive && (
                        <span className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded">当前</span>
                    )}
                </div>
                <p className="text-sm text-gray-400">尚未录入数据</p>
            </div>
        );
    }

    const { totalEnhanced, totalReduced, finalScore, enhanced, reduced } = result;

    return (
        <div className={`bg-white rounded-xl border ${isActive ? 'border-indigo-200' : 'border-gray-200'} overflow-hidden`}>
            {/* Header */}
            <div
                className={`flex items-center justify-between px-4 py-3 cursor-pointer ${isActive ? 'bg-indigo-50' : 'bg-gray-50'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Car size={16} className={isActive ? 'text-indigo-600' : 'text-gray-500'} />
                    <span className={`font-bold ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                        {vehicle.toUpperCase()}
                    </span>
                    {isActive && (
                        <span className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded">当前</span>
                    )}
                </div>
                <div className={`text-lg font-bold ${finalScore > 0 ? 'text-green-600' : finalScore < 0 ? 'text-red-500' : 'text-gray-600'
                    }`}>
                    {finalScore > 0 ? '+' : ''}{finalScore.toFixed(1)}
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="p-4 space-y-4">
                    {/* Enhanced Section */}
                    {totalEnhanced > 0 && (
                        <div className="border border-green-100 rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 bg-green-50">
                                <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                                    <TrendingUp size={14} />
                                    增强维度
                                </div>
                                <span className="font-bold text-green-700">+{totalEnhanced.toFixed(1)}</span>
                            </div>
                            <div className="p-2 space-y-2">
                                {enhanced?.petsList?.map((pets: any) => (
                                    <div key={pets.petsId} className="text-sm">
                                        <div className="flex justify-between text-gray-700 font-medium px-2">
                                            <span>{getPetsName(pets.petsId)}</span>
                                            <span className="text-green-600">+{pets.totalScore.toFixed(1)}</span>
                                        </div>
                                        <div className="pl-4 space-y-0.5 mt-1">
                                            {pets.uvL1List?.slice(0, 3).map((l1: any) => (
                                                <div key={l1.l1Name} className="flex justify-between text-xs text-gray-500">
                                                    <span className="truncate">{l1.l1Name}</span>
                                                    <span>+{l1.totalScore.toFixed(1)}</span>
                                                </div>
                                            ))}
                                            {pets.uvL1List?.length > 3 && (
                                                <div className="text-xs text-gray-400">+{pets.uvL1List.length - 3} 更多...</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reduced Section */}
                    {totalReduced > 0 && (
                        <div className="border border-red-100 rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 bg-red-50">
                                <div className="flex items-center gap-2 text-red-700 font-medium text-sm">
                                    <TrendingDown size={14} />
                                    减弱维度
                                </div>
                                <span className="font-bold text-red-700">-{totalReduced.toFixed(1)}</span>
                            </div>
                            <div className="p-2 space-y-2">
                                {reduced?.petsList?.map((pets: any) => (
                                    <div key={pets.petsId} className="text-sm">
                                        <div className="flex justify-between text-gray-700 font-medium px-2">
                                            <span>{getPetsName(pets.petsId)}</span>
                                            <span className="text-red-600">-{pets.totalScore.toFixed(1)}</span>
                                        </div>
                                        <div className="pl-4 space-y-0.5 mt-1">
                                            {pets.uvL1List?.slice(0, 3).map((l1: any) => (
                                                <div key={l1.l1Name} className="flex justify-between text-xs text-gray-500">
                                                    <span className="truncate">{l1.l1Name}</span>
                                                    <span>-{l1.totalScore.toFixed(1)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Helper to get PETS display name from ID
function getPetsName(petsId: string): string {
    const petsMap: Record<string, string> = {
        intelligent_driving: '智能驾驶',
        intelligent_cockpit: '智能座舱',
        safety: '安全体验',
        exterior_design: '外观设计',
        interior_design: '内饰设计',
        driving_experience: '驾驶体验',
        riding_experience: '乘坐体验',
        space: '空间体验',
        cabin_comfort: '座舱环境',
        range_charging: '续航补能'
    };
    return petsMap[petsId] || petsId;
}

export default VehicleResultPanel;
