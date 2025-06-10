import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2, FileText, FileIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { api } from "@/utils/api";

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setProgress(0);

    for (const file of acceptedFiles) {
      try {
        const result = await api.detect({ file });
        
        toast({
          title: "File Processed",
          description: result.is_sensitive 
            ? `Found sensitive data in ${file.name}`
            : `No sensitive data found in ${file.name}`,
          variant: result.is_sensitive ? "destructive" : "default",
        });

        setProgress(100);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    setIsUploading(false);
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div className="space-y-6">
      <div 
        {...getRootProps()} 
        className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          {isDragActive ? (
            <p>Drop the text file here...</p>
          ) : (
            <p>Drag & drop a text file here, or click to select</p>
          )}
          <p className="text-sm text-muted-foreground">
            Currently supporting .txt files up to 10MB
          </p>
          {isUploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            </div>
          )}
        </div>
      </div>

      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileIcon className="h-4 w-4" />
          Coming Soon
          <Badge variant="outline" className="ml-2">Soon™</Badge>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['.docx', '.pdf', '.xlsx', '.csv', '.json', '.xml'].map((format) => (
            <div 
              key={format}
              className="p-2 rounded border bg-background/50 text-center text-sm text-muted-foreground"
            >
              {format}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}