import React from 'react';
//Gemini: Se usa BrowserRouter en lugar de HashRouter para evitar los 404 al recargar
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        /* CAPA 1: FONDO DE ESCRITORIO */
        <div className="min-h-screen bg-gray-50 flex justify-center items-end sm:items-center p-0 sm:p-8 font-sans text-text overflow-hidden transition-all duration-500">
            
            {/* CAPA 2: EL CONTENEDOR (Estilo Tarjeta)
               - max-w-[430px]: Ancho de móvil estándar.
               - sm:rounded-2xl: Esquinas LIGERAMENTE redondeadas (sutil, no bola).
               - shadow-2xl: Profundidad.
            */}
            <div className="relative w-full max-w-[430px] h-[100dvh] sm:h-[850px] sm:max-h-[92vh] bg-background shadow-2xl overflow-hidden sm:rounded-2xl flex flex-col transition-all duration-300 ring-1 ring-black/5">
                
                {/* CAPA 3: VIEWPORT (Scroll Invisible) */}
                <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative bg-background w-full no-scrollbar">
                    
                    <Router>
                        <Routes>
                            <Route path="/" element={<HomeScreen />} />
                            <Route path={ROUTES.HOME} element={<HomeScreen />} />
                            
                            <Route path={ROUTES.SETTINGS} element={<SettingScreen />} />
                            <Route path={ROUTES.EXTRAS} element={<ExtraScreen />} />
                            <Route path={ROUTES.APP_GUIDE} element={<AppGuideScreen />} />
                            <Route path={ROUTES.RULES} element={<RulebookScreen />} />
                            
                            <Route path={ROUTES.REGISTRATION} element={<RegistrationScreen />} />
                            
                            <Route path={ROUTES.GAME} element={<GameSessionScreen />} />
                            <Route path={ROUTES.MINIGAME_SELECTOR} element={<MinigameSelectorScreen />} />
                            <Route path={ROUTES.ORACLE} element={<OracleScreen />} />
                            
                            <Route path={ROUTES.TIMER} element={<TimerScreen />} />
                            <Route path={ROUTES.DESTINIES} element={<DestiniesScreen />} />
                            
                            <Route path={ROUTES.VICTORY_LOG} element={<LogScreen />} />
                            <Route path={ROUTES.CALCULATOR} element={<CalculatorScreen />} />
                            <Route path={ROUTES.LEADERBOARD} element={<LeaderboardScreen />} />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Router>

                </div>
            </div>
        </div>
    );
};

export default App;
