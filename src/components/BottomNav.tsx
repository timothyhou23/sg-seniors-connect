import { Mic, Search, Bookmark, Bell, Settings as Cog } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const getCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-primary" : "text-muted-foreground";
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur safe-bottom">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center py-2">
        <NavLink to="/home" className={getCls}>
          <div className="flex flex-col items-center text-xs">
            <Search className="h-6 w-6" />
            <span>Home</span>
          </div>
        </NavLink>
        <NavLink to="/search" className={getCls}>
          <div className="flex flex-col items-center text-xs">
            <Search className="h-6 w-6" />
            <span>Search</span>
          </div>
        </NavLink>
        <button aria-label="Voice" className="mx-auto rounded-full h-14 w-14 -mt-8 bg-gradient-primary text-primary-foreground shadow-glow animate-float">
          <Mic className="h-6 w-6 mx-auto" />
        </button>
        <NavLink to="/saved" className={getCls}>
          <div className="flex flex-col items-center text-xs">
            <Bookmark className="h-6 w-6" />
            <span>Saved</span>
          </div>
        </NavLink>
        <NavLink to="/settings" className={getCls}>
          <div className="flex flex-col items-center text-xs">
            <Cog className="h-6 w-6" />
            <span>Settings</span>
          </div>
        </NavLink>
      </div>
    </nav>
  );
}
