
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  value: number;
  type?: string;
  className?: string;
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ value, className }) => {
  // Determine the color based on the confidence level
  const getColorClass = () => {
    if (value >= 80) {
      return "bg-red-500";
    } else if (value >= 60) {
      return "bg-orange-500";
    } else if (value >= 40) {
      return "bg-yellow-500";
    } else if (value >= 20) {
      return "bg-green-500";
    } else {
      return "bg-blue-500";
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span>Confidence</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress 
        value={value} 
        className={cn("h-2 w-full bg-muted")}
        // Fixed: Removed indicatorClassName prop which was causing the build error
      />
    </div>
  );
};

export default ConfidenceBar;
