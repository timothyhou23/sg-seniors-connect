import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  useEffect(() => {
    document.title = "SeniorGo SG — Welcome";
    const t = setTimeout(() => {
      // For now, jump to Home directly
      window.location.replace("/home");
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <div className="text-center text-primary-foreground animate-fade-in">
        <h1 className="text-3xl font-bold">SeniorGo SG</h1>
        <p className="text-lg opacity-90 mt-2">Your friendly local guide</p>
      </div>
    </div>
  );
};

export default Splash;
