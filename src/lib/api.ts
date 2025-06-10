import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
      let requestBody: { text: string };

      if (data.file) {
        // Read file content as text
        const text = await data.file.text();
        requestBody = { text };
      } else {
        requestBody = { text: data.text || '' };
      }

      const response = await fetch(`${API_BASE_URL}/api/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
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
      
      // Add file metadata to result if it's a file
      if (data.file) {
        result.processed_text = `File: ${data.file.name}`;
      }

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
  }
};
