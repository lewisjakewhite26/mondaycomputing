import { useState } from 'react';
import SplashPage from './pages/SplashPage';
import IntroPage from './pages/IntroPage';
import HubPage from './pages/HubPage';
import ScenarioPage from './pages/ScenarioPage';
import FullscreenToggle from './components/FullscreenToggle';
import './App.css';

type Page = 'splash' | 'intro' | 'hub' | 'scenario';
type ScenarioPlatform = 'roblox' | 'whatsapp' | 'snapchat';

export type { Page, ScenarioPlatform };

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('splash');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioPlatform | null>(null);
  const [completed, setCompleted] = useState<ScenarioPlatform[]>([]);

  const handleStartLesson = () => setCurrentPage('intro');
  const handleIntroComplete = () => setCurrentPage('hub');

  const handleSelectScenario = (platform: ScenarioPlatform) => {
    setSelectedScenario(platform);
    setCurrentPage('scenario');
  };

  const handleBackToHub = () => {
    setCurrentPage('hub');
    setSelectedScenario(null);
  };

  const handleScenarioComplete = (platform: ScenarioPlatform) => {
    setCompleted((prev) => (prev.includes(platform) ? prev : [...prev, platform]));
  };

  return (
    <div className="app">
      <FullscreenToggle />
      {currentPage === 'splash' && <SplashPage onStart={handleStartLesson} />}
      {currentPage === 'intro' && <IntroPage onComplete={handleIntroComplete} />}
      {currentPage === 'hub' && (
        <HubPage onSelectScenario={handleSelectScenario} completed={completed} />
      )}
      {currentPage === 'scenario' && selectedScenario && (
        <ScenarioPage
          platform={selectedScenario}
          onBack={handleBackToHub}
          onComplete={() => handleScenarioComplete(selectedScenario)}
        />
      )}
    </div>
  );
}

export default App;
