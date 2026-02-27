import { Car, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

import EmptyStateBlock from '@/components/patterns/EmptyStateBlock';
import InlineStatusBar from '@/components/patterns/InlineStatusBar';
import PageHeader from '@/components/patterns/PageHeader';
import ScoreSummary from '@/components/patterns/ScoreSummary';
import VehicleTabs from '@/components/patterns/VehicleTabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';

export default function ComponentShowcase() {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
            <PageHeader
                title="组件落地基线"
                description="基础组件 + 业务复合组件在真实业务场景下的组合示例。"
                status={{ label: 'Review Ready', tone: 'success' }}
            />

            <Card variant="subtle">
                <CardHeader>
                    <CardTitle>逐个评审入口</CardTitle>
                    <CardDescription>已挑选 5 个高频基础组件，支持单组件查看与逐条评审记录。</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button asChild variant="action">
                        <Link to="/components/review">进入 5 组件评审模式</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link to="/design-system">查看设计系统总览</Link>
                    </Button>
                </CardContent>
            </Card>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>基础组件状态</CardTitle>
                        <CardDescription>Button / Input / Toggle / Slider</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Button variant="action">Primary CTA</Button>
                            <Button variant="outline">Secondary</Button>
                            <Button variant="destructive">Delete</Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="component-email">通知邮箱</Label>
                            <Input id="component-email" placeholder="team@company.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="component-type">需求类型</Label>
                            <Select
                                id="component-type"
                                placeholder="请选择类型"
                                value="performance"
                                onValueChange={() => undefined}
                                options={[
                                    { label: 'Must-be', value: 'must-be' },
                                    { label: 'Performance', value: 'performance' },
                                    { label: 'Attractive', value: 'attractive' },
                                ]}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="component-note">备注说明</Label>
                            <Textarea id="component-note" placeholder="输入说明..." />
                        </div>
                        <div className="flex items-center justify-between rounded-control border border-border bg-surface px-3 py-2">
                            <span className="text-ds-body-sm text-text-primary">开启每周汇总</span>
                            <Toggle defaultChecked />
                        </div>
                        <label className="flex items-center gap-2 text-ds-body-sm text-text-primary">
                            <Checkbox defaultChecked aria-label="自动创建提醒任务" />
                            自动创建提醒任务
                        </label>
                        <Slider value={68} onChange={() => undefined} unit="%" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>业务复合组件</CardTitle>
                        <CardDescription>状态条 / 车型切换 / 空态 / 分值摘要</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <VehicleTabs
                            items={[
                                { id: 'leo', label: 'leo', hasData: true },
                                { id: 'draco', label: 'draco', hasData: true },
                                { id: 'cygnus', label: 'cygnus', hasData: false }
                            ]}
                            value="leo"
                            onChange={() => undefined}
                        />
                        <InlineStatusBar
                            tone="warning"
                            title="当前有 2 个阻塞项"
                            description="请先补齐 Kano 属性与渗透率，再进行测算。"
                        />
                        <ScoreSummary finalScore={12.4} totalEnhanced={18.7} totalReduced={6.3} />
                    </CardContent>
                </Card>
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>空态模板</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EmptyStateBlock
                            title="暂无测算结果"
                            description="请先添加 Pets 并选择 UV 指标，然后执行测算。"
                            actionLabel="开始录入"
                            onAction={() => undefined}
                            icon={Database}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>语义标签</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            <Badge>Default</Badge>
                            <Badge variant="success">Success</Badge>
                            <Badge variant="warning">Warning</Badge>
                            <Badge variant="destructive">Error</Badge>
                            <Badge variant="outline">Outline</Badge>
                        </div>
                        <p className="inline-flex items-center gap-1 text-ds-body-sm text-text-secondary">
                            <Car className="h-4 w-4" />
                            所有标签颜色已按 token 映射。
                        </p>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
