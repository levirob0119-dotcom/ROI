import PageHeader from '@/components/patterns/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UV1000Workspace() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <PageHeader
        title="UV1000 工作台"
        description="该模块当前为占位页，后续将接入完整 UV1000 计算与结果展示。"
        status={{ label: '规划中', tone: 'warning' }}
      />

      <Card>
        <CardHeader>
          <CardTitle>即将支持</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-ds-body-sm text-text-secondary">
          <p>1. 前后配置对比计算</p>
          <p>2. 可编辑层级规则（L2/L3）</p>
          <p>3. 方案保存与分享</p>
        </CardContent>
      </Card>
    </div>
  );
}
