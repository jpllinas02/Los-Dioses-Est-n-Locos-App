import React, { useState, useEffect, useRef } from 'react';
import { Header, Button } from '../components/UI';

export const TimerScreen: React.FC = () => {
    // Modes: 'TIMER' (Countdown) | 'STOPWATCH' (Count Up with Target)
    const [mode, setMode] = useState<'TIMER' | 'STOPWATCH'>('TIMER');

    // totalTime represents the TARGET/MAX time in both modes
    const [totalTime, setTotalTime] = useState(60); 
    
    // Counters
    const [timeLeft, setTimeLeft] = useState(60); // For Timer Mode
    const [elapsedTime, setElapsedTime] = useState(0); // For Stopwatch Mode

    const [isRunning, setIsRunning] = useState(false);
    
    // Audio States - Soundtrack ON by default
    const [narrationOn, setNarrationOn] = useState(true);
    const [soundtrackOn, setSoundtrackOn] = useState(true);

    // Input Refs for manual editing
    const minutesInputRef = useRef<HTMLInputElement>(null);
    const secondsInputRef = useRef<HTMLInputElement>(null);

    // Helper for TTS
    const speak = (text: string) => {
        if (!narrationOn || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    // Timer/Stopwatch Logic
    useEffect(() => {
        let interval: any = null;
        if (isRunning) {
            interval = setInterval(() => {
                if (mode === 'TIMER') {
                    // --- TIMER LOGIC (Countdown) ---
                    if (timeLeft > 0) {
                        const nextTime = timeLeft - 1;
                        setTimeLeft(nextTime);
                        if (nextTime === 0) {
                            setIsRunning(false);
                            speak("Tiempo terminado");
                        }
                    }
                } else {
                    // --- STOPWATCH LOGIC (Count Up Indefinitely) ---
                    setElapsedTime((prev) => {
                        const next = prev + 1;
                        if (next === totalTime) {
                            speak("Tiempo terminado");
                        }
                        return next;
                    });
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, mode, totalTime, narrationOn]);

    // Check if we passed the limit (for Visual Feedback)
    const isOvertime = mode === 'STOPWATCH' && elapsedTime >= totalTime && totalTime > 0;
    const isTimerFinished = mode === 'TIMER' && timeLeft === 0;
    const showAlertVisuals = (mode === 'STOPWATCH' && isOvertime) || (mode === 'TIMER' && isTimerFinished);

    const isEditingTarget = !isRunning && (mode === 'TIMER' ? timeLeft === totalTime : elapsedTime === 0);
    
    const displayTime = isEditingTarget 
        ? totalTime 
        : (mode === 'TIMER' ? timeLeft : elapsedTime);

    const minutes = Math.floor(displayTime / 60);
    const seconds = displayTime % 60;

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    // Handlers
    const toggleTimer = () => {
        if (mode === 'TIMER' && timeLeft === 0) {
            setTimeLeft(totalTime);
        }
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(totalTime);
        setElapsedTime(0);
    };

    const handleModeSwitch = (newMode: 'TIMER' | 'STOPWATCH') => {
        if (isRunning) return;
        if (mode === newMode) return;
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft(totalTime);
        setElapsedTime(0);
    };

    const handleQuickSelect = (seconds: number) => {
        if (isRunning) return;
        setTotalTime(seconds);
        setTimeLeft(seconds);
        setElapsedTime(0);
        setIsRunning(false); 
    };

    const handleManualInput = (type: 'min' | 'sec', value: string) => {
        if (!isEditingTarget) return; 

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
        setElapsedTime(0);
    };

    // SVG Circle Calculations
    const radius = 140; 
    const circumference = 2 * Math.PI * radius;
    
    let strokeDashoffset = 0;
    
    if (mode === 'TIMER') {
        const visualCurrent = timeLeft;
        strokeDashoffset = circumference - (visualCurrent / totalTime) * circumference;
    } else {
        const progress = Math.min(elapsedTime / totalTime, 1);
        strokeDashoffset = circumference - progress * circumference;
    }

    const circleColor = showAlertVisuals ? "#ef4444" : "#f44611";

    return (
        <div className={`flex h-screen w-full flex-col font-display overflow-hidden text-slate-900 transition-colors duration-500 ${showAlertVisuals ? 'bg-red-50' : 'bg-[#f8fafc]'}`}>
            <Header title={mode === 'TIMER' ? "Temporizador" : "Cronómetro"} showBack={true} />
            
            <div className="relative z-10 flex flex-col h-full items-center">
                
                {/* Mode Switcher */}
                <div className={`w-full px-6 pt-4 transition-all duration-300 ${isRunning ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                     <div className="flex bg-slate-100 p-1 rounded-xl relative isolate">
                         <button 
                            onClick={() => handleModeSwitch('TIMER')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all 
                            ${mode === 'TIMER' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                         >
                             Descendente
                         </button>
                         <button 
                            onClick={() => handleModeSwitch('STOPWATCH')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all 
                            ${mode === 'STOPWATCH' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                         >
                             Ascendente
                         </button>
                     </div>
                </div>

                {/* Quick Select Options */}
                <div className={`w-full px-6 pt-4 pb-2 transition-all duration-300 h-auto ${isRunning ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                    <div className="flex justify-between gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                         {[30, 60, 90].map((sec) => (
                             <button
                                key={sec}
                                onClick={() => handleQuickSelect(sec)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all 
                                    ${totalTime === sec 
                                        ? 'bg-primary text-white shadow-md' 
                                        : 'bg-transparent text-slate-500 hover:bg-slate-50'}
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
                        <div className="relative flex items-center justify-center">
                             {/* Background Circle */}
                            <svg className="w-[340px] h-[340px] -rotate-90 transform" viewBox="0 0 300 300">
                                <circle 
                                    cx="150" cy="150" r={radius} 
                                    fill="none" 
                                    stroke={showAlertVisuals ? "#fecaca" : "#e2e8f0"} 
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                ></circle>
                                {/* Progress Circle */}
                                <circle 
                                    cx="150" cy="150" r={radius} 
                                    fill="none" 
                                    stroke={circleColor} 
                                    strokeDasharray={circumference} 
                                    strokeDashoffset={isNaN(strokeDashoffset) ? 0 : strokeDashoffset}
                                    strokeLinecap="round" 
                                    strokeWidth="12"
                                    className={`transition-all duration-300 ease-linear ${showAlertVisuals ? 'animate-pulse' : ''}`}
                                ></circle>
                            </svg>
                            
                            <div className="absolute inset-0">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pb-3">
                                    <div className="h-8 flex items-center justify-center">
                                        {showAlertVisuals ? (
                                            <span className="text-red-500 font-black tracking-widest uppercase animate-bounce">¡TIEMPO!</span>
                                        ) : (
                                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                {isEditingTarget ? 'Definir Meta' : (mode === 'STOPWATCH' ? `Meta: ${Math.floor(totalTime / 60)}:${formatNumber(totalTime % 60)}` : 'Tiempo Restante')}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <input 
                                            ref={minutesInputRef}
                                            type="number"
                                            disabled={!isEditingTarget}
                                            value={formatNumber(minutes)}
                                            onChange={(e) => handleManualInput('min', e.target.value)}
                                            className={`w-[110px] text-center text-7xl font-bold bg-transparent focus:outline-none p-0 leading-none tracking-tighter placeholder-slate-900 selection:bg-primary/20 transition-colors ${showAlertVisuals ? 'text-red-500' : 'text-slate-900'} ${!isEditingTarget ? 'cursor-default' : ''}`}
                                        />
                                        <span className={`text-7xl font-bold mx-0 pb-2 transition-colors ${showAlertVisuals ? 'text-red-300' : 'text-slate-300'}`}>:</span>
                                        <input 
                                            ref={secondsInputRef}
                                            type="number"
                                            disabled={!isEditingTarget}
                                            value={formatNumber(seconds)}
                                            onChange={(e) => handleManualInput('sec', e.target.value)}
                                            className={`w-[110px] text-center text-7xl font-bold bg-transparent focus:outline-none p-0 leading-none tracking-tighter placeholder-slate-900 selection:bg-primary/20 transition-colors ${showAlertVisuals ? 'text-red-500' : 'text-slate-900'} ${!isEditingTarget ? 'cursor-default' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Action Button Area */}
                <div className="w-full px-4 mb-6">
                    {isEditingTarget ? (
                        <Button 
                            fullWidth 
                            onClick={toggleTimer} 
                            icon="play_arrow"
                            className={`shadow-[0_8px_25px_rgba(51,13,242,0.3)] h-16 text-lg tracking-wide ${showAlertVisuals ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-primary hover:bg-primary-dark'} text-white transition-colors`}
                        >
                            EMPEZAR
                        </Button>
                    ) : isRunning ? (
                        <Button 
                            fullWidth 
                            onClick={toggleTimer} 
                            icon="pause"
                            className={`shadow-[0_8px_25px_rgba(51,13,242,0.3)] h-16 text-lg tracking-wide ${showAlertVisuals ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-primary hover:bg-primary-dark'} text-white transition-colors`}
                        >
                            PAUSAR
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <Button 
                                variant="outline"
                                className={`flex-1 h-16 text-lg tracking-wide ${showAlertVisuals ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100' : ''} transition-colors shadow-sm`}
                                onClick={resetTimer}
                                icon="replay"
                            >
                                Reiniciar
                            </Button>
                            <Button 
                                className={`flex-1 h-16 text-lg tracking-wide ${showAlertVisuals ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-primary hover:bg-primary-dark'} text-white transition-colors shadow-[0_8px_25px_rgba(51,13,242,0.3)]`}
                                onClick={toggleTimer}
                                icon="play_arrow"
                            >
                                Continuar
                            </Button>
                        </div>
                    )}
                </div>

                {/* Audio Controls */}
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