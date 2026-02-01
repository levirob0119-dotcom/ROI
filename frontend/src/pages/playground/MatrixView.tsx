import React, { useState, useEffect } from 'react';
import { ArrowLeft, Grip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dataService, type Pets } from '@/services/data';

const MatrixView: React.FC = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState<Pets[]>([]);
    const vehicles = ['NIO ET5', 'Tesla Model 3', 'BMW 3', 'Xpeng P7'];

    // Matrix State: vehicle_petsId -> 'enhanced' | 'reduced' | null
    const [matrix, setMatrix] = useState<Record<string, string>>({});

    useEffect(() => {
        dataService.getPets().then(setPets);
    }, []);

    const toggleCell = (vehicle: string, petsId: string) => {
        const key = `${vehicle}_${petsId}`;
        const current = matrix[key];

        // Cycle: null -> enhanced -> reduced -> null
        if (!current) {
            setMatrix({ ...matrix, [key]: 'enhanced' });
        } else if (current === 'enhanced') {
            setMatrix({ ...matrix, [key]: 'reduced' });
        } else {
            const next = { ...matrix };
            delete next[key];
            setMatrix(next);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/demo')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold">全景矩阵模式 (Matrix)</h1>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded">Power User</span>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 font-semibold sticky top-0 z-10">
                            <tr>
                                <th className="p-4 border-b border-r border-gray-300 min-w-[200px] w-64 bg-gray-100">
                                    体验维度 / 车型
                                </th>
                                {vehicles.map(v => (
                                    <th key={v} className="p-4 border-b border-gray-300 min-w-[140px] text-center">
                                        {v}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pets.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 border-b border-gray-100">
                                    <td className="p-3 border-r border-gray-200 font-medium text-gray-900 flex items-center gap-2">
                                        <Grip size={14} className="text-gray-300 cursor-move" />
                                        {p.name}
                                    </td>
                                    {vehicles.map(v => {
                                        const status = matrix[`${v}_${p.id}`];
                                        return (
                                            <td
                                                key={v}
                                                onClick={() => toggleCell(v, p.id)}
                                                className={`p-1 border-r border-gray-100 cursor-pointer text-center select-none transition-colors ${status === 'enhanced' ? 'bg-green-100' :
                                                    status === 'reduced' ? 'bg-red-100' : ''
                                                    }`}
                                            >
                                                <div className={`w-full h-8 flex items-center justify-center rounded font-bold ${status === 'enhanced' ? 'text-green-700' :
                                                    status === 'reduced' ? 'text-red-700' : 'text-gray-300 group-hover:bg-gray-100'
                                                    }`}>
                                                    {status === 'enhanced' && '+'}
                                                    {status === 'reduced' && '-'}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                    操作提示：单击循环切换状态 (空 → 增强 → 减弱 → 空)。右键可查看详细 UV 指标。
                </div>
            </div>
        </div>
    );
};

export default MatrixView;
