import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Car, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/patterns/PageHeader';
import { Badge } from '@/components/ui/badge';
import { dataService, type Pets } from '@/services/data';

// Simplified Wizard for Demo
const WizardView: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [pets, setPets] = useState<Pets[]>([]);

    // Demo State
    const [vehicle, setVehicle] = useState('NIO ET5');
    const [selections, setSelections] = useState<string[]>([]);

    useEffect(() => {
        dataService.getPets().then(setPets);
    }, []);

    const toggleSelection = (id: string) => {
        if (selections.includes(id)) {
            setSelections(selections.filter(s => s !== id));
        } else {
            setSelections([...selections, id]);
        }
    };

    return (
        <div className="ds-page-bg min-h-screen flex flex-col">
            <div className="px-6 pt-6">
                <PageHeader
                    title="向导模式演示"
                    description="分步引导流程，仅用于实验评审。"
                    status={{ label: '实验态', tone: 'warning' }}
                />
            </div>

            {/* Progress Bar */}
            <div className="mt-4 bg-white border-y border-gray-200 px-8 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    {[
                        { num: 1, label: '选择车型' },
                        { num: 2, label: '提升维度' },
                        { num: 3, label: '降低维度' },
                        { num: 4, label: '查看结果' }
                    ].map((s) => (
                        <div key={s.num} className={`flex items-center gap-2 ${step >= s.num ? 'text-indigo-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= s.num ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
                                }`}>
                                {s.num}
                            </div>
                            <span className="font-medium">{s.label}</span>
                            {s.num < 4 && <div className="w-12 h-0.5 bg-gray-200 mx-2" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Content */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-8">
                {step === 1 && (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-8">请选择要评估的车型</h2>
                        <div className="flex gap-4 justify-center">
                            {['NIO ET5', 'Tesla Model 3', 'BMW 3'].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setVehicle(v)}
                                    className={`p-6 rounded-xl border-2 transition-all ${vehicle === v
                                        ? 'border-indigo-600 bg-indigo-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                >
                                    <Car size={32} className={`mx-auto mb-2 ${vehicle === v ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <div className="font-bold">{v}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-100 text-green-700 font-bold mb-2">
                                <ThumbsUp size={16} /> 提升维度
                            </div>
                            <h2 className="text-2xl font-bold">哪些维度的体验优于竞品？</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {pets.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => toggleSelection(p.id)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selections.includes(p.id)
                                        ? 'border-green-500 bg-green-50 shadow-sm ring-1 ring-green-500'
                                        : 'border-gray-200 bg-white hover:border-green-300'
                                        }`}
                                >
                                    <div className="font-bold mb-1">{p.name}</div>
                                    <div className="text-xs text-gray-500">点击展开详细指标 (演示)</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-100 text-red-700 font-bold mb-2">
                                <ThumbsDown size={16} /> 降低维度
                            </div>
                            <h2 className="text-2xl font-bold">哪些维度的体验不如竞品？</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {pets.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => toggleSelection(p.id + '_bad')}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selections.includes(p.id + '_bad')
                                        ? 'border-red-500 bg-red-50 shadow-sm ring-1 ring-red-500'
                                        : 'border-gray-200 bg-white hover:border-red-300'
                                        }`}
                                >
                                    <div className="font-bold mb-1">{p.name}</div>
                                    <div className="text-xs text-gray-500">点击展开详细指标 (演示)</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <Badge variant="warning">实验态结果</Badge>
                        </div>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">测算完成！</h2>
                        <p className="text-gray-500 mb-8">UVA 总分预测：85 分</p>
                        <div className="flex justify-center gap-4">
                            <button className="btn-secondary" onClick={() => navigate('/demo')}>返回 Demo 首页</button>
                            <button className="btn-primary" onClick={() => setStep(1)}>重新测算</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="bg-white border-t border-gray-200 px-8 py-4">
                <div className="max-w-4xl mx-auto flex justify-between">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : navigate('/demo')}
                        className="px-6 py-2 rounded-lg hover:bg-gray-100 font-medium text-gray-600 transition-colors"
                    >
                        {step === 1 ? '退出体验' : '上一步'}
                    </button>

                    {step < 4 && (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            下一步
                            <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WizardView;
