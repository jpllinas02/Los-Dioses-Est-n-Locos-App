import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, BottomBar } from '../components/UI';
import { MinigameType, Minigame } from '../types';
import { MINIGAMES_DB } from '../data/minigames';
import { ROUTES, STORAGE_KEYS } from '../constants';

export const MinigameSelectorScreen: React.FC = () => {
    const navigate = useNavigate();
    
    // State
    const [filters, setFilters] = useState<MinigameType[]>(['Individual', 'Team', 'Special']);
    const [isShuffling, setIsShuffling] = useState(false);
    const [drawnCard, setDrawnCard] = useState<Minigame | null>(null);
    const [tempDisplayCard, setTempDisplayCard] = useState<Minigame | null>(null); // For shuffle animation
    const [cooldown, setCooldown] = useState(0); // Lockout timer
    
    // Used Cards Persistence
    const [usedCards, setUsedCards] = useState<string[]>([]);
    
    // Scroll Detection State
    const descriptionRef = useRef<HTMLDivElement>(null);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [canScrollUp, setCanScrollUp] = useState(false);

    // Cooldown Timer Logic
    useEffect(() => {
        let interval: any;
        if (cooldown > 0) {
            interval = setTimeout(() => setCooldown(c => c - 1), 1000);
        }
        return () => clearTimeout(interval);
    }, [cooldown]);

    // Load used cards on mount
    useEffect(() => {
        const storedUsed = localStorage.getItem(STORAGE_KEYS.MINIGAME_HISTORY_IDS);
        if (storedUsed) {
            setUsedCards(JSON.parse(storedUsed));
        }
    }, []);

    // Derived: Available Pool considers Filters AND Excludes Used Cards
    const filteredByFilters = MINIGAMES_DB.filter(game => filters.includes(game.type));
    const availablePool = filteredByFilters.filter(game => !usedCards.includes(game.id));
    
    // Determine if we need to reset pool
    const poolExhausted = filteredByFilters.length > 0 && availablePool.length === 0;

    const canDraw = (availablePool.length > 0 || poolExhausted) && !isShuffling && cooldown === 0;

    // Toggle Filter
    const toggleFilter = (type: MinigameType) => {
        const newFilters = filters.includes(type) 
            ? filters.filter(t => t !== type) 
            : [...filters, type];

        setFilters(newFilters);
        // Instant reset when changing filters (restart to deck)
        setDrawnCard(null);
    };

    // Scroll Checker
    const checkScroll = () => {
        if (descriptionRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = descriptionRef.current;
            setCanScrollDown(scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 5);
            setCanScrollUp(scrollTop > 5);
        }
    };

    const resetPool = () => {
        // Only reset cards that match current filters (or just reset all to be safe/simple)
        setUsedCards([]);
        localStorage.removeItem(STORAGE_KEYS.MINIGAME_HISTORY_IDS);
        setDrawnCard(null); // Clear card to show deck and reset state
    }

    // Draw Logic
    const handleDraw = () => {
        if (isShuffling || cooldown > 0) return;

        // Auto-reset if pool exhausted
        if (poolExhausted) {
            resetPool();
            return; // Explicitly stop here to force user to draw again
        }
        
        // Check availability again (in case we just reset)
        // We need to calculate pool locally because state update might be async
        const currentUsed = poolExhausted ? [] : usedCards;
        const currentPool = MINIGAMES_DB.filter(game => filters.includes(game.type) && !currentUsed.includes(game.id));
        
        if (currentPool.length === 0) return; // Should allow draw now

        setIsShuffling(true);
        setDrawnCard(null);

        // Shuffle Animation
        let iterations = 0;
        const maxIterations = 15; 
        const interval = setInterval(() => {
            const randomTemp = currentPool[Math.floor(Math.random() * currentPool.length)];
            setTempDisplayCard(randomTemp);
            iterations++;

            if (iterations >= maxIterations) {
                clearInterval(interval);
                finishDraw(currentPool);
            }
        }, 80); 
    };

    const finishDraw = (currentPool: Minigame[]) => {
        const finalCard = currentPool[Math.floor(Math.random() * currentPool.length)];
        
        // Save as used
        const newUsed = [...usedCards, finalCard.id];
        // If we just reset, newUsed is just [finalCard.id]
        const actualUsed = poolExhausted ? [finalCard.id] : newUsed;
        
        setUsedCards(actualUsed);
        localStorage.setItem(STORAGE_KEYS.MINIGAME_HISTORY_IDS, JSON.stringify(actualUsed));

        setDrawnCard(finalCard);
        setTempDisplayCard(null);
        setIsShuffling(false);
        setCooldown(3); // Lock for 3 seconds to prevent accidental skip
    };

    // Re-check scroll on card change
    useEffect(() => {
        checkScroll();
        const t = setTimeout(checkScroll, 100);
        return () => clearTimeout(t);
    }, [drawnCard, tempDisplayCard, isShuffling]);

    const navigateToWinnerLog = () => {
        navigate(ROUTES.VICTORY_LOG, { state: { openMinigameModal: true } });
    };

    // Style Helpers
    const getCardStyles = (type?: MinigameType) => {
        if (!type) return { 
            bgHeader: 'bg-slate-50', textHeader: 'text-slate-400', textTitle: 'text-slate-500', 
            icon: 'text-slate-300', border: 'border-slate-200', divider: 'bg-slate-200'
        };
        switch(type) {
            case 'Individual': return { 
                bgHeader: 'bg-red-50', textHeader: 'text-red-500', textTitle: 'text-red-600',
                icon: 'text-red-400', border: 'border-red-100', divider: 'bg-red-100'
            };
            case 'Team': return { 
                bgHeader: 'bg-blue-50', textHeader: 'text-blue-500', textTitle: 'text-blue-600',
                icon: 'text-blue-400', border: 'border-blue-100', divider: 'bg-blue-100'
            };
            case 'Special': return { 
                bgHeader: 'bg-green-50', textHeader: 'text-green-500', textTitle: 'text-green-600',
                icon: 'text-green-400', border: 'border-green-100', divider: 'bg-green-100'
            };
            default: return { 
                bgHeader: 'bg-slate-50', textHeader: 'text-slate-400', textTitle: 'text-slate-500', 
                icon: 'text-slate-300', border: 'border-slate-200', divider: 'bg-slate-200'
            };
        }
    };

    const displayCard = isShuffling ? tempDisplayCard : drawnCard;
    const cardStyles = getCardStyles(displayCard?.type);
    const hasActiveCard = displayCard || isShuffling;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header title="Selector de Minijuegos" onBack={() => navigate(ROUTES.GAME)} helpTarget="decks" />
            
            {/* Filters */}
            <div className="w-full px-4 pt-4 pb-2 z-20">
                <h3 className="typo-caption mb-2 ml-1">Filtrar por Tipo</h3>
                <div className="flex gap-2 w-full">
                    {[{ id: 'Individual', label: 'Individual', color: 'red' }, { id: 'Team', label: 'En Equipo', color: 'blue' }, { id: 'Special', label: 'Especial', color: 'green' }].map((f) => {
                        const isActive = filters.includes(f.id as MinigameType);
                        return (
                            <button 
                                key={f.id}
                                onClick={() => toggleFilter(f.id as MinigameType)}
                                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all border-2 
                                    ${isActive 
                                        ? `bg-${f.color}-500 text-white border-${f.color}-500 shadow-md` 
                                        : `bg-white text-slate-400 border-slate-200 hover:border-${f.color}-200`
                                    }`}
                            >
                                {f.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Main Stage */}
            <div className={`flex-1 flex flex-col items-center p-4 relative min-h-[360px] pb-28 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-300 ${hasActiveCard ? 'justify-start pt-2' : 'justify-center'}`}>
                
                {/* Empty State / Deck */}
                {!displayCard && !isShuffling && (
                    <div 
                        onClick={handleDraw}
                        className="flex flex-col items-center text-center opacity-60 animate-float transition-all duration-300 cursor-pointer active:scale-95"
                    >
                        <div className="w-48 h-64 bg-slate-200 rounded-2xl border-4 border-slate-300 border-dashed flex items-center justify-center mb-4 relative">
                            {poolExhausted ? (
                                <span className="material-symbols-outlined text-6xl text-amber-400">replay</span>
                            ) : (
                                <span className="material-symbols-outlined text-6xl text-slate-400">playing_cards</span>
                            )}
                            <div className="absolute -right-2 -bottom-2 size-12 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-200">
                                <span className="font-bold text-slate-400 text-xs">{poolExhausted ? 0 : availablePool.length}</span>
                            </div>
                        </div>
                        <p className="typo-h3 text-slate-400">{poolExhausted ? '¡Mazo agotado!' : 'Toca para sacar carta'}</p>
                        {poolExhausted && <p className="text-xs text-amber-500 font-bold mt-1">Toca para revolver</p>}
                    </div>
                )}

                {/* The Card */}
                {displayCard && (
                    <div className={`relative w-full max-w-[320px] aspect-[63/88] bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out border-2 ${cardStyles.border} ${isShuffling ? 'scale-95 blur-[1px]' : 'animate-pop-in'}`}>
                        <div className={`w-full py-4 px-4 flex flex-col items-center justify-center shrink-0 border-b border-dashed ${cardStyles.border} ${cardStyles.bgHeader}`}>
                            <span className={`material-symbols-outlined text-2xl mb-1 ${cardStyles.icon}`}>
                                {displayCard.type === 'Individual' ? 'person' : displayCard.type === 'Team' ? 'groups' : 'auto_awesome'}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${cardStyles.textHeader}`}>
                                {displayCard.type === 'Team' ? 'En Equipo' : displayCard.type}
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col overflow-hidden relative w-full">
                            <div className="px-6 pt-5 pb-2 text-center shrink-0 z-10">
                                <h2 className={`font-cartoon text-2xl leading-tight ${cardStyles.textTitle}`}>{displayCard.title}</h2>
                            </div>
                            <div className={`w-12 h-1.5 mx-auto rounded-full shrink-0 my-1 ${cardStyles.divider}`}></div>
                            <div className="flex-1 px-6 pb-6 pt-2 overflow-hidden relative w-full mb-2">
                                <div className={`absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white via-white/90 to-transparent z-10 pointer-events-none transition-opacity duration-300 flex items-start justify-center pt-1 ${canScrollUp && !isShuffling ? 'opacity-100' : 'opacity-0'}`}>
                                    <span className="material-symbols-outlined text-slate-300 animate-bounce">keyboard_arrow_up</span>
                                </div>
                                <div ref={descriptionRef} onScroll={checkScroll} className="h-full overflow-y-auto no-scrollbar text-center flex items-start justify-center">
                                    <p className="font-rounded font-semibold text-[17px] text-slate-600 leading-snug w-full whitespace-pre-line pb-4 pt-2">{displayCard.description}</p>
                                </div>
                                <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none transition-opacity duration-300 z-10 flex items-end justify-center pb-2 ${canScrollDown && !isShuffling ? 'opacity-100' : 'opacity-0'}`}>
                                    <span className="material-symbols-outlined text-slate-300 animate-bounce">keyboard_arrow_down</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <BottomBar className="bg-gray-100 border-t border-slate-100">
                 <div className="flex w-full gap-3 items-center">
                    {drawnCard && !isShuffling && (
                        <Button 
                            className="flex-1 bg-gray-100 text-gray-800 border-2 border-slate-200 border-b-[4px] border-b-slate-300 active:border-b-0 active:translate-y-[4px] transition-all hover:bg-slate-50 px-0 rounded-xl"
                            onClick={navigateToWinnerLog} 
                            icon="emoji_events"
                            disabled={cooldown > 0}
                        >
                            <span className="text-sm font-bold truncate">Registrar</span>
                        </Button>
                    )}
                    <Button 
                        className={`flex-[2] shadow-[0_4px_20px_rgba(37,140,244,0.4)] bg-action ${isShuffling || cooldown > 0 ? 'opacity-80' : ''}`}
                        onClick={handleDraw} 
                        disabled={!canDraw && !poolExhausted}
                        icon={isShuffling ? 'cached' : poolExhausted ? 'replay' : 'style'}
                    >
                        {isShuffling ? '...' : cooldown > 0 ? `Espere... (${cooldown}s)` : poolExhausted ? 'Barajar de Nuevo' : drawnCard ? 'Otra Carta' : 'Sacar Carta'}
                    </Button>
                 </div>
            </BottomBar>
        </div>
    );
};
