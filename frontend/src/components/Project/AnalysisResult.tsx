import React from 'react';
import { TrendingUp, TrendingDown, Car } from 'lucide-react';
import './AnalysisInput.css'; // 共用样式

interface AnalysisResultProps {
    vehicles: string[];
    currentVehicle: string;
    results: Record<string, any>;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({
    vehicles,
    currentVehicle,
    results
}) => {
    // 对车型排序：当前车型在最前
    const sortedVehicles = [...vehicles].sort((a, b) => {
        if (a === currentVehicle) return -1;
        if (b === currentVehicle) return 1;
        return 0;
    });

    return (
        <div className="analysis-result">
            <div className="analysis-result-content">
                <h2>UVA 测算结果</h2>

                {sortedVehicles.map(v => {
                    const result = results[v];
                    const isActive = currentVehicle === v;

                    return (
                        <VehicleResultCard
                            key={v}
                            vehicle={v}
                            result={result}
                            isActive={isActive}
                        />
                    );
                })}
            </div>
        </div>
    );
};

// 格式化数字：保留1位小数
const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return '0';
    return Number(num).toFixed(1);
};

// 单个车型结果卡片
interface VehicleResultCardProps {
    vehicle: string;
    result: any;
    isActive: boolean;
}

const VehicleResultCard: React.FC<VehicleResultCardProps> = ({ vehicle, result, isActive }) => {
    const cardClass = `vehicle-result-card ${isActive ? 'vehicle-result-card--active' : ''}`;
    const iconClass = `vehicle-result-icon ${isActive ? 'vehicle-result-icon--active' : ''}`;

    if (!result) {
        return (
            <div className={cardClass}>
                <div className="vehicle-result-header">
                    <div className="vehicle-result-header-left">
                        <Car size={16} className={iconClass} />
                        <span className="vehicle-result-name">{vehicle.toUpperCase()}</span>
                        {isActive && (
                            <span className="vehicle-result-badge">当前</span>
                        )}
                    </div>
                </div>
                <div className="vehicle-result-empty">
                    尚未录入数据或测算
                </div>
            </div>
        );
    }

    return (
        <div className={cardClass}>
            {/* Header */}
            <div className="vehicle-result-header">
                <div className="vehicle-result-header-left">
                    <Car size={16} className={iconClass} />
                    <span className="vehicle-result-name">{vehicle.toUpperCase()}</span>
                    {isActive && (
                        <span className="vehicle-result-badge">当前</span>
                    )}
                </div>
                <div className="vehicle-result-score">
                    {formatNumber(result.finalScore)}
                </div>
            </div>

            {/* Scores */}
            <div className="score-grid">
                <div className="score-box score-box--enhanced">
                    <div className="score-box-label">
                        <TrendingUp size={10} />
                        提升
                    </div>
                    <div className="score-box-value">
                        +{formatNumber(result.totalEnhanced)}
                    </div>
                </div>
                <div className="score-box score-box--reduced">
                    <div className="score-box-label">
                        <TrendingDown size={10} />
                        降低
                    </div>
                    <div className="score-box-value">
                        -{formatNumber(result.totalReduced)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResult;
