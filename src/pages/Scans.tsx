import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextInput } from "./TextInput";
import { FileUpload } from "./FileUpload";
import { ScanHistory } from "./ScanHistory";

export default function Scans() {
  const [activeTab, setActiveTab] = useState("text");

  return (
    <div className="container mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="text">Text Input</TabsTrigger>
          <TabsTrigger value="file">File Upload</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <TextInput />
        </TabsContent>

        <TabsContent value="file">
          <FileUpload />
        </TabsContent>

        <TabsContent value="history">
          <ScanHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
