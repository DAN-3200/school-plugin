import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { RiskBadge } from "@/components/risk-badge";
import { CheckinForm } from "@/components/checkin-form";
import { CheckinHistory } from "@/components/checkin-history";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Checkin, Student } from "@shared/schema";
import {
  GraduationCap,
  LogOut,
  User,
  TrendingUp,
  Calendar,
  Monitor,
  Clock,
  Loader2,
  CheckCircle,
  Sparkles,
  Brain,
  Target,
  FolderKanban,
} from "lucide-react";

export default function StudentPage() {
  const [, navigate] = useLocation();
  const { user, student, logout } = useAuth();
  const { toast } = useToast();

  const currentWeek = Math.ceil(
    (Date.now() - new Date("2024-01-01").getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  const { data: studentData, isLoading: studentLoading } = useQuery<Student>({
    queryKey: ["/api/students", student?.id],
    enabled: !!student?.id,
  });

  const { data: checkins = [], isLoading: checkinsLoading } = useQuery<Checkin[]>({
    queryKey: ["/api/checkins/student", student?.id],
    enabled: !!student?.id,
  });

  const hasCheckinThisWeek = checkins.some((c) => c.weekNumber === currentWeek);

  const createCheckinMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/checkins", {
        ...data,
        studentId: student?.id,
        weekNumber: currentWeek,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checkins/student", student?.id] });
      toast({
        title: "Check-in enviado!",
        description: "Seu check-in semanal foi registrado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o check-in.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (studentLoading || checkinsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const displayStudent = studentData || student;
  const latestCheckin = checkins.length > 0 ? checkins[checkins.length - 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">SEI</h1>
              <p className="text-xs text-muted-foreground">Área do Aluno</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.name}
            </span>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{displayStudent?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {displayStudent?.email}
                  </p>
                </div>
              </div>
              {displayStudent && <RiskBadge riskIndex={displayStudent.riskIndex} />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-md">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Nota Média</p>
                <p className="text-lg font-bold">{displayStudent?.averageGrade}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-md">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Presença</p>
                <p className="text-lg font-bold">{displayStudent?.attendance}%</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-md">
                <Monitor className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Acessos AVA</p>
                <p className="text-lg font-bold">{displayStudent?.avaParticipation}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-md">
                <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Atrasos</p>
                <p className="text-lg font-bold">{displayStudent?.lateAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasCheckinThisWeek ? (
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Check-in da Semana {currentWeek} Concluído!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Você já respondeu ao check-in socioemocional desta semana.
                  </p>
                </div>
              </div>

              {latestCheckin && (
                <div className="grid grid-cols-4 gap-3 mt-6">
                  <div className="text-center p-2 bg-white dark:bg-background rounded-md">
                    <Sparkles className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Motivação</p>
                    <p className="font-mono font-bold">{latestCheckin.motivation}</p>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-background rounded-md">
                    <Brain className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Estresse</p>
                    <p className="font-mono font-bold">{latestCheckin.stress}</p>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-background rounded-md">
                    <Target className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Foco</p>
                    <p className="font-mono font-bold">{latestCheckin.focus}</p>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-background rounded-md">
                    <FolderKanban className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Organização</p>
                    <p className="font-mono font-bold">{latestCheckin.organization}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <CheckinForm
            weekNumber={currentWeek}
            onSubmit={(data) => createCheckinMutation.mutate(data)}
            isSubmitting={createCheckinMutation.isPending}
          />
        )}

        <div className="pt-4">
          <h2 className="text-lg font-semibold mb-4">Seu Histórico</h2>
          <CheckinHistory checkins={checkins} />
        </div>
      </main>
    </div>
  );
}
