import { useEffect, useState, useCallback } from "react";
import { useXP } from "@/src/context/XPContext";

export default function VoiceGreeting() {
  const { currentRank } = useXP();
  const [hasPlayed, setHasPlayed] = useState(false);

  const speakGreeting = useCallback(() => {
    if (hasPlayed) return;

    // Extract name from context or hardcode as requested
    const name = "Rohan";
    const text = `Welcome back ${name}, you are a ${currentRank.name}`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    
    const findVoice = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      return availableVoices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))) || 
             availableVoices.find(v => v.lang.startsWith('en')) || 
             availableVoices[0];
    };

    const voice = findVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
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
