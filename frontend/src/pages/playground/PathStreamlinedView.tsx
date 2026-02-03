import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit3, ArrowLeft, Calculator, MapPin } from 'lucide-react';
import UVSelectionTable from '@/components/Project/UVSelectionTable';
import { type UVL1 } from '@/services/data';

// Mock Data
const MOCK_UV: UVL1[] = [
    {
        l1_id: 1,
        l1_name: '愉悦享受',
        l2_items: [
            { id: 101, name: '高级音响体验' },
            { id: 102, name: '座椅按摩' },
            { id: 103, name: '香氛系统' }
        ]
    },
    {
        l1_id: 2,
        l1_name: '科技领先',
        l2_items: [
            { id: 201, name: '高速 NOA' },
            { id: 202, name: '城市 NOA' },
            { id: 203, name: '自动泊车' },
            { id: 204, name: 'HUD 抬头显示' }
        ]
    },
    {
        l1_id: 3,
        l1_name: '安全感',
        l2_items: [
            { id: 301, name: '主动刹车 AEB' },
            { id: 302, name: '盲区监测' },
            { id: 303, name: '车身强度' }
        ]
    },
    {
        l1_id: 4,
        l1_name: '便利性',
        l2_items: [
            { id: 401, name: '手机蓝牙钥匙' },
            { id: 402, name: '语音交互' },
            { id: 403, name: 'OTA 升级' }
        ]
    }
];

interface ImpactPath {
    id: string;
    name: string; // Scenario Name (e.g., "Feature A")
    type: 'enhanced' | 'reduced';
    vehicle: string;
    selectedUVs: string[];
}

