import {
  type User,
  type InsertUser,
  type Student,
  type InsertStudent,
  type Checkin,
  type InsertCheckin,
  type Intervention,
  type InsertIntervention,
  type FollowUp,
  type InsertFollowUp,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getStudents(): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, data: Partial<Student>): Promise<Student | undefined>;

  getCheckins(): Promise<Checkin[]>;
  getCheckinsByStudent(studentId: string): Promise<Checkin[]>;
  createCheckin(checkin: InsertCheckin): Promise<Checkin>;

  getInterventions(): Promise<Intervention[]>;
  getInterventionsByStudent(studentId: string): Promise<Intervention[]>;
  getIntervention(id: string): Promise<Intervention | undefined>;
  createIntervention(intervention: InsertIntervention): Promise<Intervention>;
  updateIntervention(id: string, data: Partial<Intervention>): Promise<Intervention | undefined>;

  getFollowUps(): Promise<FollowUp[]>;
  getFollowUpsByIntervention(interventionId: string): Promise<FollowUp[]>;
  createFollowUp(followUp: InsertFollowUp): Promise<FollowUp>;
}

function calculateRiskIndex(student: Omit<Student, "id" | "riskIndex">, checkins: Checkin[]): number {
  const peso1 = 0.25;
  const peso2 = 0.20;
  const peso3 = 0.15;
  const peso4 = 0.20;
  const peso5 = 0.20;

  const baixaNota = Math.max(0, 100 - student.averageGrade);
  const faltas = Math.max(0, 100 - student.attendance);
  const baixaParticipacao = Math.max(0, 100 - Math.min(student.avaParticipation * 5, 100));
  
  const latestCheckin = checkins
    .filter(c => c.studentId === (student as any).id)
    .sort((a, b) => b.weekNumber - a.weekNumber)[0];
  
  const estresseAlto = latestCheckin ? latestCheckin.stress * 10 : 50;
  const desmotivacao = latestCheckin ? (10 - latestCheckin.motivation) * 10 : 50;

  const ire = Math.round(
    peso1 * baixaNota +
    peso2 * faltas +
    peso3 * baixaParticipacao +
    peso4 * estresseAlto +
    peso5 * desmotivacao
  );

  return Math.min(100, Math.max(0, ire));
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private students: Map<string, Student>;
  private checkins: Map<string, Checkin>;
  private interventions: Map<string, Intervention>;
  private followUps: Map<string, FollowUp>;

  constructor() {
    this.users = new Map();
    this.students = new Map();
    this.checkins = new Map();
    this.interventions = new Map();
    this.followUps = new Map();
    
    this.seedData();
  }

  private seedData() {
    const teacherUser: User = {
      id: "user-teacher-1",
      username: "professor",
      password: "123456",
      role: "teacher",
      name: "Prof. Maria Silva",
      studentId: null,
    };
    this.users.set(teacherUser.id, teacherUser);

    const studentsData: Omit<Student, "riskIndex">[] = [
      {
        id: "student-1",
        name: "João Pedro Santos",
        email: "joao.santos@escola.edu.br",
        grade: "9º A",
        averageGrade: 85,
        attendance: 92,
        avaParticipation: 18,
        lateAssignments: 1,
      },
      {
        id: "student-2",
        name: "Ana Carolina Lima",
        email: "ana.lima@escola.edu.br",
        grade: "9º A",
        averageGrade: 62,
        attendance: 75,
        avaParticipation: 8,
        lateAssignments: 4,
      },
      {
        id: "student-3",
        name: "Lucas Oliveira Martins",
        email: "lucas.martins@escola.edu.br",
        grade: "9º B",
        averageGrade: 45,
        attendance: 58,
        avaParticipation: 3,
        lateAssignments: 7,
      },
      {
        id: "student-4",
        name: "Beatriz Ferreira Costa",
        email: "beatriz.costa@escola.edu.br",
        grade: "9º B",
        averageGrade: 78,
        attendance: 88,
        avaParticipation: 15,
        lateAssignments: 2,
      },
      {
        id: "student-5",
        name: "Gabriel Rodrigues Alves",
        email: "gabriel.alves@escola.edu.br",
        grade: "9º A",
        averageGrade: 55,
        attendance: 68,
        avaParticipation: 6,
        lateAssignments: 5,
      },
    ];

    const checkinsData: Omit<Checkin, "id">[] = [
      { studentId: "student-1", weekNumber: 45, motivation: 8, stress: 3, focus: 7, organization: 8, createdAt: "2024-11-04" },
      { studentId: "student-1", weekNumber: 46, motivation: 9, stress: 2, focus: 8, organization: 9, createdAt: "2024-11-11" },
      { studentId: "student-2", weekNumber: 45, motivation: 5, stress: 7, focus: 4, organization: 4, createdAt: "2024-11-04" },
      { studentId: "student-2", weekNumber: 46, motivation: 4, stress: 8, focus: 3, organization: 3, createdAt: "2024-11-11" },
      { studentId: "student-3", weekNumber: 45, motivation: 3, stress: 9, focus: 2, organization: 2, createdAt: "2024-11-04" },
      { studentId: "student-3", weekNumber: 46, motivation: 2, stress: 9, focus: 2, organization: 1, createdAt: "2024-11-11" },
      { studentId: "student-4", weekNumber: 45, motivation: 7, stress: 4, focus: 7, organization: 6, createdAt: "2024-11-04" },
      { studentId: "student-4", weekNumber: 46, motivation: 8, stress: 3, focus: 8, organization: 7, createdAt: "2024-11-11" },
      { studentId: "student-5", weekNumber: 45, motivation: 5, stress: 6, focus: 5, organization: 4, createdAt: "2024-11-04" },
      { studentId: "student-5", weekNumber: 46, motivation: 4, stress: 7, focus: 4, organization: 3, createdAt: "2024-11-11" },
    ];

    checkinsData.forEach((checkin, index) => {
      const id = `checkin-${index + 1}`;
      this.checkins.set(id, { ...checkin, id });
    });

    studentsData.forEach((studentData) => {
      const studentCheckins = Array.from(this.checkins.values()).filter(
        (c) => c.studentId === studentData.id
      );
      const riskIndex = calculateRiskIndex(studentData as any, studentCheckins);
      const student: Student = { ...studentData, riskIndex };
      this.students.set(student.id, student);
    });

    studentsData.forEach((studentData, index) => {
      const studentUser: User = {
        id: `user-student-${index + 1}`,
        username: `aluno${index + 1}`,
        password: "123456",
        role: "student",
        name: studentData.name,
        studentId: studentData.id,
      };
      this.users.set(studentUser.id, studentUser);
    });

    const intervention1: Intervention = {
      id: "intervention-1",
      studentId: "student-3",
      objective: "Melhorar frequência e engajamento nas aulas de Matemática",
      plannedActions: "1. Reunião com a família para discutir rotina de estudos\n2. Acompanhamento diário de presença\n3. Tutoria extra às quartas-feiras\n4. Revisão de conteúdos básicos",
      startDate: "2024-11-01",
      responsible: "Prof. Maria Silva",
      status: "open",
      createdAt: "2024-11-01",
    };
    this.interventions.set(intervention1.id, intervention1);

    const followUp1: FollowUp = {
      id: "followup-1",
      interventionId: "intervention-1",
      observations: "Primeira semana de acompanhamento. Aluno compareceu a 3 das 5 aulas. Demonstrou interesse na tutoria.",
      progress: 3,
      createdAt: "2024-11-08",
    };
    this.followUps.set(followUp1.id, followUp1);

    const followUp2: FollowUp = {
      id: "followup-2",
      interventionId: "intervention-1",
      observations: "Reunião com a família realizada. Pai se comprometeu a acompanhar as tarefas. Aluno melhorou a frequência.",
      progress: 5,
      createdAt: "2024-11-15",
    };
    this.followUps.set(followUp2.id, followUp2);

    const intervention2: Intervention = {
      id: "intervention-2",
      studentId: "student-2",
      objective: "Apoio socioemocional e redução de estresse",
      plannedActions: "1. Encaminhamento para orientação educacional\n2. Técnicas de gestão de ansiedade\n3. Flexibilização de prazos de entrega\n4. Grupo de apoio entre pares",
      startDate: "2024-11-10",
      responsible: "Coord. Pedro Santos",
      status: "open",
      createdAt: "2024-11-10",
    };
    this.interventions.set(intervention2.id, intervention2);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = { ...insertStudent, id };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) return undefined;
    
    const updated = { ...student, ...data };
    this.students.set(id, updated);
    return updated;
  }

  async getCheckins(): Promise<Checkin[]> {
    return Array.from(this.checkins.values());
  }

  async getCheckinsByStudent(studentId: string): Promise<Checkin[]> {
    return Array.from(this.checkins.values()).filter(
      (checkin) => checkin.studentId === studentId
    );
  }

  async createCheckin(insertCheckin: InsertCheckin): Promise<Checkin> {
    const id = randomUUID();
    const checkin: Checkin = {
      ...insertCheckin,
      id,
      createdAt: new Date().toISOString(),
    };
    this.checkins.set(id, checkin);

    const student = this.students.get(insertCheckin.studentId);
    if (student) {
      const allCheckins = await this.getCheckinsByStudent(insertCheckin.studentId);
      const riskIndex = calculateRiskIndex(student, allCheckins);
      await this.updateStudent(student.id, { riskIndex });
    }

    return checkin;
  }

  async getInterventions(): Promise<Intervention[]> {
    return Array.from(this.interventions.values());
  }

  async getInterventionsByStudent(studentId: string): Promise<Intervention[]> {
    return Array.from(this.interventions.values()).filter(
      (intervention) => intervention.studentId === studentId
    );
  }

  async getIntervention(id: string): Promise<Intervention | undefined> {
    return this.interventions.get(id);
  }

  async createIntervention(insertIntervention: InsertIntervention): Promise<Intervention> {
    const id = randomUUID();
    const intervention: Intervention = {
      ...insertIntervention,
      id,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    this.interventions.set(id, intervention);
    return intervention;
  }

  async updateIntervention(id: string, data: Partial<Intervention>): Promise<Intervention | undefined> {
    const intervention = this.interventions.get(id);
    if (!intervention) return undefined;
    
    const updated = { ...intervention, ...data };
    this.interventions.set(id, updated);
    return updated;
  }

  async getFollowUps(): Promise<FollowUp[]> {
    return Array.from(this.followUps.values());
  }

  async getFollowUpsByIntervention(interventionId: string): Promise<FollowUp[]> {
    return Array.from(this.followUps.values()).filter(
      (followUp) => followUp.interventionId === interventionId
    );
  }

  async createFollowUp(insertFollowUp: InsertFollowUp): Promise<FollowUp> {
    const id = randomUUID();
    const followUp: FollowUp = {
      ...insertFollowUp,
      id,
      createdAt: new Date().toISOString(),
    };
    this.followUps.set(id, followUp);
    return followUp;
  }
}

export const storage = new MemStorage();
