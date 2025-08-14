import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "zh" | "ms" | "ta";

type Permissions = {
  location: boolean;
  notifications: boolean;
  mic: boolean;
};

type Accessibility = {
  fontScale: number; // 1 to 2
  highContrast: boolean;
};

export type ItemType = "benefit" | "event";

export type FeedItem = {
  id: string;
  type: ItemType;
  title: string;
  summary: string;
  date?: string; // for events
  venue?: { name: string; address: string };
  eligibility?: "ELIGIBLE" | "MAYBE" | "INELIGIBLE";
  distanceKm?: number;
};

type Reminder = {
  id: string;
  itemId?: string;
  itemType?: ItemType | "custom";
  title: string;
  scheduledAt: string; // ISO
  status: "scheduled" | "sent" | "cancelled";
};

type AppState = {
  lang: Language;
  accessibility: Accessibility;
  permissions: Permissions;
  bookmarks: string[]; // item ids
  reminders: Reminder[];
  setLang: (l: Language) => void;
  setAccessibility: (a: Partial<Accessibility>) => void;
  setPermissions: (p: Partial<Permissions>) => void;
  toggleBookmark: (id: string) => void;
  addReminder: (r: Omit<Reminder, "id" | "status">) => void;
  removeReminder: (id: string) => void;
};

const AppStateContext = createContext<AppState | null>(null);

const STORAGE_KEY = "seniorgo_app_state_v1";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [accessibility, setAccessibilityState] = useState<Accessibility>({ fontScale: 1, highContrast: false });
  const [permissions, setPermissionsState] = useState<Permissions>({ location: false, notifications: false, mic: false });
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // load
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.lang) setLangState(parsed.lang);
        if (parsed.accessibility) setAccessibilityState(parsed.accessibility);
        if (parsed.permissions) setPermissionsState(parsed.permissions);
        if (parsed.bookmarks) setBookmarks(parsed.bookmarks);
        if (parsed.reminders) setReminders(parsed.reminders);
      } catch {}
    }
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lang, accessibility, permissions, bookmarks, reminders })
    );
    document.body.classList.toggle("high-contrast", accessibility.highContrast);
    document.documentElement.style.setProperty("--font-scale", String(accessibility.fontScale));
  }, [lang, accessibility, permissions, bookmarks, reminders]);

  const setLang = (l: Language) => setLangState(l);
  const setAccessibility = (a: Partial<Accessibility>) => setAccessibilityState(prev => ({ ...prev, ...a }));
  const setPermissions = (p: Partial<Permissions>) => setPermissionsState(prev => ({ ...prev, ...p }));
  const toggleBookmark = (id: string) => setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  const addReminder = (r: Omit<Reminder, "id" | "status">) => setReminders(prev => [{ id: crypto.randomUUID(), status: "scheduled", ...r }, ...prev]);
  const removeReminder = (id: string) => setReminders(prev => prev.filter(r => r.id !== id));

  const value = useMemo<AppState>(() => ({
    lang, accessibility, permissions, bookmarks, reminders,
    setLang, setAccessibility, setPermissions, toggleBookmark, addReminder, removeReminder,
  }), [lang, accessibility, permissions, bookmarks, reminders]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
