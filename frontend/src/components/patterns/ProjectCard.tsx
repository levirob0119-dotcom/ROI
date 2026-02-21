import { Clock, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatEnglishLabel } from '@/lib/utils';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    vehicles: string[];
    updatedAt: string;
  };
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onOpen, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className="h-full cursor-pointer hover:translate-y-[-2px]" onClick={() => onOpen(project.id)}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-1">{project.name}</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="编辑项目"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(project.id);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              aria-label="删除项目"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(project.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="min-h-[40px] text-ds-body-sm text-text-secondary">
          {project.description?.trim() || '暂无项目描述。'}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex min-h-12 flex-wrap items-start gap-2">
          {project.vehicles.map((vehicle) => (
            <Badge key={vehicle} variant="outline" className="rounded-control bg-white/85 px-2 py-1 text-ds-caption ring-1 ring-slate-900/8">
              {formatEnglishLabel(vehicle)}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between pt-4 text-ds-caption text-text-secondary">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          最近更新
        </span>
        <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
}
