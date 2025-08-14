import AppLayout from "@/layout/AppLayout";
import { useAppState } from "@/context/AppState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFeed } from "@/hooks/useFeed";

export default function Saved() {
  const { bookmarks, toggleBookmark } = useAppState();
  const { feed } = useFeed();
  const items = feed.filter(i => bookmarks.includes(i.id));

  return (
    <AppLayout title="Saved">
      <div className="space-y-3">
        {items.map(i => (
          <Card key={i.id}>
            <CardHeader>
              <CardTitle className="text-lg">{i.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link to={`/details/${i.type}/${i.id}`}><Button size="sm" variant="hero">View</Button></Link>
              <Button size="sm" variant="outline" onClick={()=>toggleBookmark(i.id)}>Remove</Button>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-muted-foreground">Nothing saved yet.</p>}
      </div>
    </AppLayout>
  );
}
