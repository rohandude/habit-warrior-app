import { useState } from "react";
import Layout from "./components/Layout";
import HomeScreen from "./screens/HomeScreen";
import ChallengeScreen from "./screens/ChallengeScreen";
import LevelsScreen from "./screens/LevelsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RewardsScreen from "./screens/RewardsScreen";
import RitualsScreen from "./screens/RitualsScreen";
import { AlarmProvider } from "./context/AlarmContext";
import AlarmOverlay from "./components/AlarmOverlay";

import { XPProvider } from "./context/XPContext";
import { HabitProvider } from "./context/HabitContext";
import { AudioManagerProvider } from "./context/AudioManagerContext";
import VoiceGreeting from "./components/VoiceGreeting";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case "challenge":
        return <ChallengeScreen />;
      case "rituals":
        return <RitualsScreen />;
      case "levels":
        return <LevelsScreen />;
      case "rewards":
        return <RewardsScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <XPProvider>
      <HabitProvider>
        <AudioManagerProvider>
          <AlarmProvider>
            <Layout currentScreen={currentScreen} onScreenChange={setCurrentScreen}>
              {renderScreen()}
            </Layout>
            <AlarmOverlay />
            <VoiceGreeting />
          </AlarmProvider>
        </AudioManagerProvider>
      </HabitProvider>
    </XPProvider>
  );
}
