/**
 * NotificationsScreen
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { EmptyState } from '../../components/ui/Card';
import { db } from '../../mock/db';

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: string;
}

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const data = db.get<Notification[]>('notifications') ?? [];
    setNotifications(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, []);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    db.set('notifications', updated);
    setNotifications(updated);
  };

  const markRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    db.set('notifications', updated);
    setNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const typeIcon: Record<string, string> = {
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
    error: '!',
  };

  const typeColor: Record<string, string> = {
    success: 'bg-success/10 text-success',
    info: 'bg-primary-light text-primary',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Notifications" showBack />
      <ScreenContainer className="pt-4 gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-body-sm text-text-secondary">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1 text-primary text-body-sm font-semibold hover:underline">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={28} />}
            title="No notifications"
            description="You have no notifications yet. We'll let you know when something happens."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((notif, i) => (
              <motion.button
                key={notif.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => markRead(notif.id)}
                className={[
                  'w-full rounded-lg border p-4 text-left flex items-start gap-3 transition-all',
                  notif.read ? 'bg-white border-border' : 'bg-primary-light border-primary/20',
                ].join(' ')}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${typeColor[notif.type] ?? typeColor.info}`}>
                  {typeIcon[notif.type] ?? 'ℹ'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-body font-semibold ${notif.read ? 'text-text-primary' : 'text-primary'}`}>
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" aria-label="Unread" />
                    )}
                  </div>
                  <p className="text-body-sm text-text-secondary mt-0.5">{notif.body}</p>
                  <p className="text-xs text-text-secondary/60 mt-1">{formatTime(notif.timestamp)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </ScreenContainer>
    </div>
  );
}
