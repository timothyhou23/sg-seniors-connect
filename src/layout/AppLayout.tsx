import BottomNav from "@/components/BottomNav";
import MicButton from "@/components/MicButton";

export default function AppLayout({ children, title, subtitle }: { children: React.ReactNode; title?: string; subtitle?: string; }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(60%_40%_at_50%_-10%,hsl(var(--accent)/0.15),transparent)]">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-xl font-semibold">{title ?? "SeniorGo SG"}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </header>
      <main className="max-w-md mx-auto pb-24 px-4 pt-4">
        {children}
      </main>
      <div className="fixed bottom-16 right-4">
        <MicButton />
      </div>
      <BottomNav />
    </div>
  );
}
