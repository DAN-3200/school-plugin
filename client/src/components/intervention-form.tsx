import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Student } from "@shared/schema";
import { Loader2 } from "lucide-react";

const interventionFormSchema = z.object({
  objective: z.string().min(10, "O objetivo deve ter pelo menos 10 caracteres"),
  plannedActions: z.string().min(20, "Descreva as ações planejadas com mais detalhes"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  responsible: z.string().min(3, "Informe o responsável"),
});

type InterventionFormData = z.infer<typeof interventionFormSchema>;

interface InterventionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSubmit: (data: InterventionFormData) => void;
  isSubmitting?: boolean;
}

export function InterventionForm({
  open,
  onOpenChange,
  student,
  onSubmit,
  isSubmitting,
}: InterventionFormProps) {
  const form = useForm<InterventionFormData>({
    resolver: zodResolver(interventionFormSchema),
    defaultValues: {
      objective: "",
      plannedActions: "",
      startDate: new Date().toISOString().split("T")[0],
      responsible: "",
    },
  });

  const handleSubmit = (data: InterventionFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Intervenção Pedagógica</DialogTitle>
          <DialogDescription>
            {student
              ? `Criar intervenção para ${student.name}`
              : "Preencha os detalhes da intervenção"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo da Intervenção</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo principal desta intervenção..."
                      className="min-h-20 resize-none"
                      {...field}
                      data-testid="input-objective"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plannedActions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ações Planejadas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhe as ações que serão realizadas..."
                      className="min-h-24 resize-none"
                      {...field}
                      data-testid="input-planned-actions"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-start-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do responsável"
                        {...field}
                        data-testid="input-responsible"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} data-testid="button-submit-intervention">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Intervenção"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
