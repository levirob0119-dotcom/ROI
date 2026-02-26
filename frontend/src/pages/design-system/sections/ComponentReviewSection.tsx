// @ts-nocheck
import { ArrowRight, CheckCircle2, CircleAlert, Clock3 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionShell } from './SectionShell';

const reviewComponents = [
  { name: 'Button', summary: 'Loading 与禁用语义增强', status: 'ready' as const },
  { name: 'Input', summary: '支持尺寸与前后缀插槽', status: 'ready' as const },
  { name: 'Select', summary: '支持 helper / error 信息位', status: 'ready' as const },
  { name: 'Card', summary: '补齐 variant / interactive / density', status: 'ready' as const },
  { name: 'Badge', summary: '支持 size / shape / status dot', status: 'ready' as const },
];

const statusMeta = {
  ready: { label: '可评审', icon: CheckCircle2, variant: 'success' as const },
  pending: { label: '待补齐', icon: Clock3, variant: 'warning' as const },
  blocked: { label: '阻塞', icon: CircleAlert, variant: 'destructive' as const },
};

export default function ComponentReviewSection() {
  return (
    <SectionShell
      id="component-review"
      title="Component Review"
      description="首批 5 个组件优化已就绪。可在 showpage 快速浏览，也可进入逐个评审模式。"
    >
      <Card variant="subtle">
        <CardHeader>
          <CardTitle>逐个评审入口</CardTitle>
          <CardDescription>一次只看一个组件，按“通过 / 待优化 / 阻塞”逐条落结论。</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {reviewComponents.map((item) => {
            const meta = statusMeta[item.status];
            const Icon = meta.icon;
            return (
              <div key={item.name} className="surface-inset rounded-control p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-ds-body-sm font-semibold text-slate-800">{item.name}</p>
                  <Badge variant={meta.variant} withDot>
                    {meta.label}
                  </Badge>
                </div>
                <p className="mt-2 text-ds-caption text-slate-600">{item.summary}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <Icon className="h-3.5 w-3.5" />
                  Showpage 已可预览
                </p>
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          <Button asChild variant="action">
            <a href="/components/review">
              打开逐个评审
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/components">查看组件总览</a>
          </Button>
        </CardFooter>
      </Card>
    </SectionShell>
  );
}
