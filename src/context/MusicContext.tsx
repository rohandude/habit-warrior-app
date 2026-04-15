import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface MusicContextType {
  isPlaying: boolean;
  volume: number;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cinematic dark ambient track
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0; // Start at 0 for fade-in
    audioRef.current.onerror = (e) => console.error("Music audio error:", e);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const setVolume = (newVolume: number) => {
    const safeVolume = isNaN(newVolume) ? 0.5 : Math.max(0, Math.min(1, newVolume));
    setVolumeState(safeVolume);
    if (audioRef.current) {
      try {
        audioRef.current.volume = safeVolume;
      } catch (e) {
        console.error("Failed to set volume:", e);
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    } else {
      setIsPlaying(true);
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay prevented or audio error:", error);
          setIsPlaying(false);
        });
      }
      
      // Fade in logic
      let currentFadeVol = 0;
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      
      const targetVolume = isNaN(volume) ? 0.5 : volume;
      
      fadeIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          currentFadeVol += 0.05;
          if (currentFadeVol >= targetVolume) {
            audioRef.current.volume = targetVolume;
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          } else {
            try {
              audioRef.current.volume = Math.min(1, Math.max(0, currentFadeVol));
            } catch (e) {
              if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            }
          }
        }
      }, 100);
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, volume, togglePlay, setVolume }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
