import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2 } from "lucide-react";

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setProgress(0);

    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${https://api.type-secure.online}/api/detect/file`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const result = await response.json();
        
        toast({
          title: "File Processed",
          description: result.is_sensitive 
            ? `Found sensitive data in ${file.name}`
            : `No sensitive data found in ${file.name}`,
          variant: result.is_sensitive ? "destructive" : "default",
        });

        setProgress(100);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: error instanceof Error ? error.message : "Failed to process file",
        });
      }
    }
    
    setIsUploading(false);
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div 
      {...getRootProps()} 
      className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag & drop files here, or click to select</p>
        )}
        <p className="text-sm text-muted-foreground">
          Supports .docx, .xlsx, and .csv files up to 10MB
        </p>
        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}