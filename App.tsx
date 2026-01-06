import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// New Organization
import { HomeScreen } from './screens/HomeScreen';
import { SettingScreen } from './screens/SettingScreen';
import { ExtraScreen } from './screens/ExtraScreen';
import { RegistrationScreen } from './screens/NewGameScreen';
import { GameSessionScreen, MinigameSelectorScreen, OracleScreen } from './screens/GameScreens';
import { VictoryLogScreen, CalculatorScreen, LeaderboardScreen } from './screens/LogsAndWinnerScreen';
import { TimerScreen } from './screens/TimerScreen';
import { DestiniesScreen } from './screens/DestiniesScreen';
import { AppGuideScreen } from './screens/AppGuideScreen';
import { RulebookScreen } from './screens/RulebookScreen';

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
                {/* Main Menu */}
                <Route path="/" element={<HomeScreen />} />
                <Route path="/settings" element={<SettingScreen />} />
                <Route path="/extras" element={<ExtraScreen />} />
                <Route path="/app-guide" element={<AppGuideScreen />} />
                <Route path="/rules" element={<RulebookScreen />} />
                
                {/* Game Setup */}
                <Route path="/registration" element={<RegistrationScreen />} />
                
                {/* Active Game Hub & Core Decks */}
                <Route path="/game" element={<GameSessionScreen />} />
                <Route path="/minigame-selector" element={<MinigameSelectorScreen />} />
                <Route path="/oracle" element={<OracleScreen />} />
                
                {/* Game Tools (Isolated) */}
                <Route path="/timer" element={<TimerScreen />} />
                <Route path="/destinies-public" element={<DestiniesScreen />} />
                
                {/* Game Stats, Logs & Results */}
                <Route path="/victory-log" element={<VictoryLogScreen />} />
                <Route path="/calculator" element={<CalculatorScreen />} />
                <Route path="/leaderboard" element={<LeaderboardScreen />} />
            </Routes>
        </Router>
    );
};

export default App;