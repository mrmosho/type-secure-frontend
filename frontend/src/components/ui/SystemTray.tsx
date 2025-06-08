
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, ShieldAlert, X } from "lucide-react";
import { cn } from '@/lib/utils';

interface SystemTrayProps {
  detectionCount: number;
  className?: string;
}

const SystemTray: React.FC<SystemTrayProps> = ({ detectionCount, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={cn("fixed bottom-4 right-4", className)}>
      {isExpanded && (
        <Card className="mb-2 p-3 w-72 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">System Status</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-3 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Engine: Active</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className={cn(
                "h-2 w-2 rounded-full", 
                detectionCount > 0 ? "bg-amber-500" : "bg-green-500"
              )} />
              <span>
                Detections: {detectionCount > 0 ? 
                  `${detectionCount} pending` : 
                  "None"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Encryption: Ready</span>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-2">
            <Button className="w-full text-xs h-8 bg-ts-purple-500 hover:bg-ts-purple-600">
              View Dashboard
            </Button>
            <Button variant="outline" className="w-full text-xs h-8">
              Pause
            </Button>
          </div>
        </Card>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className={cn(
              "h-10 w-10 rounded-full shadow-lg", 
              detectionCount > 0 ? "animate-pulse-glow" : "",
              !isExpanded && "bg-ts-purple-500 text-white hover:bg-ts-purple-600 hover:text-white"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {detectionCount > 0 ? (
              <ShieldAlert className="h-5 w-5" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem>
            View Detections
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            Exit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SystemTray;
