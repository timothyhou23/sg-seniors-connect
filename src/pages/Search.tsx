import AppLayout from "@/layout/AppLayout";
import MicButton from "@/components/MicButton";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/context/AppState";
import { useFeed } from "@/hooks/useFeed";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchPage() {
  const q = useQuery();
  const [text, setText] = useState(q.get("q") ?? "");
  const { feed } = useFeed();
  const nav = useNavigate();

  useEffect(() => { 
    document.title = "SeniorGo SG — Search"; 
    // Update text when URL query changes
    const urlQuery = q.get("q");
    if (urlQuery && urlQuery !== text) {
      setText(urlQuery);
    }
  }, [q.get("q")]);

  const results = useMemo(() => {
    if (!text.trim()) return [] as typeof feed;
    const s = text.toLowerCase().trim();
    console.log('Searching for:', s);
    console.log('Feed data:', feed);
    const filtered = feed.filter(i => 
      i.title.toLowerCase().includes(s) || 
      i.summary.toLowerCase().includes(s)
    );
    console.log('Search results:', filtered);
    return filtered;
  }, [text, feed]);

  return (
    <AppLayout title="Search" subtitle="Speak or type in your lingo lah">
      <div className="flex gap-2 mb-3">
        <Input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="Try: events near Bishan" 
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              nav(`/search?q=${encodeURIComponent(text)}`);
            }
          }}
        />
        <Button onClick={() => nav(`/search?q=${encodeURIComponent(text)}`)}>Search</Button>
      </div>
      <div className="flex gap-2 mb-4">
        <Button size="sm" variant="outline" onClick={()=>setText("events near me this weekend")}>This weekend</Button>
        <Button size="sm" variant="outline" onClick={()=>setText("free events nearby")}>Free nearby</Button>
        <Button size="sm" variant="outline" onClick={()=>setText("benefits for PR over 60")}>Benefits 60+</Button>
      </div>

      {!text && (
        <div className="flex flex-col items-center mt-8">
          <MicButton size={80} />
          <p className="text-sm text-muted-foreground mt-2">Tap to speak</p>
        </div>
      )}

      {text && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {results.length > 0 ? `Found ${results.length} results for "${text}"` : `No results found for "${text}"`}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {results.map(r => (
          <Card key={r.id} className="cursor-pointer hover:bg-accent/5" onClick={() => nav(`/details/${r.type}/${r.id}`)}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {r.title}
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  r.eligibility === 'ELIGIBLE' 
                    ? 'text-green-700 bg-green-50 border-green-200' 
                    : r.eligibility === 'MAYBE' 
                      ? 'text-amber-700 bg-amber-50 border-amber-200' 
                      : 'text-red-700 bg-red-50 border-red-200'
                }`}>
                  {r.eligibility}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{r.summary}</p>
              {r.type === 'event' && r.venue && (
                <p className="text-xs text-muted-foreground">📍 {r.venue.name} {r.distanceKm ? `• ${r.distanceKm}km away` : ''}</p>
              )}
              {r.type === 'event' && r.date && (
                <p className="text-xs text-muted-foreground">📅 {new Date(r.date).toLocaleDateString()}</p>
              )}
            </CardContent>
          </Card>
        ))}
        {results.length === 0 && text && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No results found for "{text}"</p>
            <p className="text-sm text-muted-foreground">Try different keywords or browse all content</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
