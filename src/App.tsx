import { useState } from "react";
import Layout from "./components/Layout";
import HomeScreen from "./screens/HomeScreen";
import ChallengeScreen from "./screens/ChallengeScreen";
import LevelsScreen from "./screens/LevelsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RewardsScreen from "./screens/RewardsScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen />;
      case "challenge":
        return <ChallengeScreen />;
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
    <Layout currentScreen={currentScreen} onScreenChange={setCurrentScreen}>
      {renderScreen()}
    </Layout>
  );
}
