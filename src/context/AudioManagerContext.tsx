import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

interface AudioManagerContextType {
  // BGM
  isBgmPlaying: boolean;
  bgmVolume: number;
  toggleBgm: () => void;
  setBgmVolume: (volume: number) => void;
  
  // SFX
  playSfx: (url: string) => Promise<void>;
  
  // Voice (TTS)
  speak: (text: string) => void;
  isSpeaking: boolean;
  
  // Global
  masterVolume: number;
  setMasterVolume: (volume: number) => void;
  setBgmPaused: (paused: boolean) => void;
}

const AudioManagerContext = createContext<AudioManagerContextType | undefined>(undefined);

export const AudioManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [bgmVolume, setBgmVolumeState] = useState(0.5);
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize BGM
  useEffect(() => {
    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audio.loop = true;
    audio.volume = 0;
    bgmRef.current = audio;

    const handleCanPlay = () => {
      console.log("BGM loaded and ready");
    };
    audio.addEventListener("canplaythrough", handleCanPlay);

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.pause();
      bgmRef.current = null;
    };
  }, []);

  const fadeBgm = useCallback((targetVol: number, duration: number = 1000) => {
    if (!bgmRef.current) return;
    
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    
    const startVol = bgmRef.current.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volStep = (targetVol - startVol) / steps;
    
    let currentStep = 0;
    fadeIntervalRef.current = setInterval(() => {
      if (bgmRef.current) {
        currentStep++;
        const nextVol = Math.max(0, Math.min(1, startVol + (volStep * currentStep)));
        bgmRef.current.volume = nextVol;
        
        if (currentStep >= steps) {
          bgmRef.current.volume = targetVol;
          clearInterval(fadeIntervalRef.current!);
          fadeIntervalRef.current = null;
        }
      }
    }, stepTime);
  }, []);

  const toggleBgm = useCallback(() => {
    if (!bgmRef.current) return;

    if (isBgmPlaying) {
      fadeBgm(0, 500);
      setTimeout(() => {
        bgmRef.current?.pause();
        setIsBgmPlaying(false);
      }, 500);
    } else {
      setIsBgmPlaying(true);
      bgmRef.current.play().then(() => {
        fadeBgm(bgmVolume * masterVolume, 1000);
      }).catch(err => {
        console.warn("BGM play blocked:", err);
        setIsBgmPlaying(false);
      });
    }
  }, [isBgmPlaying, bgmVolume, masterVolume, fadeBgm]);

  const setBgmVolume = useCallback((vol: number) => {
    const safeVol = isNaN(vol) ? 0.5 : Math.max(0, Math.min(1, vol));
    setBgmVolumeState(safeVol);
    if (bgmRef.current && isBgmPlaying && !fadeIntervalRef.current) {
      bgmRef.current.volume = safeVol * masterVolume;
    }
  }, [isBgmPlaying, masterVolume]);

  const playSfx = useCallback(async (url: string) => {
    // Pause BGM temporarily
    const wasBgmPlaying = isBgmPlaying;
    if (wasBgmPlaying) {
      fadeBgm(0, 200);
    }

    if (!sfxRef.current) {
      sfxRef.current = new Audio();
    }
    
    sfxRef.current.src = url;
    sfxRef.current.volume = masterVolume;
    
    return new Promise<void>((resolve) => {
      const handleCanPlay = () => {
        sfxRef.current?.removeEventListener("canplaythrough", handleCanPlay);
        sfxRef.current?.play().catch(err => {
          console.warn("SFX play blocked:", err);
          if (wasBgmPlaying) fadeBgm(bgmVolume * masterVolume, 200);
          resolve();
        });
      };

      const onEnded = () => {
        sfxRef.current?.removeEventListener("ended", onEnded);
        if (wasBgmPlaying) {
          fadeBgm(bgmVolume * masterVolume, 500);
        }
        resolve();
      };
      
      sfxRef.current?.addEventListener("canplaythrough", handleCanPlay);
      sfxRef.current?.addEventListener("ended", onEnded);
      
      // Fallback if loading fails
      sfxRef.current?.addEventListener("error", () => {
        if (wasBgmPlaying) fadeBgm(bgmVolume * masterVolume, 200);
        resolve();
      }, { once: true });
    });
  }, [isBgmPlaying, bgmVolume, masterVolume, fadeBgm]);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    // Pause BGM
    const wasBgmPlaying = isBgmPlaying;
    if (wasBgmPlaying) {
      fadeBgm(0, 300);
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))) || 
                  voices.find(v => v.lang.startsWith('en')) || 
                  voices[0];
    
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
      if (wasBgmPlaying) {
        fadeBgm(bgmVolume * masterVolume, 800);
      }
    };

    utterance.onerror = (e) => {
      console.error("TTS Error:", e);
      setIsSpeaking(false);
      if (wasBgmPlaying) fadeBgm(bgmVolume * masterVolume, 300);
    };

    window.speechSynthesis.speak(utterance);
  }, [isBgmPlaying, bgmVolume, masterVolume, fadeBgm]);

  const setBgmPaused = useCallback((paused: boolean) => {
    if (paused) {
      fadeBgm(0, 300);
    } else if (isBgmPlaying) {
      fadeBgm(bgmVolume * masterVolume, 500);
    }
  }, [isBgmPlaying, bgmVolume, masterVolume, fadeBgm]);

  return (
    <AudioManagerContext.Provider value={{
      isBgmPlaying,
      bgmVolume,
      toggleBgm,
      setBgmVolume,
      playSfx,
      speak,
      isSpeaking,
      masterVolume,
      setMasterVolume,
      setBgmPaused
    }}>
      {children}
    </AudioManagerContext.Provider>
  );
};

export const useAudioManager = () => {
  const context = useContext(AudioManagerContext);
  if (context === undefined) {
    throw new Error("useAudioManager must be used within an AudioManagerProvider");
  }
  return context;
};
