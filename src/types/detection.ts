export interface DetectionResponse {
  is_sensitive: boolean;
  confidence: number;
  detected_types: string[];
  processed_text: string;
}

export interface FileDetectionResult extends DetectionResponse {
  filename: string;
  file_type: string;
  size: number;
}

export interface DashboardStats {
  total_scans: number;
  sensitive_detected: number;
  detection_types_count: Record<string, number>;
  recent_detections: FileDetectionResult[];
}