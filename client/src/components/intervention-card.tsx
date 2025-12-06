import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Intervention, FollowUp, Student } from "@shared/schema";
import { Calendar, User, Target, ChevronRight, CheckCircle, Clock, Plus, MessageSquare } from "lucide-react";

interface InterventionCardProps {
  intervention: Intervention;
  student: Student;
  followUps: FollowUp[];
  onAddFollowUp: () => void;
  onComplete: () => void;
  onViewDetails: () => void;
}

export function InterventionCard({
  intervention,
  student,
  followUps,
  onAddFollowUp,
  onComplete,
  onViewDetails,
}: InterventionCardProps) {
  const isCompleted = intervention.status === "completed";
  const latestProgress = followUps.length > 0
    ? followUps[followUps.length - 1].progress
    : 0;

  return (
    <Card
      className={`hover-elevate ${isCompleted ? "opacity-75" : ""}`}
      data-testid={`card-intervention-${intervention.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge
                variant={isCompleted ? "secondary" : "default"}
                className="gap-1"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Concluída
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    Em andamento
                  </>
                )}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {followUps.length} acompanhamento{followUps.length !== 1 ? "s" : ""}
              </span>
            </div>
            <CardTitle className="text-base line-clamp-2">
              {intervention.objective}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="font-medium text-foreground">{student.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(intervention.startDate).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-mono font-medium">{latestProgress}/10</span>
          </div>
          <Progress value={latestProgress * 10} className="h-2" />
        </div>

        <div className="flex items-center gap-2 pt-2">
          {!isCompleted && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddFollowUp}
                className="flex-1"
                data-testid={`button-add-followup-${intervention.id}`}
              >
                <Plus className="w-4 h-4 mr-1" />
                Acompanhamento
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onComplete}
                data-testid={`button-complete-intervention-${intervention.id}`}
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewDetails}
            data-testid={`button-view-intervention-${intervention.id}`}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
