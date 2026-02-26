import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CircleAlert, CircleCheck, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type ComponentId = 'button' | 'input' | 'select' | 'card' | 'badge';
type ReviewStatus = 'pending' | 'approved' | 'needs-work' | 'blocked';

const componentFlow: Array<{
  id: ComponentId;
  name: string;
  summary: string;
  checklist: string[];
}> = [
  {
    id: 'button',
    name: 'Button',
    summary: '补齐 loading 状态、禁用语义与尺寸一致性。',
    checklist: ['主次按钮是否清晰', 'loading 时是否防重复提交', '焦点态是否明显可见'],
  },
  {
    id: 'input',
    name: 'Input',
    summary: '增加尺寸与前后缀插槽，支持信息密度更高的表单。',
    checklist: ['输入区层级是否清晰', '前后缀与正文间距是否稳定', '错误态可读性是否达标'],
  },
  {
    id: 'select',
    name: 'Select',
    summary: '统一尺寸体系，增加 helper / error 信息位。',
    checklist: ['占位文案是否易懂', '下拉状态切换是否自然', '错误提示是否明确'],
  },
  {
    id: 'card',
    name: 'Card',
    summary: '新增 subtle / elevated / interactive 形态与紧凑密度。',
    checklist: ['信息分区是否清晰', '卡片层级是否合理', '可点击卡片是否具备反馈'],
  },
  {
    id: 'badge',
    name: 'Badge',
    summary: '新增尺寸、圆角风格和状态点，提升语义表达能力。',
    checklist: ['语义颜色是否稳定', '小尺寸可读性是否足够', '状态点是否有意义且不干扰'],
  },
];

const statusMeta: Record<ReviewStatus, { label: string; variant: 'outline' | 'success' | 'warning' | 'destructive' }> = {
  pending: { label: '待评审', variant: 'outline' },
  approved: { label: '通过', variant: 'success' },
  'needs-work': { label: '待优化', variant: 'warning' },
  blocked: { label: '阻塞', variant: 'destructive' },
};

type ReviewRecord = Record<ComponentId, { status: ReviewStatus; note: string }>;

