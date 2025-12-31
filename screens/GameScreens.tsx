import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Card, Button, BottomBar } from '../components/UI';
import { Player, GameColor } from '../types';

// --- Game Session (Main Hub) ---
export const GameSessionScreen: React.FC = () => {
    const navigate = useNavigate();
    const [hasPlayers, setHasPlayers] = useState(false);
    const [showEndGameModal, setShowEndGameModal] = useState(false);

    useEffect(() => {
        const storedPlayers = localStorage.getItem('game_players');
        if (storedPlayers && JSON.parse(storedPlayers).length > 0) {
            setHasPlayers(true);
        } else {
            setHasPlayers(false);
        }
    }, []);

    const handleEndGameClick = () => {
        if (hasPlayers) {
            navigate('/calculator');
        } else {
            setShowEndGameModal(true);
        }
    };

    const handleExitGame = () => {
        navigate('/');
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
                <h3 className="text-slate-400 tracking-wide text-xs font-bold uppercase px-1 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">bolt</span> Acciones Principales
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Card onClick={() => navigate('/minigame-selector')} className="h-64 border-4 border-white group" bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAlkW3Xim0uV0HK2wLarIuDmnPNIxq6jxurfDoWcgSZFCnSnp0hxr3dUMh7AALzEB-Jt-KtfY7CdDHk7lAel5YbztNTT9y39EWZ4ZP_xLE7-aHS2eWLwDTc9j-Kp8WmsK17sl2a-ObIvNoekXKRK7ncyL3JdigLfAjcUG054BZ2EA2G5jG4MkLOPam8H1uNyb45kjrApoEC72QAapwFAR7ECEgl975PQ4rqaIYwqnv79kxuSnrLgfddpi1yS6iPbBuZmm4kjG0StSo">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="relative z-10 flex flex-col justify-end h-full p-4">
                            <div className="size-12 rounded-xl bg-primary flex items-center justify-center shadow-lg border-2 border-white/20 mb-3">
                                <span className="material-symbols-outlined text-white text-2xl">videogame_asset</span>
                            </div>
                            <h4 className="text-white text-lg font-extrabold leading-tight">Jugar Minijuego</h4>
                            <p className="text-white/80 text-xs mt-1 font-medium">Desafía a los dioses.</p>
                        </div>
                    </Card>
                    <Card onClick={() => navigate('/oracle')} className="h-64 border-4 border-white group" bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuD9QZx7CtrJnAHf9WfZTyPOlTMAK7huKeUFgLtc33PrED9FikKC8usbyisSCOi2BuhW9d-S0tLyBUDMBiK6TOoPDH6JRgJCZgVj9G7sDmv4-KrLTdPS93yBc0VxGPm-pEYNK_gjxy266cH0TZBTo1tFrOg9RHQlJFGjxwImcPf5mCwVmTOOd6LB5o0f85239Cd1aL1iyspDGfYPpGdptQX4tqVOczJJbjZ6RFrzl8zBoRfDwyFQWNihIv34b0I9Yrw7t6SOra7hIC8">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="relative z-10 flex flex-col justify-end h-full p-4">
                            <div className="size-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg border-2 border-white/20 mb-3">
                                <span className="material-symbols-outlined text-white text-2xl">visibility</span>
                            </div>
                            <h4 className="text-white text-lg font-extrabold leading-tight">Activar Oráculo</h4>
                            <p className="text-white/80 text-xs mt-1 font-medium">Consulta el destino.</p>
                        </div>
                    </Card>
                </div>

                <h3 className="text-slate-400 tracking-wide text-xs font-bold uppercase px-1 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">build</span> Herramientas
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-8">
                     {[
                         {icon: 'timer', color: 'teal', label: 'Temporizador', path: '/timer'},
                         {icon: 'map', color: 'amber', label: 'Destinos', path: '/destinies-public'},
                         {icon: 'menu_book', color: 'pink', label: 'Bitácora', path: '/victory-log'},
                     ].map((t, i) => {
                         // Disable Victory Log if no players are registered
                         const isDisabled = t.path === '/victory-log' && !hasPlayers;
                         return (
                             <button 
                                key={i} 
                                onClick={() => !isDisabled && navigate(t.path)} 
                                disabled={isDisabled}
                                className={`flex flex-col items-center justify-center bg-white rounded-2xl p-3 h-32 shadow-sm border border-slate-200 transition-all 
                                    ${isDisabled 
                                        ? 'opacity-50 grayscale cursor-not-allowed border-dashed' 
                                        : 'hover:border-primary/50 active:scale-95'
                                    }`}
                             >
                                <div className={`size-12 rounded-full bg-${t.color}-50 text-${t.color}-600 flex items-center justify-center mb-3`}>
                                    <span className="material-symbols-outlined">{t.icon}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-700 text-center flex flex-col items-center">
                                    {t.label}
                                    {isDisabled && <span className="text-[9px] text-slate-400 uppercase mt-0.5 font-normal">(Requiere Registro)</span>}
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
                        {hasPlayers && (
                            <span className="text-[10px] font-medium opacity-80 mt-1 tracking-wide">y Descubrir al Ganador</span>
                        )}
                    </div>
                </Button>
            </div>

            {/* End Game Modal for Skipped Registration */}
            {showEndGameModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEndGameModal(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col p-8 items-center text-center animate-float">
                        <div className="w-16 h-16 bg-green-50 text-green-600 border border-green-100 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                             <span className="material-symbols-outlined text-4xl">celebration</span>
                        </div>
                        <h3 className="typo-h2 mb-3 text-slate-900">¡Gracias por Jugar!</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                            Como jugaste en modo libre, no se ha <strong>calculado automáticamente el podio</strong>.
                            <br/><br/>
                            <span className="text-sm opacity-80">¡Registra a los jugadores la próxima vez para desbloquear la Bitácora y la Calculadora!</span>
                        </p>
                        <Button fullWidth onClick={handleExitGame}>
                            Salir al Inicio
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Minigame Selector --- (No changes, same as before)
export const MinigameSelectorScreen: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header title="Selector de Minijuegos" actionIcon="settings" />
            <div className="flex-1 flex flex-col items-center w-full px-4 py-6 space-y-6 pb-28">
                <div className="w-full space-y-3">
                    <h3 className="typo-h3 px-1">Tipo de Minijuegos</h3>
                    <div className="w-full flex gap-3 overflow-x-auto no-scrollbar py-1">
                        <button className="flex h-10 flex-1 shrink-0 items-center justify-center rounded-full bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-500/20 px-6">Individual</button>
                        <button className="flex h-10 flex-1 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 px-6">En Equipo</button>
                        <button className="flex h-10 flex-1 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-bold text-sm shadow-lg shadow-green-500/20 px-6">Especial</button>
                    </div>
                </div>

                <div className="w-full">
                    <div className="flex flex-col items-stretch justify-start rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden relative p-6 gap-4">
                        <div>
                            <h3 className="typo-h2 mb-1">La Ira de Poseidón</h3>
                            <p className="text-action font-bold text-sm">Tipo: Desafío Físico</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                            <p className="typo-body">
                                "Todos los jugadores deben contener la respiración. El primero en soltarla pierde un turno y debe imitar a un pez."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <BottomBar>
                 <Button fullWidth className="bg-action shadow-[0_4px_20px_rgba(37,140,244,0.4)]">Seleccionar Minijuego</Button>
            </BottomBar>
        </div>
    );
};

// --- Oracle Screen --- (No changes, same as before)
export const OracleScreen: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header title="Activación de Oráculos" actionIcon="settings" />
            <div className="flex-1 flex flex-col items-center px-6 pt-4 w-full pb-32">
                <div className="w-full animate-float">
                    <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-xl border border-slate-100">
                        <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                            <div className="h-full w-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDO4FEqbIhBr1HqIATV6fhQX4eX9w-1oi9qG34WCkoxGmFzAjcI2KJtt5tktFV3QHcj35Ac0v7jySWvRo3wCtfrLcyXZB3bINfMKeYxHTpuPNCtkO_OUoYtBZlhet_ssQHHpz322Ynh4UTXCt80MIt8MXN6stSmiIy6svcltHWcv4hms_fnwW-2n1ECvyu4zhK4Qz0YuiEG24xSN4ERMDDlARKWGSjrDmCHiowNPMEJupqnBcrLZMivu-QqXarMWyLYs3ylCHYqPSc')"}}></div>
                            <div className="absolute top-4 right-4 z-20">
                                <div className="flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-md border border-white/20">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-90">TIPO</span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Favorable</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 p-7 pt-5">
                            <div>
                                <h3 className="typo-caption text-action mb-1.5">Resultado</h3>
                                <h2 className="typo-h2">La Bendición del Trueno</h2>
                            </div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <p className="typo-body">
                                Zeus te sonríe desde el Olimpo. La tormenta despeja el camino de tus enemigos. <span className="text-action font-bold bg-blue-50 px-1 rounded">Roba dos cartas de acción extra</span> inmediatamente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <BottomBar>
                <Button fullWidth className="bg-action shadow-[0_8px_20px_rgb(37,140,244,0.3)]" icon="auto_awesome">ACTIVAR ORÁCULO</Button>
            </BottomBar>
        </div>
    );
};

// --- Victory Log ---
interface MinigameRecord {
    id: string;
    round: number;
    winners: string[]; // Player IDs
    timestamp: number;
}

export const VictoryLogScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [players, setPlayers] = useState<Player[]>([]);
    
    // Core stats for Leaderboard compatibility
    // 'mentions' structure: { [category: string]: { [playerId: string]: number } }
    const [log, setLog] = useState<{minigames: Record<string, number>, mentions: Record<string, Record<string, number>>}>({ minigames: {}, mentions: {} });
    
    // Detailed history for this screen
    const [minigameHistory, setMinigameHistory] = useState<MinigameRecord[]>([]);
    
    // UI States
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
    const [showMinigameModal, setShowMinigameModal] = useState(false);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

    useEffect(() => {
        const storedPlayers = localStorage.getItem('game_players');
        const storedLog = localStorage.getItem('game_log');
        const storedHistory = localStorage.getItem('game_minigame_history');

        if (storedPlayers) {
            const parsedPlayers = JSON.parse(storedPlayers);
            setPlayers(parsedPlayers);
            
            if (storedLog) {
                const parsedLog = JSON.parse(storedLog);
                // Backward compatibility if old 'decisions' exists, move to mentions.strategy
                if (parsedLog.decisions && !parsedLog.mentions) {
                    parsedLog.mentions = { 'strategy': parsedLog.decisions };
                }
                setLog(parsedLog.mentions ? parsedLog : { minigames: {}, mentions: {} });
            } else {
                const initialLog = { minigames: {}, mentions: {} };
                parsedPlayers.forEach((p: Player) => {
                    // @ts-ignore
                    initialLog.minigames[p.id] = 0;
                });
                setLog(initialLog);
            }

            if (storedHistory) {
                setMinigameHistory(JSON.parse(storedHistory));
            }
        }
    }, []);

    // Persistence
    useEffect(() => {
        if (players.length > 0) {
            localStorage.setItem('game_log', JSON.stringify(log));
            localStorage.setItem('game_minigame_history', JSON.stringify(minigameHistory));
        }
    }, [log, minigameHistory, players]);

    const handleBack = () => {
        if (location.state?.fromCalculator) {
            // If coming from Calculator Summary, return there
            navigate('/calculator', { state: { initialShowSummary: true } });
        } else {
            navigate(-1);
        }
    };

    const toggleWinnerSelection = (playerId: string) => {
        setSelectedWinners(prev => 
            prev.includes(playerId) 
                ? prev.filter(id => id !== playerId) 
                : [...prev, playerId]
        );
    };

    const openMinigameModal = (record?: MinigameRecord) => {
        if (record) {
            // Edit Mode
            setEditingRecordId(record.id);
            setSelectedWinners(record.winners);
        } else {
            // New Mode
            setEditingRecordId(null);
            setSelectedWinners([]);
        }
        setShowMinigameModal(true);
    };

    const deleteMinigameRecord = () => {
        if (!editingRecordId) return;

        let newHistory = minigameHistory.filter(rec => rec.id !== editingRecordId);
        
        // Re-index rounds so they remain sequential (e.g. Round 1, 2, 3...)
        // Since the list is ordered newest-first, round = total - index
        newHistory = newHistory.map((rec, index) => ({
            ...rec,
            round: newHistory.length - index
        }));

        setMinigameHistory(newHistory);
        recalculateStats(newHistory, log.mentions); // Keep mentions, recalc minigames

        setShowMinigameModal(false);
        setEditingRecordId(null);
        setSelectedWinners([]);
    };

    const confirmMinigame = () => {
        let winnersToSave = selectedWinners;
        
        // Handle "All selected" as "No Winners" per user request
        if (selectedWinners.length === players.length) {
            winnersToSave = [];
        }

        let newHistory = [...minigameHistory];
        
        if (editingRecordId) {
             // UPDATE Existing
             newHistory = newHistory.map(rec => {
                 if (rec.id === editingRecordId) {
                     return { ...rec, winners: winnersToSave };
                 }
                 return rec;
             });
        } else {
             // CREATE New
             const newRecord: MinigameRecord = {
                 id: `mg-${Date.now()}`,
                 round: minigameHistory.length + 1,
                 winners: winnersToSave,
                 timestamp: Date.now()
             };
             newHistory = [newRecord, ...newHistory];
             setIsHistoryExpanded(true); // Auto expand on new add
        }
        
        setMinigameHistory(newHistory);
        recalculateStats(newHistory, log.mentions);

        // Reset
        setSelectedWinners([]);
        setEditingRecordId(null);
        setShowMinigameModal(false);
    };

    // Helper to recalculate total minigame wins based on history
    const recalculateStats = (history: MinigameRecord[], currentMentions: Record<string, Record<string, number>>) => {
        const newMinigamesStats: Record<string, number> = {};
        // Reset to 0
        players.forEach(p => newMinigamesStats[p.id] = 0);
        
        // Sum from history
        history.forEach(rec => {
            rec.winners.forEach(wid => {
                newMinigamesStats[wid] = (newMinigamesStats[wid] || 0) + 1;
            });
        });

        setLog({ minigames: newMinigamesStats, mentions: currentMentions });
    };

    const openVoteModal = (category: string) => {
        setActiveCategory(category);
        setShowVoteModal(true);
    }

    const confirmVote = (winnerId: string) => {
        if (!activeCategory) return;
        
        setLog(prev => {
            const catVotes = prev.mentions[activeCategory] || {};
            return {
                ...prev,
                mentions: {
                    ...prev.mentions,
                    [activeCategory]: {
                        ...catVotes,
                        [winnerId]: (catVotes[winnerId] || 0) + 1
                    }
                }
            }
        });
        setShowVoteModal(false);
        setActiveCategory(null);
    };

    const clearCategoryVotes = () => {
        if (!activeCategory) return;
        
        setLog(prev => {
            const newMentions = { ...prev.mentions };
            delete newMentions[activeCategory];
            return { ...prev, mentions: newMentions };
        });
        setShowVoteModal(false);
        setActiveCategory(null);
    }

    const getColorStyle = (color: GameColor) => {
        switch(color) {
            case 'red': return {bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200'};
            case 'blue': return {bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200'};
            case 'yellow': return {bg: 'bg-yellow-400', text: 'text-yellow-600', border: 'border-yellow-200'};
            case 'green': return {bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200'};
            case 'black': return {bg: 'bg-slate-900', text: 'text-slate-900', border: 'border-slate-800'};
            case 'white': return {bg: 'bg-white', text: 'text-slate-600', border: 'border-slate-300'};
            default: return {bg: 'bg-slate-500', text: 'text-slate-600', border: 'border-slate-200'};
        }
    };

    const voteCategories = [
        { id: 'strategy', label: 'Estratega', modalTitle: 'El Más Estratégico', icon: 'psychology', color: 'purple' },
        { id: 'chaos', label: 'Caótico', modalTitle: 'El Más Caótico', icon: 'local_fire_department', color: 'red' },
        { id: 'fun', label: 'Gracioso', modalTitle: 'Quien Más Hizo Reír', icon: 'sentiment_very_satisfied', color: 'amber' },
        { id: 'liar', label: 'Mentiroso', modalTitle: 'El Mejor Mentiroso', icon: 'theater_comedy', color: 'slate' },
    ];

    const getActiveCategoryModalTitle = () => {
        return voteCategories.find(c => c.id === activeCategory)?.modalTitle || 'Votación';
    }

    // Calculate total votes for the current active category
    const getTotalVotesForCategory = (catId: string) => {
        if (!log.mentions || !log.mentions[catId]) return 0;
        return Object.values(log.mentions[catId]).reduce((sum: number, count: number) => sum + count, 0);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#f5f7f8]">
            <Header title="Bitácora de Partida" actionIcon="settings" onBack={handleBack} />
            
            <div className="flex-1 px-4 pt-6 pb-24 overflow-y-auto no-scrollbar">
                
                {/* Header Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 text-center relative overflow-hidden">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-500 mb-4">
                        <span className="material-symbols-outlined text-[32px]">emoji_events</span>
                    </div>
                    <p className="text-gray-600 text-base font-medium leading-relaxed">
                        Registra los eventos de la partida para otorgar las menciones de honor.
                    </p>
                </div>
                
                <div className="space-y-8">
                    
                    {/* SECTION 1: MINIGAMES */}
                    <div>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="typo-h3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-action">trophy</span>
                                Minijuegos
                            </h3>
                            <button 
                                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                                className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                {isHistoryExpanded ? 'Ocultar Lista' : 'Ver Historial'}
                                <span className={`material-symbols-outlined text-sm transition-transform ${isHistoryExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                        </div>

                        {/* Register Button */}
                        <Button 
                            fullWidth 
                            className="bg-action shadow-lg shadow-action/20 mb-4" 
                            icon="add_circle"
                            onClick={() => openMinigameModal()}
                        >
                            Registrar Ganador de Minijuego
                        </Button>

                        {/* Collapsible History List - Stable Scrollbar */}
                        {isHistoryExpanded && (
                            <div className="flex flex-col gap-3" style={{scrollbarGutter: 'stable'}}>
                                {minigameHistory.length === 0 ? (
                                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        No hay minijuegos registrados aún.
                                    </div>
                                ) : (
                                    minigameHistory.map((record, idx) => (
                                        <div key={record.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ronda {record.round}</span>
                                                <span className="font-bold text-slate-800 text-sm">Minijuego</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    {record.winners.length === 0 ? (
                                                        <span className="text-xs text-slate-400 font-bold italic mr-1">Sin ganadores</span>
                                                    ) : (
                                                        record.winners.map(wid => {
                                                            const p = players.find(pl => pl.id === wid);
                                                            if (!p) return null;
                                                            const style = getColorStyle(p.color);
                                                            return (
                                                                <div key={wid} className={`size-8 rounded-full ${style.bg} flex items-center justify-center border ${style.border} shadow-sm`} title={p.name}>
                                                                    <span className={`material-symbols-outlined text-sm ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                                                </div>
                                                            )
                                                        })
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={() => openMinigameModal(record)}
                                                    className="size-8 rounded-full text-slate-400 hover:text-action hover:bg-slate-50 flex items-center justify-center transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <hr className="border-slate-200" />

                    {/* SECTION 2: OTHERS (VOTING) */}
                    <div>
                        <div className="mb-4 px-1">
                             <h3 className="typo-h3 flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-purple-500">hotel_class</span>
                                Otros
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">Votaciones opcionales para destacar jugadores.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {voteCategories.map(cat => {
                                const totalVotes = getTotalVotesForCategory(cat.id);
                                return (
                                    <button 
                                        key={cat.id}
                                        onClick={() => openVoteModal(cat.id)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-${cat.color}-200 hover:bg-${cat.color}-50 transition-all active:scale-[0.98] group`}
                                    >
                                        <div className={`size-10 rounded-full bg-${cat.color}-100 text-${cat.color}-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                            <span className="material-symbols-outlined">{cat.icon}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                                        <span className="text-[10px] font-bold text-slate-400 mt-0.5">({totalVotes} {totalVotes === 1 ? 'voto' : 'votos'})</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* Minigame Winner Modal */}
            {showMinigameModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMinigameModal(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                        <div className="p-6 border-b border-slate-100 bg-white text-center">
                            <h3 className="typo-h3 text-slate-900">{editingRecordId ? 'Editar Resultado' : '¿Quién Ganó el Minijuego?'}</h3>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Selecciona los ganadores del Minijuego de la Ronda</p>
                        </div>
                        
                        <div className="p-6 overflow-y-auto grid grid-cols-2 gap-4 bg-[#f8fafc]">
                            {players.map(p => {
                                const isSelected = selectedWinners.includes(p.id);
                                const style = getColorStyle(p.color);
                                return (
                                    <button 
                                        key={p.id}
                                        onClick={() => toggleWinnerSelection(p.id)}
                                        className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 aspect-[4/3] shadow-sm ${isSelected ? `border-action bg-white ring-2 ring-action/20` : 'border-white bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`size-14 rounded-full ${style.bg} flex items-center justify-center border ${style.border} shadow-md transition-transform ${isSelected ? 'scale-110' : ''}`}>
                                            <span className={`material-symbols-outlined text-3xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                        </div>
                                        <span className={`text-sm font-bold truncate w-full text-center ${isSelected ? 'text-action' : 'text-slate-700'}`}>{p.name}</span>
                                        
                                        {/* Corner checkmark similar to screenshot/registration */}
                                        <div className={`absolute top-3 right-3 size-6 rounded-full flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-action text-white scale-100' : 'bg-slate-100 text-slate-300 scale-0 opacity-0'}`}>
                                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                        
                        <div className="p-6 border-t border-slate-100 bg-white flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setShowMinigameModal(false)}
                                    className="px-4 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <Button className="flex-1 shadow-xl shadow-primary/20" onClick={confirmMinigame}>
                                    {(selectedWinners.length === 0 || selectedWinners.length === players.length) ? 'No hubo Ganadores' : 'Confirmar'}
                                </Button>
                            </div>
                            
                            {editingRecordId && (
                                <button 
                                    onClick={deleteMinigameRecord} 
                                    className="w-full py-3 rounded-xl text-danger font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2 mt-2"
                                >
                                    <span className="material-symbols-outlined icon-sm">delete</span> Eliminar este registro
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Vote Modal */}
            {showVoteModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowVoteModal(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                         <div className="p-6 border-b border-slate-100 bg-white text-center">
                            <h3 className="typo-h3 text-slate-900">{getActiveCategoryModalTitle()}</h3>
                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wide">
                                ({activeCategory ? getTotalVotesForCategory(activeCategory) : 0} {activeCategory && getTotalVotesForCategory(activeCategory) === 1 ? 'voto recibido' : 'votos recibidos'})
                            </p>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Toca al jugador que merece este título</p>
                        </div>
                        <div className="p-6 overflow-y-auto grid grid-cols-2 gap-4 bg-[#f8fafc]">
                             {players.map(p => {
                                const style = getColorStyle(p.color);
                                return (
                                    <button 
                                        key={p.id}
                                        onClick={() => confirmVote(p.id)}
                                        className="relative p-4 rounded-2xl border-2 border-white bg-white hover:border-slate-200 transition-all duration-200 flex flex-col items-center justify-center gap-3 aspect-[4/3] shadow-sm active:scale-95"
                                    >
                                        <div className={`size-14 rounded-full ${style.bg} flex items-center justify-center border ${style.border} shadow-md`}>
                                            <span className={`material-symbols-outlined text-3xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                        </div>
                                        <div className="w-full text-center">
                                            <span className="block text-sm font-bold truncate w-full text-slate-700">{p.name}</span>
                                        </div>
                                    </button>
                                )
                             })}
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-white flex flex-col gap-3">
                            <Button variant="outline" fullWidth onClick={() => setShowVoteModal(false)}>Cancelar</Button>
                            
                            <button 
                                onClick={clearCategoryVotes} 
                                className="w-full py-3 rounded-xl text-danger font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2 mt-2"
                            >
                                <span className="material-symbols-outlined icon-sm">delete</span> Borrar votos de esta categoría
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};