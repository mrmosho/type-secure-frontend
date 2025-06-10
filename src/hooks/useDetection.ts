import { useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { useSettings } from '@/context/SettingsContext';

export function useDetection() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { settings } = useSettings();

  const detectText = async (text: string) => {
    try {
      setIsLoading(true);
      
      const result = await api.detect({
        text,
        sensitivity: settings.sensitivity,
        detection_types: settings.enabledTypes
      });

      await api.saveDetectionResult(result);

      return result;
    } catch (error) {
      toast({
        title: 'Detection Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { detectText, isLoading };
}