import React from 'react';
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
        /* CAPA 1: FONDO (Solo visible en Escritorio)
           - bg-gray-50: Color de fondo elegante.
           - items-center: Centra el móvil verticalmente en PC.
           - En móvil, este div queda detrás debido al 'fixed' del hijo.
        */
        <div className="min-h-[100dvh] w-full bg-gray-50 flex justify-center items-center font-sans text-text">
            
            {/* CAPA 2: EL CHASIS (La App en sí)
               - MÓVIL (Por defecto): 'fixed inset-0'. Ocupa toda la pantalla física. 
                 Esto elimina el cuadro blanco superior y el espacio inferior.
               - ESCRITORIO (sm:): 'sm:relative'. Vuelve a ser una caja flotante.
                 sm:h-[850px], sm:rounded-2xl, etc.
            */}
            <div className="fixed inset-0 sm:relative sm:inset-auto w-full sm:max-w-[430px] sm:h-[850px] sm:max-h-[92vh] bg-background sm:shadow-2xl sm:rounded-2xl flex flex-col z-10 overflow-hidden ring-1 ring-black/5">
                
                {/* CAPA 3: VIEWPORT (Scroll)
                   - overscroll-none: Evita el rebote blanco en iOS/Android.
                   - pb-28: Padding inferior ajustado (aprox 112px). 
                     Suficiente para librar la BottomBar y mostrar las 2 líneas, 
                     pero sin bajar "más de lo necesario".
                */}
                <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative bg-background w-full no-scrollbar pb-28 overscroll-none">
                    
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
