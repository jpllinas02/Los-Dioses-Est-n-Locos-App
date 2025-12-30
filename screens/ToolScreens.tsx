import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, BottomBar } from '../components/UI';
import { Player, GameColor } from '../types';

// --- Timer Screen ---
export const TimerScreen: React.FC = () => {
    return (
        <div className="relative flex h-screen w-full flex-col bg-[#f8f6f5] font-display overflow-hidden text-[#392c28]">
             <div className="absolute inset-0 z-0">
                <img className="h-full w-full object-cover opacity-5 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYa-OoofmWSBinPaouh8-IMH4Htbm-QgS4P4A44BJpjsRfYF3-5EdFTfc12TXPelhdaJgCRMtAdAPKCUFARpN8bWjLSFGIHC5JndSoL7NomaCKIND6c7rCUqOJmEv_uvRAWkCNOoTo838PAlratp2m9qm80rMRpy-plFgCl_joDwcl25_cLrW36ibjR5hPqjkUr9pGdw5rWCsnz4ZXfNWPfgmiuDahHFi6ZjG5q8wYTY5X2b_35vUVYX9VQ562fMTj7EDgG6UkyW8"/>
            </div>
            <Header title="Temporizador" transparent actionIcon="settings" />
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-center gap-4 py-6 w-full px-6">
                    <button className="px-5 py-2.5 rounded-xl bg-white border border-[#392c28]/10 text-[#392c28] font-bold">00:30</button>
                    <button className="px-5 py-2.5 rounded-xl bg-danger border border-danger text-white shadow-[0_0_15px_rgba(242,70,13,0.3)] font-bold">01:00</button>
                    <button className="px-5 py-2.5 rounded-xl bg-white border border-[#392c28]/10 text-[#392c28] font-bold">01:30</button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center w-full px-4 min-h-0">
                    <div className="relative flex items-center justify-center">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-[#392c28]/10 relative flex items-center justify-center bg-white/60 backdrop-blur-sm shadow-xl">
                            <svg className="absolute inset-0 w-full h-full -rotate-90 transform p-2" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" fill="none" r="46" stroke="#e5e5e5" strokeWidth="6"></circle>
                                <circle cx="50" cy="50" fill="none" r="46" stroke="#f2460d" strokeDasharray="289" strokeDashoffset="40" strokeLinecap="round" strokeWidth="6"></circle>
                            </svg>
                            <div className="flex flex-col items-center z-10 text-[#392c28]">
                                <div className="flex items-baseline justify-center">
                                    <span className="text-7xl font-bold tracking-tighter tabular-nums leading-none">05</span>
                                    <span className="text-7xl font-bold tracking-tighter mb-2 animate-pulse text-[#392c28]/80">:</span>
                                    <span className="text-7xl font-bold tracking-tighter tabular-nums leading-none">00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center px-5 pb-10 pt-12 relative z-20">
                     <Button variant="danger" className="w-full max-w-[320px] h-16 text-lg" icon="play_arrow">START TIMER</Button>
                </div>
            </div>
        </div>
    );
};

// --- Calculator Screen ---
export const CalculatorScreen: React.FC = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [stats, setStats] = useState<Record<string, {relics: number, plagues: number, powers: number}>>({});
    
    // New States for Flow Control
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showFinalSummary, setShowFinalSummary] = useState(false);

    // Load players on mount
    useEffect(() => {
        const storedPlayers = localStorage.getItem('game_players');
        const storedStats = localStorage.getItem('game_stats');

        if (storedPlayers) {
            const parsedPlayers = JSON.parse(storedPlayers);
            setPlayers(parsedPlayers);
            
            if (storedStats) {
                // Restore stats if available
                setStats(JSON.parse(storedStats));
            } else {
                // Initialize stats for each player if not present
                const initialStats: Record<string, any> = {};
                parsedPlayers.forEach((p: Player) => {
                    initialStats[p.id] = { relics: 0, plagues: 0, powers: 0 };
                });
                setStats(initialStats);
            }
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

    const handleNext = () => {
        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(prev => prev + 1);
        } else {
            // Last player, show summary before finalizing
            setShowFinalSummary(true);
        }
    };

    const handleBackArrow = () => {
        if (showFinalSummary) {
            // Go back to input view, preserving all stats
            setShowFinalSummary(false);
            return;
        }

        if (currentPlayerIndex > 0) {
            setCurrentPlayerIndex(prev => prev - 1);
        } else {
            // If first player, try to exit
            setShowExitConfirm(true);
        }
    };

    const handleFinalizeGame = () => {
        const finalResults = players.map(p => {
            const s = stats[p.id];
            let totalScore = 0;

            // Scoring Logic based on Pact
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

    // Helper for styles based on color
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
                    <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                        {/* Dynamic Progress Dots */}
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

                        {/* Player Header */}
                        <div className="flex flex-col items-center gap-5 px-6 mb-8">
                            <div className={`relative h-32 w-32 bg-white flex items-center justify-center rounded-full border-[6px] shadow-lg transition-all duration-500 ${playerStyle.border}`}>
                                <span className={`material-symbols-outlined text-7xl text-slate-800`}>face</span>
                                {/* Player Color Badge */}
                                <div className={`absolute bottom-0 right-0 h-10 w-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${playerStyle.bg}`}>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center animate-float">
                                <h1 className="typo-h1 text-center">Jugador {currentPlayerIndex + 1}: {currentPlayer.name}</h1>
                                <p className="typo-body font-medium text-center mt-1 text-slate-500">Ingresa sus resultados finales</p>
                            </div>
                        </div>

                        {/* Input Items */}
                        <div className="flex flex-col gap-4 px-4 w-full max-w-md mx-auto">
                            
                            {/* RELICS */}
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

                            {/* PLAGUES */}
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

                            {/* POWERS */}
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
                        <Button fullWidth onClick={handleNext} icon={currentPlayerIndex === players.length - 1 ? "list_alt" : "arrow_forward"}>
                            {currentPlayerIndex === players.length - 1 ? "Finalizar" : "Siguiente"}
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
                                {players.map(p => {
                                    const s = stats[p.id];
                                    const pStyle = getColorStyle(p.color);
                                    return (
                                        <div key={p.id} className="grid grid-cols-5 gap-2 p-4 items-center text-center">
                                            <div className="col-span-2 flex items-center gap-3 text-left overflow-hidden">
                                                <div className={`size-8 rounded-full ${pStyle.bg} flex items-center justify-center shrink-0 border border-black/10`}>
                                                    <span className={`material-symbols-outlined text-lg ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                                </div>
                                                <span className="font-bold text-slate-900 truncate text-sm">{p.name}</span>
                                            </div>
                                            <div className="font-bold text-slate-600">{s.relics}</div>
                                            <div className="font-bold text-slate-600">{s.plagues}</div>
                                            <div className="font-bold text-slate-600">{s.powers}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <p className="text-center text-slate-400 text-xs mt-4 px-4">
                            Revisa que todo esté correcto antes de calcular al ganador.
                        </p>
                    </div>
                    <BottomBar className="bg-white border-t border-slate-100">
                        <Button fullWidth onClick={handleFinalizeGame} icon="emoji_events" className="animate-pulse h-auto py-3">
                             <div className="flex flex-col items-center leading-none">
                                <span>Calcular Ganador</span>
                                <span className="text-[10px] font-medium opacity-80 mt-1 tracking-wide">Y Revelar Pactos</span>
                            </div>
                        </Button>
                    </BottomBar>
                </>
            )}

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)}></div>
                    <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-6 flex flex-col items-center text-center">
                        <span className="material-symbols-outlined text-4xl text-danger mb-2">warning</span>
                        <h3 className="typo-h3 mb-2">¿Cancelar cálculo?</h3>
                        <p className="text-sm text-slate-500 mb-6">Se perderá los datos ingresados hasta ahora.</p>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-600">Continuar</button>
                            <button onClick={() => navigate('/game')} className="flex-1 py-3 rounded-xl bg-danger text-white font-bold">Salir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// --- Destinies Screen ---
export const DestiniesScreen: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [mode, setMode] = useState<'Public' | 'Secret'>('Public');
    const [excludedPlayers, setExcludedPlayers] = useState<string[]>([]);
    
    // States for Flow
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [countdownValue, setCountdownValue] = useState(5);
    const [isRevealed, setIsRevealed] = useState(false);
    const [winnerId, setWinnerId] = useState<string | null>(null);
    const [showReset, setShowReset] = useState(false);

    // Secret Mode States
    const [seenPlayers, setSeenPlayers] = useState<string[]>([]);
    const [modalPlayer, setModalPlayer] = useState<Player | null>(null);

    useEffect(() => {
        const storedPlayers = localStorage.getItem('game_players');
        if (storedPlayers) {
            setPlayers(JSON.parse(storedPlayers));
        }
    }, []);

    // Countdown Timer Logic
    useEffect(() => {
        let interval: any;
        if (isCountingDown && countdownValue > 0) {
            interval = setInterval(() => {
                setCountdownValue(prev => prev - 1);
            }, 1000);
        } else if (isCountingDown && countdownValue === 0) {
            // Timer Finished - Enable Reset
            setIsCountingDown(false);
            setShowReset(true);
        }
        return () => clearInterval(interval);
    }, [isCountingDown, countdownValue]);

    const toggleExclusion = (pid: string) => {
        // Prevent interaction during countdown or once revealed
        if (isCountingDown || isRevealed) return;
        
        setExcludedPlayers(prev => 
            prev.includes(pid) 
                ? prev.filter(id => id !== pid) 
                : [...prev, pid]
        );
    };

    // Helper to Reset State
    const resetState = () => {
        setIsRevealed(false);
        setWinnerId(null);
        setShowReset(false);
        setCountdownValue(5);
        setSeenPlayers([]);
        setExcludedPlayers([]); // Reset exclusions on restart as requested
    };

    const handleAction = () => {
        if (showReset) {
            resetState();
            return;
        }

        // Calculate Winner
        const candidates = players.filter(p => !excludedPlayers.includes(p.id));
        if (candidates.length === 0) return;

        const winner = candidates[Math.floor(Math.random() * candidates.length)];
        setWinnerId(winner.id);
        
        // Show Results Immediately
        setIsRevealed(true);

        // Start 5s timer to enable Reset button
        setIsCountingDown(true);
    };

    const handleModeSwitch = (newMode: 'Public' | 'Secret') => {
        if (isCountingDown) return; // Block only during countdown
        setMode(newMode);
        // Switching mode acts as a reset if we are in revealed state
        if (isRevealed) {
            resetState();
        }
    };

    const handleSecretCheck = (player: Player) => {
        setModalPlayer(player);
    };

    const confirmSecretView = () => {
        if (modalPlayer) {
            setSeenPlayers(prev => [...prev, modalPlayer.id]);
            setModalPlayer(null);
        }
    };

    const getColorStyle = (color: GameColor) => {
        switch(color) {
            case 'red': return { bg: 'bg-red-500', border: 'border-red-200' };
            case 'blue': return { bg: 'bg-blue-500', border: 'border-blue-200' };
            case 'yellow': return { bg: 'bg-yellow-400', border: 'border-yellow-200' };
            case 'green': return { bg: 'bg-green-500', border: 'border-green-200' };
            case 'black': return { bg: 'bg-slate-900', border: 'border-slate-800' };
            case 'white': return { bg: 'bg-white', border: 'border-slate-300' };
            default: return { bg: 'bg-slate-500', border: 'border-slate-200' };
        }
    };

    // Calculate positions for players in a circle
    const getPlayerPosition = (index: number, total: number) => {
        const radius = 130; // Distance from center
        const angle = (index * (360 / total)) - 90; // Start from top
        const radian = (angle * Math.PI) / 180;
        return {
            left: `calc(50% + ${Math.cos(radian) * radius}px)`,
            top: `calc(50% + ${Math.sin(radian) * radius}px)`,
        };
    };

    const buttonLabel = useMemo(() => {
        if (showReset) return "Reiniciar Destinos";
        if (isCountingDown) return `${countdownValue}`;
        return `Mostrar Destinos - ${mode === 'Public' ? 'Público' : 'Secreto'}`;
    }, [showReset, isCountingDown, countdownValue, mode]);

    return (
        <div className="bg-[#f8f9fc] min-h-screen font-display flex flex-col overflow-hidden">
            <Header title="Selector de Destinos" actionIcon="settings" />
            
            {/* Top Controls */}
            <div className="pt-6 px-6 z-20">
                <p className="text-center text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">¿Quieres que el Destino sea público o secreto?</p>
                <div className="flex h-10 w-full max-w-xs mx-auto items-center justify-center rounded-xl bg-white p-1 shadow-sm border border-slate-200">
                    <button 
                        onClick={() => handleModeSwitch('Public')} 
                        disabled={isCountingDown}
                        className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all duration-300 ${isCountingDown ? 'opacity-50 cursor-not-allowed' : ''} ${mode==='Public' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-slate-50'}`}
                    >
                        <span className="truncate text-sm font-bold tracking-wide">Público</span>
                    </button>
                    <button 
                        onClick={() => handleModeSwitch('Secret')} 
                        disabled={isCountingDown}
                        className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all duration-300 ${isCountingDown ? 'opacity-50 cursor-not-allowed' : ''} ${mode==='Secret' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-slate-50'}`}
                    >
                        <span className="truncate text-sm font-bold tracking-wide">Secreto</span>
                    </button>
                </div>
            </div>

            <main className="relative flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto overflow-hidden">
                
                {/* Radial Layout */}
                <div className="relative w-[340px] h-[340px] flex items-center justify-center mt-[-40px]">
                     {/* Center Button */}
                     <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button 
                            onClick={handleAction}
                            disabled={isCountingDown}
                            className={`relative group w-40 h-40 rounded-full flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(79,44,224,0.35)] transition-all duration-200 ring-8 ring-white/50 backdrop-blur-sm 
                                ${isCountingDown 
                                    ? 'bg-primary opacity-50 cursor-not-allowed scale-95 shadow-none ring-primary/30' 
                                    : 'bg-gradient-to-br from-[#6345e8] to-[#330df2] active:scale-95'
                                }
                            `}
                        >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center gap-1 p-2">
                                 {!isCountingDown && (
                                     <div className="bg-white/10 p-3 rounded-full mb-1 backdrop-blur-md border border-white/20 shadow-lg">
                                        <span className="material-symbols-outlined text-3xl text-white">
                                            {showReset ? 'replay' : 'auto_awesome'}
                                        </span>
                                     </div>
                                 )}
                                 <span className={`font-black uppercase leading-tight tracking-wider text-white ${isCountingDown ? 'text-6xl' : 'text-xs'}`}>
                                    {buttonLabel}
                                 </span>
                            </div>
                        </button>
                     </div>

                     {/* Players */}
                     {players.map((p, i) => {
                         const pos = getPlayerPosition(i, players.length);
                         const style = getColorStyle(p.color);
                         const isExcluded = excludedPlayers.includes(p.id);
                         const isWinner = winnerId === p.id;
                         const hasSeen = seenPlayers.includes(p.id);
                         const showSecretEye = isRevealed && mode === 'Secret' && !isExcluded && !hasSeen;
                         const playerIcon = mode === 'Public' ? 'face' : 'visibility';
                         
                         return (
                            <div 
                                key={p.id}
                                onClick={() => toggleExclusion(p.id)}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-300 z-30
                                    ${isExcluded ? 'opacity-40 grayscale scale-95' : 'opacity-100'} 
                                    ${!isCountingDown && !isRevealed ? 'cursor-pointer active:scale-95 hover:scale-105' : ''}
                                `}
                                style={{ left: pos.left, top: pos.top }}
                            >
                                <div className={`relative size-14 rounded-full ${style.bg} border-2 ${style.border} shadow-md flex items-center justify-center z-10 transition-all overflow-hidden`}>
                                    <span className={`material-symbols-outlined text-2xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>{playerIcon}</span>
                                    
                                    {/* SEEN Diagonal Line Overlay */}
                                    {hasSeen && mode === 'Secret' && (
                                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <div className="w-full h-1 bg-white/80 rotate-45 transform"></div>
                                         </div>
                                    )}

                                    {/* PUBLIC RESULT: Result Bubble */}
                                    {isRevealed && mode === 'Public' && !isExcluded && (
                                        <div className={`absolute -top-4 -right-2 px-2 py-0.5 rounded-lg border-2 shadow-sm text-[10px] font-black uppercase tracking-wider animate-bounce ${isWinner ? 'bg-green-500 border-green-600 text-white z-20 scale-125' : 'bg-white border-slate-200 text-slate-400'}`}>
                                            {isWinner ? 'SÍ' : 'NO'}
                                        </div>
                                    )}

                                    {/* SECRET RESULT: Eye Button Overlay */}
                                    {showSecretEye && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSecretCheck(p);
                                            }}
                                            className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
                                        >
                                            <span className="material-symbols-outlined text-2xl">visibility</span>
                                        </button>
                                    )}
                                </div>
                                <span className={`text-[10px] font-bold bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-100 shadow-sm truncate max-w-[80px] ${isWinner && isRevealed && mode === 'Public' ? 'text-primary' : 'text-slate-600'}`}>{p.name}</span>
                            </div>
                         );
                     })}
                </div>

                 <div className="w-[90%] rounded-xl bg-white border border-slate-200 shadow-lg shadow-primary/5 p-4 relative overflow-hidden mt-4 mx-auto mb-6">
                     <div className="flex flex-col gap-2 relative z-10 text-center">
                        <div className="flex items-center justify-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-[20px]">info</span>
                            <span className="text-xs font-bold uppercase tracking-wider">{mode === 'Public' ? 'Modo Público' : 'Modo Secreto'}</span>
                        </div>
                        <p className="typo-body text-xs text-slate-500">
                            {mode === 'Public' 
                                ? "Toca a los jugadores para excluirlos. El oráculo elegirá visiblemente a uno." 
                                : "Pasa el dispositivo. Cada jugador descubrirá su destino en privado pulsando el ojo."}
                        </p>
                     </div>
                 </div>
            </main>

            {/* Secret Result Modal */}
            {modalPlayer && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col p-8 items-center text-center animate-float">
                        <h3 className="typo-caption text-slate-400 mb-2">Destino de {modalPlayer.name}</h3>
                        
                        <div className={`size-32 rounded-full flex items-center justify-center mb-6 shadow-xl border-4 ${modalPlayer.id === winnerId ? 'bg-green-100 border-green-200 text-green-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                            <span className="font-black text-5xl tracking-tighter">
                                {modalPlayer.id === winnerId ? 'SÍ' : 'NO'}
                            </span>
                        </div>

                        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                            {modalPlayer.id === winnerId 
                                ? "¡El destino te ha elegido! Asume la responsabilidad."
                                : "Has sido salvado por esta vez. Continúa jugando."}
                        </p>

                        <Button fullWidth onClick={confirmSecretView} className={modalPlayer.id === winnerId ? 'bg-green-500 shadow-green-500/30' : 'bg-slate-800'}>
                            Aceptar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}