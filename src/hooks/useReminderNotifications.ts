import { useEffect } from 'react';
import { useAppState } from '@/context/AppState';
import { useToast } from '@/hooks/use-toast';

export function useReminderNotifications() {
  const { reminders, removeReminder } = useAppState();
  const { toast } = useToast();

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.scheduledAt);
        
        // Check if reminder time has passed and is within the last minute
        if (reminder.status === 'scheduled' && reminderTime <= now && (now.getTime() - reminderTime.getTime()) < 60000) {
          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('SeniorGo Reminder', {
              body: reminder.title,
              icon: '/favicon.ico',
              tag: reminder.id,
            });
          }
          
          // Show toast
          toast({
            title: "🔔 Reminder Alert!",
            description: reminder.title,
            duration: 10000, // 10 seconds
          });

          // Play notification sound
          try {
            const audio = new Audio('data:audio/wav;base64,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');
            audio.play().catch(() => {
              // Silent fail if audio doesn't play
            });
          } catch {
            // Silent fail if audio creation fails
          }
        }
      });
    };

    // Check reminders every 30 seconds
    const interval = setInterval(checkReminders, 30000);
    
    // Also check immediately
    checkReminders();

    return () => clearInterval(interval);
  }, [reminders, toast, removeReminder]);

  // Request notification permission on first use
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
}