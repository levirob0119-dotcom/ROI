import { Database, Save } from 'lucide-react';

import EmptyStateBlock from '@/components/patterns/EmptyStateBlock';
import InlineStatusBar from '@/components/patterns/InlineStatusBar';
import ProjectCard from '@/components/patterns/ProjectCard';
import ScoreSummary from '@/components/patterns/ScoreSummary';
import VehicleTabs from '@/components/patterns/VehicleTabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { SectionShell } from './SectionShell';

const demoProject = {
  id: 'demo-id',
  name: 'ET5 UVA 优化验证',
  description: '按同屏联动流程验证新组件库的一致性。',
  vehicles: ['leo', 'draco', 'cetus'],
  updatedAt: new Date().toISOString()
};

export default function PatternsSection() {
  const { showToast, ToastComponent } = useToast();

  return (
    <SectionShell
      id="patterns"
      title="Patterns"
      description="Production-ready business patterns for RI workflow pages."
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="hover:translate-y-0">
          <CardHeader>
            <CardTitle>Page status + vehicle tabs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InlineStatusBar
              tone="info"
              title="同屏联动模式"
              description="录入与结果并排展示，优先支持高频专家操作。"
              actions={
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4" />
                  保存草稿
                </Button>
              }
            />
            <VehicleTabs
              items={[
                { id: 'leo', label: 'Leo', hasData: true },
                { id: 'draco', label: 'Draco', hasData: true },
                { id: 'pisces', label: 'Pisces', hasData: false }
              ]}
              value="leo"
              onChange={() => undefined}
              onBlockedSelection={() => showToast('该车型暂无 UVA 数据', 'warning')}
            />
          </CardContent>
        </Card>

        <Card className="hover:translate-y-0">
          <CardHeader>
            <CardTitle>Score summary pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreSummary finalScore={14.8} totalEnhanced={20.5} totalReduced={5.7} lastCalculatedAt={new Date().toISOString()} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ProjectCard
          project={demoProject}
          onOpen={() => undefined}
          onEdit={() => undefined}
          onDelete={() => undefined}
        />

        <Card className="hover:translate-y-0">
          <CardHeader>
            <CardTitle>Empty state pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyStateBlock
              title="暂无可展示结果"
              description="请先补齐 Pets、UV 与配置参数，随后执行测算。"
              actionLabel="开始录入"
              onAction={() => showToast('开始录入（演示）', 'info')}
              icon={Database}
            />
          </CardContent>
        </Card>
      </div>

      <ToastComponent />
    </SectionShell>
  );
}
