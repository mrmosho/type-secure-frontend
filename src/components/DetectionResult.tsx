import { AlertCircle, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DetectionResponse {
  is_sensitive: boolean;
  confidence: number;
  detected_types: string[];
  processed_text: string;
}

interface DetectionResultProps {
  result: DetectionResponse;
}

export function DetectionResult({ result }: DetectionResultProps) {
  const confidencePercentage = Math.round(result.confidence * 100);
  
  return (
    <div className="space-y-4">
      <Alert variant={result.is_sensitive ? "destructive" : "default"}>
        <div className="flex items-center gap-2">
          {result.is_sensitive ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <ShieldCheck className="h-5 w-5" />
          )}
          <AlertTitle>
            {result.is_sensitive ? "Sensitive Data Detected" : "No Sensitive Data Found"}
          </AlertTitle>
        </div>
        <AlertDescription>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Confidence:</span>
              <Progress value={confidencePercentage} className="w-32" />
              <span className="text-sm">{confidencePercentage}%</span>
            </div>
            {result.detected_types.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Detected types:</span>
                {result.detected_types.map((type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {result.is_sensitive && (
        <Alert>
          <AlertTitle>Processed Text</AlertTitle>
          <AlertDescription className="mt-2 whitespace-pre-wrap">
            {result.processed_text}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}