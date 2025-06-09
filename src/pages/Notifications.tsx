
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bell, Check, ShieldAlert, Settings, Info } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  date: Date;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Sensitive Data Detected",
    message: "6 new items detected in 'customer_data.xlsx'",
    type: "alert",
    date: new Date(2025, 4, 5, 14, 32),
    isRead: false
  },
  {
    id: "2",
    title: "Encryption Complete",
    message: "4 items were successfully encrypted",
    type: "success",
    date: new Date(2025, 4, 5, 12, 45),
    isRead: false
  },
  {
    id: "3",
    title: "System Update Available",
    message: "A new version of TypeSecure is available",
    type: "info",
    date: new Date(2025, 4, 4, 9, 15),
    isRead: true
  },
  {
    id: "4",
    title: "Pattern Database Updated",
    message: "The detection pattern database has been updated",
    type: "success",
    date: new Date(2025, 4, 3, 16, 20),
    isRead: true
  },
  {
    id: "5",
    title: "High-Risk Detection",
    message: "Credit card information detected in unsecured document",
    type: "alert",
    date: new Date(2025, 4, 2, 11, 33),
    isRead: true
  }
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const clearAll = () => {
    setNotifications([]);
  };
  
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return <ShieldAlert className="h-5 w-5 text-ts-pink-500" />;
      case 'success': return <Check className="h-5 w-5 text-green-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getUnreadCount = (filter?: Notification['type']) => {
    return notifications.filter(n => !n.isRead && (!filter || n.type === filter)).length;
  };
  
  const getFilteredNotifications = (filter?: Notification['type']) => {
    return notifications.filter(n => !filter || n.type === filter);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          {getUnreadCount() > 0 && (
            <Badge className="ml-2 bg-ts-pink-500">
              {getUnreadCount()} new
            </Badge>
          )}
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.isRead)}
          >
            Mark all read
          </Button>
          <Button 
            variant="outline"
            onClick={clearAll}
            className="text-destructive hover:text-destructive"
            disabled={notifications.length === 0}
          >
            Clear all
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="relative">
            All
            {getUnreadCount() > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-ts-pink-500"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            Alerts
            {getUnreadCount('alert') > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-ts-pink-500"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="success">Success</TabsTrigger>
        </TabsList>
        
        {['all', 'alerts', 'info', 'success'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6 space-y-4">
            {getFilteredNotifications(tab === 'all' ? undefined : tab as any).length > 0 ? (
              getFilteredNotifications(tab === 'all' ? undefined : tab as any).map(notification => (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "transition-all",
                    !notification.isRead && "border-l-4 border-l-ts-purple-500"
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getIcon(notification.type)}
                        <CardTitle className="text-base">{notification.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs font-normal">
                        {notification.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{notification.message}</p>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-end gap-2">
                    {!notification.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up!
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Notifications;
