import AppLayout from "@/layout/AppLayout";
import { useParams } from "react-router-dom";
import { useAppState } from "@/context/AppState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFeed } from "@/hooks/useFeed";

export default function Details() {
  const { type, id } = useParams();
  const { toggleBookmark, bookmarks } = useAppState();
  const { feed } = useFeed();
  const item = feed.find(i => i.id === id && i.type === type);

  if (!item) return <AppLayout title="Not found"><p>Item not found.</p></AppLayout>;

  return (
    <AppLayout title={item.title} subtitle={item.type === 'event' ? (item.date ? new Date(item.date).toLocaleString() : '') : 'Benefit details'}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <p className="text-base">{item.summary}</p>
          <div className="flex gap-2 flex-wrap">
            <Button variant="hero">{item.type === 'event' ? 'Get Directions' : 'Check Eligibility'}</Button>
            <Button variant="outline" onClick={() => toggleBookmark(item.id)}>{bookmarks.includes(item.id) ? 'Saved' : 'Save'}</Button>
            <Button variant="outline" onClick={() => navigator.share?.({ title: item.title, text: item.summary, url: window.location.href })}>Share</Button>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
