import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, ActionCard } from '../components/UI';
import { ROUTES, STORAGE_KEYS } from '../constants';

// --- Game Session (Main Hub) ---
export const GameSessionScreen: React.FC = () => {
    const navigate = useNavigate();
    
    // Auth Guard: If no players, go home
    useEffect(() => {
        const storedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
        if (!storedPlayers || JSON.parse(storedPlayers).length === 0) {
            navigate(ROUTES.HOME, { replace: true });
        }
    }, [navigate]);
    
    const handleEndGameClick = () => {
        // Direct navigation to calculator (which leads to leaderboard)
        navigate(ROUTES.CALCULATOR);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#f8fafc]">
            <Header 
                title="Partida Activa" 
                showBack={true} 
                onBack={() => navigate(ROUTES.HOME)}
                actionIcon="settings"
            />

            <div className="flex-1 px-4 py-6">
                {/* SECTION 1: CARD PILES */}
                <h3 className="text-slate-400 tracking-wide text-xs font-bold uppercase px-1 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">style</span> PILAS DE CARTAS
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Minigame Card - Refactored to ActionCard */}
                    <ActionCard 
                        title="Jugar Minijuego"
                        onClick={() => navigate(ROUTES.MINIGAME_SELECTOR)}
                        bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAlkW3Xim0uV0HK2wLarIuDmnPNIxq6jxurfDoWcgSZFCnSnp0hxr3dUMh7AALzEB-Jt-KtfY7CdDHk7lAel5YbztNTT9y39EWZ4ZP_xLE7-aHS2eWLwDTc9j-Kp8WmsK17sl2a-ObIvNoekXKRK7ncyL3JdigLfAjcUG054BZ2EA2G5jG4MkLOPam8H1uNyb45kjrApoEC72QAapwFAR7ECEgl975PQ4rqaIYwqnv79kxuSnrLgfddpi1yS6iPbBuZmm4kjG0StSo"
                    />
                    
                    {/* Oracle Card - Refactored to ActionCard */}
                    <ActionCard 
                        title="Activar Oráculo"
                        onClick={() => navigate(ROUTES.ORACLE)}
                        bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuD9QZx7CtrJnAHf9WfZTyPOlTMAK7huKeUFgLtc33PrED9FikKC8usbyisSCOi2BuhW9d-S0tLyBUDMBiK6TOoPDH6JRgJCZgVj9G7sDmv4-KrLTdPS93yBc0VxGPm-pEYNK_gjxy266cH0TZBTo1tFrOg9RHQlJFGjxwImcPf5mCwVmTOOd6LB5o0f85239Cd1aL1iyspDGfYPpGdptQX4tqVOczJJbjZ6RFrzl8zBoRfDwyFQWNihIv34b0I9Yrw7t6SOra7hIC8"
                    />
                </div>

                {/* SECTION 2: SUPPORT TOOLS */}
                <h3 className="text-slate-400 tracking-wide text-xs font-bold uppercase px-1 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">widgets</span> HERRAMIENTAS DE APOYO
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-8">
                     {[
                         {icon: 'timer', color: 'teal', label: 'Temporizador / Cronómetro', path: ROUTES.TIMER},
                         {icon: 'casino', color: 'amber', label: 'Destinos', path: ROUTES.DESTINIES},
                         {icon: 'menu_book', color: 'pink', label: 'Bitácora', path: ROUTES.VICTORY_LOG},
                     ].map((t, i) => {
                         return (
                             <button 
                                key={i} 
                                onClick={() => navigate(t.path)} 
                                className={`flex flex-col items-center justify-center bg-white rounded-2xl p-3 h-32 shadow-sm border border-slate-200 transition-all hover:border-primary/50 active:scale-95`}
                             >
                                <div className={`size-12 rounded-full bg-${t.color}-50 text-${t.color}-600 flex items-center justify-center mb-3`}>
                                    <span className="material-symbols-outlined">{t.icon}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-700 text-center flex flex-col items-center leading-tight">
                                    {t.label}
                                </span>
                             </button>
                         )
                     })}
                </div>

                <Button 
                    variant="primary" 
                    fullWidth 
                    icon="emoji_events" 
                    onClick={handleEndGameClick}
                    className="h-auto py-3 !bg-[#f44611] hover:!bg-[#d63b0b] text-white !shadow-[0_4px_15px_rgba(244,70,17,0.4)]"
                >
                    <div className="flex flex-col items-center leading-none">
                        <span className="text-lg font-bold">Terminar Partida</span>
                    </div>
                </Button>
            </div>
        </div>
    );
};