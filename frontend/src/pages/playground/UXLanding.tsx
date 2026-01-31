import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, ArrowRight, MousePointer2, ListOrdered, Grid3X3 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const DemoCard = ({ title, desc, icon: Icon, path, color }: any) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(path)}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 text-white`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {title}
            </h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                {desc}
            </p>
            <div className="flex items-center text-indigo-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span>立即体验</span>
                <ArrowRight size={16} className="ml-1" />
            </div>
        </div>
    );
};

const UXLanding: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">UX 交互体验场</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        我们为您构建了三种不同理念的交互原型。请点击下方卡片，亲自上手体验录入流程，选择最适合现有工作流的方案。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DemoCard
                        title="方案 A: 流式布局"
                        desc="【推荐】左侧切维度，中间选指标，右侧看结果。强调“心流”和效率，适合高频操作。"
                        icon={Layout}
                        path="/demo/streamlined"
                        color="bg-blue-500"
                    />
                    <DemoCard
                        title="方案 B: 向导模式"
                        desc="分步引导，先选增强再选减弱。降低认知负载，适合演示和新手引导。"
                        icon={ListOrdered}
                        path="/demo/wizard"
                        color="bg-purple-500"
                    />
                    <DemoCard
                        title="方案 C: 矩阵模式"
                        desc="上帝视角，类 Excel 表格体验。适合专家用户进行多车型快速批量勾选。"
                        icon={Grid3X3}
                        path="/demo/matrix"
                        color="bg-emerald-500"
                    />
                    <DemoCard
                        title="方案 D: Path 核心模式"
                        desc="【用户定制】严格遵循 Path 配置流程：定义方向 -> 选维度 -> 选 UV。逻辑最严谨。"
                        icon={MousePointer2}
                        path="/demo/path"
                        color="bg-pink-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default UXLanding;
