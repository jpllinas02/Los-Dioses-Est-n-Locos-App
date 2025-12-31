import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Button, BottomBar } from '../components/UI';
import { Player, GameColor } from '../types';

// --- Timer Screen ---
export const TimerScreen: React.FC = () => {
    // State
    const [totalTime, setTotalTime] = useState(60); // Default 1 minute
    const [timeLeft, setTimeLeft] = useState(60);
    const [isRunning, setIsRunning] = useState(false);
    
    // Audio States
    const [narrationOn, setNarrationOn] = useState(true);
    const [soundtrackOn, setSoundtrackOn] = useState(false);

    // Input Refs for manual editing
    const minutesInputRef = useRef<HTMLInputElement>(null);
    const secondsInputRef = useRef<HTMLInputElement>(null);

    // Timer Logic
    useEffect(() => {
        let interval: any = null;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            // Optional: Play sound here
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    // Formatters
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    // Handlers
    const toggleTimer = () => {
        if (timeLeft === 0) {
            setTimeLeft(totalTime);
        }
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(totalTime);
    };

    const handleQuickSelect = (seconds: number) => {
        if (isRunning) return;
        setTotalTime(seconds);
        setTimeLeft(seconds);
    };

    const handleManualInput = (type: 'min' | 'sec', value: string) => {
        let val = parseInt(value) || 0;
        if (type === 'sec' && val > 59) val = 59;
        if (val < 0) val = 0;

        let newTotal = 0;
        if (type === 'min') {
            newTotal = (val * 60) + (totalTime % 60);
        } else {
            newTotal = (Math.floor(totalTime / 60) * 60) + val;
        }

        setTotalTime(newTotal);
        setTimeLeft(newTotal);
    };

    // SVG Circle Calculations
    const radius = 140; 
    const circumference = 2 * Math.PI * radius;
    // Visually target the next second when running to consume immediately
    const displayTime = isRunning ? Math.max(0, timeLeft - 1) : timeLeft;
    const strokeDashoffset = circumference - (displayTime / totalTime) * circumference;

    return (
        <div className="flex h-screen w-full flex-col bg-[#f8fafc] font-display overflow-hidden text-slate-900">
            <Header title="Temporizador" actionIcon="settings" />
            
            <div className="relative z-10 flex flex-col h-full items-center">
                
                {/* Quick Select Options */}
                <div className="w-full px-6 pt-6 pb-2">
                    <div className="flex justify-between gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                         {[30, 60, 90].map((sec) => (
                             <button
                                key={sec}
                                onClick={() => handleQuickSelect(sec)}
                                disabled={isRunning}
                                className={`flex-1 py-4 rounded-xl text-base font-bold transition-all 
                                    ${totalTime === sec 
                                        ? 'bg-primary text-white shadow-md' 
                                        : 'bg-transparent text-slate-500 hover:bg-slate-50'}
                                    ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                             >
                                 {Math.floor(sec / 60)}:{formatNumber(sec % 60)}
                             </button>
                         ))}
                    </div>
                </div>

                {/* Main Timer Display */}
                <div className="flex-1 flex flex-col items-center justify-center w-full px-4 min-h-0 relative">
                    <div className="relative flex items-center justify-center">
                        {/* SVG Progress Circle */}
                        <div className="relative flex items-center justify-center">
                             {/* Background Circle */}
                            <svg className="w-[340px] h-[340px] -rotate-90 transform" viewBox="0 0 300 300">
                                <circle 
                                    cx="150" cy="150" r={radius} 
                                    fill="none" 
                                    stroke="#e2e8f0" 
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                ></circle>
                                {/* Progress Circle - Faster animation (duration-300) */}
                                <circle 
                                    cx="150" cy="150" r={radius} 
                                    fill="none" 
                                    stroke={timeLeft < 10 && isRunning ? "#f44611" : "#f44611"} 
                                    strokeDasharray={circumference} 
                                    strokeDashoffset={isNaN(strokeDashoffset) ? 0 : strokeDashoffset}
                                    strokeLinecap="round" 
                                    strokeWidth="12"
                                    className="transition-all duration-300 ease-out"
                                ></circle>
                            </svg>
                            
                            {/* Absolute Overlay */}
                            <div className="absolute inset-0">
                                {/* Timer Digits - Perfectly Centered */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pb-3">
                                    <input 
                                        ref={minutesInputRef}
                                        type="number"
                                        disabled={isRunning}
                                        value={formatNumber(minutes)}
                                        onChange={(e) => handleManualInput('min', e.target.value)}
                                        className={`w-[110px] text-center text-7xl font-bold bg-transparent focus:outline-none p-0 leading-none tracking-tighter text-slate-900 placeholder-slate-900 selection:bg-primary/20`}
                                    />
                                    <span className="text-7xl font-bold text-slate-300 mx-0 pb-2">:</span>
                                    <input 
                                        ref={secondsInputRef}
                                        type="number"
                                        disabled={isRunning}
                                        value={formatNumber(seconds)}
                                        onChange={(e) => handleManualInput('sec', e.target.value)}
                                        className={`w-[110px] text-center text-7xl font-bold bg-transparent focus:outline-none p-0 leading-none tracking-tighter text-slate-900 placeholder-slate-900 selection:bg-primary/20`}
                                    />
                                </div>
                                
                                {/* Reset Button - Positioned absolutely at bottom of circle area */}
                                <div className="absolute bottom-12 left-0 right-0 flex justify-center">
                                    <button 
                                        onClick={resetTimer}
                                        className="h-16 w-16 rounded-full flex items-center justify-center text-slate-300 hover:text-primary hover:bg-slate-50 transition-all active:scale-95"
                                        title="Reiniciar"
                                    >
                                        <span className="material-symbols-outlined text-4xl">replay</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Action Button - Now Above Audio */}
                <div className="w-full px-4 mb-6">
                    <Button 
                        fullWidth 
                        onClick={toggleTimer} 
                        icon={isRunning ? "pause" : "play_arrow"}
                        className="shadow-[0_8px_25px_rgba(51,13,242,0.3)] h-16 text-lg tracking-wide bg-primary hover:bg-primary-dark text-white"
                    >
                        {isRunning ? 'PAUSAR' : 'EMPEZAR'}
                    </Button>
                </div>

                {/* Audio Controls - Now Below Main Button, Orange Accent */}
                <div className="flex justify-center gap-4 w-full px-6 mb-8">
                    <button 
                        onClick={() => setNarrationOn(!narrationOn)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all active:scale-95 ${narrationOn ? 'bg-white border-[#f44611] text-[#f44611] shadow-sm shadow-[#f44611]/10' : 'bg-white border-slate-200 text-slate-400'}`}
                    >
                        <div className="relative">
                            <span className="material-symbols-outlined text-[24px]">graphic_eq</span>
                            {!narrationOn && (
                                <div className="absolute top-1/2 left-1/2 w-[140%] h-[2px] bg-slate-400 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg]"></div>
                            )}
                        </div>
                        <span className="text-sm font-bold">Narración</span>
                    </button>
                    
                    <button 
                        onClick={() => setSoundtrackOn(!soundtrackOn)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all active:scale-95 ${soundtrackOn ? 'bg-white border-[#f44611] text-[#f44611] shadow-sm shadow-[#f44611]/10' : 'bg-white border-slate-200 text-slate-400'}`}
                    >
                        <div className="relative">
                            <span className="material-symbols-outlined text-[24px]">music_note</span>
                            {!soundtrackOn && (
                                <div className="absolute top-1/2 left-1/2 w-[140%] h-[2px] bg-slate-400 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg]"></div>
                            )}
                        </div>
                        <span className="text-sm font-bold">Música de Fondo</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

// --- Calculator Screen ---
export const CalculatorScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [stats, setStats] = useState<Record<string, {relics: number, plagues: number, powers: number}>>({});
    
    // New States for Flow Control
    // Check if we are returning from Victory Log to show summary immediately
    const [showFinalSummary, setShowFinalSummary] = useState(location.state?.initialShowSummary || false);

    // Touch Handling State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Fisher-Yates Shuffle
    const shuffle = (array: string[]) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

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
             // Fallback: Generate Default Players if no data
            const pool = ["Paco", "Lola", "Coco", "Tete", "Nono", "Rorro", "Nadie", "Casi", "El Capo", "Bebé", "Caos", "Osi", "Bicho", "Pulga", "Mole", "Cinco"];
            const shuffledPool = shuffle([...pool]);
            
            const defaultColors: GameColor[] = ['red', 'blue', 'yellow', 'green', 'black', 'white'];
            const defaults: Player[] = defaultColors.map((color, index) => ({
                id: `def-${index}`,
                name: shuffledPool[index], // Use random name
                pact: 'Atenea',
                color: color
            }));
            setPlayers(defaults);
             // Initialize default stats
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
            // FIX: Always go to the last player when going back from summary
            if (players.length > 0) {
                setCurrentPlayerIndex(players.length - 1);
            }
            return;
        }

        // Just go back to game hub
        navigate('/game');
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

    // --- Touch Handlers ---
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    }

    const onTouchEnd = () => {
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
                    <div 
                        className="flex-1 overflow-y-auto no-scrollbar pb-32"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
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

                        {/* Player Header with Navigation Arrows */}
                        <div className="relative flex items-center justify-center px-2 mb-8 w-full max-w-lg mx-auto">
                            
                            {/* Left Arrow (Previous) */}
                            {currentPlayerIndex > 0 && (
                                <button
                                    onClick={goToPrevPlayer}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-slate-300/60 hover:text-primary transition-colors z-20 animate-pulse active:scale-95"
                                    aria-label="Jugador Anterior"
                                >
                                    <span className="material-symbols-outlined text-6xl">chevron_left</span>
                                </button>
                            )}

                            {/* Main Avatar Area */}
                            <div className="flex flex-col items-center gap-5 z-10">
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

                            {/* Right Arrow (Next) */}
                            {currentPlayerIndex < players.length - 1 && (
                                <button
                                    onClick={goToNextPlayer}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-300/60 hover:text-primary transition-colors z-20 animate-pulse active:scale-95"
                                    aria-label="Siguiente Jugador"
                                >
                                    <span className="material-symbols-outlined text-6xl">chevron_right</span>
                                </button>
                            )}
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
                        <Button fullWidth onClick={handleNextButton} icon={currentPlayerIndex === players.length - 1 ? "list_alt" : "arrow_forward"}>
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

// --- Destinies Screen (REDESIGNED) ---
export const DestiniesScreen: React.FC = () => {
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
    
    // Switch Confirmation State
    const [pendingSwitchMode, setPendingSwitchMode] = useState<'PUBLIC' | 'SECRET' | null>(null);

    // Secret Mode Specifics
    const [secretModalPlayer, setSecretModalPlayer] = useState<Player | null>(null);
    const [seenPlayerIds, setSeenPlayerIds] = useState<string[]>([]);

    // Fisher-Yates Shuffle
    const shuffle = (array: string[]) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    useEffect(() => {
        const storedPlayers = localStorage.getItem('game_players');
        if (storedPlayers && JSON.parse(storedPlayers).length > 0) {
            setPlayers(JSON.parse(storedPlayers));
        } else {
            // Default players if none registered - use random names
            const pool = ["Paco", "Lola", "Coco", "Tete", "Nono", "Rorro", "Nadie", "Casi", "El Capo", "Bebé", "Caos", "Osi", "Bicho", "Pulga", "Mole", "Cinco"];
            const shuffledPool = shuffle([...pool]);

            const defaultColors: GameColor[] = ['red', 'blue', 'yellow', 'green', 'black', 'white'];
            const defaults: Player[] = defaultColors.map((color, index) => ({
                id: `def-${index}`,
                name: shuffledPool[index], // Use random name
                pact: 'Atenea', // Dummy value
                color: color
            }));
            setPlayers(defaults);
        }
    }, []);

    // --- Actions ---

    const toggleExclusion = (pid: string) => {
        if (gameState !== 'IDLE') return; // Lock during game
        setExcludedIds(prev => 
            prev.includes(pid) ? prev.filter(id => id !== pid) : [...prev, pid]
        );
    };

    const handleSwitchMode = (targetMode: 'PUBLIC' | 'SECRET') => {
        // Requirement 1: Pressing same button does nothing
        if (mode === targetMode) return;

        // Requirement 2: Double Click Safety
        // Check "Busy" state
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

        // Execute Switch
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
        }
    };

    const resetGame = () => {
        setGameState('IDLE');
        setWinnerId(null);
        setSecretModalPlayer(null);
        setSeenPlayerIds([]);
        setExcludedIds([]);
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
                {/* Horizontal Scrolling: "w-max mx-auto" centers small content within overflow, but allows scrolling for large */}
                <div className="overflow-x-auto no-scrollbar pb-1">
                    <div className="flex gap-3 px-4 w-max mx-auto">
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
                                    <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center">{p.name}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* --- MIDDLE: Mode Switcher --- */}
            <div className="px-6 py-4">
                 <div className="flex bg-slate-100 p-1 rounded-xl relative isolate">
                     <button 
                        onClick={() => handleSwitchMode('PUBLIC')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all 
                        ${mode === 'PUBLIC' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'} 
                        ${pendingSwitchMode === 'PUBLIC' ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300 relative z-10' : ''}`}
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
                                <h2 className="typo-h1 text-slate-900 mb-2">{winnerPlayer.name}</h2>
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
                                 
                                 // Card State Logic
                                 // If seen: Greyed out, Locked.
                                 // If not seen: Colored, Clickable.
                                 
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
                                         <span className={`font-bold text-sm ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>Soy {p.name}</span>
                                     </button>
                                 )
                             })}
                         </div>

                         {/* Reset/Finish Button Area */}
                         <div className="absolute bottom-6 left-0 right-0 flex justify-center px-6">
                            <Button 
                                fullWidth 
                                onClick={resetGame}
                                disabled={!allCandidatesSeen}
                                className={allCandidatesSeen ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-300 shadow-none'}
                            >
                                {allCandidatesSeen ? 'Reiniciar Destinos' : 'Faltan jugadores por ver'}
                            </Button>
                         </div>
                    </div>
                )}
            </div>

            {/* SECRET MODAL (The "Peek") */}
            {secretModalPlayer && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col p-8 items-center text-center animate-float">
                        <h3 className="typo-caption text-slate-400 mb-4">Destino de {secretModalPlayer.name}</h3>
                        
                        <div className={`size-40 rounded-full flex items-center justify-center mb-6 shadow-xl border-8 ${secretModalPlayer.id === winnerId ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                            {secretModalPlayer.id === winnerId ? (
                                // Winner text: SÍ
                                <span className="font-black text-6xl tracking-tighter">SÍ</span>
                            ) : (
                                // Loser text: NO
                                <span className="font-black text-6xl tracking-tighter">NO</span>
                            )}
                        </div>

                        <p className="text-sm text-slate-500 mb-4 leading-relaxed px-4">
                            {secretModalPlayer.id === winnerId 
                                ? "El destino te ha seleccionado."
                                : "No has sido seleccionado."}
                        </p>

                        {candidatesCount === 1 && (
                            <p className="text-xs text-slate-400 italic mb-8 bg-slate-50 px-3 py-2 rounded-lg">
                                (Bueno... eras el único participando 🤷‍♂️)
                            </p>
                        )}

                        <Button fullWidth onClick={closeSecretModal} className="bg-slate-900 mt-2">
                            Entendido
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};