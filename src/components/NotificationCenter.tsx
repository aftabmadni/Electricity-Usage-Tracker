import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Notification } from '../lib/types';
import { Bell, CreditCard, Brain, AlertTriangle, Trophy, CheckCheck, X } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { formatRelativeTime } from '../lib/formatters';
import { Badge } from './ui/badge';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate?: (path: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigate
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment':
        return CreditCard;
      case 'insight':
        return Brain;
      case 'alert':
        return AlertTriangle;
      case 'achievement':
        return Trophy;
      default:
        return Bell;
    }
  };

  const getColorScheme = (type: Notification['type']) => {
    switch (type) {
      case 'payment':
        return {
          bg: 'bg-green-50',
          icon: 'text-green-600',
          border: 'border-green-200'
        };
      case 'insight':
        return {
          bg: 'bg-purple-50',
          icon: 'text-purple-600',
          border: 'border-purple-200'
        };
      case 'alert':
        return {
          bg: 'bg-red-50',
          icon: 'text-red-600',
          border: 'border-red-200'
        };
      case 'achievement':
        return {
          bg: 'bg-yellow-50',
          icon: 'text-yellow-600',
          border: 'border-yellow-200'
        };
      default:
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          border: 'border-blue-200'
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.link && onNavigate) {
      onNavigate(notification.link);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </DialogTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="h-8 text-xs gap-1"
              >
                <CheckCheck size={14} />
                Mark all read
              </Button>
            )}
          </div>
          <DialogDescription>
            Stay updated with your electricity usage and insights
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] px-6 pb-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-600">No notifications yet</p>
              <p className="text-xs text-gray-500 mt-1">
                We'll notify you about important updates
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                const colors = getColorScheme(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      notification.read
                        ? 'bg-white border-gray-200 hover:bg-gray-50'
                        : `${colors.bg} ${colors.border} hover:opacity-80`
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`text-sm font-medium ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notification.id);
                              }}
                              className="p-1 hover:bg-white rounded transition-colors"
                              aria-label="Mark as read"
                            >
                              <X size={14} className="text-gray-500" />
                            </button>
                          )}
                        </div>
                        <p className={`text-sm ${
                          notification.read ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                          {notification.link && (
                            <span className="text-xs text-blue-600 hover:underline">
                              View →
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>
                {unreadCount === 0 ? 'All caught up!' : `${unreadCount} unread`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
