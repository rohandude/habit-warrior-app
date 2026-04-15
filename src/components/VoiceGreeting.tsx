import { useEffect, useState, useCallback, useRef } from "react";
import { useXP } from "@/src/context/XPContext";
import { useAudioManager } from "@/src/context/AudioManagerContext";

export default function VoiceGreeting() {
  const { currentRank } = useXP();
  const { speak } = useAudioManager();
  const [hasPlayed, setHasPlayed] = useState(false);

  const speakGreeting = useCallback(() => {
    if (hasPlayed) return;

    const name = "Rohan";
    const text = `Welcome back ${name}, you are a ${currentRank.name}`;
    
    speak(text);
    setHasPlayed(true);
  }, [currentRank.name, hasPlayed, speak]);

  useEffect(() => {
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
