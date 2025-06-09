
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SettingItem from "@/components/Settings/SettingItem";
import { useToast } from "@/hooks/use-toast";

const Settings: React.FC = () => {
  const { toast } = useToast();
  
  // Detection settings state
  const [autoScan, setAutoScan] = useState(true);
  const [emailDetection, setEmailDetection] = useState(true);
  const [phoneDetection, setPhoneDetection] = useState(true);
  const [creditCardDetection, setCreditCardDetection] = useState(true);
  const [addressDetection, setAddressDetection] = useState(true);
  const [sensitivityLevel, setSensitivityLevel] = useState([70]);
  
  // Encryption settings state
  const [autoEncrypt, setAutoEncrypt] = useState(false);
  const [highConfidenceEncrypt, setHighConfidenceEncrypt] = useState(true);
  const [encryptionStrength, setEncryptionStrength] = useState([256]);
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  
  const handleSaveSettings = () => {
    // In a real app, would save settings to an API
    toast({
      title: "Settings saved",
      description: "Your changes have been successfully saved.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Button
          onClick={handleSaveSettings}
          className="bg-ts-purple-500 hover:bg-ts-purple-600"
        >
          Save Settings
        </Button>
      </div>
      
      <Tabs defaultValue="detection">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detection">Detection</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detection" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detection Settings</CardTitle>
              <CardDescription>
                Configure how the system detects sensitive data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem
                id="auto-scan"
                title="Automatic Scanning"
                description="Automatically scan files when they are accessed"
                type="switch"
                value={autoScan}
                onChange={setAutoScan}
              />
              
              <Separator />
              
              <h3 className="text-lg font-medium">Detection Types</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <SettingItem
                  id="email-detection"
                  title="Email Addresses"
                  description="Detect email addresses in content"
                  type="switch"
                  value={emailDetection}
                  onChange={setEmailDetection}
                />
                
                <SettingItem
                  id="phone-detection"
                  title="Phone Numbers"
                  description="Detect phone numbers in content"
                  type="switch"
                  value={phoneDetection}
                  onChange={setPhoneDetection}
                />
                
                <SettingItem
                  id="credit-card-detection"
                  title="Credit Card Numbers"
                  description="Detect credit card numbers in content"
                  type="switch"
                  value={creditCardDetection}
                  onChange={setCreditCardDetection}
                />
                
                <SettingItem
                  id="address-detection"
                  title="Physical Addresses"
                  description="Detect physical addresses in content"
                  type="switch"
                  value={addressDetection}
                  onChange={setAddressDetection}
                />
              </div>
              
              <Separator />
              
              <SettingItem
                id="sensitivity-level"
                title="Detection Sensitivity"
                description="Adjust how sensitive the detection is (higher = more detections but may include more false positives)"
                type="slider"
                min={1}
                max={100}
                value={sensitivityLevel}
                onChange={setSensitivityLevel}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="encryption" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Encryption Settings</CardTitle>
              <CardDescription>
                Configure how detected sensitive data is encrypted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem
                id="auto-encrypt"
                title="Automatic Encryption"
                description="Automatically encrypt all detected sensitive data"
                type="switch"
                value={autoEncrypt}
                onChange={setAutoEncrypt}
              />
              
              <SettingItem
                id="high-confidence-encrypt"
                title="High-Confidence Auto-Encryption"
                description="Automatically encrypt only high-confidence detections (above 85%)"
                type="switch"
                value={highConfidenceEncrypt}
                onChange={setHighConfidenceEncrypt}
              />
              
              <Separator />
              
              <SettingItem
                id="encryption-strength"
                title="Encryption Strength (bits)"
                description="Higher values provide stronger encryption but may affect performance"
                type="slider"
                min={128}
                max={512}
                step={128}
                value={encryptionStrength}
                onChange={setEncryptionStrength}
              />
              
              <div className="mt-6">
                <Button>Reset Encryption Keys</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you are notified about detections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem
                id="email-notifications"
                title="Email Notifications"
                description="Receive notifications via email"
                type="switch"
                value={emailNotifications}
                onChange={setEmailNotifications}
              />
              
              <SettingItem
                id="system-notifications"
                title="System Notifications"
                description="Receive desktop/system notifications"
                type="switch"
                value={systemNotifications}
                onChange={setSystemNotifications}
              />
              
              <SettingItem
                id="weekly-reports"
                title="Weekly Reports"
                description="Receive weekly summary reports"
                type="switch"
                value={weeklyReports}
                onChange={setWeeklyReports}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Export & Data Management</CardTitle>
              <CardDescription>
                Manage your data and export settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export your detection logs and settings for backup or transfer between systems.
              </p>
              
              <div className="flex gap-4">
                <Button variant="outline">Export Settings</Button>
                <Button variant="outline">Export Detection Logs</Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" className="text-destructive hover:text-destructive">
                Clear All Data
              </Button>
              <Button variant="outline">Import Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
