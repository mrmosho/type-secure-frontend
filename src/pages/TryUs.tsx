
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TestTube, Upload, Eye, FileText, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import DetectionItem, { Detection, DetectionType } from '@/components/Monitoring/DetectionItem';

const TryUs: React.FC = () => {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [activeTab, setActiveTab] = useState<string>('text');

  // Mock detection logic
  const scanForSensitiveData = (content: string): Detection[] => {
    const results: Detection[] = [];
    
    // Credit card regex (simplified)
    const creditCardRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
    let match;
    
    while ((match = creditCardRegex.exec(content)) !== null) {
      results.push({
        id: `cc-${Date.now()}-${results.length}`,
        timestamp: new Date().toISOString(),
        path: file ? file.name : 'Manual Input',
        type: 'financial',
        content: match[0],
        confidence: 0.95,
        encrypted: false,
        source: 'Try Us Demo',
        value: match[0]
      });
    }
    
    // Email regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    while ((match = emailRegex.exec(content)) !== null) {
      results.push({
        id: `email-${Date.now()}-${results.length}`,
        timestamp: new Date().toISOString(),
        path: file ? file.name : 'Manual Input',
        type: 'personal',
        content: match[0],
        confidence: 0.9,
        encrypted: false,
        source: 'Try Us Demo',
        value: match[0]
      });
    }
    
    // Phone number regex (simplified)
    const phoneRegex = /\b(?:\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}\b/g;
    while ((match = phoneRegex.exec(content)) !== null) {
      results.push({
        id: `phone-${Date.now()}-${results.length}`,
        timestamp: new Date().toISOString(),
        path: file ? file.name : 'Manual Input',
        type: 'personal',
        content: match[0],
        confidence: 0.85,
        encrypted: false,
        source: 'Try Us Demo',
        value: match[0]
      });
    }

    // Password-like pattern
    const passwordRegex = /\b(?:password|pwd|secret|key)[\s:=]+\S+\b/gi;
    while ((match = passwordRegex.exec(content)) !== null) {
      results.push({
        id: `pwd-${Date.now()}-${results.length}`,
        timestamp: new Date().toISOString(),
        path: file ? file.name : 'Manual Input',
        type: 'password',
        content: match[0],
        confidence: 0.8,
        encrypted: false,
        source: 'Try Us Demo',
        value: match[0]
      });
    }
    
    return results;
  };

  const handleTextScan = () => {
    if (!text.trim()) {
      toast({
        title: "No content to scan",
        description: "Please enter some text to scan for sensitive data.",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    
    // Simulate processing time
    setTimeout(() => {
      const results = scanForSensitiveData(text);
      setDetections(results);
      setIsScanning(false);
      
      toast({
        title: results.length > 0 
          ? `${results.length} sensitive data item${results.length === 1 ? '' : 's'} detected` 
          : "No sensitive data detected",
        description: results.length > 0 
          ? "Review the items below and choose to encrypt or ignore them." 
          : "Your text appears to be free of common sensitive data patterns.",
      });
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Mock file reading - in a real app, we'd parse the file content
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const content = event.target.result.toString();
          setText(content);
        }
      };
      
      reader.readAsText(selectedFile);
    }
  };

  const handleFileScan = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to scan.",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    
    // Simulate processing time
    setTimeout(() => {
      const results = scanForSensitiveData(text);
      setDetections(results);
      setIsScanning(false);
      
      toast({
        title: results.length > 0 
          ? `${results.length} sensitive data item${results.length === 1 ? '' : 's'} detected` 
          : "No sensitive data detected",
        description: results.length > 0 
          ? "Review the items below and choose to encrypt or ignore them." 
          : "Your file appears to be free of common sensitive data patterns.",
      });
    }, 2000);
  };

  const handleEncrypt = (id: string) => {
    setDetections(prev => 
      prev.map(detection => 
        detection.id === id 
          ? { ...detection, encrypted: true } 
          : detection
      )
    );
    
    toast({
      title: "Data encrypted",
      description: "The sensitive data has been encrypted successfully.",
    });
  };

  const handleIgnore = (id: string) => {
    setDetections(prev => prev.filter(detection => detection.id !== id));
    
    toast({
      title: "Detection ignored",
      description: "The detection has been removed from the list.",
    });
  };

  const handleView = (detection: Detection) => {
    toast({
      title: "Sensitive Data",
      description: (
        <div className="mt-2 p-2 bg-muted rounded">
          <code>{detection.content}</code>
        </div>
      ),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/home">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <TestTube className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Try Our Detection System</h1>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mt-2">
            Experience how our system identifies and protects sensitive data in real-time.
            Upload a file or paste your content to see the detection in action.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Sensitive Data Scanner</CardTitle>
            <CardDescription>
              Test our detection algorithm with your own content. We'll identify potential sensitive information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="text"
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                <TabsTrigger value="text">Manual Input</TabsTrigger>
                <TabsTrigger value="file">File Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Enter text with sensitive data (e.g., credit cards, emails, passwords)</Label>
                  <Textarea
                    id="content"
                    placeholder="Example: My credit card is 4111-1111-1111-1111 and my email is example@email.com"
                    className="min-h-[200px]"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Try including credit card numbers, emails, phone numbers, or passwords.
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleTextScan}
                  disabled={isScanning || !text.trim()}
                >
                  {isScanning ? "Scanning..." : "Scan Text"}
                </Button>
              </TabsContent>
              
              <TabsContent value="file" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Upload a text file (.txt, .docx, .pdf)</Label>
                  <div className="border border-dashed border-input rounded-md p-6 flex flex-col items-center justify-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                    <Input
                      id="file"
                      type="file"
                      accept=".txt,.docx,.pdf"
                      className="max-w-sm"
                      onChange={handleFileUpload}
                    />
                  </div>
                  {file && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  )}
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleFileScan}
                  disabled={isScanning || !file}
                >
                  {isScanning ? "Scanning File..." : "Scan File"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {detections.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Detection Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detections.map(detection => (
                <DetectionItem 
                  key={detection.id}
                  detection={detection}
                  onEncrypt={handleEncrypt}
                  onView={() => handleView(detection)}
                  onIgnore={handleIgnore}
                />
              ))}
            </div>
          </div>
        )}

        {detections.length === 0 && text && !isScanning && (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Eye className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-center text-muted-foreground">
                No sensitive data detected in your input. Try adding example data like credit card numbers or emails.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TryUs;
