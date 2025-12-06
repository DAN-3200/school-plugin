import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Checkin } from "@shared/schema";
import { Calendar, Sparkles, Brain, Target, FolderKanban } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface CheckinHistoryProps {
  checkins: Checkin[];
  showChart?: boolean;
}

export function CheckinHistory({ checkins, showChart = true }: CheckinHistoryProps) {
  if (checkins.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Nenhum check-in realizado ainda
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Complete seu primeiro check-in semanal para ver seu histórico
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedCheckins = [...checkins].sort((a, b) => b.weekNumber - a.weekNumber);
  const chartData = [...checkins]
    .sort((a, b) => a.weekNumber - b.weekNumber)
    .map((c) => ({
      week: `Sem ${c.weekNumber}`,
      Motivação: c.motivation,
      Estresse: c.stress,
      Foco: c.focus,
      Organização: c.organization,
    }));

  const getProgressColor = (value: number, isStress = false) => {
    if (isStress) {
      if (value <= 3) return "bg-green-500";
      if (value <= 6) return "bg-yellow-500";
      return "bg-red-500";
    }
    if (value <= 3) return "bg-red-500";
    if (value <= 6) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {showChart && checkins.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evolução Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="week" fontSize={12} />
                  <YAxis domain={[0, 10]} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Motivação"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Estresse"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Foco"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Organização"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Check-ins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedCheckins.map((checkin) => (
            <div
              key={checkin.id}
              className="p-4 border rounded-md space-y-3"
              data-testid={`card-checkin-${checkin.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Semana {checkin.weekNumber}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(checkin.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Sparkles className="w-3 h-3" />
                    <span>Motivação</span>
                    <span className="ml-auto font-mono font-medium text-foreground">
                      {checkin.motivation}/10
                    </span>
                  </div>
                  <Progress
                    value={checkin.motivation * 10}
                    className="h-2"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Brain className="w-3 h-3" />
                    <span>Estresse</span>
                    <span className="ml-auto font-mono font-medium text-foreground">
                      {checkin.stress}/10
                    </span>
                  </div>
                  <Progress
                    value={checkin.stress * 10}
                    className="h-2"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Target className="w-3 h-3" />
                    <span>Foco</span>
                    <span className="ml-auto font-mono font-medium text-foreground">
                      {checkin.focus}/10
                    </span>
                  </div>
                  <Progress
                    value={checkin.focus * 10}
                    className="h-2"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FolderKanban className="w-3 h-3" />
                    <span>Organização</span>
                    <span className="ml-auto font-mono font-medium text-foreground">
                      {checkin.organization}/10
                    </span>
                  </div>
                  <Progress
                    value={checkin.organization * 10}
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
