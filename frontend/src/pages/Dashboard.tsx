
import React from "react";
import StatsCard from "@/components/Dashboard/StatsCard";
import DetectionChart from "@/components/Dashboard/DetectionChart";
import { Bell, Lock, Settings, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SystemTray from "@/components/UI/SystemTray";

// Mock data for demonstration
const chartData = [
  { name: "Jan", personal: 12, financial: 8 },
  { name: "Feb", personal: 19, financial: 14 },
  { name: "Mar", personal: 15, financial: 11 },
  { name: "Apr", personal: 27, financial: 19 },
  { name: "May", personal: 32, financial: 25 },
  { name: "Jun", personal: 20, financial: 18 },
  { name: "Jul", personal: 29, financial: 21 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button
          className="bg-ts-purple-500 hover:bg-ts-purple-600"
        >
          New Scan
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Detections"
          value="846"
          icon={<ShieldCheck className="h-4 w-4" />}
          trend={{ value: 12, isPositive: false }}
        />
        <StatsCard
          title="Protected Files"
          value="382"
          icon={<Lock className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Monitors"
          value="5"
          description="All systems operational"
          icon={<Bell className="h-4 w-4" />}
        />
        <StatsCard
          title="Sensitivity Level"
          value="Medium"
          description="Last updated 2 days ago"
          icon={<Settings className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DetectionChart 
          data={chartData}
          title="Detection History"
          description="Data detection trends over the past 7 months"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system health and security status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>Active Protection</span>
                </div>
                <span className="text-sm text-muted-foreground">Real-time monitoring active</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>Database Connection</span>
                </div>
                <span className="text-sm text-muted-foreground">Connected (low latency)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>Encryption Module</span>
                </div>
                <span className="text-sm text-muted-foreground">AES-256 ready</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>JWT Authentication</span>
                </div>
                <span className="text-sm text-muted-foreground">Valid session</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span>Pattern Database</span>
                </div>
                <span className="text-sm text-muted-foreground">Update available</span>
              </div>
            </div>
            
            <Button className="w-full mt-6 bg-ts-purple-500 hover:bg-ts-purple-600">
              Update Pattern Database
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <SystemTray detectionCount={3} />
    </div>
  );
};

export default Dashboard;
