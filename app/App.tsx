import React from 'react';
//Gemini: Cambiamos BrowserRouter por HashRouter para evitar los 404 al recargar
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
        /* Usamos HashRouter. 
           Nota: En HashRouter, el basename suele ser innecesario si el servidor 
           sirve el index.html desde la subcarpeta, pero lo mantenemos para 
           consistencia con la estructura de archivos /app.
        */
        /* CAPA 1: FONDO DE ESCRITORIO 
           Centra el móvil en pantallas grandes y pone un fondo gris suave.
        */
        <div className="min-h-screen bg-slate-200 flex justify-center items-center p-0 sm:p-4 font-rounded text-text overflow-hidden">
            
            {/* CAPA 2: EL CHASIS DEL MÓVIL (MASTER CONTAINER)
               Define el ancho máximo, la sombra 2xl y el borde oscuro.
            */}
            <div className="relative w-full max-w-[450px] h-[100dvh] sm:h-[850px] sm:max-h-[90vh] bg-background shadow-2xl overflow-hidden sm:rounded-[2.5rem] border-x-0 sm:border-[8px] border-slate-900 flex flex-col transition-all duration-300">
                
                {/* CAPA 3: VIEWPORT CON SCROLL
                   Aquí ocurre la magia. Todo lo que renderice el Router vivirá aquí dentro.
                   El scroll es interno, simulando la pantalla táctil.
                */}
                <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative bg-background w-full">

        <Router>
            <Routes>
                {/* Main Menu - Ruta raíz del hash */}
                <Route path="/" element={<HomeScreen />} />
                <Route path={ROUTES.HOME} element={<HomeScreen />} />
                
                {/* Menus */}
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
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
                </div>
            </div>
        </div>
    );
};
export default App;
