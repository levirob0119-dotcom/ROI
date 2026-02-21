import { Car, Database } from 'lucide-react';

import EmptyStateBlock from '@/components/patterns/EmptyStateBlock';
import InlineStatusBar from '@/components/patterns/InlineStatusBar';
import PageHeader from '@/components/patterns/PageHeader';
import ScoreSummary from '@/components/patterns/ScoreSummary';
import VehicleTabs from '@/components/patterns/VehicleTabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';

export default function ComponentShowcase() {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
            <PageHeader
                title="组件落地基线"
                description="基础组件 + 业务复合组件在真实业务场景下的组合示例。"
                status={{ label: 'Review Ready', tone: 'success' }}
            />

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card className="hover:translate-y-0">
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
                        <div className="flex items-center justify-between rounded-control border border-border bg-surface px-3 py-2">
                            <span className="text-ds-body-sm text-text-primary">开启每周汇总</span>
                            <Toggle defaultChecked />
                        </div>
                        <Slider value={68} onChange={() => undefined} unit="%" />
                    </CardContent>
                </Card>

                <Card className="hover:translate-y-0">
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
                            onBlockedSelection={() => undefined}
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
                <Card className="hover:translate-y-0">
                    <CardHeader>
                        <CardTitle>空态模板</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EmptyStateBlock
                            title="暂无测算结果"
                            description="请先添加 PETS 并选择 UV 指标，然后执行测算。"
                            actionLabel="开始录入"
                            onAction={() => undefined}
                            icon={Database}
                        />
                    </CardContent>
                </Card>

                <Card className="hover:translate-y-0">
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
