import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import type { UserNotification } from "@shared/schema";

export function NotificationBanner() {
  const [, setLocation] = useLocation();
  
  const { data: notifications = [] } = useQuery<UserNotification[]>({
    queryKey: ['/api/notifications'],
    refetchInterval: 30000, // Poll every 30 seconds
  });

  const dismissMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest('PATCH', `/api/notifications/${notificationId}/dismiss`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest('PATCH', `/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  // Show max 3 notifications
  const visibleNotifications = notifications.slice(0, 3);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" data-testid="icon-notification-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" data-testid="icon-notification-warning" />;
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-red-500" data-testid="icon-notification-urgent" />;
      case 'feature':
        return <Sparkles className="h-5 w-5 text-purple-500" data-testid="icon-notification-feature" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" data-testid="icon-notification-info" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-amber-500';
      case 'urgent':
        return 'border-l-red-500';
      case 'feature':
        return 'border-l-purple-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const handleAction = (notification: UserNotification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }
    if (notification.actionUrl) {
      setLocation(notification.actionUrl);
    }
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed top-16 left-0 right-0 z-40 flex flex-col items-center gap-2 px-4 pointer-events-none"
      data-testid="notification-container"
    >
      <div className="w-full max-w-7xl flex flex-col gap-2">
        {visibleNotifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`
              pointer-events-auto
              bg-background/95 backdrop-blur-md
              border border-l-4 ${getBorderColor(notification.type)}
              rounded-lg shadow-lg
              p-4
              flex items-start gap-3
              animate-in slide-in-from-top-2 duration-150
              ${notification.isRead ? 'opacity-70' : 'opacity-100'}
            `}
            style={{ animationDelay: `${index * 50}ms` }}
            data-testid={`notification-banner-${notification.id}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm" data-testid={`notification-title-${notification.id}`}>
                {notification.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1" data-testid={`notification-message-${notification.id}`}>
                {notification.message}
              </p>

              {notification.actionUrl && notification.actionLabel && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => handleAction(notification)}
                  data-testid={`button-notification-action-${notification.id}`}
                >
                  {notification.actionLabel}
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-6 w-6"
              onClick={() => dismissMutation.mutate(notification.id)}
              data-testid={`button-dismiss-notification-${notification.id}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
