import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = 'https://api.type-secure.online';

interface DetectionRequest {
  text: string;
  // Add other fields as required by your API
}

interface DetectionResponse {
  is_sensitive: boolean;
  confidence: number;
  detected_types: string[];
  processed_text: string;
}

export const api = {
  async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
    };
  },

  async detect(data: DetectionRequest): Promise<DetectionResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/api/detect`, {
        method: 'POST',
        headers: {
          ...headers,
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(data),
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
      
      // Validate response structure
      if (!this.isValidDetectionResponse(result)) {
        throw new Error('Invalid response format from API');
      }

      // Save to database immediately
      try {
        await this.saveDetectionResult(result);
      } catch (dbError) {
        console.error('Failed to save to database:', dbError);
        // Continue even if database save fails
      }

      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Detection failed",
        variant: "destructive",
      });
      throw error;
    }
  },

  async uploadFile(file: File): Promise<DetectionResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/detect/file`, {
        method: 'POST',
        headers: {
          ...headers,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('File upload failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`File upload failed: ${errorText}`);
      }

      const result = await response.json();
      
      if (!this.isValidDetectionResponse(result)) {
        throw new Error('Invalid response format from API');
      }

      await this.saveDetectionResult({
        ...result,
        processed_text: `File: ${file.name}`,
      });

      return result;
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "File upload failed",
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