const PathStreamlinedView: React.FC = () => {
    const navigate = useNavigate();
    const [paths, setPaths] = useState<ImpactPath[]>([]);
    const [activePathId, setActivePathId] = useState<string | null>(null);

    // Temp state for new path creation
    const [isCreating, setIsCreating] = useState(false);
    const [newPathName, setNewPathName] = useState('');
    const [newPathType, setNewPathType] = useState<'enhanced' | 'reduced'>('enhanced');

    // Project Info State (Mock)
    const projectDesc = 'NIO ET5 竞争力分析';

    const handleBack = () => navigate('/demo');

    const activePath = useMemo(() => paths.find(p => p.id === activePathId), [paths, activePathId]);

    const createPath = () => {
        if (!newPathName.trim()) return;
        const newPath: ImpactPath = {
            id: Date.now().toString(),
            name: newPathName,
            type: newPathType,
            vehicle: 'NIO ET5',
            selectedUVs: []
        };
        setPaths([...paths, newPath]);
        setActivePathId(newPath.id);
        setIsCreating(false);
        setNewPathName('');
    };

    const toggleUV = (uvL2: string) => {
        if (!activePathId) return;
        setPaths(paths.map(p => {
            if (p.id !== activePathId) return p;
            const newUVs = p.selectedUVs.includes(uvL2)
                ? p.selectedUVs.filter(u => u !== uvL2)
                : [...p.selectedUVs, uvL2];
            return { ...p, selectedUVs: newUVs };
        }));
    };

    const deletePath = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setPaths(paths.filter(p => p.id !== id));
        if (activePathId === id) setActivePathId(null);
    };

    // Calculation Logic (Mock)
    const score = useMemo(() => {
        let enhanced = 0;
        let reduced = 0;
        paths.forEach(p => {
            const val = p.selectedUVs.length * 10; // Mock score per UV
            if (p.type === 'enhanced') enhanced += val;
            else reduced += val;
        });
        return { total: enhanced - reduced, enhanced, reduced };
    }, [paths]);

    return (
        <div className="bg-gray-50 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {projectDesc}
                            <Edit3 size={16} className="text-gray-400 cursor-pointer hover:text-indigo-600" />
                        </h1>
                        <div className="text-xs text-gray-500 mt-1">方案 D: Path 核心模式 (Scenario Based)</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
                        <span className="text-sm text-indigo-800 font-medium mr-2">预估 UVA 总分</span>
                        <span className="text-2xl font-bold text-indigo-600">{score.total}</span>
                    </div>
                    <button className="bg-black text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors">
                        保存方案
                    </button>
                </div>
            </div>

            <div className="flex-1 flex min-h-0">
                {/* LEFT: Path Configuration List */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">影响路径配置 (Path)</h2>

                        {/* New Path Builder */}
                        {!isCreating ? (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 font-medium"
                            >
                                <Plus size={18} />
                                新建 Path
                            </button>
                        ) : (
                            <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-lg animate-in fade-in zoom-in-95 duration-200 relative z-20">
                                <h3 className="text-sm font-bold text-gray-900 mb-3">定义 Path 属性</h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Path 名称 / 场景描述</label>
                                        <input
                                            type="text"
                                            value={newPathName}
                                            onChange={(e) => setNewPathName(e.target.value)}
                                            placeholder="例如: 自动泊车功能"
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-indigo-500 outline-none"
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">影响方向</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setNewPathType('enhanced')}
                                                className={`flex-1 py-1.5 text-xs font-bold rounded ${newPathType === 'enhanced' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                            >
                                                提升 (+)
                                            </button>
                                            <button
                                                onClick={() => setNewPathType('reduced')}
                                                className={`flex-1 py-1.5 text-xs font-bold rounded ${newPathType === 'reduced' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                                            >
                                                降低 (-)
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={createPath}
                                        disabled={!newPathName.trim()}
                                        className="w-full py-2 bg-black text-white rounded text-xs font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        确认创建
                                    </button>
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="w-full py-1 text-xs text-gray-400 hover:text-gray-600"
                                    >
                                        取消
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {paths.length === 0 && !isCreating && (
                            <div className="text-center py-10 text-gray-400 text-sm">
                                暂无 Path<br />请点击上方新建
                            </div>
                        )}
                        {paths.map(path => {
                            const isActive = activePathId === path.id;
                            return (
                                <div
                                    key={path.id}
                                    onClick={() => setActivePathId(path.id)}
                                    className={`relative p-3 rounded-lg border transition-all cursor-pointer group ${isActive
                                        ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                                        : 'border-gray-200 bg-white hover:border-indigo-300'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${path.type === 'enhanced' ? 'bg-white text-indigo-600 border border-indigo-200' : 'bg-white text-red-600 border border-red-200'
                                            }`}>
                                            {path.type === 'enhanced' ? 'ENHANCE' : 'REDUCE'}
                                        </div>
                                        <button
                                            onClick={(e) => deletePath(e, path.id)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="font-bold text-gray-900 mb-1 leading-tight">{path.name}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <MapPin size={10} />
                                        {path.vehicle}
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        已选 UV: <b>{path.selectedUVs.length}</b>
                                    </div>

                                    {isActive && (
                                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-50 border-r border-t border-indigo-500 transform rotate-45"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* MIDDLE: UV Selection Table (Contextual) */}
                <div className="flex-1 bg-gray-50 p-6 overflow-y-auto flex flex-col">
                    {activePath ? (
                        <div className="max-w-4xl mx-auto w-full animate-in slide-in-from-right-4 duration-300">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <span className={`w-3 h-8 rounded-full ${activePath.type === 'enhanced' ? 'bg-indigo-600' : 'bg-red-500'}`}></span>
                                    {activePath.name}
                                    <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-normal text-gray-500 shadow-sm">
                                        {activePath.vehicle}
                                    </span>
                                </h2>
                                <p className="text-gray-500 mt-2 ml-6">
                                    请在下方表格中勾选此 Scene/Feature 影响的用户价值 (UV)。
                                </p>
                            </div>

                            <UVSelectionTable
                                uvData={MOCK_UV}
                                selectedUVs={activePath.selectedUVs}
                                onToggle={toggleUV}
                            />
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <Plus size={32} className="text-white" />
                            </div>
                            <p className="text-lg font-medium">请先从左侧选择一条 Path<br />或点击“新建 Path”</p>
                        </div>
                    )}
                </div>

                {/* RIGHT: Result Preview (Always Visible / Collapsible) */}
                <div className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Calculator size={18} />
                        实时测算明细
                    </h3>

                    <div className="space-y-6">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-sm text-gray-500 mb-1">Total Score</div>
                            <div className="text-3xl font-extrabold text-indigo-600">{score.total}</div>
                            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-200">
                                <div>
                                    <div className="text-xs text-green-600 font-bold uppercase">Enhanced</div>
                                    <div className="font-mono font-bold">+{score.enhanced}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-red-600 font-bold uppercase">Reduced</div>
                                    <div className="font-mono font-bold">-{score.reduced}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Path Breakdown</h4>
                            {paths.map(p => (
                                <div key={p.id} className="flex justify-between items-center text-sm mb-2 pb-2 border-b border-gray-50 last:border-0">
                                    <div className="truncate pr-2">
                                        <div className="font-medium text-gray-700 truncate" title={p.name}>{p.name}</div>
                                        <div className="text-xs text-gray-400">{p.selectedUVs.length} UVs</div>
                                    </div>
                                    <div className={`font-mono font-bold whitespace-nowrap ${p.type === 'enhanced' ? 'text-green-600' : 'text-red-600'}`}>
                                        {p.type === 'enhanced' ? '+' : '-'}{p.selectedUVs.length * 10}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PathStreamlinedView;
// Force rebuild trigger
