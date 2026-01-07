import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameSession } from '../hooks/useGameSession';
import { MenuButton } from '../components/UI';
import { ROUTES } from '../constants';

// Importa el logo transparente que subiste
import Logo from '../assets/logo_transparente.png';

// --- Home Screen ---
export const HomeScreen: React.FC = () => {
    const navigate = useNavigate();
    const { hasActiveSession, startNewGame, resumeGame } = useGameSession();
    const [showResumeModal, setShowResumeModal] = useState(false);

    // Lógica 100% manual: Solo se ejecuta al hacer Click
    const handleStartGame = () => {
        if (hasActiveSession) {
            setShowResumeModal(true);
        } else {
            startNewGame();
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background overflow-hidden max-w-md mx-auto shadow-2xl">
             <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.08] mix-blend-multiply grayscale" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3RwclW-6L2OYrgdY1Hk_rKW2-hQLFqhp8Ii5OYxEAUZTyH6S3YEG-0_vjW2fne3ekkbc0WtIMZ3EM9Whc-oPdIOabbYPutIEejGEvRvWtjqEGyU5bscKlRtjZ1h-IQe5kttxTtZsgdvD8WbuJPhwqNk4X9ddygeY6c6vEEgitYZAiBCNueDV-qgZszt9SJL1XlEtc6DiHmQ4pynpviq1EINlahGsDhGCblUg4xoE11XUZN2M4OrIdlh7rsjZM3H65rKndEHHRnD0")'}}></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-100/40 via-background/50 to-background"></div>

            <div className="w-full pt-8"></div>

            <div className="relative z-10 flex-1 flex flex-col items-center px-6 w-full pt-4">
                {/* Logo Section - modificado: sin texto, más grande y más cerca del botón */}
                <div className="flex flex-col items-center justify-center mb-2 w-full">
                    <div className="relative w-56 h-56 mb-2">
                        <div className="relative w-full h-full bg-transparent rounded-full flex items-center justify-center p-2 animate-float">
                            {/* Imagen con fondo transparente (app/assets/logo_transparente.png). */}
                            <img
                                src={Logo}
                                alt="Logo - Los Dioses"
                                className="w-full h-full object-contain"
                                style={{ pointerEvents: 'none' }}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Menu System */}
                <div className="w-full flex flex-col items-center justify-start flex-1 mb-8">
                    
                    {/* Main Button */}
                    <div className="w-full max-w-xs mb-6">
                        <button 
                            onClick={handleStartGame} 
                            className="group relative w-full py-8 px-4 bg-[#330df2] text-white rounded-2xl shadow-[0_6px_0_0_#280bc4,0_0_40px_rgba(51,13,242,0.5)] active:shadow-none active:translate-y-[2px] transition-transform flex flex-col items-center justify-center"
                        >
                            <span className="text-xl font-extrabold tracking-tight leading-none mb-2 block">Empieza Partida Nueva</span>
                            <span className="text-sm font-medium text-white/80 leading-none block">O Retoma una iniciada</span>
                        </button>
                    </div>
                    
                    {/* Secondary List using MenuButton Component */}
                    <div className="flex flex-col gap-2.5 w-full max-w-[240px]">
                        <MenuButton onClick={() => navigate(ROUTES.APP_GUIDE)}>
                            ¿Cómo Usar Esta App?
                        </MenuButton>

                        <MenuButton onClick={() => navigate(ROUTES.RULES)}>
                            Reglas Del Juego
                        </MenuButton>

                        <MenuButton onClick={() => navigate(ROUTES.SETTINGS)}>
                            Configuración
                        </MenuButton>

                        <MenuButton onClick={() => navigate(ROUTES.EXTRAS)}>
                            Extras
                        </MenuButton>
                    </div>
                </div>
            </div>

            {/* Resume/New Game Modal */}
            {showResumeModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowResumeModal(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-6 flex flex-col items-center text-center animate-float">
                        <span className="material-symbols-outlined text-4xl text-primary mb-2">save</span>
                        <h3 className="typo-h3 mb-2">Partida Encontrada</h3>
                        <p className="text-sm text-slate-500 mb-6">Existe una partida anterior guardada. ¿Deseas continuarla o empezar de cero?</p>
                        <div className="flex gap-3 w-full">
                             <button onClick={startNewGame} className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-600 text-sm">Nueva Partida</button>
                             <button onClick={resumeGame} className="flex-[2] py-3 rounded-xl bg-primary text-white font-bold shadow-md">Continuar Partida</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
