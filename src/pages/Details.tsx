import AppLayout from "@/layout/AppLayout";
import { useParams } from "react-router-dom";
import { useAppState } from "@/context/AppState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFeed } from "@/hooks/useFeed";
import { MapPin, Calendar, Clock, ExternalLink, Bell } from "lucide-react";

export default function Details() {
  const { type, id } = useParams();
  const { toggleBookmark, bookmarks, addReminder } = useAppState();
  const { feed } = useFeed();
  const item = feed.find(i => i.id === id && i.type === type);

  if (!item) return <AppLayout title="Not found"><p>Item not found.</p></AppLayout>;

  const handleGetDirections = () => {
    if (item.type === 'event' && item.venue?.address) {
      const encodedAddress = encodeURIComponent(item.venue.address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const handleCheckEligibility = () => {
    if (item.type === 'benefit' && (item as any).source_url) {
      window.open((item as any).source_url, '_blank');
    }
  };

  const handleAddReminder = () => {
    addReminder({
      itemId: item.id,
      itemType: item.type,
      title: `Reminder: ${item.title}`,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-SG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AppLayout title={item.title} subtitle={item.type === 'event' ? 'Event Details' : 'Benefit Details'}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={item.eligibility === 'ELIGIBLE' ? 'default' : item.eligibility === 'MAYBE' ? 'secondary' : 'destructive'}>
                {item.eligibility}
              </Badge>
              {item.type === 'event' && item.distanceKm && (
                <Badge variant="outline">{item.distanceKm} km away</Badge>
              )}
            </div>

            <p className="text-base leading-relaxed">{item.summary}</p>
            
            {/* Event-specific information */}
            {item.type === 'event' && (
              <div className="space-y-3 border-t pt-4">
                {(item as any).event_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate((item as any).event_date)}</span>
                  </div>
                )}
                {(item as any).event_date && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatTime((item as any).event_date)}</span>
                  </div>
                )}
                {item.venue && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{item.venue.name}</p>
                      <p className="text-sm text-muted-foreground">{item.venue.address}</p>
                    </div>
                  </div>
                )}
                {(item as any).organizer && (
                  <div>
                    <span className="text-sm text-muted-foreground">Organized by: </span>
                    <span className="font-medium">{(item as any).organizer}</span>
                  </div>
                )}
              </div>
            )}

            {/* Benefit-specific information */}
            {item.type === 'benefit' && (
              <div className="space-y-3 border-t pt-4">
                {(item as any).apply_deadline && (
                  <div>
                    <span className="text-sm text-muted-foreground">Application Deadline: </span>
                    <span className="font-medium">{formatDate((item as any).apply_deadline)}</span>
                  </div>
                )}
                {(item as any).categories && (item as any).categories.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">Categories: </span>
                    <div className="flex gap-1 mt-1">
                      {(item as any).categories.map((category: string) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 flex-wrap pt-4">
              {item.type === 'event' ? (
                <Button 
                  variant="hero" 
                  onClick={handleGetDirections}
                  disabled={!item.venue?.address}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              ) : (
                <Button 
                  variant="hero" 
                  onClick={handleCheckEligibility}
                  disabled={!(item as any).source_url}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Check Eligibility
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => toggleBookmark(item.id)}
              >
                {bookmarks.includes(item.id) ? 'Saved' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAddReminder}
              >
                <Bell className="h-4 w-4 mr-2" />
                Remind me
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigator.share?.({ 
                  title: item.title, 
                  text: item.summary, 
                  url: window.location.href 
                })}
              >
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
