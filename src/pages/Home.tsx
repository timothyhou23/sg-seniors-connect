import AppLayout from "@/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Bell } from "lucide-react";
import { useAppState } from "@/context/AppState";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFeed } from "@/hooks/useFeed";

const TABS = ["All", "Benefits", "Events"] as const;

type Tab = typeof TABS[number];

export default function Home() {
  const { bookmarks, toggleBookmark } = useAppState();
  const { feed, loading, error, refreshFeed } = useFeed();
  const [tab, setTab] = useState<Tab>("All");
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
    <AppLayout title="Eh hello! What can I help you with?" subtitle="Try: events near Bishan this weekend">
      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 rounded-full border ${tab===t?"bg-primary text-primary-foreground":"bg-secondary text-secondary-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <span className={`text-xs px-2 py-1 rounded-full border ${item.eligibility === 'ELIGIBLE' ? 'text-green-700 bg-green-50' : item.eligibility === 'MAYBE' ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'}`}>
                  {item.eligibility}
                </span>
              </div>
              <CardDescription>{item.summary}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {item.type === 'event' && (
                <p className="text-sm text-muted-foreground mb-2">{item.date && new Date(item.date).toLocaleString()} • {item.venue?.name} {item.distanceKm?`• ${item.distanceKm}km`:''}</p>
              )}
              <div className="flex gap-2">
                <Link to={`/details/${item.type}/${item.id}`}>
                  <Button size="sm" variant="hero">View Details</Button>
                </Link>
                <Button size="sm" variant="outline" onClick={() => toggleBookmark(item.id)}>
                  <Bookmark className="mr-1" /> {bookmarks.includes(item.id)?'Saved':'Save'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigator.share?.({ title: item.title, text: item.summary, url: window.location.href })}>
                  <Share2 className="mr-1" /> Share
                </Button>
                <Button size="sm" variant="outline">
                  <Bell className="mr-1" /> Remind me
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
