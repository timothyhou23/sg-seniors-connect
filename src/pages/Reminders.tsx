import AppLayout from "@/layout/AppLayout";
import { useAppState } from "@/context/AppState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Reminders() {
  const { reminders, removeReminder } = useAppState();

  return (
    <AppLayout title="Reminders">
      <div className="space-y-3">
        {reminders.map(r => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="text-lg">{r.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{new Date(r.scheduledAt).toLocaleString()}</p>
              <Button size="sm" variant="outline" onClick={()=>removeReminder(r.id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
        {reminders.length === 0 && <p className="text-muted-foreground">No reminders yet.</p>}
      </div>
    </AppLayout>
  );
}
