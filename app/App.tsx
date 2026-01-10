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
        /* CAPA 1: FONDO DE ESCRITORIO
           Mantiene el fondo elegante en PC, pero en móvil quedará oculto.
        */
        <div className="min-h-screen w-full bg-gray-50 flex justify-center items-center font-sans text-text">
            
            {/* CAPA 2: EL CHASIS (Anclaje Absoluto)
               - MÓVIL: 'fixed inset-0'. ESTA ES LA SOLUCIÓN.
                 Obliga al div a respetar los límites físicos de la pantalla.
                 Ya no se "saldrá" por abajo.
               - ESCRITORIO: Vuelve a ser relativo y flotante.
            */}
            <div className="fixed inset-0 sm:relative sm:inset-auto w-full sm:max-w-[430px] h-[100dvh] sm:h-[100vh] bg-background sm:shadow-2xl flex flex-col z-50 overflow-hidden ring-1 ring-black/5">
                
                {/* CAPA 3: SCROLL INTERNO
                   - h-full: Ocupa exactamente el espacio disponible dentro del Chasis.
                     Suficiente para que el texto suba por encima de tu BottomBar, 
                     pero sin dejar un espacio vacío gigante.
                */}
                <div className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-background overscroll-contain pb-0">
                    
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
