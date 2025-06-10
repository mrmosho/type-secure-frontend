import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Bell, User, Settings, LogOut, X, Check, AlertTriangle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type SecurityStatus = 'Protected' | 'Warning' | 'At Risk';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface TopBarProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ theme: propTheme, toggleTheme: propToggleTheme }) => {
  const { theme, setTheme } = useTheme();
  const [securityStatus, setSecurityStatus] = React.useState<SecurityStatus>('Protected');
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Encryption Complete',
      message: 'Successfully encrypted 3 items in customer_data.xlsx',
      timestamp: new Date(),
      read: false,
      type: 'success'
    },
    {
      id: '2',
      title: 'New Detection',
      message: 'Found potential sensitive data in uploaded files',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      type: 'warning'
    },
    {
      id: '3',
      title: 'System Update',
      message: 'TypeSecure was updated to version 1.2.0',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
      type: 'info'
    }
  ]);
  
  const getStatusColor = () => {
    switch (securityStatus) {
      case 'Protected':
        return 'bg-green-500';
      case 'Warning':
        return 'bg-yellow-500';
      case 'At Risk':
        return 'bg-red-500';
      default:
        return 'bg-green-500';
    }
  };

  const handleToggleTheme = () => {
    if (propToggleTheme) {
      propToggleTheme();
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  const currentTheme = propTheme || theme;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateToSettings = () => {
    navigate('/settings');
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'TS';

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    toast({
      title: "All notifications marked as read",
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    
    toast({
      title: "All notifications cleared",
    });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="h-16 border-b flex items-center justify-between px-4 bg-background relative z-40">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
          <Badge variant="outline" className="text-xs font-medium">
            {securityStatus}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleToggleTheme}
          className="p-2 rounded-full hover:bg-muted"
          aria-label="Toggle theme"
        >
          {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-muted relative" aria-label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 z-50">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              {notifications.length > 0 && (
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    disabled={!unreadCount}
                    className="text-xs h-7"
                  >
                    Mark all read
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearNotifications}
                    className="text-xs text-destructive hover:text-destructive h-7"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {notifications.length > 0 ? (
              <ScrollArea className="h-[300px]">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 relative ${!notification.read ? 'bg-muted/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-1" />
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm cursor-pointer hover:bg-primary/90 transition-colors">
              {userInitials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 z-50">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={navigateToDashboard}>
              <User className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={navigateToSettings}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopBar;
