import { useState } from 'react';
import { useDetection } from '@/hooks/useDetection';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DetectionResult } from '@/components/DetectionResult';

export function TextInput() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<DetectionResponse | null>(null);
  const { detectText, isLoading } = useDetection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const detectionResult = await detectText(text);
      setResult(detectionResult);
    } catch (error) {
      console.error('Detection failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to scan..."
          className="min-h-[200px]"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Scanning...' : 'Scan Text'}
        </Button>
      </form>

      {result && <DetectionResult result={result} />}
    </div>
  );
}