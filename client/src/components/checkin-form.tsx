import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Sparkles, Brain, Target, FolderKanban, Loader2 } from "lucide-react";

interface CheckinFormProps {
  weekNumber: number;
  onSubmit: (data: {
    motivation: number;
    stress: number;
    focus: number;
    organization: number;
  }) => void;
  isSubmitting?: boolean;
}

export function CheckinForm({ weekNumber, onSubmit, isSubmitting }: CheckinFormProps) {
  const [motivation, setMotivation] = useState(5);
  const [stress, setStress] = useState(5);
  const [focus, setFocus] = useState(5);
  const [organization, setOrganization] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ motivation, stress, focus, organization });
  };

  const getValueLabel = (value: number, isStress = false) => {
    if (isStress) {
      if (value <= 3) return "Baixo";
      if (value <= 6) return "Moderado";
      return "Alto";
    }
    if (value <= 3) return "Baixo";
    if (value <= 6) return "Moderado";
    return "Alto";
  };

  const getValueColor = (value: number, isStress = false) => {
    if (isStress) {
      if (value <= 3) return "text-green-600 dark:text-green-400";
      if (value <= 6) return "text-yellow-600 dark:text-yellow-400";
      return "text-red-600 dark:text-red-400";
    }
    if (value <= 3) return "text-red-600 dark:text-red-400";
    if (value <= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Check-in Semanal</CardTitle>
            <CardDescription>
              Como você está se sentindo esta semana? Responda com sinceridade.
            </CardDescription>
          </div>
          <div className="px-4 py-2 bg-primary/10 rounded-md">
            <span className="text-sm font-medium text-primary">Semana {weekNumber}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <Label htmlFor="motivation" className="text-base font-medium">
                    Como está sua motivação esta semana?
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold text-lg ${getValueColor(motivation)}`}>
                    {motivation}
                  </span>
                  <span className={`text-sm ${getValueColor(motivation)}`}>
                    ({getValueLabel(motivation)})
                  </span>
                </div>
              </div>
              <Slider
                id="motivation"
                min={0}
                max={10}
                step={1}
                value={[motivation]}
                onValueChange={([v]) => setMotivation(v)}
                className="py-2"
                data-testid="slider-motivation"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <Label htmlFor="stress" className="text-base font-medium">
                    Seu nível de estresse?
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold text-lg ${getValueColor(stress, true)}`}>
                    {stress}
                  </span>
                  <span className={`text-sm ${getValueColor(stress, true)}`}>
                    ({getValueLabel(stress, true)})
                  </span>
                </div>
              </div>
              <Slider
                id="stress"
                min={0}
                max={10}
                step={1}
                value={[stress]}
                onValueChange={([v]) => setStress(v)}
                className="py-2"
                data-testid="slider-stress"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <Label htmlFor="focus" className="text-base font-medium">
                    Como está seu foco nos estudos?
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold text-lg ${getValueColor(focus)}`}>
                    {focus}
                  </span>
                  <span className={`text-sm ${getValueColor(focus)}`}>
                    ({getValueLabel(focus)})
                  </span>
                </div>
              </div>
              <Slider
                id="focus"
                min={0}
                max={10}
                step={1}
                value={[focus]}
                onValueChange={([v]) => setFocus(v)}
                className="py-2"
                data-testid="slider-focus"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-primary" />
                  <Label htmlFor="organization" className="text-base font-medium">
                    Como você avalia sua organização?
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold text-lg ${getValueColor(organization)}`}>
                    {organization}
                  </span>
                  <span className={`text-sm ${getValueColor(organization)}`}>
                    ({getValueLabel(organization)})
                  </span>
                </div>
              </div>
              <Slider
                id="organization"
                min={0}
                max={10}
                step={1}
                value={[organization]}
                onValueChange={([v]) => setOrganization(v)}
                className="py-2"
                data-testid="slider-organization"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
            data-testid="button-submit-checkin"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Check-in"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
