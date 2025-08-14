import AppLayout from "@/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Bell } from "lucide-react";
import { useAppState } from "@/context/AppState";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFeed } from "@/hooks/useFeed";
import { useToast } from "@/hooks/use-toast";
import benefitsIcon from "@/assets/benefits-icon.jpg";
import eventsIcon from "@/assets/events-icon.jpg";

const TABS = ["All", "Benefits", "Events"] as const;

type Tab = typeof TABS[number];

export default function Home() {
  const { bookmarks, toggleBookmark, addReminder } = useAppState();
  const { feed, loading, error, refreshFeed } = useFeed();
  const [tab, setTab] = useState<Tab>("All");
  const { toast } = useToast();
  useEffect(() => { document.title = "SeniorGo SG — Home"; }, []);

  const list = useMemo(() => feed.filter(i => tab === "All" || (tab === "Benefits" && i.type === "benefit") || (tab === "Events" && i.type === "event")), [feed, tab]);

  if (loading) {
    return (
      <AppLayout title="Eh hello! What can I help you with?" subtitle="Try: events near Bishan this weekend">
        <div className="flex justify-center items-center py-8">
          <div className="text-muted-foreground">Loading fresh content...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Eh hello! What can I help you with?" subtitle="Try: events near Bishan this weekend">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Oops! Had trouble loading content.</p>
          <Button onClick={refreshFeed} variant="outline">Try Again</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="My Lobang Kaki" subtitle="Try: events near Bishan this weekend">
      {/* Hero Image Section */}
      <div className="relative mb-6 -mx-4 rounded-lg overflow-hidden shadow-elegant">
        <div className="relative">
          <img 
            src="/lovable-uploads/f530809c-81ed-45c4-9630-e16ee2396333.png" 
            alt="Multicultural Singapore seniors sharing a meal together" 
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
          <div className="absolute inset-0 texture-grain opacity-20"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-white text-lg font-semibold drop-shadow-lg">Your Singapore Community Hub</h2>
          <p className="text-white/90 text-sm drop-shadow-md">Discover benefits and events crafted for you</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
              tab === t 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {t === "Benefits" && (
              <img src={benefitsIcon} alt="" className="w-4 h-4 rounded-full" />
            )}
            {t === "Events" && (
              <img src={eventsIcon} alt="" className="w-4 h-4 rounded-full" />
            )}
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map(item => (
          <Card key={item.id} className="overflow-hidden card-texture border-l-4 border-l-primary/30 hover:border-l-primary hover:shadow-glow transition-all duration-300">
            {/* Enhanced Card Header with Image */}
            <div className="relative">
              <div className="h-20 bg-gradient-to-r from-primary/8 to-accent/8 relative overflow-hidden">
                <img 
                  src={item.type === 'benefit' ? benefitsIcon : eventsIcon} 
                  alt={`${item.type} illustration`}
                  className="absolute right-3 top-3 w-12 h-12 object-cover rounded-lg opacity-60 shadow-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent"></div>
                <div className="absolute bottom-2 right-2">
                  <span className={`text-xs px-2 py-1 rounded-full shadow-sm ${
                    item.eligibility === 'ELIGIBLE' ? 'badge-success' : 
                    item.eligibility === 'MAYBE' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {item.eligibility === 'ELIGIBLE' ? '✓ Eligible' :
                     item.eligibility === 'MAYBE' ? '? Maybe' : '✗ Not Eligible'}
                  </span>
                </div>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">{item.summary}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {item.type === 'event' && (
                <p className="text-sm text-muted-foreground mb-2">{(item as any).event_date && new Date((item as any).event_date).toLocaleString()} • {item.venue?.name} {item.distanceKm?`• ${item.distanceKm}km`:''}</p>
              )}
              <div className="flex gap-2 flex-wrap">
                <Link to={`/details/${item.type}/${item.id}`}>
                  <Button size="sm" variant="hero">View Details</Button>
                </Link>
                <Button size="sm" variant="outline" onClick={() => toggleBookmark(item.id)}>
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">{bookmarks.includes(item.id) ? 'Saved' : 'Save'}</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    const url = `${window.location.origin}/details/${item.type}/${item.id}`;
                    if (navigator.share) {
                      navigator.share({ 
                        title: item.title, 
                        text: item.summary, 
                        url: url 
                      });
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard?.writeText(`${item.title} - ${item.summary} ${url}`)
                        .then(() => {
                          toast({
                            title: "Link copied!",
                            description: "Link copied to clipboard"
                          });
                        })
                        .catch(() => {
                          // Final fallback: just open the URL
                          window.open(url, '_blank');
                        });
                    }
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Share</span>
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  addReminder({
                    itemId: item.id,
                    itemType: item.type,
                    title: `Reminder: ${item.title}`,
                    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                  });
                  // Show feedback
                  toast({
                    title: "Reminder set!",
                    description: "You'll be reminded tomorrow"
                  });
                }}>
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Remind</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
