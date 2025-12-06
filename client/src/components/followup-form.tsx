import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { Intervention } from "@shared/schema";
import { Loader2 } from "lucide-react";

const followUpFormSchema = z.object({
  observations: z.string().min(10, "As observações devem ter pelo menos 10 caracteres"),
  progress: z.number().min(0).max(10),
});

type FollowUpFormData = z.infer<typeof followUpFormSchema>;

interface FollowUpFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intervention: Intervention | null;
  onSubmit: (data: FollowUpFormData) => void;
  isSubmitting?: boolean;
}

export function FollowUpForm({
  open,
  onOpenChange,
  intervention,
  onSubmit,
  isSubmitting,
}: FollowUpFormProps) {
  const [progress, setProgress] = useState(5);

  const form = useForm<FollowUpFormData>({
    resolver: zodResolver(followUpFormSchema),
    defaultValues: {
      observations: "",
      progress: 5,
    },
  });

  const handleSubmit = (data: FollowUpFormData) => {
    onSubmit({ ...data, progress });
    form.reset();
    setProgress(5);
  };

  const getProgressLabel = (value: number) => {
    if (value <= 2) return "Pouco progresso";
    if (value <= 4) return "Algum progresso";
    if (value <= 6) return "Progresso moderado";
    if (value <= 8) return "Bom progresso";
    return "Excelente progresso";
  };

  const getProgressColor = (value: number) => {
    if (value <= 3) return "text-red-600 dark:text-red-400";
    if (value <= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Acompanhamento</DialogTitle>
          <DialogDescription>
            {intervention
              ? `Acompanhamento para: ${intervention.objective.substring(0, 50)}...`
              : "Registre as observações e o progresso"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva suas observações sobre o progresso do aluno..."
                      className="min-h-24 resize-none"
                      {...field}
                      data-testid="input-observations"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Nível de Progresso</FormLabel>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold text-lg ${getProgressColor(progress)}`}>
                    {progress}
                  </span>
                  <span className={`text-sm ${getProgressColor(progress)}`}>
                    ({getProgressLabel(progress)})
                  </span>
                </div>
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={[progress]}
                onValueChange={([v]) => setProgress(v)}
                className="py-2"
                data-testid="slider-progress"
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
              <Button type="submit" disabled={isSubmitting} data-testid="button-submit-followup">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrar Acompanhamento"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
