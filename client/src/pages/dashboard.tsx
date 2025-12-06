import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { MetricCard } from "@/components/metric-card";
import { StudentTable } from "@/components/student-table";
import { RiskBadge } from "@/components/risk-badge";
import { InterventionCard } from "@/components/intervention-card";
import { InterventionForm } from "@/components/intervention-form";
import { FollowUpForm } from "@/components/followup-form";
import { StudentDetailModal } from "@/components/student-detail-modal";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getRiskLevel } from "@shared/schema";
import type { Student, Checkin, Intervention, FollowUp } from "@shared/schema";
import {
  Users,
  AlertTriangle,
  Target,
  ClipboardCheck,
  Search,
  LogOut,
  GraduationCap,
  Plus,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [interventionModalOpen, setInterventionModalOpen] = useState(false);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);

  const { data: students = [], isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const { data: checkins = [] } = useQuery<Checkin[]>({
    queryKey: ["/api/checkins"],
  });

  const { data: interventions = [] } = useQuery<Intervention[]>({
    queryKey: ["/api/interventions"],
  });

  const { data: followUps = [] } = useQuery<FollowUp[]>({
    queryKey: ["/api/followups"],
  });

  const createInterventionMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/interventions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interventions"] });
      setInterventionModalOpen(false);
      toast({
        title: "Intervenção criada!",
        description: "A intervenção pedagógica foi registrada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a intervenção.",
        variant: "destructive",
      });
    },
  });

  const createFollowUpMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/followups", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/followups"] });
      setFollowUpModalOpen(false);
      toast({
        title: "Acompanhamento registrado!",
        description: "O acompanhamento foi adicionado à intervenção.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível registrar o acompanhamento.",
        variant: "destructive",
      });
    },
  });

  const completeInterventionMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("PATCH", `/api/interventions/${id}`, { status: "completed" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interventions"] });
      toast({
        title: "Intervenção concluída!",
        description: "A intervenção foi marcada como concluída.",
      });
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highRiskCount = students.filter((s) => getRiskLevel(s.riskIndex) === "high").length;
  const mediumRiskCount = students.filter((s) => getRiskLevel(s.riskIndex) === "medium").length;
  const openInterventions = interventions.filter((i) => i.status === "open");
  const completedInterventions = interventions.filter((i) => i.status === "completed");

  const pendingCheckinsCount = students.filter((student) => {
    const currentWeek = Math.ceil((Date.now() - new Date("2024-01-01").getTime()) / (7 * 24 * 60 * 60 * 1000));
    return !checkins.some((c) => c.studentId === student.id && c.weekNumber === currentWeek);
  }).length;

  if (studentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">SEI</h1>
              <p className="text-xs text-muted-foreground">Dashboard do Professor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Olá, {user?.name}
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

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Alunos"
            value={students.length}
            icon={Users}
            description="Alunos cadastrados"
          />
          <MetricCard
            title="Risco Alto"
            value={highRiskCount}
            icon={AlertTriangle}
            variant="danger"
            description={`${mediumRiskCount} em risco médio`}
          />
          <MetricCard
            title="Intervenções Ativas"
            value={openInterventions.length}
            icon={Target}
            variant="warning"
            description={`${completedInterventions.length} concluídas`}
          />
          <MetricCard
            title="Check-ins Pendentes"
            value={pendingCheckinsCount}
            icon={ClipboardCheck}
            description="Alunos sem check-in esta semana"
          />
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students" data-testid="tab-students">
              <Users className="w-4 h-4 mr-2" />
              Alunos
            </TabsTrigger>
            <TabsTrigger value="interventions" data-testid="tab-interventions">
              <Target className="w-4 h-4 mr-2" />
              Intervenções
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar alunos por nome, email ou turma..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-students"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{filteredStudents.length} aluno(s)</span>
              </div>
            </div>

            <StudentTable
              students={filteredStudents}
              onViewDetails={(student) => {
                setSelectedStudent(student);
                setDetailModalOpen(true);
              }}
              onCreateIntervention={(student) => {
                setSelectedStudent(student);
                setInterventionModalOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="interventions" className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{openInterventions.length} em andamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{completedInterventions.length} concluídas</span>
                </div>
              </div>
              <Button
                onClick={() => {
                  setSelectedStudent(null);
                  setInterventionModalOpen(true);
                }}
                data-testid="button-new-intervention"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Intervenção
              </Button>
            </div>

            <Tabs defaultValue="open" className="space-y-4">
              <TabsList>
                <TabsTrigger value="open">Abertas ({openInterventions.length})</TabsTrigger>
                <TabsTrigger value="completed">Concluídas ({completedInterventions.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="open">
                {openInterventions.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">
                        Nenhuma intervenção em andamento
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Crie uma nova intervenção para começar a acompanhar alunos
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {openInterventions.map((intervention) => {
                      const student = students.find((s) => s.id === intervention.studentId);
                      const interventionFollowUps = followUps.filter(
                        (f) => f.interventionId === intervention.id
                      );

                      return (
                        <InterventionCard
                          key={intervention.id}
                          intervention={intervention}
                          student={student!}
                          followUps={interventionFollowUps}
                          onAddFollowUp={() => {
                            setSelectedIntervention(intervention);
                            setFollowUpModalOpen(true);
                          }}
                          onComplete={() => completeInterventionMutation.mutate(intervention.id)}
                          onViewDetails={() => {
                            setSelectedStudent(student!);
                            setDetailModalOpen(true);
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {completedInterventions.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">
                        Nenhuma intervenção concluída ainda
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedInterventions.map((intervention) => {
                      const student = students.find((s) => s.id === intervention.studentId);
                      const interventionFollowUps = followUps.filter(
                        (f) => f.interventionId === intervention.id
                      );

                      return (
                        <InterventionCard
                          key={intervention.id}
                          intervention={intervention}
                          student={student!}
                          followUps={interventionFollowUps}
                          onAddFollowUp={() => {}}
                          onComplete={() => {}}
                          onViewDetails={() => {
                            setSelectedStudent(student!);
                            setDetailModalOpen(true);
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </main>

      <StudentDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        student={selectedStudent}
        checkins={checkins}
        interventions={interventions}
        followUps={followUps}
      />

      <InterventionForm
        open={interventionModalOpen}
        onOpenChange={setInterventionModalOpen}
        student={selectedStudent}
        onSubmit={(data) => {
          if (selectedStudent) {
            createInterventionMutation.mutate({
              ...data,
              studentId: selectedStudent.id,
            });
          }
        }}
        isSubmitting={createInterventionMutation.isPending}
      />

      <FollowUpForm
        open={followUpModalOpen}
        onOpenChange={setFollowUpModalOpen}
        intervention={selectedIntervention}
        onSubmit={(data) => {
          if (selectedIntervention) {
            createFollowUpMutation.mutate({
              ...data,
              interventionId: selectedIntervention.id,
            });
          }
        }}
        isSubmitting={createFollowUpMutation.isPending}
      />
    </div>
  );
}
