import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Scan, 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Database,
  Folder,
  Shield,
  File,
  Type
} from "lucide-react";

type ScanMode = "file" | "text";

const Scans: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMode, setScanMode] = useState<ScanMode>("file");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");

  const handleNewScan = () => {
    // Check if user has provided content
    if (scanMode === "file" && !uploadedFile) {
      alert("Please upload a file before starting the scan.");
      return;
    }
    if (scanMode === "text" && !textInput.trim()) {
      alert("Please enter some text before starting the scan.");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const canStartScan = () => {
    if (scanMode === "file") return uploadedFile !== null;
    if (scanMode === "text") return textInput.trim().length > 0;
    return false;
  };

  const recentScans = [
    {
      id: 1,
      name: "Employee Database Scan",
      type: "Database",
      status: "completed",
      detections: 23,
      timestamp: "2 hours ago",
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 2,
      name: "Document Repository",
      type: "File System",
      status: "running",
      detections: 8,
      timestamp: "Running",
      icon: <Folder className="w-4 h-4" />
    },
    {
      id: 3,
      name: "Email Archive Scan",
      type: "Email",
      status: "completed",
      detections: 156,
      timestamp: "1 day ago",
      icon: <FileText className="w-4 h-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "running":
        return "bg-blue-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "running":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Security Scans</h1>
        <Button
          onClick={handleNewScan}
          disabled={isScanning || !canStartScan()}
          className="bg-ts-purple-500 hover:bg-ts-purple-600"
        >
          <Scan className="mr-2 h-4 w-4" />
          {isScanning ? "Scanning..." : "New Scan"}
        </Button>
      </div>

      {isScanning && (
        <Card className="bg-ts-purple-50/50 border-ts-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center text-ts-purple-700">
              <Scan className="mr-2 h-5 w-5 animate-spin" />
              Scan in Progress
            </CardTitle>
            <CardDescription>
              Analyzing your {scanMode === "file" ? "file" : "text"} for sensitive information patterns...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={scanProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(scanProgress)}% complete
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="new-scan" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new-scan">New Scan</TabsTrigger>
          <TabsTrigger value="recent">Recent Scans</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="new-scan">
          <div className="space-y-6">
            {/* Scan Mode Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Scan Method</CardTitle>
                <CardDescription>
                  Select how you want to provide content for scanning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant={scanMode === "file" ? "default" : "outline"}
                    className={`h-20 flex flex-col space-y-2 ${
                      scanMode === "file" ? "bg-ts-purple-500 hover:bg-ts-purple-600" : ""
                    }`}
                    onClick={() => setScanMode("file")}
                  >
                    <Upload className="w-6 h-6" />
                    <span>Upload File</span>
                  </Button>
                  <Button
                    variant={scanMode === "text" ? "default" : "outline"}
                    className={`h-20 flex flex-col space-y-2 ${
                      scanMode === "text" ? "bg-ts-purple-500 hover:bg-ts-purple-600" : ""
                    }`}
                    onClick={() => setScanMode("text")}
                  >
                    <Type className="w-6 h-6" />
                    <span>Text Input</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content Input Based on Mode */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {scanMode === "file" ? <File className="w-5 h-5" /> : <Type className="w-5 h-5" />}
                  <span>{scanMode === "file" ? "File Upload" : "Text Input"}</span>
                </CardTitle>
                <CardDescription>
                  {scanMode === "file" 
                    ? "Upload a document, database export, or any file containing sensitive data"
                    : "Paste or type text content that you want to scan for sensitive information"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scanMode === "file" ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="file-upload">Select File</Label>
                      <Input
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        accept=".txt,.pdf,.doc,.docx,.csv,.xlsx,.json"
                        className="mt-1"
                      />
                    </div>
                    {uploadedFile && (
                      <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <File className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="text-input">Enter Text Content</Label>
                      <Textarea
                        id="text-input"
                        placeholder="Paste or type your text content here..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="mt-1 min-h-[200px]"
                      />
                    </div>
                    {textInput.trim() && (
                      <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <Type className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          {textInput.trim().length} characters ready for scanning
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Scan Results</CardTitle>
              <CardDescription>
                View and analyze your recent security scans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {scan.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{scan.name}</h3>
                        <p className="text-sm text-muted-foreground">{scan.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(scan.status)}
                          <Badge variant={scan.status === "completed" ? "default" : "secondary"}>
                            {scan.detections} detections
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{scan.timestamp}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Scans</CardTitle>
              <CardDescription>
                Manage your automated security scan schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Scheduled Scans</h3>
                <p className="text-muted-foreground mb-4">
                  Set up automatic scans to run at regular intervals
                </p>
                <Button className="bg-ts-purple-500 hover:bg-ts-purple-600">
                  Schedule New Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scans;