export default function ComponentReviewShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [priority, setPriority] = useState('');
  const [approvalStage, setApprovalStage] = useState('draft');
  const [reviewState, setReviewState] = useState<ReviewRecord>(() =>
    componentFlow.reduce(
      (accumulator, item) => ({
        ...accumulator,
        [item.id]: { status: 'pending', note: '' },
      }),
      {} as ReviewRecord
    )
  );

  const currentComponent = componentFlow[currentIndex];
  const currentReview = reviewState[currentComponent.id];
  const reviewedCount = useMemo(
    () => componentFlow.filter((item) => reviewState[item.id].status !== 'pending').length,
    [reviewState]
  );

  const renderPreview = () => {
    switch (currentComponent.id) {
      case 'button':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="action">主行动</Button>
              <Button variant="outline">次行动</Button>
              <Button variant="destructive">危险操作</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">小按钮</Button>
              <Button size="default">默认</Button>
              <Button size="lg">大按钮</Button>
            </div>
            <Button
              variant="action"
              isLoading={buttonLoading}
              loadingText="正在提交..."
              onClick={() => {
                setButtonLoading(true);
                window.setTimeout(() => setButtonLoading(false), 1200);
              }}
            >
              提交评审
            </Button>
          </div>
        );
      case 'input':
        return (
          <div className="space-y-3">
            <Input
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="搜索组件、状态或负责人..."
              startAdornment={<Search className="h-4 w-4" aria-hidden="true" />}
            />
            <Input controlSize="sm" placeholder="紧凑模式输入（sm）" />
            <Input
              controlSize="lg"
              aria-invalid="true"
              placeholder="错误输入示例"
              endAdornment={<CircleAlert className="h-4 w-4 text-destructive" aria-hidden="true" />}
            />
          </div>
        );
      case 'select':
        return (
          <div className="space-y-3">
            <Select
              value={priority}
              onValueChange={setPriority}
              placeholder="请选择优先级"
              helperText="用于排序待评审组件的处理顺序"
              options={[
                { label: 'P0 - 本周上线', value: 'p0' },
                { label: 'P1 - 下个迭代', value: 'p1' },
                { label: 'P2 - 观察中', value: 'p2' },
              ]}
            />
            <Select
              value={approvalStage}
              onValueChange={setApprovalStage}
              invalid
              errorText="当前流程缺少“设计负责人确认”步骤"
              options={[
                { label: '草稿中', value: 'draft' },
                { label: '待评审', value: 'reviewing' },
                { label: '待发布', value: 'ready' },
              ]}
            />
          </div>
        );
      case 'card':
        return (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card>
              <CardHeader density="compact">
                <CardTitle>默认卡片</CardTitle>
                <CardDescription>适合详情信息与复杂内容承载。</CardDescription>
              </CardHeader>
              <CardContent density="compact">
                <p className="text-ds-body-sm text-slate-600">内容间距更紧凑，适合高信息密度页面。</p>
              </CardContent>
            </Card>
            <Card variant="subtle" interactive tabIndex={0}>
              <CardHeader>
                <CardTitle>可操作卡片</CardTitle>
                <CardDescription>hover / focus 会给出层级反馈。</CardDescription>
              </CardHeader>
              <CardFooter className="justify-between">
                <Badge variant="success" withDot>
                  Ready
                </Badge>
                <span className="text-ds-caption text-slate-500">按 Enter 查看</span>
              </CardFooter>
            </Card>
          </div>
        );
      case 'badge':
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" withDot>
                线上稳定
              </Badge>
              <Badge variant="warning" withDot>
                待观察
              </Badge>
              <Badge variant="destructive" withDot>
                需处理
              </Badge>
              <Badge variant="outline">中性标签</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge size="sm">SM</Badge>
              <Badge size="default">Default</Badge>
              <Badge size="lg">LG</Badge>
              <Badge shape="rounded" variant="secondary">
                Rounded
              </Badge>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <Card variant="subtle">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-ds-caption uppercase tracking-wide text-slate-500">Component Review Mode</p>
              <CardTitle>组件库首批 5 个组件优化评审</CardTitle>
              <CardDescription>一次只看一个组件，逐个做结论，避免评审信息淹没。</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{`已评审 ${reviewedCount}/5`}</Badge>
              <Button asChild size="sm" variant="outline">
                <Link to="/components">返回总览</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label>当前组件</Label>
              <CardTitle>{`${currentIndex + 1}. ${currentComponent.name}`}</CardTitle>
              <CardDescription>{currentComponent.summary}</CardDescription>
            </div>
            <Badge variant={statusMeta[currentReview.status].variant}>{statusMeta[currentReview.status].label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <section className="space-y-3 rounded-control border border-border bg-surface p-4">
            <p className="text-ds-body-sm font-medium text-slate-700">组件展示</p>
            {renderPreview()}
          </section>

          <section className="space-y-3 rounded-control border border-border bg-surface p-4">
            <p className="text-ds-body-sm font-medium text-slate-700">评审清单</p>
            <ul className="space-y-2 text-ds-body-sm text-slate-600">
              {currentComponent.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CircleCheck className="mt-0.5 h-4 w-4 text-slate-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={currentReview.status === 'approved' ? 'action' : 'outline'}
                onClick={() =>
                  setReviewState((previous) => ({
                    ...previous,
                    [currentComponent.id]: { ...previous[currentComponent.id], status: 'approved' },
                  }))
                }
              >
                通过
              </Button>
              <Button
                size="sm"
                variant={currentReview.status === 'needs-work' ? 'action' : 'outline'}
                onClick={() =>
                  setReviewState((previous) => ({
                    ...previous,
                    [currentComponent.id]: { ...previous[currentComponent.id], status: 'needs-work' },
                  }))
                }
              >
                待优化
              </Button>
              <Button
                size="sm"
                variant={currentReview.status === 'blocked' ? 'destructive' : 'outline'}
                onClick={() =>
                  setReviewState((previous) => ({
                    ...previous,
                    [currentComponent.id]: { ...previous[currentComponent.id], status: 'blocked' },
                  }))
                }
              >
                阻塞
              </Button>
            </div>
            <Textarea
              placeholder="记录这个组件的评审意见..."
              value={currentReview.note}
              onChange={(event) =>
                setReviewState((previous) => ({
                  ...previous,
                  [currentComponent.id]: { ...previous[currentComponent.id], note: event.target.value },
                }))
              }
            />
          </section>
        </CardContent>
        <CardFooter className="justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((previous) => Math.max(previous - 1, 0))}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            上一个
          </Button>
          <Button
            variant="action"
            onClick={() => setCurrentIndex((previous) => Math.min(previous + 1, componentFlow.length - 1))}
            disabled={currentIndex === componentFlow.length - 1}
          >
            下一个
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Card variant="subtle">
        <CardContent className="flex flex-wrap items-center gap-2 pt-5 sm:pt-6">
          {componentFlow.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className="rounded-control focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              <Badge variant={statusMeta[reviewState[item.id].status].variant}>
                {`${index + 1}. ${item.name} · ${statusMeta[reviewState[item.id].status].label}`}
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
