import AppLayout from "@/layout/AppLayout";
import { useAppState } from "@/context/AppState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useReminderNotifications } from "@/hooks/useReminderNotifications";
import { useFeed } from "@/hooks/useFeed";
import { ExternalLink, Calendar, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Reminders() {
  const { reminders, removeReminder } = useAppState();
  const { feed } = useFeed();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Enable reminder notifications
  useReminderNotifications();

  const handleViewDetails = (reminder: any) => {
    if (reminder.itemId && reminder.itemType && reminder.itemType !== 'custom') {
      navigate(`/details/${reminder.itemType}/${reminder.itemId}`);
    } else {
      toast({
        title: "No details available",
        description: "This is a custom reminder without linked content.",
      });
    }
  };

  const testReminder = () => {
    toast({
      title: "🔔 Test Reminder Alert!",
      description: "This is how your reminders will appear",
      duration: 5000,
    });
    
    // Test notification if permissions are granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('SeniorGo Test Reminder', {
        body: 'This is how your reminders will appear',
        icon: '/favicon.ico',
      });
    }
  };

  const getItemTitle = (reminder: any) => {
    if (reminder.itemId && reminder.itemType && reminder.itemType !== 'custom') {
      const item = feed.find(f => f.id === reminder.itemId && f.type === reminder.itemType);
      return item ? item.title : reminder.title;
    }
    return reminder.title;
  };

  return (
    <AppLayout title="Reminders">
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            {reminders.length > 0 ? `${reminders.length} reminders set` : 'No reminders yet'}
          </p>
          <Button size="sm" variant="outline" onClick={testReminder}>
            <Bell className="h-4 w-4 mr-2" />
            Test Alert
          </Button>
        </div>
        
        {reminders.map(r => (
          <Card key={r.id} className="cursor-pointer hover:bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {getItemTitle(r)}
                <div className="flex gap-2">
                  {r.itemId && r.itemType && r.itemType !== 'custom' && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleViewDetails(r)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => removeReminder(r.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(r.scheduledAt).toLocaleString()}</span>
                <span className={`ml-auto px-2 py-1 rounded-full text-xs ${
                  r.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                  r.status === 'sent' ? 'bg-green-100 text-green-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {r.status}
                </span>
              </div>
              {r.itemId && r.itemType && r.itemType !== 'custom' && (
                <div className="mt-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs p-0 h-auto text-muted-foreground hover:text-foreground"
                    onClick={() => handleViewDetails(r)}
                  >
                    View {r.itemType} details →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {reminders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No reminders yet.</p>
            <p className="text-sm text-muted-foreground">
              Add reminders from event and benefit details pages to get notified!
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
