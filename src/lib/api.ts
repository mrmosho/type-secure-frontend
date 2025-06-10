import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface DetectionResponse {
  is_sensitive: boolean;
  confidence: number;
  detected_types: string[];
  processed_text: string;
}

interface DetectionRequest {
  text: string;
  sensitivity?: number;
  detection_types?: string[];
}

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// TEMPORARY FIX: Hardcode the HTTPS URL to bypass caching
const API_BASE_URL = 'https://api.type-secure.online';

export const api = {
  async detect(data: DetectionRequest): Promise<DetectionResponse> {
    try {
      console.log('🔍 Using API URL:', API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/api/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new APIError(response.status, 'Detection request failed');
      }

      const result = await response.json();
      return result as DetectionResponse;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },



  
  async saveDetectionResult(result: DetectionResponse) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('detections')
      .insert({
        user_id: user.id,
        input_text: result.processed_text,
        is_sensitive: result.is_sensitive,
        confidence: result.confidence,
        detected_types: result.detected_types,
        processed_at: new Date().toISOString()
      });

    if (error) throw error;
  }
};
