import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface DetectionResult {
  is_sensitive: boolean;
  confidence: number;
  detected_types: string[];
  processed_text: string;
}

export function TextInput() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${https://api.type-secure.online}/api/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Detection failed');

      const result = await response.json();
      setResult(result);

      if (result.is_sensitive) {
        toast({
          variant: 'destructive',
          title: 'Sensitive Data Detected',
          description: `Found ${result.detected_types.join(', ')}`,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to scan text',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to scan for sensitive data..."
          className="min-h-[200px]"
        />
        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            'Scan Text'
          )}
        </Button>
      </form>

      {result && (
        <div className={`p-4 rounded-lg border ${
          result.is_sensitive ? 'bg-destructive/10 border-destructive' : 'bg-green-50 border-green-200'
        }`}>
          <h3 className="font-semibold mb-2">
            {result.is_sensitive ? 'Sensitive Data Detected' : 'No Sensitive Data Found'}
          </h3>
          <p>Confidence: {Math.round(result.confidence * 100)}%</p>
          {result.detected_types.length > 0 && (
            <p>Types: {result.detected_types.join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
}