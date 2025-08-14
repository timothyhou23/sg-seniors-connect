import BottomNav from "@/components/BottomNav";
import MicButton from "@/components/MicButton";
import backgroundPattern from "@/assets/background-pattern.jpg";

export default function AppLayout({ children, title, subtitle }: { children: React.ReactNode; title?: string; subtitle?: string; }) {
  return (
    <div className="min-h-screen relative">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url(${backgroundPattern})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      <div className="relative bg-gradient-to-b from-background/95 via-background/98 to-background min-h-screen">
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
    </div>
  );
}
