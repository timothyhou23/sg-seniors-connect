import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MicButton({ size = 64 }: { size?: number }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const nav = useNavigate();

  useEffect(() => {
    // Web Speech API availability
    console.log('Checking speech recognition support');
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    console.log('Speech Recognition available:', !!SR);
    if (SR) {
      setSupported(true);
      const r = new SR();
      r.lang = "en-SG";
      r.interimResults = true;
      r.maxAlternatives = 1;
      r.onresult = (e: any) => {
        console.log('Speech recognition result:', e.results);
        const last = e.results[e.results.length - 1];
        if (last.isFinal) {
          const transcript = last[0].transcript;
          console.log('Final transcript:', transcript);
          nav(`/search?q=${encodeURIComponent(transcript)}`);
          setListening(false);
          r.stop();
        }
      };
      r.onerror = (e: any) => {
        console.error('Speech recognition error:', e.error);
        setListening(false);
      };
      r.onend = () => {
        console.log('Speech recognition ended');
        setListening(false);
      };
      recognitionRef.current = r;
    }
  }, [nav]);

  const toggle = () => {
    const r = recognitionRef.current;
    if (!r) return;
    if (listening) {
      r.stop();
      setListening(false);
    } else {
      try {
        console.log('Starting speech recognition');
        r.start();
        setListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  if (!supported)
    return (
      <Button variant="hero" className="rounded-full h-14 w-14 p-0" onClick={() => nav("/search")}> 
        <Mic className="h-6 w-6" />
      </Button>
    );

  return (
    <button
      aria-label={listening ? "Stop listening" : "Start voice"}
      onClick={toggle}
      className={`rounded-full flex items-center justify-center text-primary-foreground shadow-glow ${
        listening ? "bg-accent animate-pulse-glow" : "bg-gradient-primary"
      }`}
      style={{ width: size, height: size }}
    >
      {listening ? <Square className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
    </button>
  );
}
