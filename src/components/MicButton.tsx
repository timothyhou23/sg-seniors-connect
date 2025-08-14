import { useEffect, useRef, useState } from "react";
import { Mic, Square, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function MicButton({ size = 64 }: { size?: number }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [permissionState, setPermissionState] = useState<'unknown' | 'granted' | 'denied'>('unknown');
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
          setPermissionState('denied');
        } else if (e.error === 'not-allowed') {
          toast({
            title: "Permission denied",
            description: "Microphone permission was denied. Please enable it in browser settings.",
            variant: "destructive",
          });
          setPermissionState('denied');
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

  const handleClick = async () => {
    console.log('Mic button clicked, current state:', { listening, supported, permissionState });
    
    // If not supported, navigate to search with helpful message
    if (!supported) {
      toast({
        title: "Voice search not available",
        description: "Using text search instead",
      });
      nav("/search");
      return;
    }

    const r = recognitionRef.current;
    if (!r) {
      toast({
        title: "Voice search not available",
        description: "Using text search instead",
      });
      nav("/search");
      return;
    }

    // If currently listening, stop
    if (listening) {
      console.log('Stopping speech recognition');
      try {
        r.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      setListening(false);
      return;
    }

    // Start recognition with better error handling
    try {
      console.log('Attempting to start speech recognition...');
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported');
      }
      
      // Request microphone permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone permission granted');
        stream.getTracks().forEach(track => track.stop());
        setPermissionState('granted');
      } catch (permError) {
        console.error('Microphone permission denied:', permError);
        setPermissionState('denied');
        toast({
          title: "Microphone access needed",
          description: "Please allow microphone access in your browser settings",
          variant: "destructive",
        });
        // Still navigate to search as fallback
        setTimeout(() => nav("/search"), 2000);
        return;
      }

      // Now start speech recognition
      r.start();
      setListening(true);
      console.log('Speech recognition started successfully');
      
      toast({
        title: "Listening...",
        description: "Speak your search query now",
      });
      
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setListening(false);
      setPermissionState('denied');
      
      toast({
        title: "Voice search unavailable",
        description: "Using text search instead",
      });
      
      // Fallback to regular search
      nav("/search");
    }
  };

  // Always render as a button that works
  return (
    <button
      aria-label={listening ? "Stop listening" : "Start voice search"}
      onClick={handleClick}
      className={`rounded-full flex items-center justify-center text-primary-foreground shadow-glow transition-all duration-200 ${
        listening 
          ? "bg-accent animate-pulse" 
          : permissionState === 'denied' 
            ? "bg-destructive" 
            : "bg-gradient-primary hover:opacity-90"
      }`}
      style={{ width: size, height: size }}
    >
      {listening ? (
        <Square className="h-7 w-7" />
      ) : permissionState === 'denied' ? (
        <MicOff className="h-7 w-7" />
      ) : (
        <Mic className="h-7 w-7" />
      )}
    </button>
  );
}
