import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function ComponentShowcase() {
    return (
        <div className="p-10 space-y-10 max-w-5xl mx-auto pb-32">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">组件库展示</h1>
                <p className="text-muted-foreground">
                    当前应用中使用的所有基础 UI 组件概览。
                </p>
            </div>

            {/* Buttons */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Button 按钮</h2>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">Icon</Button>
                </div>
            </section>

            {/* Badges */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Badge 徽章</h2>
                <div className="flex flex-wrap gap-4">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                </div>
            </section>

            {/* Inputs */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Input 输入框</h2>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="Email" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="disabled">Disabled</Label>
                    <Input disabled type="text" id="disabled" placeholder="Disabled input" />
                </div>
            </section>

            {/* Toggle (Switch) */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Toggle 开关</h2>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center space-x-2">
                        <Toggle id="toggle-1" aria-label="Toggle example" />
                        <Label htmlFor="toggle-1">Default</Label>
                    </div>
                </div>
            </section>

            {/* Cards */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Card 卡片</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>项目概况</CardTitle>
                            <CardDescription>查看和管理您的项目基本信息</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                卡片内容区域。可以放置表单、文本或其他组件。
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">操作按钮</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>通知设置</CardTitle>
                            <CardDescription>管理您的通知偏好</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">邮件通知</p>
                                    <p className="text-xs text-muted-foreground">接收每日摘要邮件</p>
                                </div>
                                <Toggle aria-label="Toggle email notifications" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
