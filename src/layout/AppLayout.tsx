import BottomNav from "@/components/BottomNav";
import MicButton from "@/components/MicButton";
import backgroundPattern from "@/assets/background-pattern.jpg";

export default function AppLayout({ children, title, subtitle }: { children: React.ReactNode; title?: string; subtitle?: string; }) {
  return (
    <div className="min-h-screen relative">
      {/* Layered Background with Depth */}
      <div 
        className="fixed inset-0 opacity-8 pointer-events-none"
        style={{
          backgroundImage: `url(${backgroundPattern})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      <div className="fixed inset-0 bg-gradient-depth pointer-events-none"></div>
      <div className="fixed inset-0 texture-grain pointer-events-none"></div>
      <div className="fixed inset-0 texture-subtle pointer-events-none"></div>
      <div className="relative bg-gradient-to-b from-background/90 via-background/95 to-background/98 min-h-screen">
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
