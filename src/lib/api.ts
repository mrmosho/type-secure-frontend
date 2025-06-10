import { toast } from '@/components/ui/use-toast';

// Always use HTTPS URL
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
      let requestBody: { text: string };

      if (data.file) {
        // Read file content as text
        const text = await data.file.text();
        requestBody = { text };
        console.log('📤 Processing file:', data.file.name);
      } else {
        requestBody = { text: data.text || '' };
      }

      console.log('🔍 Making request to:', API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/api/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Detection failed:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          error: errorText
        });
        throw new Error(`Detection failed: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Detection successful:', result);
      
      // Add file metadata to result if it's a file
      if (data.file) {
        result.processed_text = `File: ${data.file.name}`;
      }

      return result;
    } catch (error) {
      console.error('❌ API Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Request failed: ${error.message}`
          : "Detection failed - please try again",
        variant: "destructive",
      });
      throw error;
    }
  }
};
