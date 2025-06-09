
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText, Shield, ShieldAlert } from 'lucide-react';
import ConfidenceBar from './ConfidenceBar';

export type DetectionType = 'financial' | 'personal' | 'health' | 'password';

export interface Detection {
  id: string;
  timestamp: string;
  path: string;
  type: DetectionType;
  content: string;
  confidence: number;
  encrypted: boolean;
  source?: string; // Added to match usage in MonitoringPanel
  value?: string; // Added to match usage in MonitoringPanel
}

interface DetectionItemProps {
  detection: Detection;
  onEncrypt?: (id: string) => void;
  onView?: (detection: Detection) => void;
  onIgnore?: (id: string) => void; // Added this prop
}

const DetectionItem: React.FC<DetectionItemProps> = ({
  detection,
  onEncrypt,
  onView,
  onIgnore,
}) => {
  const { id, timestamp, path, type, confidence, encrypted } = detection;
  
  const getTypeColor = () => {
    switch (type) {
      case 'financial':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'personal':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'health':
        return 'bg-green-500 hover:bg-green-600';
      case 'password':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-slate-500 hover:bg-slate-600';
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const handleEncrypt = () => {
    if (onEncrypt) {
      onEncrypt(id);
    }
  };
  
  const handleView = () => {
    if (onView) {
      onView(detection);
    }
  };
  
  const handleIgnore = () => {
    if (onIgnore) {
      onIgnore(id);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium truncate max-w-[200px]">{path}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatTimestamp(timestamp)}
          </div>
        </div>
        <Badge className={`${getTypeColor()} text-white`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      </div>
      
      <div className="mb-3">
        <ConfidenceBar value={confidence} />
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          className="text-xs flex items-center space-x-1 text-muted-foreground hover:text-foreground"
          onClick={handleView}
        >
          <Eye className="h-3 w-3" />
          <span>View</span>
        </button>
        
        {!encrypted ? (
          <div className="flex space-x-3">
            <button 
              className="text-xs flex items-center space-x-1 text-muted-foreground hover:text-foreground"
              onClick={handleEncrypt}
            >
              <ShieldAlert className="h-3 w-3" />
              <span>Encrypt</span>
            </button>
            
            {onIgnore && (
              <button 
                className="text-xs flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                onClick={handleIgnore}
              >
                <span>Ignore</span>
              </button>
            )}
          </div>
        ) : (
          <div className="text-xs flex items-center space-x-1 text-green-500">
            <Shield className="h-3 w-3" />
            <span>Encrypted</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectionItem;
