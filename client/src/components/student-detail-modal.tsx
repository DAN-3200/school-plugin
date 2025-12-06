import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RiskBadge } from "./risk-badge";
import { CheckinHistory } from "./checkin-history";
import type { Student, Checkin, Intervention, FollowUp } from "@shared/schema";
import { 
  User, 
  Mail, 
  GraduationCap, 
  TrendingUp,
  Clock,
  Monitor,
  Calendar,
  Target,
  CheckCircle
} from "lucide-react";

interface StudentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  checkins: Checkin[];
  interventions: Intervention[];
  followUps: FollowUp[];
}

export function StudentDetailModal({
  open,
  onOpenChange,
  student,
  checkins,
  interventions,
  followUps,
}: StudentDetailModalProps) {
  if (!student) return null;

  const getGradeColor = (grade: number) => {
    if (grade >= 70) return "text-green-600 dark:text-green-400";
    if (grade >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 80) return "text-green-600 dark:text-green-400";
    if (attendance >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const studentCheckins = checkins.filter(c => c.studentId === student.id);
  const studentInterventions = interventions.filter(i => i.studentId === student.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">{student.name}</DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{student.email}</span>
                </div>
              </div>
            </div>
            <RiskBadge riskIndex={student.riskIndex} />
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview" data-testid="tab-overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="socioemotional" data-testid="tab-socioemotional">Socioemocional</TabsTrigger>
            <TabsTrigger value="interventions" data-testid="tab-interventions">Intervenções</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Turma</p>
                  <p className="text-lg font-bold">{student.grade}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Nota Média</p>
                  <p className={`text-lg font-bold ${getGradeColor(student.averageGrade)}`}>
                    {student.averageGrade}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Presença</p>
                  <p className={`text-lg font-bold ${getAttendanceColor(student.attendance)}`}>
                    {student.attendance}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Monitor className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Acessos AVA</p>
                  <p className="text-lg font-bold">{student.avaParticipation}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Indicadores de Desempenho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Nota Média</span>
                    <span className="font-mono">{student.averageGrade}/100</span>
                  </div>
                  <Progress value={student.averageGrade} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Presença</span>
                    <span className="font-mono">{student.attendance}%</span>
                  </div>
                  <Progress value={student.attendance} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Atividades Atrasadas</span>
                    <span className="font-mono text-red-600 dark:text-red-400">{student.lateAssignments}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Índice de Risco Escolar (IRE)</span>
                    <span className="font-mono">{student.riskIndex}/100</span>
                  </div>
                  <Progress value={student.riskIndex} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="socioemotional" className="mt-6">
            <CheckinHistory checkins={studentCheckins} />
          </TabsContent>

          <TabsContent value="interventions" className="mt-6 space-y-4">
            {studentInterventions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    Nenhuma intervenção registrada
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Crie uma intervenção para acompanhar o progresso deste aluno
                  </p>
                </CardContent>
              </Card>
            ) : (
              studentInterventions.map((intervention) => {
                const interventionFollowUps = followUps.filter(
                  (f) => f.interventionId === intervention.id
                );
                const latestProgress = interventionFollowUps.length > 0
                  ? interventionFollowUps[interventionFollowUps.length - 1].progress
                  : 0;

                return (
                  <Card key={intervention.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-4">
                        <CardTitle className="text-base">{intervention.objective}</CardTitle>
                        <span className={`text-xs px-2 py-1 rounded ${
                          intervention.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}>
                          {intervention.status === "completed" ? "Concluída" : "Em andamento"}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{intervention.plannedActions}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Início: {new Date(intervention.startDate).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{intervention.responsible}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span className="font-mono">{latestProgress}/10</span>
                        </div>
                        <Progress value={latestProgress * 10} className="h-2" />
                      </div>

                      {interventionFollowUps.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <p className="text-sm font-medium mb-3">Acompanhamentos ({interventionFollowUps.length})</p>
                          <div className="space-y-3">
                            {interventionFollowUps.slice(-3).map((followUp) => (
                              <div key={followUp.id} className="text-sm p-3 bg-muted/50 rounded-md">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(followUp.createdAt).toLocaleDateString("pt-BR")}
                                  </span>
                                  <span className="font-mono text-xs">
                                    Progresso: {followUp.progress}/10
                                  </span>
                                </div>
                                <p className="text-muted-foreground">{followUp.observations}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
