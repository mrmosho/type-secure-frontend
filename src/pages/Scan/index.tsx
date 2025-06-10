import { useAuth } from '@/hooks/useAuth';
import { FileUpload } from './FileUpload';
import { TextInput } from './TextInput';

export default function ScanPage() {
  // This will handle authentication
  useAuth();

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8">
      <TextInput />
      <FileUpload />
    </div>
  );
}