import { useEffect, useState, useCallback, useRef } from "react";
import { useXP } from "@/src/context/XPContext";

export default function VoiceGreeting() {
  const { currentRank } = useXP();
  const [hasPlayed, setHasPlayed] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speakGreeting = useCallback(() => {
    if (hasPlayed) return;

    // Extract name from context or hardcode as requested
    const name = "Rohan";
    const text = `Welcome back ${name}, you are a ${currentRank.name}`;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    
    const findVoice = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      return availableVoices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))) || 
             availableVoices.find(v => v.lang.startsWith('en')) || 
             availableVoices[0];
    };

    const voice = findVoice();
    if (voice) {
      utteranceRef.current.voice = voice;
    }

    utteranceRef.current.rate = 0.95;
    utteranceRef.current.pitch = 1;

    utteranceRef.current.onend = () => {
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utteranceRef.current);
    setHasPlayed(true);
  }, [currentRank.name, hasPlayed]);

  useEffect(() => {
    // Handle voices loading asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = speakGreeting;
    }

    // Attempt to speak on mount
    speakGreeting();

    // Interaction fallback for browser autoplay policies
    const handleInteraction = () => {
      speakGreeting();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [speakGreeting]);

  return null;
}
