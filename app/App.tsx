import React from 'react';
// CAMBIO CRÍTICO: Usamos BrowserRouter en lugar de HashRouter para soportar el basename correctamente
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants';

// 1. Screens
import { HomeScreen } from './screens/HomeScreen';
import { SettingScreen } from './screens/SettingScreen';
import { ExtraScreen } from './screens/ExtraScreen';
import { RegistrationScreen } from './screens/NewGameScreen';
import { GameSessionScreen } from './screens/GameScreens';
import { MinigameSelectorScreen } from './screens/MinigameSelectorScreen';
import { OracleScreen } from './screens/OracleScreen';
import { TimerScreen } from './screens/TimerScreen';
import { DestiniesScreen } from './screens/DestiniesScreen';
import { AppGuideScreen } from './screens/AppGuideScreen';
import { RulebookScreen } from './screens/RulebookScreen';

// 2. New Refactored Screens
import { LogScreen } from './screens/LogScreen';
import { CalculatorScreen } from './screens/CalculatorScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';

const App: React.FC = () => {
    return (
        /* CAMBIO CLAVE: Añadimos basename="/app" para que las rutas funcionen en la subcarpeta */
        <Router basename="/app">
            <Routes>
                {/* Main Menu - Explicitly defined as index */}
                <Route index element={<HomeScreen />} />
                <Route path={ROUTES.HOME} element={<HomeScreen />} />
                
                {/* Secondary Menus */}
                <Route path={ROUTES.SETTINGS} element={<SettingScreen />} />
                <Route path={ROUTES.EXTRAS} element={<ExtraScreen />} />
                <Route path={ROUTES.APP_GUIDE} element={<AppGuideScreen />} />
                <Route path={ROUTES.RULES} element={<RulebookScreen />} />
                
                {/* Game Setup */}
                <Route path={ROUTES.REGISTRATION} element={<RegistrationScreen />} />
                
                {/* Active Game Hub & Core Decks */}
                <Route path={ROUTES.GAME} element={<GameSessionScreen />} />
                <Route path={ROUTES.MINIGAME_SELECTOR} element={<MinigameSelectorScreen />} />
                <Route path={ROUTES.ORACLE} element={<OracleScreen />} />
                
                {/* Game Tools (Isolated) */}
                <Route path={ROUTES.TIMER} element={<TimerScreen />} />
                <Route path={ROUTES.DESTINIES} element={<DestiniesScreen />} />
                
                {/* Game Stats, Logs & Results */}
                <Route path={ROUTES.VICTORY_LOG} element={<LogScreen />} />
                <Route path={ROUTES.CALCULATOR} element={<CalculatorScreen />} />
                <Route path={ROUTES.LEADERBOARD} element={<LeaderboardScreen />} />

                {/* Catch-all redirect to Home */}
                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
        </Router>
    );
};

export default App;
