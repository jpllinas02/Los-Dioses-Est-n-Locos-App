import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Button, BottomBar, PlayerName } from '../components/UI';
import { Player, GameColor } from '../types';
import { shuffle, DEFAULT_NAME_POOL } from '../utils';

// --- Types for Log ---
interface MinigameRecord {
    id: string;
    round: number;
    winners: string[];
    timestamp: number;
}

// --- VICTORY LOG COMPONENT ---
export const VictoryLogScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [players, setPlayers] = useState<Player[]>([]);
    
    // Check if we came from calculator
    const isFromCalculator = location.state?.fromCalculator;
    // Check if we came from Minigame Selector to auto-open modal
    const shouldAutoOpenModal = location.state?.openMinigameModal;

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
    
    // New UI State for Vote Feedback
    const [justVotedId, setJustVotedId] = useState<string | null>(null);
    const [isClearingVotes, setIsClearingVotes] = useState(false);

    // Initialize Modal from Navigation State
    useEffect(() => {
        if (shouldAutoOpenModal) {
            setShowMinigameModal(true);
        }
    }, [shouldAutoOpenModal]);

    useEffect(() => {
        const storedPlayers = localStorage.getItem('game_players');
        const storedLog = localStorage.getItem('game_log');
        const storedHistory = localStorage.getItem('game_minigame_history');

        let currentPlayers: Player[] = [];

        if (storedPlayers && JSON.parse(storedPlayers).length > 0) {
            currentPlayers = JSON.parse(storedPlayers);
        } else {
             // Fallback: Generate Default Players for Victory Log usage with random names
            const shuffledPool = shuffle([...DEFAULT_NAME_POOL]);

            const defaultColors: GameColor[] = ['red', 'blue', 'yellow', 'green', 'black', 'white'];
            currentPlayers = defaultColors.map((color, index) => ({
                id: `def-${index}`,
                name: shuffledPool[index], // Use random name
                pact: 'Atenea',
                color: color
            }));
        }
        
        setPlayers(currentPlayers);
            
        if (storedLog) {
            const parsedLog = JSON.parse(storedLog);
            if (parsedLog.decisions && !parsedLog.mentions) {
                parsedLog.mentions = { 'strategy': parsedLog.decisions };
            }
            setLog(parsedLog.mentions ? parsedLog : { minigames: {}, mentions: {} });
        } else {
            const initialLog = { minigames: {}, mentions: {} };
            currentPlayers.forEach((p: Player) => {
                // @ts-ignore
                initialLog.minigames[p.id] = 0;
            });
            setLog(initialLog);
        }

        if (storedHistory) {
            setMinigameHistory(JSON.parse(storedHistory));
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
        if (isFromCalculator) {
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
            setEditingRecordId(record.id);
            setSelectedWinners(record.winners);
        } else {
            setEditingRecordId(null);
            setSelectedWinners([]);
        }
        setShowMinigameModal(true);
    };

    const handleCloseMinigameModal = () => {
        setShowMinigameModal(false);
        setEditingRecordId(null);
        setSelectedWinners([]);
        
        if (shouldAutoOpenModal) {
            navigate(-1);
        }
    };

    const deleteMinigameRecord = () => {
        if (!editingRecordId) return;

        let newHistory = minigameHistory.filter(rec => rec.id !== editingRecordId);
        
        // Re-index rounds
        newHistory = newHistory.map((rec, index) => ({
            ...rec,
            round: newHistory.length - index
        }));

        setMinigameHistory(newHistory);
        recalculateStats(newHistory, log.mentions); 

        handleCloseMinigameModal(); 
    };

    const confirmMinigame = () => {
        let winnersToSave = selectedWinners;
        
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
        setShowMinigameModal(false);
        setEditingRecordId(null);
        setSelectedWinners([]);

        // Smart return if came from game
        if (shouldAutoOpenModal) {
            navigate(-1);
        }
    };

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
        
        setJustVotedId(winnerId);

        setTimeout(() => {
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
            setJustVotedId(null); // Reset
        }, 700);
    };

    const clearCategoryVotes = () => {
        if (!activeCategory) return;
        
        setIsClearingVotes(true);

        setTimeout(() => {
            setLog(prev => {
                const newMentions = { ...prev.mentions };
                delete newMentions[activeCategory];
                return { ...prev, mentions: newMentions };
            });
            setShowVoteModal(false);
            setActiveCategory(null);
            setIsClearingVotes(false);
        }, 700); // 700ms duration
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

    const getTotalVotesForCategory = (catId: string) => {
        if (!log.mentions || !log.mentions[catId]) return 0;
        return Object.values(log.mentions[catId]).reduce((sum: number, count: number) => sum + count, 0);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#f5f7f8]">
            <Header title="Bitácora de Partida" actionIcon="settings" onBack={handleBack} />
            
            <div className="flex-1 px-4 pt-6 pb-36 overflow-y-auto no-scrollbar">
                
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
                                {isHistoryExpanded ? 'Ocultar Lista' : 'Mostrar Lista'}
                                <span className={`material-symbols-outlined text-sm transition-transform ${isHistoryExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                        </div>

                        <Button 
                            fullWidth 
                            className="bg-action shadow-lg shadow-action/20 mb-4" 
                            icon="add_circle"
                            onClick={() => openMinigameModal()}
                        >
                            Registrar Ganador de Minijuego
                        </Button>

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
                    {/* BACKDROP with Smart Close */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseMinigameModal}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                        <div className="p-5 border-b border-slate-100 bg-white text-center relative">
                            <h3 className="typo-h3 text-slate-900">{editingRecordId ? 'Editar Resultado' : '¿Quién Ganó el Minijuego?'}</h3>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Selecciona los ganadores de la Ronda</p>
                        </div>
                        
                        <div className="p-5 overflow-y-auto grid grid-cols-2 gap-3 bg-[#f8fafc]">
                            {players.map(p => {
                                const isSelected = selectedWinners.includes(p.id);
                                const style = getColorStyle(p.color);
                                return (
                                    <button 
                                        key={p.id}
                                        onClick={() => toggleWinnerSelection(p.id)}
                                        className={`relative p-3 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 h-28 shadow-sm ${isSelected ? `border-action bg-white ring-2 ring-action/20` : 'border-white bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`size-12 rounded-full ${style.bg} flex items-center justify-center border ${style.border} shadow-md transition-transform ${isSelected ? 'scale-110' : ''}`}>
                                            <span className={`material-symbols-outlined text-2xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                        </div>
                                        <span className={`text-sm font-bold truncate w-full text-center ${isSelected ? 'text-action' : 'text-slate-700'}`}>
                                            <PlayerName name={p.name} />
                                        </span>
                                        
                                        <div className={`absolute top-2 right-2 size-5 rounded-full flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-action text-white scale-100' : 'bg-slate-100 text-slate-300 scale-0 opacity-0'}`}>
                                            <span className="material-symbols-outlined text-xs font-bold">check</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                        
                        <div className="p-5 border-t border-slate-100 bg-white flex flex-col gap-3">
                            <div className="flex gap-3 w-full">
                                <Button variant="ghost" className="flex-1" onClick={handleCloseMinigameModal}>Cancelar</Button>
                                <Button className="flex-[2] shadow-xl shadow-primary/20" onClick={confirmMinigame}>
                                    {(selectedWinners.length === 0 || selectedWinners.length === players.length) ? 'No Hubo Ganadores' : 'Confirmar'}
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
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isClearingVotes && setShowVoteModal(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                         
                         {isClearingVotes && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-300">
                                <div className="flex flex-col items-center justify-center animate-pop-in">
                                    <div className="size-14 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-3 shadow-xl border-4 border-white">
                                        <span className="material-symbols-outlined text-3xl font-bold">delete</span>
                                    </div>
                                    <p className="text-red-500 font-bold text-lg animate-pulse">¡Votos Eliminados!</p>
                                </div>
                            </div>
                         )}

                         <div className="p-5 border-b border-slate-100 bg-white text-center">
                            <h3 className="typo-h3 text-slate-900">{getActiveCategoryModalTitle()}</h3>
                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wide">
                                ({activeCategory ? getTotalVotesForCategory(activeCategory) : 0} {activeCategory && getTotalVotesForCategory(activeCategory) === 1 ? 'voto recibido' : 'votos recibidos'})
                            </p>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Toca al jugador que merece este título</p>
                        </div>
                        <div className="p-5 overflow-y-auto grid grid-cols-2 gap-3 bg-[#f8fafc] relative">
                             {players.map(p => {
                                const style = getColorStyle(p.color);
                                const isJustVoted = justVotedId === p.id;
                                
                                return (
                                    <button 
                                        key={p.id}
                                        onClick={() => confirmVote(p.id)}
                                        disabled={justVotedId !== null || isClearingVotes}
                                        className={`relative p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 h-28 shadow-sm active:scale-95 overflow-hidden ${isJustVoted ? 'bg-green-50 border-green-500 scale-105' : 'border-white bg-white hover:border-slate-200'}`}
                                    >
                                        {isJustVoted ? (
                                            <div className="flex flex-col items-center justify-center w-full h-full animate-pop-in">
                                                <div className="size-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg mb-2 border-4 border-white">
                                                    <span className="material-symbols-outlined text-3xl font-bold">check</span>
                                                </div>
                                                <span className="text-green-600 font-bold text-sm animate-pulse">¡Voto!</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={`size-12 rounded-full ${style.bg} flex items-center justify-center border ${style.border} shadow-md transition-transform`}>
                                                    <span className={`material-symbols-outlined text-2xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                                </div>
                                                <div className="w-full text-center relative z-10">
                                                    <span className="block text-sm font-bold truncate w-full text-slate-700">
                                                        <PlayerName name={p.name} />
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </button>
                                )
                             })}
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-white flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setShowVoteModal(false)} disabled={isClearingVotes}>Cancelar</Button>
                            
                            <button 
                                onClick={clearCategoryVotes} 
                                disabled={isClearingVotes}
                                className="flex-1 py-3 rounded-xl text-danger font-bold text-sm hover:bg-red-50 border border-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined icon-sm">delete</span> Borrar votos
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isFromCalculator && (
                <BottomBar className="bg-white border-t border-slate-100">
                    <Button 
                        fullWidth 
                        onClick={() => navigate('/calculator', { state: { initialShowSummary: true } })} 
                        icon="check"
                    >
                        Volver al Resumen
                    </Button>
                </BottomBar>
            )}

        </div>
    );
};

// --- CALCULATOR COMPONENT ---
export const CalculatorScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [stats, setStats] = useState<Record<string, {relics: number, plagues: number, powers: number}>>({});
    
    // New States for Flow Control
    const [showFinalSummary, setShowFinalSummary] = useState(location.state?.initialShowSummary || false);
    const [isEditingFromSummary, setIsEditingFromSummary] = useState(false);

    // Touch Handling State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Load players on mount
    useEffect(() => {
        const storedPlayers = localStorage.getItem('game_players');
        const storedStats = localStorage.getItem('game_stats');

        if (storedPlayers && JSON.parse(storedPlayers).length > 0) {
            const parsedPlayers = JSON.parse(storedPlayers);
            setPlayers(parsedPlayers);
            
            if (storedStats) {
                setStats(JSON.parse(storedStats));
            } else {
                const initialStats: Record<string, any> = {};
                parsedPlayers.forEach((p: Player) => {
                    initialStats[p.id] = { relics: 0, plagues: 0, powers: 0 };
                });
                setStats(initialStats);
            }
        } else {
            // Fallback
            const shuffledPool = shuffle([...DEFAULT_NAME_POOL]);
            
            const defaultColors: GameColor[] = ['red', 'blue', 'yellow', 'green', 'black', 'white'];
            const defaults: Player[] = defaultColors.map((color, index) => ({
                id: `def-${index}`,
                name: shuffledPool[index], // Use random name
                pact: 'Atenea',
                color: color
            }));
            setPlayers(defaults);
            const initialStats: Record<string, any> = {};
            defaults.forEach((p: Player) => {
                initialStats[p.id] = { relics: 0, plagues: 0, powers: 0 };
            });
            setStats(initialStats);
        }
    }, []);

    // Save stats whenever they change
    useEffect(() => {
        if (Object.keys(stats).length > 0) {
            localStorage.setItem('game_stats', JSON.stringify(stats));
        }
    }, [stats]);

    const currentPlayer = players[currentPlayerIndex];

    const updateStat = (type: 'relics' | 'plagues' | 'powers', delta: number) => {
        if (!currentPlayer) return;
        setStats(prev => ({
            ...prev,
            [currentPlayer.id]: {
                ...prev[currentPlayer.id],
                [type]: Math.max(0, (prev[currentPlayer.id][type] || 0) + delta)
            }
        }));
    };

    const handleInputChange = (type: 'relics' | 'plagues' | 'powers', value: string) => {
        if (!currentPlayer) return;
        const numValue = parseInt(value) || 0;
        setStats(prev => ({
            ...prev,
            [currentPlayer.id]: {
                ...prev[currentPlayer.id],
                [type]: Math.max(0, numValue)
            }
        }));
    };

    // Navigation Logic
    const goToNextPlayer = () => {
        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(prev => prev + 1);
        }
    };

    const goToPrevPlayer = () => {
        if (currentPlayerIndex > 0) {
            setCurrentPlayerIndex(prev => prev - 1);
        }
    };

    const handleNextButton = () => {
        if (isEditingFromSummary) {
            setShowFinalSummary(true);
            setIsEditingFromSummary(false);
            return;
        }

        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(prev => prev + 1);
        } else {
            setShowFinalSummary(true);
        }
    };

    const handleBackArrow = () => {
        if (isEditingFromSummary) {
            setShowFinalSummary(true);
            setIsEditingFromSummary(false);
            return;
        }

        if (showFinalSummary) {
            setShowFinalSummary(false);
            if (players.length > 0) {
                setCurrentPlayerIndex(players.length - 1);
            }
            return;
        }

        navigate('/game');
    };

    const handleEditPlayerFromSummary = (index: number) => {
        setCurrentPlayerIndex(index);
        setIsEditingFromSummary(true);
        setShowFinalSummary(false);
    };

    const handleFinalizeGame = () => {
        const finalResults = players.map(p => {
            const s = stats[p.id];
            let totalScore = 0;

            switch (p.pact) {
                case 'Atenea':
                    // Relic (+3), Plague (-1), Power (0)
                    totalScore = (s.relics * 3) + (s.plagues * -1);
                    break;
                case 'Loki':
                    // Relic (+2), Plague (+1), Power (0)
                    totalScore = (s.relics * 2) + (s.plagues * 1);
                    break;
                case 'Longwang':
                    // Relic (+2), Plague (-1), Power (+1)
                    totalScore = (s.relics * 2) + (s.plagues * -1) + (s.powers * 1);
                    break;
                default:
                    totalScore = 0;
            }

            return {
                ...p,
                scoreDetails: s,
                score: totalScore
            };
        });
        
        localStorage.setItem('game_results', JSON.stringify(finalResults));
        navigate('/leaderboard');
    };

    // --- Touch Handlers ---
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        if (isEditingFromSummary) return;

        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    }

    const onTouchMove = (e: React.TouchEvent) => {
        if (isEditingFromSummary) return;
        setTouchEnd(e.targetTouches[0].clientX);
    }

    const onTouchEnd = () => {
        if (isEditingFromSummary) return;
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentPlayerIndex < players.length - 1) {
             goToNextPlayer();
        }
        if (isRightSwipe && currentPlayerIndex > 0) {
             goToPrevPlayer();
        }
    }

    const getColorStyle = (color: GameColor) => {
        switch(color) {
            case 'red': return { border: 'border-red-500 shadow-red-500/20', bg: 'bg-red-500', dot: 'bg-red-500' };
            case 'blue': return { border: 'border-blue-500 shadow-blue-500/20', bg: 'bg-blue-500', dot: 'bg-blue-500' };
            case 'yellow': return { border: 'border-yellow-400 shadow-yellow-400/20', bg: 'bg-yellow-400', dot: 'bg-yellow-400' };
            case 'green': return { border: 'border-green-500 shadow-green-500/20', bg: 'bg-green-500', dot: 'bg-green-500' };
            case 'black': return { border: 'border-slate-800 shadow-slate-800/20', bg: 'bg-slate-900', dot: 'bg-slate-900' };
            case 'white': return { border: 'border-slate-300 shadow-slate-300/20', bg: 'bg-slate-200', dot: 'bg-slate-400' };
            default: return { border: 'border-slate-200', bg: 'bg-slate-200', dot: 'bg-primary' };
        }
    };

    let mainButtonText = "Siguiente";
    let mainButtonIcon = "arrow_forward";

    if (isEditingFromSummary) {
        mainButtonText = "Guardar y Volver";
        mainButtonIcon = "check";
    } else if (currentPlayerIndex === players.length - 1) {
        mainButtonText = "Finalizar";
        mainButtonIcon = "list_alt";
    }

    if (players.length === 0) return <div className="flex h-screen items-center justify-center">Cargando...</div>;

    const currentStats = stats[currentPlayer.id] || { relics: 0, plagues: 0, powers: 0 };
    const playerStyle = getColorStyle(currentPlayer.color);

    return (
        <div className="flex min-h-screen flex-col bg-background">
             <Header 
                title={showFinalSummary ? "Resumen Final" : "Calculadora"} 
                showBack={true} 
                onBack={handleBackArrow}
                actionIcon="settings"
             />
            
            {!showFinalSummary ? (
                // --- INPUT VIEW ---
                <>
                    <div 
                        className="flex-1 overflow-y-auto no-scrollbar pb-32"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {!isEditingFromSummary && (
                            <div className="flex w-full flex-row items-center justify-center gap-2 py-6">
                                {players.map((p, idx) => {
                                    const pStyle = getColorStyle(p.color);
                                    const isActive = idx === currentPlayerIndex;
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`h-2.5 rounded-full transition-all duration-300 ${isActive ? `w-8 shadow-sm ${pStyle.dot}` : 'w-2.5 bg-gray-200'}`}
                                        ></div>
                                    );
                                })}
                            </div>
                        )}
                        
                        {isEditingFromSummary && <div className="h-8"></div>}

                        <div className="relative flex items-center justify-center px-2 mb-8 w-full max-w-lg mx-auto">
                            {!isEditingFromSummary && currentPlayerIndex > 0 && (
                                <button
                                    onClick={goToPrevPlayer}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-slate-300/60 hover:text-primary transition-colors z-20 animate-pulse active:scale-95"
                                    aria-label="Jugador Anterior"
                                >
                                    <span className="material-symbols-outlined text-6xl">chevron_left</span>
                                </button>
                            )}

                            <div className="flex flex-col items-center gap-5 z-10">
                                <div className={`relative h-32 w-32 bg-white flex items-center justify-center rounded-full border-[6px] shadow-lg transition-all duration-500 ${playerStyle.border}`}>
                                    <span className={`material-symbols-outlined text-7xl text-slate-800`}>face</span>
                                    <div className={`absolute bottom-0 right-0 h-10 w-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${playerStyle.bg}`}>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <h1 className="typo-h1 text-center">
                                        <PlayerName name={currentPlayer.name} />
                                    </h1>
                                    <p className="typo-body font-medium text-center mt-1 text-slate-500">Ingresa sus resultados finales</p>
                                </div>
                            </div>

                            {!isEditingFromSummary && currentPlayerIndex < players.length - 1 && (
                                <button
                                    onClick={goToNextPlayer}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-300/60 hover:text-primary transition-colors z-20 animate-pulse active:scale-95"
                                    aria-label="Siguiente Jugador"
                                >
                                    <span className="material-symbols-outlined text-6xl">chevron_right</span>
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 px-4 w-full max-w-md mx-auto">
                            
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 transition-colors hover:border-cyan-200">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 border border-cyan-100 shrink-0 h-16 w-16 shadow-sm">
                                        <span className="material-symbols-outlined text-[36px] filled" style={{fontVariationSettings: "'FILL' 1"}}>diamond</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="typo-h3 text-slate-800">Reliquias</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                    <button onClick={() => updateStat('relics', -1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-slate-500 font-bold text-xl">-</button>
                                    <input 
                                        type="number" 
                                        value={currentStats.relics} 
                                        onChange={(e) => handleInputChange('relics', e.target.value)}
                                        className="w-12 text-center text-xl font-black text-slate-800 bg-transparent focus:outline-none focus:bg-slate-100 rounded-md"
                                    />
                                    <button onClick={() => updateStat('relics', 1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyan-500 text-white shadow-md shadow-cyan-200 hover:bg-cyan-600 active:scale-95 transition-all font-bold text-xl">+</button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 transition-colors hover:border-purple-200">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center rounded-2xl bg-purple-50 text-purple-500 border border-purple-100 shrink-0 h-16 w-16 shadow-sm">
                                        <span className="material-symbols-outlined text-[36px] filled" style={{fontVariationSettings: "'FILL' 1"}}>skull</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="typo-h3 text-slate-800">Plagas</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                    <button onClick={() => updateStat('plagues', -1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-slate-500 font-bold text-xl">-</button>
                                    <input 
                                        type="number" 
                                        value={currentStats.plagues} 
                                        onChange={(e) => handleInputChange('plagues', e.target.value)}
                                        className="w-12 text-center text-xl font-black text-slate-800 bg-transparent focus:outline-none focus:bg-slate-100 rounded-md"
                                    />
                                    <button onClick={() => updateStat('plagues', 1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-500 text-white shadow-md shadow-purple-200 hover:bg-purple-600 active:scale-95 transition-all font-bold text-xl">+</button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 transition-colors hover:border-yellow-200">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500 border border-yellow-100 shrink-0 h-16 w-16 shadow-sm">
                                        <span className="material-symbols-outlined text-[36px] filled" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="typo-h3 text-slate-800">Poderes</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                    <button onClick={() => updateStat('powers', -1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-slate-500 font-bold text-xl">-</button>
                                    <input 
                                        type="number" 
                                        value={currentStats.powers} 
                                        onChange={(e) => handleInputChange('powers', e.target.value)}
                                        className="w-12 text-center text-xl font-black text-slate-800 bg-transparent focus:outline-none focus:bg-slate-100 rounded-md"
                                    />
                                    <button onClick={() => updateStat('powers', 1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-yellow-400 text-white shadow-md shadow-yellow-200 hover:bg-yellow-500 active:scale-95 transition-all font-bold text-xl">+</button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <BottomBar className="bg-white border-t border-slate-100">
                        <Button fullWidth onClick={handleNextButton} icon={mainButtonIcon}>
                            {mainButtonText}
                        </Button>
                    </BottomBar>
                </>
            ) : (
                // --- SUMMARY TABLE VIEW ---
                <>
                    <div className="flex-1 overflow-y-auto p-4 pb-32">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="grid grid-cols-5 gap-2 p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                                <div className="col-span-2 text-left pl-2">Jugador</div>
                                <div><span className="material-symbols-outlined text-lg align-middle text-cyan-500">diamond</span></div>
                                <div><span className="material-symbols-outlined text-lg align-middle text-purple-500">skull</span></div>
                                <div><span className="material-symbols-outlined text-lg align-middle text-yellow-500">bolt</span></div>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {players.map((p, index) => {
                                    const s = stats[p.id];
                                    const pStyle = getColorStyle(p.color);
                                    return (
                                        <div 
                                            key={p.id} 
                                            onClick={() => handleEditPlayerFromSummary(index)}
                                            className="grid grid-cols-5 gap-2 p-4 items-center text-center cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors group"
                                        >
                                            <div className="col-span-2 flex items-center gap-3 text-left overflow-hidden">
                                                <div className={`size-8 rounded-full ${pStyle.bg} flex items-center justify-center shrink-0 border border-black/10`}>
                                                    <span className={`material-symbols-outlined text-lg ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                                </div>
                                                <span className="font-bold text-slate-900 truncate text-sm group-hover:text-primary transition-colors">
                                                    <PlayerName name={p.name} />
                                                </span>
                                            </div>
                                            <div className="font-bold text-slate-600">{s.relics}</div>
                                            <div className="font-bold text-slate-600">{s.plagues}</div>
                                            <div className="font-bold text-slate-600">{s.powers}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <p className="text-center text-slate-400 text-xs mt-4 px-4 leading-relaxed">
                            Toca el nombre de un jugador para modificar sus puntos.<br/>
                            Revisa que todo esté correcto antes de calcular.
                        </p>
                    </div>
                    <BottomBar className="bg-white border-t border-slate-100">
                        <div className="w-full flex flex-col gap-3">
                            <Button 
                                fullWidth 
                                onClick={handleFinalizeGame} 
                                icon="emoji_events" 
                                className="h-auto py-3 !bg-[#f44611] hover:!bg-[#d63b0b] text-white !shadow-[0_4px_15px_rgba(244,70,17,0.4)]"
                            >
                                <div className="flex flex-col items-center leading-none">
                                    <span className="text-lg font-bold">Calcular Ganador</span>
                                    <span className="text-[10px] font-medium opacity-80 mt-1 tracking-wide">Y Revelar Pactos</span>
                                </div>
                            </Button>
                            <Button 
                                fullWidth 
                                variant="ghost" 
                                onClick={() => navigate('/victory-log', { state: { fromCalculator: true } })} 
                                icon="menu_book" 
                                className="text-sm font-bold text-slate-500"
                            >
                                Actualizar la Bitácora
                            </Button>
                        </div>
                    </BottomBar>
                </>
            )}
        </div>
    )
}

// --- LEADERBOARD COMPONENT ---
export const LeaderboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState<Player[]>([]);
    const [gameLog, setGameLog] = useState<{minigames: Record<string, number>, mentions?: Record<string, Record<string, number>>, decisions?: Record<string, number>} | null>(null);
    const [honorCounts, setHonorCounts] = useState<Record<string, number>>({});

    const calculateHonorCounts = (players: Player[], log: any) => {
        const counts: Record<string, number> = {};
        players.forEach(p => counts[p.id] = 0);

        if (!log) return counts;

        if (log.minigames) {
            let max = 0;
            const minigames = log.minigames as Record<string, number>;
            Object.values(minigames).forEach((v) => { if (v > max) max = v; });
            
            if (max > 0) {
                const winners = Object.keys(minigames).filter(id => minigames[id] === max);
                winners.forEach(id => { if(counts[id] !== undefined) counts[id]++; });
            }
        }

        if (log.mentions) {
            Object.keys(log.mentions).forEach(catId => {
                const votes = log.mentions[catId] as Record<string, number>;
                let max = 0;
                Object.values(votes).forEach((v) => { if (v > max) max = v; });
                
                if (max > 0) {
                    const winners = Object.keys(votes).filter(id => votes[id] === max);
                    winners.forEach(id => { if(counts[id] !== undefined) counts[id]++; });
                }
            });
        }

        return counts;
    }

    useEffect(() => {
        const storedResults = localStorage.getItem('game_results');
        const storedLog = localStorage.getItem('game_log');
        let parsedLog = null;
        let parsedResults: Player[] = [];

        if (storedLog) {
            parsedLog = JSON.parse(storedLog);
            setGameLog(parsedLog);
        }

        if (storedResults) {
            parsedResults = JSON.parse(storedResults);
            const calculatedHonors = calculateHonorCounts(parsedResults, parsedLog);
            setHonorCounts(calculatedHonors);
            
            const sorted = parsedResults.sort((a: Player, b: Player) => {
                const scoreDiff = (b.score || 0) - (a.score || 0);
                if (scoreDiff !== 0) return scoreDiff;

                const honorsA = calculatedHonors[a.id] || 0;
                const honorsB = calculatedHonors[b.id] || 0;
                return honorsB - honorsA;
            });
            
            setResults(sorted);
        } else {
            setResults([]); 
        }
    }, []);

    const winner = results.length > 0 ? results[0] : null;
    const others = results.length > 1 ? results.slice(1) : [];

    const getMinigameHonor = () => {
        if (!gameLog?.minigames || !results.length) return null;
        let max = 0;
        let bestPids: string[] = [];
        
        Object.entries(gameLog.minigames).forEach(([id, c]) => {
            const count = c as number;
            if (count > max) {
                max = count;
                bestPids = [id];
            } else if (count === max) {
                bestPids.push(id);
            }
        });

        if (max <= 0 || bestPids.length === 0) return null;

        const bestPlayer = results
            .filter(p => bestPids.includes(p.id))
            .sort((a,b) => (b.score || 0) - (a.score || 0))[0];

        if (!bestPlayer) return null;

        return {
            player: bestPlayer,
            count: max,
            title: 'Maestro de Minijuegos',
            icon: 'trophy'
        };
    };

    const getCategoryHonors = () => {
        if (!gameLog?.mentions || !results.length) return [];
        
        const categories = [
             { id: 'strategy', title: 'El Más Estratégico', icon: 'psychology' },
             { id: 'chaos', title: 'El Más Caótico', icon: 'local_fire_department' },
             { id: 'fun', title: 'Quien Más Hizo Reír', icon: 'sentiment_very_satisfied' },
             { id: 'liar', title: 'El Mejor Mentiroso', icon: 'theater_comedy' },
        ];

        const honors: any[] = [];

        categories.forEach(cat => {
            const catVotes = gameLog.mentions![cat.id];
            if (!catVotes) return;

            let max = 0;
            let bestPids: string[] = [];

            Object.entries(catVotes).forEach(([pid, c]) => {
                const count = c as number;
                if (count > max) {
                    max = count;
                    bestPids = [pid];
                } else if (count === max) {
                    bestPids.push(pid);
                }
            });

            if (max > 0 && bestPids.length > 0) {
                 const bestPlayer = results
                    .filter(p => bestPids.includes(p.id))
                    .sort((a,b) => (b.score || 0) - (a.score || 0))[0];
                 
                 if (bestPlayer) {
                     honors.push({
                         player: bestPlayer,
                         count: max,
                         ...cat
                     });
                 }
            }
        });

        return honors;
    };

    const minigameHonor = getMinigameHonor();
    const categoryHonors = getCategoryHonors();
    const hasHonors = minigameHonor || categoryHonors.length > 0;

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

    const getHonorColorStyles = (color: GameColor) => {
        switch(color) {
            case 'red': return {
                gradient: 'from-red-50', 
                border: 'border-red-200 border-l-4 border-l-red-500', 
                bgIcon: 'bg-red-500 shadow-md shadow-red-500/30', 
                textIcon: 'text-white',
                textTitle: 'text-red-900',
                badge: 'bg-white border border-red-200 text-red-700'
            };
            case 'blue': return {
                gradient: 'from-blue-50', 
                border: 'border-blue-200 border-l-4 border-l-blue-500', 
                bgIcon: 'bg-blue-500 shadow-md shadow-blue-500/30', 
                textIcon: 'text-white',
                textTitle: 'text-blue-900',
                badge: 'bg-white border border-blue-200 text-blue-700'
            };
            case 'green': return {
                gradient: 'from-green-50', 
                border: 'border-green-200 border-l-4 border-l-green-500', 
                bgIcon: 'bg-green-500 shadow-md shadow-green-500/30', 
                textIcon: 'text-white',
                textTitle: 'text-green-900',
                badge: 'bg-white border border-green-200 text-green-700'
            };
            case 'yellow': return {
                gradient: 'from-yellow-50', 
                border: 'border-yellow-200 border-l-4 border-l-yellow-400', 
                bgIcon: 'bg-yellow-400 shadow-md shadow-yellow-400/30', 
                textIcon: 'text-white',
                textTitle: 'text-yellow-800',
                badge: 'bg-white border border-yellow-200 text-yellow-700'
            };
            case 'black': return {
                gradient: 'from-slate-100', 
                border: 'border-slate-300 border-l-4 border-l-slate-900', 
                bgIcon: 'bg-slate-900 shadow-md shadow-slate-900/30', 
                textIcon: 'text-white',
                textTitle: 'text-slate-900',
                badge: 'bg-white border border-slate-300 text-slate-800'
            };
            case 'white': return {
                gradient: 'from-slate-50', 
                border: 'border-slate-200 border-l-4 border-l-slate-400', 
                bgIcon: 'bg-white border border-slate-200', 
                textIcon: 'text-slate-500', 
                textTitle: 'text-slate-600',
                badge: 'bg-slate-50 border border-slate-200 text-slate-600'
            };
            default: return {
                gradient: 'from-slate-50',
                border: 'border-slate-100 border-l-4 border-l-slate-400',
                bgIcon: 'bg-slate-100',
                textIcon: 'text-slate-500',
                textTitle: 'text-slate-600',
                badge: 'bg-slate-100 text-slate-500'
            };
        }
    };

    const getRank = (index: number) => {
        const actualRank = index + 1;
        if (index === 0) return 1;
        
        const curr = results[index];
        const prev = results[index - 1];
        
        const currHonors = honorCounts[curr.id] || 0;
        const prevHonors = honorCounts[prev.id] || 0;

        if ((curr.score || 0) === (prev.score || 0) && currHonors === prevHonors) {
             const firstIndex = results.findIndex(p => 
                 (p.score || 0) === (curr.score || 0) && 
                 (honorCounts[p.id] || 0) === currHonors
             );
             return firstIndex + 1;
        }
        
        return actualRank;
    }

    if (results.length === 0) {
        return (
            <div className="flex min-h-screen flex-col bg-background items-center justify-center p-6 text-center">
                 <h2 className="typo-h2">No hay resultados aún</h2>
                 <p className="typo-body mb-4">Termina una partida para ver la tabla.</p>
                 <Button onClick={()=>navigate('/game')}>Volver al Juego</Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header title="Resultados Finales" actionIcon="share" />
            <div className="flex-1 overflow-y-auto pb-32 relative">
                 <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>
                 <div className="relative z-10 pt-4 pb-2 px-4 text-center mt-6">
                    <h1 className="typo-h1">
                        ¡Campeón Supremo!
                    </h1>
                 </div>

                 {winner && (
                     <div className="p-4 relative z-10">
                         <div className="flex flex-col items-center justify-center rounded-2xl shadow-lg bg-white border-2 border-primary overflow-hidden relative p-6">
                            <div className="absolute top-3 right-3 animate-bounce">
                                <span className="material-symbols-outlined text-yellow-500 text-4xl filled" style={{fontVariationSettings: "'FILL' 1"}}>crown</span>
                            </div>
                            <div className={`w-32 h-32 rounded-full border-4 shadow-md flex items-center justify-center mb-4 ${getColorStyle(winner.color).bg}`}>
                                <span className={`material-symbols-outlined text-7xl ${winner.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                            </div>
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold mb-2">
                                {getRank(0) === 1 ? '1er Lugar' : `${getRank(0)}º Lugar`}
                            </div>
                            <p className="typo-h2">
                                <PlayerName name={winner.name} />
                            </p>
                            <p className="text-text-muted text-sm font-medium">Pacto: <span className="font-bold text-slate-800">{winner.pact}</span></p>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-4xl font-extrabold text-primary">{winner.score}</span>
                                <span className="text-lg font-medium text-text-muted">PTS</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 w-full mt-4 bg-slate-50 p-2 rounded-xl">
                                <div className="text-center">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Reliquias</span>
                                    <span className="font-bold text-cyan-600">{winner.scoreDetails?.relics || 0}</span>
                                </div>
                                <div className="text-center border-l border-slate-200">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Plagas</span>
                                    <span className="font-bold text-purple-600">{winner.scoreDetails?.plagues || 0}</span>
                                </div>
                                <div className="text-center border-l border-slate-200">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Poderes</span>
                                    <span className="font-bold text-yellow-600">{winner.scoreDetails?.powers || 0}</span>
                                </div>
                            </div>
                         </div>
                     </div>
                 )}

                 <div className="px-4 mt-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="grid grid-cols-[3rem_1fr_4rem] bg-slate-50 border-b border-slate-200 py-2 px-3">
                             <div className="text-xs font-bold text-slate-400 uppercase text-center">Pos</div>
                             <div className="text-xs font-bold text-slate-400 uppercase text-left pl-2">Jugador</div>
                             <div className="text-xs font-bold text-slate-400 uppercase text-right">Pts</div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {others.map((p, i) => {
                                const overallIndex = i + 1; // 0 is winner
                                const rank = getRank(overallIndex);
                                return (
                                <div key={p.id} className="grid grid-cols-[3rem_1fr_4rem] items-center py-3 px-3">
                                    <div className="flex justify-center">
                                        <div className="flex size-7 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-sm border border-slate-200">{rank}</div>
                                    </div>
                                    <div className="flex items-center gap-3 pl-2 overflow-hidden">
                                        <div className={`size-9 rounded-full flex items-center justify-center shadow-sm shrink-0 border ${getColorStyle(p.color).border} ${getColorStyle(p.color).bg}`}>
                                            <span className={`material-symbols-outlined text-lg ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-slate-900 font-bold text-sm truncate">
                                                <PlayerName name={p.name} />
                                            </p>
                                            <p className="text-slate-400 text-xs truncate">Pacto: {p.pact}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-900 font-bold text-lg">{p.score}</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                 </div>

                 {hasHonors && (
                    <div className="px-4 mt-8 mb-4">
                        <h3 className="text-center typo-h3 mb-4 text-slate-500">Menciones Honoríficas</h3>
                        <div className="grid gap-3">
                            {minigameHonor && (
                                <div className={`bg-gradient-to-r ${getHonorColorStyles(minigameHonor.player.color).gradient} to-white p-4 rounded-xl border ${getHonorColorStyles(minigameHonor.player.color).border} flex items-center gap-4 shadow-sm`}>
                                    <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${getHonorColorStyles(minigameHonor.player.color).bgIcon} ${getHonorColorStyles(minigameHonor.player.color).textIcon}`}>
                                        <span className="material-symbols-outlined text-2xl">{minigameHonor.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <p className={`text-xs font-bold uppercase tracking-wider ${getHonorColorStyles(minigameHonor.player.color).textTitle}`}>{minigameHonor.title}</p>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getHonorColorStyles(minigameHonor.player.color).badge}`}>{minigameHonor.count} {minigameHonor.count === 1 ? 'Victoria' : 'Victorias'}</span>
                                        </div>
                                        <p className="font-bold text-slate-900 text-lg">
                                            <PlayerName name={minigameHonor.player.name} />
                                        </p>
                                    </div>
                                </div>
                            )}
                            {categoryHonors.map((honor) => (
                                <div key={honor.id} className={`bg-gradient-to-r ${getHonorColorStyles(honor.player.color).gradient} to-white p-4 rounded-xl border ${getHonorColorStyles(honor.player.color).border} flex items-center gap-4 shadow-sm`}>
                                    <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${getHonorColorStyles(honor.player.color).bgIcon} ${getHonorColorStyles(honor.player.color).textIcon}`}>
                                        <span className="material-symbols-outlined text-2xl">{honor.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                         <div className="flex justify-between items-baseline">
                                            <p className={`text-xs font-bold uppercase tracking-wider ${getHonorColorStyles(honor.player.color).textTitle}`}>{honor.title}</p>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getHonorColorStyles(honor.player.color).badge}`}>{honor.count} {honor.count === 1 ? 'Voto' : 'Votos'}</span>
                                        </div>
                                        <p className="font-bold text-slate-900 text-lg">
                                            <PlayerName name={honor.player.name} />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
            </div>
            
            <BottomBar className="bg-white border-t border-slate-100">
                <Button variant="outline" className="flex-1" icon="home" onClick={()=>navigate('/')}>Inicio</Button>
                <Button className="flex-[2]" onClick={()=>navigate('/registration')} icon="replay">Nueva Partida</Button>
            </BottomBar>
        </div>
    );
};