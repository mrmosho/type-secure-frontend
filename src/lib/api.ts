import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = 'https://api.type-secure.online';

interface DetectionRequest {
  text?: string;
  file?: File;
}

interface DetectionResponse {
  is_sensitive: boolean;
  confidence: number;
  detected_types: string[];
  processed_text: string;
}

export const api = {
  async detect(data: DetectionRequest): Promise<DetectionResponse> {
    try {
      let body: FormData | string;
      const headers: Record<string, string> = {};

      if (data.file) {
        body = new FormData();
        body.append('file', data.file);
      } else {
        body = JSON.stringify({ text: data.text });
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/api/detect`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Detection failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Detection failed: ${errorText}`);
      }

      const result = await response.json();
      
      if (!this.isValidDetectionResponse(result)) {
        throw new Error('Invalid response format from API');
      }

      // Save to database with appropriate text
      await this.saveDetectionResult({
        ...result,
        processed_text: data.file 
          ? `File: ${data.file.name}`
          : result.processed_text,
      });

      return result;
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Detection failed",
        variant: "destructive",
      });
      throw error;
    }
  },

  isValidDetectionResponse(data: any): data is DetectionResponse {
    return (
      typeof data === 'object' &&
      'is_sensitive' in data &&
      'confidence' in data &&
      'detected_types' in data &&
      'processed_text' in data &&
      Array.isArray(data.detected_types)
    );
  },

  async saveDetectionResult(result: DetectionResponse): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('Cannot save result: No authenticated user');
      return;
    }

    const { error } = await supabase
      .from('detections')
      .insert({
        user_id: user.id,
        input_text: result.processed_text,
        is_sensitive: result.is_sensitive,
        confidence: result.confidence,
        detected_types: result.detected_types,
        processed_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Database save failed:', error);
      throw error;
    }
  }
};
