import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { HomeScreen, RegistrationScreen, LeaderboardScreen, ExtrasScreen } from './screens/MainScreens';
import { GameSessionScreen, MinigameSelectorScreen, OracleScreen, VictoryLogScreen } from './screens/GameScreens';
import { TimerScreen, CalculatorScreen, DestiniesScreen } from './screens/ToolScreens';
import { LearnIntroScreen, LearnConceptsScreen, LearnSummaryScreen } from './screens/LearnScreens';

// Component to handle initial redirect
const InitialRedirect: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        // Force redirect to home on mount
        navigate('/');
    }, []);
    return null;
}

const App: React.FC = () => {
    return (
        <Router>
            <InitialRedirect />
            <Routes>
                {/* Onboarding & Main */}
                <Route path="/" element={<HomeScreen />} />
                <Route path="/registration" element={<RegistrationScreen />} />
                <Route path="/leaderboard" element={<LeaderboardScreen />} />
                <Route path="/extras" element={<ExtrasScreen />} />
                
                {/* Game Logic */}
                <Route path="/game" element={<GameSessionScreen />} />
                <Route path="/minigame-selector" element={<MinigameSelectorScreen />} />
                <Route path="/oracle" element={<OracleScreen />} />
                <Route path="/victory-log" element={<VictoryLogScreen />} />
                
                {/* Tools */}
                <Route path="/timer" element={<TimerScreen />} />
                <Route path="/calculator" element={<CalculatorScreen />} />
                <Route path="/destinies-public" element={<DestiniesScreen />} />
                
                {/* Learn Flow */}
                <Route path="/learn-intro" element={<LearnIntroScreen />} />
                <Route path="/learn-concepts" element={<LearnConceptsScreen />} />
                <Route path="/learn-summary" element={<LearnSummaryScreen />} />
            </Routes>
        </Router>
    );
};

export default App;