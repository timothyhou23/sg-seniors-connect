import { useEffect, useRef, useState } from "react";
import { Mic, Square, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function MicButton({ size = 64 }: { size?: number }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const nav = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for speech recognition support
    console.log('Checking speech recognition support');
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    console.log('Speech Recognition available:', !!SR);
    
    if (SR) {
      setSupported(true);
      const r = new SR();
      r.lang = "en-SG";
      r.interimResults = true;
      r.maxAlternatives = 1;
      r.continuous = false;
      
      r.onresult = (e: any) => {
        console.log('Speech recognition result:', e.results);
        const last = e.results[e.results.length - 1];
        if (last.isFinal) {
          const transcript = last[0].transcript.trim();
          console.log('Final transcript:', transcript);
          if (transcript) {
            nav(`/search?q=${encodeURIComponent(transcript)}`);
            toast({
              title: "Search query captured",
              description: `Searching for: "${transcript}"`,
            });
          }
          setListening(false);
          r.stop();
        }
      };
      
      r.onerror = (e: any) => {
        console.error('Speech recognition error:', e.error);
        setListening(false);
        
        if (e.error === 'audio-capture') {
          toast({
            title: "Microphone access needed",
            description: "Please allow microphone access to use voice search",
            variant: "destructive",
          });
          setPermissionGranted(false);
        } else if (e.error === 'not-allowed') {
          toast({
            title: "Permission denied",
            description: "Microphone permission was denied. Please enable it in browser settings.",
            variant: "destructive",
          });
          setPermissionGranted(false);
        } else {
          toast({
            title: "Voice recognition error",
            description: "Please try again or use text search",
            variant: "destructive",
          });
        }
      };
      
      r.onend = () => {
        console.log('Speech recognition ended');
        setListening(false);
      };
      
      recognitionRef.current = r;
    }
  }, [nav, toast]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately, we just needed permission
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      setPermissionGranted(false);
      toast({
        title: "Microphone access required",
        description: "Please allow microphone access to use voice search",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggle = async () => {
    const r = recognitionRef.current;
    if (!r) return;

    if (listening) {
      r.stop();
      setListening(false);
      return;
    }

    // Check microphone permission first
    if (!permissionGranted) {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) return;
    }

    try {
      console.log('Starting speech recognition');
      r.start();
      setListening(true);
      toast({
        title: "Listening...",
        description: "Speak your search query now",
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setListening(false);
      toast({
        title: "Voice search unavailable",
        description: "Please try again or use text search",
        variant: "destructive",
      });
    }
  };

  if (!supported) {
    return (
      <Button 
        variant="fab"
        onClick={() => nav("/search")}
        style={{ width: size, height: size }}
      > 
        <Mic className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <button
      aria-label={listening ? "Stop listening" : "Start voice search"}
      onClick={toggle}
      className={`rounded-full flex items-center justify-center text-primary-foreground shadow-glow transition-all duration-200 ${
        listening 
          ? "bg-accent animate-pulse" 
          : permissionGranted === false 
            ? "bg-destructive" 
            : "bg-gradient-primary hover:opacity-90"
      }`}
      style={{ width: size, height: size }}
    >
      {listening ? (
        <Square className="h-7 w-7" />
      ) : permissionGranted === false ? (
        <MicOff className="h-7 w-7" />
      ) : (
        <Mic className="h-7 w-7" />
      )}
    </button>
  );
}
