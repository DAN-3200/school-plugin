import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'student' | 'teacher'
  name: text("name").notNull(),
  studentId: varchar("student_id"), // links to student if role is 'student'
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  grade: text("grade").notNull(), // série/turma
  averageGrade: integer("average_grade").notNull(), // nota média (0-100)
  attendance: integer("attendance").notNull(), // presença % (0-100)
  avaParticipation: integer("ava_participation").notNull(), // acessos no AVA
  lateAssignments: integer("late_assignments").notNull(), // atividades atrasadas
  riskIndex: integer("risk_index").notNull(), // IRE calculado (0-100)
});

export const checkins = pgTable("checkins", {
  id: varchar("id").primaryKey(),
  studentId: varchar("student_id").notNull(),
  weekNumber: integer("week_number").notNull(),
  motivation: integer("motivation").notNull(), // 0-10
  stress: integer("stress").notNull(), // 0-10
  focus: integer("focus").notNull(), // 0-10
  organization: integer("organization").notNull(), // 0-10
  createdAt: text("created_at").notNull(),
});

export const interventions = pgTable("interventions", {
  id: varchar("id").primaryKey(),
  studentId: varchar("student_id").notNull(),
  objective: text("objective").notNull(),
  plannedActions: text("planned_actions").notNull(),
  startDate: text("start_date").notNull(),
  responsible: text("responsible").notNull(),
  status: text("status").notNull(), // 'open' | 'completed'
  createdAt: text("created_at").notNull(),
});

export const followUps = pgTable("follow_ups", {
  id: varchar("id").primaryKey(),
  interventionId: varchar("intervention_id").notNull(),
  observations: text("observations").notNull(),
  progress: integer("progress").notNull(), // 0-10
  createdAt: text("created_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true });
export const insertCheckinSchema = createInsertSchema(checkins).omit({ id: true, createdAt: true });
export const insertInterventionSchema = createInsertSchema(interventions).omit({ id: true, createdAt: true, status: true });
export const insertFollowUpSchema = createInsertSchema(followUps).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

export type InsertCheckin = z.infer<typeof insertCheckinSchema>;
export type Checkin = typeof checkins.$inferSelect;

export type InsertIntervention = z.infer<typeof insertInterventionSchema>;
export type Intervention = typeof interventions.$inferSelect;

export type InsertFollowUp = z.infer<typeof insertFollowUpSchema>;
export type FollowUp = typeof followUps.$inferSelect;

// Auth types
export const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário obrigatório"),
  password: z.string().min(1, "Senha obrigatória"),
});

export type LoginData = z.infer<typeof loginSchema>;

// Risk level type
export type RiskLevel = 'low' | 'medium' | 'high';

export function getRiskLevel(riskIndex: number): RiskLevel {
  if (riskIndex <= 30) return 'low';
  if (riskIndex <= 60) return 'medium';
  return 'high';
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'low': return 'green';
    case 'medium': return 'yellow';
    case 'high': return 'red';
  }
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 'low': return 'Baixo Risco';
    case 'medium': return 'Médio Risco';
    case 'high': return 'Alto Risco';
  }
}
