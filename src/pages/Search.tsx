import AppLayout from "@/layout/AppLayout";
import MicButton from "@/components/MicButton";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/context/AppState";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchPage() {
  const q = useQuery();
  const [text, setText] = useState(q.get("q") ?? "");
  const { feed } = useAppState();
  const nav = useNavigate();

  useEffect(() => { document.title = "SeniorGo SG — Search"; }, []);

  const results = useMemo(() => {
    if (!text) return [] as typeof feed;
    const s = text.toLowerCase();
    return feed.filter(i => i.title.toLowerCase().includes(s) || i.summary.toLowerCase().includes(s));
  }, [text, feed]);

  return (
    <AppLayout title="Search" subtitle="Speak or type in your lingo lah">
      <div className="flex gap-2 mb-3">
        <Input value={text} onChange={e=>setText(e.target.value)} placeholder="Try: events near Bishan" className="flex-1" />
        <Button onClick={()=> nav(`/search?q=${encodeURIComponent(text)}`)}>Search</Button>
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

      <div className="space-y-3">
        {results.map(r => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="text-lg">{r.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{r.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
