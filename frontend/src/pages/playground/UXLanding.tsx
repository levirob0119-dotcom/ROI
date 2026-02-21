import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Grid3X3, Layout, ListOrdered, MousePointer2 } from 'lucide-react';

import PageHeader from '@/components/patterns/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DemoEntry {
    title: string;
    desc: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    status?: string;
}

const demos: DemoEntry[] = [
    {
        title: '方案 A: 流式布局',
        desc: '左侧录入、右侧结果联动，强调高频效率与连续操作。',
        path: '/demo/streamlined',
        icon: Layout,
        status: '推荐'
    },
    {
        title: '方案 B: 向导模式',
        desc: '按步骤引导用户完成录入，适用于培训和演示。',
        path: '/demo/wizard',
        icon: ListOrdered
    },
    {
        title: '方案 C: 矩阵模式',
        desc: '以矩阵视图批量处理多车型，适合专家用户。',
        path: '/demo/matrix',
        icon: Grid3X3
    },
    {
        title: '方案 D: Path 模式',
        desc: '以 Path 为核心定义影响方向与指标映射。',
        path: '/demo/path',
        icon: MousePointer2
    }
];

const UXLanding: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
            <PageHeader
                title="UX 交互实验场"
                description="用于评审交互方案，不直接代表生产页面。"
                status={{ label: '实验态', tone: 'warning' }}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {demos.map((demo) => {
                    const Icon = demo.icon;
                    return (
                        <Card
                            key={demo.path}
                            className="cursor-pointer"
                            onClick={() => navigate(demo.path)}
                        >
                            <CardHeader>
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="inline-flex rounded-control bg-primary/10 p-2 text-primary">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    {demo.status ? <Badge variant="success">{demo.status}</Badge> : null}
                                    <Badge variant="warning">实验态</Badge>
                                </div>
                                <CardTitle>{demo.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-ds-body-sm text-text-secondary">{demo.desc}</p>
                                <p className="inline-flex items-center gap-1 text-ds-body-sm font-semibold text-primary">
                                    进入体验
                                    <ArrowRight className="h-4 w-4" />
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default UXLanding;
