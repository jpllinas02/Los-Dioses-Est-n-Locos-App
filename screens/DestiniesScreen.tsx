import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, PlayerName } from '../components/UI';
import { Player, GameColor } from '../types';
import { STORAGE_KEYS, ROUTES } from '../constants';

export const DestiniesScreen: React.FC = () => {
    const navigate = useNavigate();
    // Core Data
    const [players, setPlayers] = useState<Player[]>([]);
    const [excludedIds, setExcludedIds] = useState<string[]>([]);
    
    // Modes: 'PUBLIC' (Instant result) | 'SECRET' (Hidden result per player)
    const [mode, setMode] = useState<'PUBLIC' | 'SECRET'>('PUBLIC');
    
    // State: 'IDLE' | 'RESULT' | 'SECRET_PHASE'
    const [gameState, setGameState] = useState<'IDLE' | 'RESULT' | 'SECRET_PHASE'>('IDLE');
    
    // Logic State
    const [winnerId, setWinnerId] = useState<string | null>(null);
    const [resetLocked, setResetLocked] = useState(false);
    
    // Secret Mode Reveal Logic
    const [isSecretRevealed, setIsSecretRevealed] = useState(false);
    
    // Switch Confirmation State
    const [pendingSwitchMode, setPendingSwitchMode] = useState<'PUBLIC' | 'SECRET' | null>(null);

    // Secret Mode Specifics
    const [secretModalPlayer, setSecretModalPlayer] = useState<Player | null>(null);
    const [seenPlayerIds, setSeenPlayerIds] = useState<string[]>([]);

    // Scroll Fade State
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
    };

    useEffect(() => {
        const storedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
        if (storedPlayers && JSON.parse(storedPlayers).length > 0) {
            setPlayers(JSON.parse(storedPlayers));
        } else {
            // No players, redirect to home
            navigate(ROUTES.HOME, { replace: true });
        }
    }, [navigate]);

    // Check scroll availability whenever players change or component mounts
    useEffect(() => {
        checkScroll();
        const timer = setTimeout(checkScroll, 100);
        return () => clearTimeout(timer);
    }, [players]);

    // --- Actions ---

    const toggleExclusion = (pid: string) => {
        if (gameState !== 'IDLE') return; // Lock during game
        setExcludedIds(prev => 
            prev.includes(pid) ? prev.filter(id => id !== pid) : [...prev, pid]
        );
    };

    const handleSwitchMode = (targetMode: 'PUBLIC' | 'SECRET') => {
        if (mode === targetMode) return;

        const candidates = players.filter(p => !excludedIds.includes(p.id));
        const allCandidatesSeen = candidates.every(p => seenPlayerIds.includes(p.id));
        
        const isBusyPublic = mode === 'PUBLIC' && gameState === 'RESULT' && resetLocked;
        const isBusySecret = mode === 'SECRET' && gameState === 'SECRET_PHASE' && !allCandidatesSeen;

        // If busy, require confirmation
        if (isBusyPublic || isBusySecret) {
            if (pendingSwitchMode !== targetMode) {
                setPendingSwitchMode(targetMode);
                return;
            }
        }

        resetGame();
        setMode(targetMode);
    };

    // Auto-reset pending confirmation when game is no longer busy
    useEffect(() => {
        const candidates = players.filter(p => !excludedIds.includes(p.id));
        const allCandidatesSeen = candidates.every(p => seenPlayerIds.includes(p.id));
        const isBusyPublic = mode === 'PUBLIC' && gameState === 'RESULT' && resetLocked;
        const isBusySecret = mode === 'SECRET' && gameState === 'SECRET_PHASE' && !allCandidatesSeen;

        if (!isBusyPublic && !isBusySecret && pendingSwitchMode) {
            setPendingSwitchMode(null);
        }
    }, [resetLocked, seenPlayerIds, players, excludedIds, mode, gameState, pendingSwitchMode]);

    const pickWinner = () => {
        const candidates = players.filter(p => !excludedIds.includes(p.id));
        if (candidates.length === 0) return null;
        const winner = candidates[Math.floor(Math.random() * candidates.length)];
        return winner.id;
    }

    const startSelection = () => {
        const winId = pickWinner();
        if (!winId) return;

        setWinnerId(winId);

        if (mode === 'PUBLIC') {
            setGameState('RESULT');
            setResetLocked(true);
            setTimeout(() => setResetLocked(false), 3000);
        } else {
            // Secret Mode starts immediately
            setGameState('SECRET_PHASE');
            setSeenPlayerIds([]);
            setIsSecretRevealed(false);
        }
    };

    const resetGame = () => {
        setGameState('IDLE');
        setWinnerId(null);
        setSecretModalPlayer(null);
        setSeenPlayerIds([]);
        setExcludedIds([]);
        setIsSecretRevealed(false);
        setPendingSwitchMode(null); // Clear any pending switch
    };

    const handleSecretCardClick = (player: Player) => {
        // Prevent re-opening seen cards
        if (seenPlayerIds.includes(player.id)) return;
        setSecretModalPlayer(player);
    };

    const closeSecretModal = () => {
        if (secretModalPlayer) {
            setSeenPlayerIds(prev => [...prev, secretModalPlayer.id]);
            setSecretModalPlayer(null);
        }
    }

    // --- Helpers ---
    const getColorStyle = (color: GameColor) => {
        switch(color) {
            case 'red': return { bg: 'bg-red-500', border: 'border-red-200', text: 'text-red-600', light: 'bg-red-50' };
            case 'blue': return { bg: 'bg-blue-500', border: 'border-blue-200', text: 'text-blue-600', light: 'bg-blue-50' };
            case 'yellow': return { bg: 'bg-yellow-400', border: 'border-yellow-200', text: 'text-yellow-600', light: 'bg-yellow-50' };
            case 'green': return { bg: 'bg-green-500', border: 'border-green-200', text: 'text-green-600', light: 'bg-green-50' };
            case 'black': return { bg: 'bg-slate-900', border: 'border-slate-800', text: 'text-slate-900', light: 'bg-slate-100' };
            case 'white': return { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-600', light: 'bg-white' };
            default: return { bg: 'bg-slate-500', border: 'border-slate-200', text: 'text-slate-600', light: 'bg-slate-50' };
        }
    };

    const winnerPlayer = players.find(p => p.id === winnerId);
    // Candidates are non-excluded players
    const candidatesCount = players.filter(p => !excludedIds.includes(p.id)).length;
    // For Secret Mode: Enable "Revelar Verdad" only when all CANDIDATES have seen their card
    const allCandidatesSeen = players
        .filter(p => !excludedIds.includes(p.id))
        .every(p => seenPlayerIds.includes(p.id));

    return (
        <div className="flex h-screen w-full flex-col bg-[#f8fafc]">
            <Header title="Selector de Destinos" actionIcon="settings" />

            {/* --- TOP: Player Filter --- */}
            <div className="bg-white border-b border-slate-100 pb-3 pt-4 px-4 shadow-sm z-20">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">¿QUIÉNES PARTICIPAN?</h3>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{candidatesCount} Jugadores</span>
                </div>
                {/* Horizontal Scrolling Wrapper */}
                <div className="relative">
                    {/* Left Fade */}
                    <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}></div>
                    
                    {/* Scroll Container */}
                    <div 
                        ref={scrollContainerRef}
                        onScroll={checkScroll}
                        className="overflow-x-auto no-scrollbar pb-1"
                    >
                        <div className="flex gap-3 px-2 w-max mx-auto">
                            {players.map(p => {
                                const isExcluded = excludedIds.includes(p.id);
                                const style = getColorStyle(p.color);
                                return (
                                    <button 
                                        key={p.id}
                                        onClick={() => toggleExclusion(p.id)}
                                        disabled={gameState !== 'IDLE'}
                                        className={`relative flex flex-col items-center gap-1.5 min-w-[60px] transition-all ${isExcluded ? 'opacity-60 grayscale' : 'opacity-100'} ${gameState !== 'IDLE' ? 'pointer-events-none' : 'active:scale-95'}`}
                                    >
                                        <div className={`size-12 rounded-full ${style.bg} border-2 ${style.border} flex items-center justify-center shadow-sm relative`}>
                                            <span className={`material-symbols-outlined text-2xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                            {isExcluded && (
                                                <div className="absolute top-1/2 left-1/2 w-[140%] h-[2px] bg-slate-600 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] z-20 shadow-sm border border-white/50"></div>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center">
                                            <PlayerName name={p.name} />
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right Fade */}
                    <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
            </div>

            {/* --- MIDDLE: Mode Switcher --- */}
            <div className="px-6 py-4">
                 <div className="flex bg-slate-100 p-1 rounded-xl relative isolate">
                     <button 
                        onClick={() => handleSwitchMode('PUBLIC')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all 
                        ${mode === 'PUBLIC' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                         {pendingSwitchMode === 'PUBLIC' ? '¿Confirmar?' : 'Público'}
                     </button>
                     <button 
                        onClick={() => handleSwitchMode('SECRET')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all 
                        ${mode === 'SECRET' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'} 
                        ${pendingSwitchMode === 'SECRET' ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300 relative z-10' : ''}`}
                     >
                         {pendingSwitchMode === 'SECRET' ? '¿Confirmar?' : 'Secreto'}
                     </button>
                 </div>
                 <p className="text-center text-xs text-slate-400 mt-2">
                     {mode === 'PUBLIC' ? 'El resultado será visible para todos inmediatamente.' : 'Cada jugador consultará su destino en privado.'}
                 </p>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 px-4 pb-6 overflow-hidden flex flex-col items-center justify-center">
                
                {/* IDLE STATE */}
                {gameState === 'IDLE' && (
                    <div className="w-full max-w-sm animate-float">
                        <Button 
                            fullWidth 
                            onClick={startSelection} 
                            disabled={candidatesCount === 0}
                            className="h-24 text-xl shadow-xl shadow-primary/20"
                            icon="auto_awesome"
                        >
                            Consultar Destino - {mode === 'PUBLIC' ? 'Público' : 'Secreto'}
                        </Button>
                    </div>
                )}

                {/* PUBLIC RESULT STATE */}
                {mode === 'PUBLIC' && gameState === 'RESULT' && winnerPlayer && (
                    <div className="w-full max-w-xs flex flex-col items-center">
                        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col items-center text-center animate-bounce-in relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent z-0"></div>
                            <div className="relative z-10 w-full">
                                <div className="size-32 rounded-full border-8 border-white shadow-lg mb-6 flex items-center justify-center bg-slate-100 mx-auto">
                                    <span className="material-symbols-outlined text-7xl text-slate-400">location_on</span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">El Destino Señala a</h3>
                                <h2 className="typo-h1 text-slate-900 mb-2">
                                    <PlayerName name={winnerPlayer.name} />
                                </h2>
                                {candidatesCount === 1 && (
                                    <p className="text-xs text-slate-400 italic mb-4 bg-slate-50 px-3 py-2 rounded-lg">
                                        (Bueno... eras el único participando 🤷‍♂️)
                                    </p>
                                )}
                                <Button 
                                    fullWidth 
                                    onClick={resetGame} 
                                    className={`h-16 bg-slate-900 text-white hover:bg-slate-800 shadow-lg ${resetLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={resetLocked}
                                >
                                    {resetLocked ? 'Espera...' : 'Reiniciar Destinos'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* SECRET PHASE STATE */}
                {mode === 'SECRET' && gameState === 'SECRET_PHASE' && (
                    <div className="w-full h-full flex flex-col">
                         <div className="flex-1 grid grid-cols-2 gap-3 overflow-y-auto content-start pb-24">
                             {players.map(p => {
                                 const isExcluded = excludedIds.includes(p.id);
                                 if (isExcluded) return null; // Don't show excluded cards
                                 
                                 const style = getColorStyle(p.color);
                                 const hasSeen = seenPlayerIds.includes(p.id);
                                 const isWinner = p.id === winnerId;
                                 
                                 if (isSecretRevealed) {
                                     return (
                                         <div key={p.id} className={`rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 h-32 animate-pop-in ${isWinner ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                             {isWinner ? (
                                                 <>
                                                    <div className="size-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                                                        <span className="material-symbols-outlined text-2xl">check</span>
                                                    </div>
                                                    <span className="font-black text-xl text-green-700 tracking-tight">SÍ</span>
                                                 </>
                                             ) : (
                                                 <>
                                                    <div className="size-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shadow-sm">
                                                        <span className="material-symbols-outlined text-2xl">close</span>
                                                    </div>
                                                    <span className="font-black text-xl text-slate-400 tracking-tight">NO</span>
                                                 </>
                                             )}
                                             <span className="text-xs font-bold text-slate-500">
                                                 <PlayerName name={p.name} />
                                             </span>
                                         </div>
                                     )
                                 }

                                 if (hasSeen) {
                                     return (
                                        <div key={p.id} className="bg-slate-100 rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center gap-2 opacity-60 h-32">
                                            <span className="material-symbols-outlined text-slate-400 text-3xl">lock</span>
                                            <span className="font-bold text-slate-500 text-sm">Visto</span>
                                        </div>
                                     )
                                 }

                                 return (
                                     <button 
                                        key={p.id}
                                        onClick={() => handleSecretCardClick(p)}
                                        className={`relative rounded-xl shadow-sm border-2 p-4 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform h-32 ${style.bg} ${style.border}`}
                                     >
                                         <div className={`size-12 rounded-full flex items-center justify-center mb-1 backdrop-blur-sm ${p.color === 'white' ? 'bg-black/10 text-slate-900' : 'bg-white/20 text-white'}`}>
                                             <span className="material-symbols-outlined text-2xl">visibility</span>
                                         </div>
                                         <span className={`font-bold text-sm ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>
                                            Soy <PlayerName name={p.name} />
                                         </span>
                                     </button>
                                 )
                             })}
                         </div>

                         <div className="absolute bottom-6 left-0 right-0 flex justify-center px-6">
                            <Button 
                                fullWidth 
                                onClick={isSecretRevealed ? resetGame : () => setIsSecretRevealed(true)}
                                disabled={!allCandidatesSeen}
                                className={allCandidatesSeen ? (isSecretRevealed ? 'bg-slate-900 text-white shadow-lg' : 'bg-primary text-white shadow-lg') : 'bg-slate-300 shadow-none'}
                            >
                                {!allCandidatesSeen 
                                    ? 'Faltan jugadores por ver' 
                                    : (isSecretRevealed ? 'Reiniciar Destinos' : 'Revelar Resultados')
                                }
                            </Button>
                         </div>
                    </div>
                )}
            </div>

            {secretModalPlayer && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col p-8 items-center text-center animate-float">
                        <h3 className="typo-caption text-slate-400 mb-4">Destino de <PlayerName name={secretModalPlayer.name} /></h3>
                        
                        <div className={`size-40 rounded-full flex items-center justify-center mb-6 shadow-xl border-8 ${secretModalPlayer.id === winnerId ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                            {secretModalPlayer.id === winnerId ? (
                                <span className="font-black text-6xl tracking-tighter">SÍ</span>
                            ) : (
                                <span className="font-black text-6xl tracking-tighter">NO</span>
                            )}
                        </div>

                        <p className="text-sm text-slate-500 mb-4 leading-relaxed px-4">
                            {secretModalPlayer.id === winnerId 
                                ? "El destino te ha seleccionado."
                                : "No has sido seleccionado."}
                        </p>

                        <Button fullWidth onClick={closeSecretModal} className="bg-slate-900 mt-2">
                            Entendido
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};