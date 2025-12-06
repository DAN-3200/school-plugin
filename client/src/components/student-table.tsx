import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "./risk-badge";
import type { Student } from "@shared/schema";
import { Eye, FileText, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StudentTableProps {
  students: Student[];
  onViewDetails: (student: Student) => void;
  onCreateIntervention: (student: Student) => void;
}

export function StudentTable({
  students,
  onViewDetails,
  onCreateIntervention,
}: StudentTableProps) {
  const getGradeTrend = (grade: number) => {
    if (grade >= 70) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (grade >= 50) return <Minus className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 80) return "text-green-600 dark:text-green-400";
    if (attendance >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Aluno</TableHead>
            <TableHead className="font-semibold text-center">Turma</TableHead>
            <TableHead className="font-semibold text-center">Nota Média</TableHead>
            <TableHead className="font-semibold text-center">Presença</TableHead>
            <TableHead className="font-semibold text-center">Acessos AVA</TableHead>
            <TableHead className="font-semibold text-center">Atrasos</TableHead>
            <TableHead className="font-semibold text-center">IRE</TableHead>
            <TableHead className="font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow
              key={student.id}
              className={`hover-elevate ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
              data-testid={`row-student-${student.id}`}
            >
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span data-testid={`text-student-name-${student.id}`}>{student.name}</span>
                  <span className="text-xs text-muted-foreground">{student.email}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className="px-2 py-1 bg-muted rounded text-sm">
                  {student.grade}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-mono font-semibold">{student.averageGrade}</span>
                  {getGradeTrend(student.averageGrade)}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className={`font-mono font-semibold ${getAttendanceColor(student.attendance)}`}>
                  {student.attendance}%
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className="font-mono">{student.avaParticipation}</span>
              </TableCell>
              <TableCell className="text-center">
                <span className={`font-mono ${student.lateAssignments > 3 ? "text-red-600 dark:text-red-400 font-semibold" : ""}`}>
                  {student.lateAssignments}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <RiskBadge riskIndex={student.riskIndex} showLabel={false} size="sm" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onViewDetails(student)}
                    data-testid={`button-view-details-${student.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onCreateIntervention(student)}
                    data-testid={`button-create-intervention-${student.id}`}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
