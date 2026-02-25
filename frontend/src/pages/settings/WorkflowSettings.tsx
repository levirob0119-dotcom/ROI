import { useMemo, useState } from 'react';
import { Copy, Key, Plus } from 'lucide-react';

import InlineStatusBar from '@/components/patterns/InlineStatusBar';
import PageHeader from '@/components/patterns/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface NotificationState {
    failures: boolean;
    success: boolean;
    digest: boolean;
}

export default function WorkflowSettings() {
    const [apiKey] = useState('sk_live_51M0d8sL9s8d7f6g5h4j3k2l1...XyZ');
    const [notifications, setNotifications] = useState<NotificationState>({
        failures: true,
        success: false,
        digest: true
    });

    const { showToast, ToastComponent } = useToast();

    const webhooks = useMemo(
        () => [
            { url: 'https://api.myapp.com/events', events: ['push', 'pr.merge'], status: 'active' },
            { url: 'https://staging.myapp.com/test', events: ['issue.created'], status: 'failed' },
            { url: 'https://integrations.legacy.com/v1', events: ['all events'], status: 'disabled' }
        ],
        []
    );

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
            <PageHeader
                title="流程设置"
                description="按策略模块管理 API、回调和通知规则，减少配置分散与排查成本。"
                status={{ label: '草稿态', tone: 'warning' }}
                actions={
                    <Button type="button" variant="action" onClick={() => showToast('设置已保存', 'success')}>
                        保存变更
                    </Button>
                }
            />

            <InlineStatusBar
                tone="info"
                title="策略分组说明"
                description="本页面按 接入安全 / 事件回调 / 通知策略 三组组织，便于团队协作评审。"
            />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="inline-flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            接入安全
                        </CardTitle>
                        <p className="text-ds-body-sm text-text-secondary">管理生产密钥和安全状态。</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Label className="text-ds-caption text-text-secondary" htmlFor="workflow-api-key">
                            Production Secret Key
                        </Label>
                        <div className="flex gap-2">
                            <Input id="workflow-api-key" readOnly value={apiKey} className="font-mono" />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    navigator.clipboard.writeText(apiKey).catch(() => undefined);
                                    showToast('已复制 API Key', 'success');
                                }}
                            >
                                <Copy className="h-4 w-4" />
                                复制
                            </Button>
                        </div>
                        <InlineStatusBar
                            tone="warning"
                            title="高权限凭据"
                            description="请仅在服务端保存与使用此密钥，不要暴露到浏览器客户端。"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>通知策略</CardTitle>
                        <p className="text-ds-body-sm text-text-secondary">配置关键事件的通知优先级和发送频率。</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="surface-inset flex items-center justify-between rounded-control px-3 py-2">
                            <div>
                                <p className="text-ds-body-sm font-semibold text-text-primary">失败告警</p>
                                <p className="text-ds-caption text-text-secondary">关键流程失败时立即通知</p>
                            </div>
                            <Toggle
                                checked={notifications.failures}
                                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, failures: checked }))}
                            />
                        </div>
                        <div className="surface-inset flex items-center justify-between rounded-control px-3 py-2">
                            <div>
                                <p className="text-ds-body-sm font-semibold text-text-primary">成功通知</p>
                                <p className="text-ds-caption text-text-secondary">流程成功结束后发送通知</p>
                            </div>
                            <Toggle
                                checked={notifications.success}
                                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, success: checked }))}
                            />
                        </div>
                        <div className="surface-inset flex items-center justify-between rounded-control px-3 py-2">
                            <div>
                                <p className="text-ds-body-sm font-semibold text-text-primary">每周汇总</p>
                                <p className="text-ds-caption text-text-secondary">每周一自动发送团队摘要</p>
                            </div>
                            <Toggle
                                checked={notifications.digest}
                                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, digest: checked }))}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <CardTitle>事件回调端点</CardTitle>
                            <p className="mt-1 text-ds-body-sm text-text-secondary">集中管理第三方 webhook，统一查看状态与影响范围。</p>
                        </div>
                        <Button type="button" variant="outline">
                            <Plus className="h-4 w-4" />
                            添加端点
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Endpoint</TableHead>
                                <TableHead>事件</TableHead>
                                <TableHead>状态</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {webhooks.map((webhook) => (
                                <TableRow key={webhook.url}>
                                    <TableCell>{webhook.url}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {webhook.events.map((event) => (
                                                <Badge key={event} variant="outline">
                                                    {event}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                webhook.status === 'active' && 'surface-tint-success text-success',
                                                webhook.status === 'failed' && 'surface-tint-error text-error',
                                                webhook.status === 'disabled' && 'surface-inset text-slate-600'
                                            )}
                                        >
                                            {webhook.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <ToastComponent />
        </div>
    );
}
