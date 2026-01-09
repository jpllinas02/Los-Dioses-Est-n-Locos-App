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
           - h-[100dvh]: Altura dinámica total del viewport.
           - items-center: Centrado vertical (aunque como llenaremos la altura, esto es preventivo).
           - bg-gray-50: Color de fondo para los laterales en PC.
        */
        <div className="h-[100dvh] w-full bg-gray-50 flex justify-center items-stretch overflow-hidden font-sans text-text">
            
            {/* CAPA 2: EL CONTENEDOR (Estilo App Nativa)
               - w-full: En móvil ocupa todo el ancho.
               - max-w-[430px]: En PC se limita al ancho de un móvil.
               - h-full: Ocupa el 100% de la altura (Toca arriba y abajo).
               - shadow-2xl: Mantiene la profundidad en PC.
               - relative z-10: Se asegura de estar encima de cualquier rareza del fondo.
            */}
            <div className="relative w-full sm:max-w-[430px] h-full bg-background shadow-2xl overflow-hidden flex flex-col z-10">
                
                {/* CAPA 3: VIEWPORT CON SCROLL INVISIBLE
                   - pb-32: ¡CLAVE! Añadimos padding extra al final. 
                     Esto permite que el último texto haga scroll hasta arriba, 
                     librándose de la barra de navegación o del corte de pantalla.
                */}
                <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative bg-background w-full no-scrollbar pb-32">
                    
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
