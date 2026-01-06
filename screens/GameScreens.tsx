import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Button } from '../components/UI';

// --- Game Session (Main Hub) ---
export const GameSessionScreen: React.FC = () => {
    const navigate = useNavigate();
    
    const handleEndGameClick = () => {
        // Direct navigation to calculator (which leads to leaderboard)
        navigate('/calculator');
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#f8fafc]">
            <Header 
                title="Partida Activa" 
                showBack={true} 
                onBack={() => navigate('/')}
                actionIcon="settings"
            />

            <div className="flex-1 px-4 py-6">
                {/* SECTION 1: CARD PILES */}
                <h3 className="text-slate-400 tracking-wide text-xs font-bold uppercase px-1 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">style</span> PILAS DE CARTAS
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Minigame Card */}
                    <Card onClick={() => navigate('/minigame-selector')} className="h-64 border-4 border-white group" bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAlkW3Xim0uV0HK2wLarIuDmnPNIxq6jxurfDoWcgSZFCnSnp0hxr3dUMh7AALzEB-Jt-KtfY7CdDHk7lAel5YbztNTT9y39EWZ4ZP_xLE7-aHS2eWLwDTc9j-Kp8WmsK17sl2a-ObIvNoekXKRK7ncyL3JdigLfAjcUG054BZ2EA2G5jG4MkLOPam8H1uNyb45kjrApoEC72QAapwFAR7ECEgl975PQ4rqaIYwqnv79kxuSnrLgfddpi1yS6iPbBuZmm4kjG0StSo">
                        {/* Darker overlay for better text contrast since icons are gone */}
                        <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50"></div>
                        <div className="relative z-10 flex flex-col justify-center items-center h-full p-4 text-center">
                            <h4 className="text-white text-2xl font-extrabold leading-tight tracking-tight drop-shadow-md">Jugar Minijuego</h4>
                        </div>
                    </Card>
                    
                    {/* Oracle Card */}
                    <Card onClick={() => navigate('/oracle')} className="h-64 border-4 border-white group" bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuD9QZx7CtrJnAHf9WfZTyPOlTMAK7huKeUFgLtc33PrED9FikKC8usbyisSCOi2BuhW9d-S0tLyBUDMBiK6TOoPDH6JRgJCZgVj9G7sDmv4-KrLTdPS93yBc0VxGPm-pEYNK_gjxy266cH0TZBTo1tFrOg9RHQlJFGjxwImcPf5mCwVmTOOd6LB5o0f85239Cd1aL1iyspDGfYPpGdptQX4tqVOczJJbjZ6RFrzl8zBoRfDwyFQWNihIv34b0I9Yrw7t6SOra7hIC8">
                        <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50"></div>
                        <div className="relative z-10 flex flex-col justify-center items-center h-full p-4 text-center">
                            <h4 className="text-white text-2xl font-extrabold leading-tight tracking-tight drop-shadow-md">Activar Oráculo</h4>
                        </div>
                    </Card>
                </div>

                {/* SECTION 2: SUPPORT TOOLS */}
                <h3 className="text-slate-400 tracking-wide text-xs font-bold uppercase px-1 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">widgets</span> HERRAMIENTAS DE APOYO
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-8">
                     {[
                         {icon: 'timer', color: 'teal', label: 'Temporizador / Cronómetro', path: '/timer'},
                         {icon: 'casino', color: 'amber', label: 'Destinos', path: '/destinies-public'}, // Icon changed to 'casino' (dice/randomness)
                         {icon: 'menu_book', color: 'pink', label: 'Bitácora', path: '/victory-log'},
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