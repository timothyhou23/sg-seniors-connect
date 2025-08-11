import AppLayout from "@/layout/AppLayout";
import { useAppState, Language } from "@/context/AppState";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const { lang, setLang, accessibility, setAccessibility } = useAppState();
  return (
    <AppLayout title="Settings" subtitle="Language & Accessibility">
      <div className="space-y-6">
        <section>
          <h2 className="text-base font-semibold mb-2">Language</h2>
          <div className="grid grid-cols-4 gap-2">
            {(["en","zh","ms","ta"] as Language[]).map(l => (
              <button key={l} onClick={()=>setLang(l)} className={`px-3 py-2 rounded-full border ${lang===l?"bg-primary text-primary-foreground":"bg-secondary text-secondary-foreground"}`}>{l.toUpperCase()}</button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2">Accessibility</h2>
          <div className="flex items-center gap-3">
            <Label htmlFor="scale">Font size</Label>
            <Input id="scale" type="range" min={1} max={2} step={0.1} value={accessibility.fontScale} onChange={e=>setAccessibility({ fontScale: Number(e.target.value) })} />
            <span className="text-sm text-muted-foreground">{Math.round(accessibility.fontScale*100)}%</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <Label htmlFor="hc">High contrast</Label>
            <Switch id="hc" checked={accessibility.highContrast} onCheckedChange={v=>setAccessibility({ highContrast: v })} />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
