import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCheckinSchema, insertInterventionSchema, insertFollowUpSchema } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId: string;
    studentId?: string;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Usuário ou senha incorretos" });
      }

      let student = undefined;
      if (user.role === "student" && user.studentId) {
        student = await storage.getStudent(user.studentId);
      }

      req.session.userId = user.id;
      if (student) {
        req.session.studentId = student.id;
      }

      res.json({ user, student });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const user = await storage.getUser(req.session.userId);

      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ error: "Usuário não encontrado" });
      }

      let student = undefined;
      if (user.role === "student" && user.studentId) {
        student = await storage.getStudent(user.studentId);
      }

      res.json({ user, student });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao fazer logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  app.get("/api/students", requireAuth, async (req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar alunos" });
    }
  });

  app.get("/api/students/:id", requireAuth, async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar aluno" });
    }
  });

  app.get("/api/checkins", requireAuth, async (req, res) => {
    try {
      const checkins = await storage.getCheckins();
      res.json(checkins);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar check-ins" });
    }
  });

  app.get("/api/checkins/student/:studentId", requireAuth, async (req, res) => {
    try {
      const checkins = await storage.getCheckinsByStudent(req.params.studentId);
      res.json(checkins);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar check-ins do aluno" });
    }
  });

  app.post("/api/checkins", requireAuth, async (req, res) => {
    try {
      const result = insertCheckinSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Dados inválidos", details: result.error.errors });
      }

      const checkin = await storage.createCheckin(result.data);
      res.status(201).json(checkin);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar check-in" });
    }
  });

  app.get("/api/interventions", requireAuth, async (req, res) => {
    try {
      const interventions = await storage.getInterventions();
      res.json(interventions);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar intervenções" });
    }
  });

  app.get("/api/interventions/:id", requireAuth, async (req, res) => {
    try {
      const intervention = await storage.getIntervention(req.params.id);
      if (!intervention) {
        return res.status(404).json({ error: "Intervenção não encontrada" });
      }
      res.json(intervention);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar intervenção" });
    }
  });

  app.post("/api/interventions", requireAuth, async (req, res) => {
    try {
      const result = insertInterventionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Dados inválidos", details: result.error.errors });
      }

      const intervention = await storage.createIntervention(result.data);
      res.status(201).json(intervention);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar intervenção" });
    }
  });

  app.patch("/api/interventions/:id", requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status || !["open", "completed"].includes(status)) {
        return res.status(400).json({ error: "Status inválido. Valores permitidos: open, completed" });
      }

      const existingIntervention = await storage.getIntervention(req.params.id);
      if (!existingIntervention) {
        return res.status(404).json({ error: "Intervenção não encontrada" });
      }

      if (existingIntervention.status === "completed" && status === "open") {
        return res.status(400).json({ error: "Não é possível reabrir uma intervenção concluída" });
      }

      const intervention = await storage.updateIntervention(req.params.id, { status });
      res.json(intervention);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar intervenção" });
    }
  });

  app.get("/api/followups", requireAuth, async (req, res) => {
    try {
      const followUps = await storage.getFollowUps();
      res.json(followUps);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar acompanhamentos" });
    }
  });

  app.get("/api/followups/intervention/:interventionId", requireAuth, async (req, res) => {
    try {
      const followUps = await storage.getFollowUpsByIntervention(req.params.interventionId);
      res.json(followUps);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar acompanhamentos da intervenção" });
    }
  });

  app.post("/api/followups", requireAuth, async (req, res) => {
    try {
      const result = insertFollowUpSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Dados inválidos", details: result.error.errors });
      }

      const followUp = await storage.createFollowUp(result.data);
      res.status(201).json(followUp);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar acompanhamento" });
    }
  });

  return httpServer;
}
