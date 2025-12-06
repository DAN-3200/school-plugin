import { Badge } from "@/components/ui/badge";
import { getRiskLevel, getRiskLabel, type RiskLevel } from "@shared/schema";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface RiskBadgeProps {
  riskIndex: number;
  showLabel?: boolean;
  size?: "sm" | "default";
}

export function RiskBadge({ riskIndex, showLabel = true, size = "default" }: RiskBadgeProps) {
  const level = getRiskLevel(riskIndex);
  const label = getRiskLabel(level);

  const getStyles = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700";
      case "high":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700";
    }
  };

  const getIcon = (riskLevel: RiskLevel) => {
    const iconClass = size === "sm" ? "w-3 h-3" : "w-4 h-4";
    switch (riskLevel) {
      case "low":
        return <CheckCircle className={iconClass} />;
      case "medium":
        return <AlertCircle className={iconClass} />;
      case "high":
        return <AlertTriangle className={iconClass} />;
    }
  };

  return (
    <Badge
      variant="outline"
      className={`${getStyles(level)} ${size === "sm" ? "text-xs px-2 py-0.5" : "px-3 py-1"} font-medium gap-1.5 no-default-hover-elevate no-default-active-elevate`}
      data-testid={`badge-risk-${level}`}
    >
      {getIcon(level)}
      {showLabel && <span>{label}</span>}
      {!showLabel && <span>IRE: {riskIndex}</span>}
    </Badge>
  );
}
