import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, BottomBar } from '../components/UI';
import { Oracle, OracleType } from '../types';
import { ORACLES_DB } from '../data/oracles';
import { ROUTES, STORAGE_KEYS } from '../constants';

export const OracleScreen: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [isShuffling, setIsShuffling] = useState(false);
    const [drawnCard, setDrawnCard] = useState<Oracle | null>(null);
    const [tempDisplayCard, setTempDisplayCard] = useState<Oracle | null>(null);
    const [usedCards, setUsedCards] = useState<string[]>([]);
    const [cooldown, setCooldown] = useState(0); // Lockout timer

    // Scroll States
    const descriptionRef = useRef<HTMLDivElement>(null);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [canScrollUp, setCanScrollUp] = useState(false);

    // Persistence Check
    useEffect(() => {
        const storedUsed = localStorage.getItem(STORAGE_KEYS.ORACLE_HISTORY_IDS);
        if (storedUsed) {
            setUsedCards(JSON.parse(storedUsed));
        }
    }, []);

    // Cooldown Timer Logic
    useEffect(() => {
        let interval: any;
        if (cooldown > 0) {
            interval = setTimeout(() => setCooldown(c => c - 1), 1000);
        }
        return () => clearTimeout(interval);
    }, [cooldown]);

    // Derived
    const availablePool = ORACLES_DB.filter(c => !usedCards.includes(c.id));
    const poolExhausted = availablePool.length === 0;
    
    // Allow draw if there are cards, or if we need to shuffle (pool exhausted)
    const canDraw = (availablePool.length > 0 || poolExhausted) && !isShuffling && cooldown === 0;

    const resetPool = () => {
        setUsedCards([]);
        localStorage.removeItem(STORAGE_KEYS.ORACLE_HISTORY_IDS);
        setDrawnCard(null); // Clear active card to show deck and make reset obvious
    }

    const handleActivate = () => {
        if (isShuffling || cooldown > 0) return;

        // Auto-reset logic
        if (poolExhausted) {
            resetPool();
            return; // Explicitly stop here to force user to draw again
        }

        const currentUsed = poolExhausted ? [] : usedCards;
        // Use full DB, no filtering
        const currentPool = ORACLES_DB.filter(c => !currentUsed.includes(c.id));
        
        if (currentPool.length === 0) return;

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
                finishActivation(currentPool);
            }
        }, 80);
    };

    const finishActivation = (currentPool: Oracle[]) => {
        const finalCard = currentPool[Math.floor(Math.random() * currentPool.length)];
        
        const newUsed = [...usedCards, finalCard.id];
        const actualUsed = poolExhausted ? [finalCard.id] : newUsed;
        
        setUsedCards(actualUsed);
        localStorage.setItem(STORAGE_KEYS.ORACLE_HISTORY_IDS, JSON.stringify(actualUsed));

        setDrawnCard(finalCard);
        setTempDisplayCard(null);
        setIsShuffling(false);
        setCooldown(3); // Lock for 3 seconds
    };

    // Scroll Logic
    const checkScroll = () => {
        if (descriptionRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = descriptionRef.current;
            setCanScrollDown(scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 5);
            setCanScrollUp(scrollTop > 5);
        }
    };

    useEffect(() => {
        checkScroll();
        const t = setTimeout(checkScroll, 100);
        return () => clearTimeout(t);
    }, [drawnCard, tempDisplayCard, isShuffling]);

    // Visual Styles
    const getOracleStyles = (type?: OracleType) => {
        if (!type) return { 
             bgHeader: 'bg-purple-50', textHeader: 'text-purple-400',
             border: 'border-purple-200', icon: 'visibility', divider: 'bg-purple-100', textTitle: 'text-purple-600'
        };
        switch(type) {
            case 'Favorable': return { 
                bgHeader: 'bg-emerald-50', textHeader: 'text-emerald-500', 
                border: 'border-emerald-100', icon: 'check_circle',
                textTitle: 'text-emerald-600', divider: 'bg-emerald-100'
            };
            case 'Desfavorable': return { 
                bgHeader: 'bg-rose-50', textHeader: 'text-rose-500', 
                border: 'border-rose-100', icon: 'cancel',
                textTitle: 'text-rose-600', divider: 'bg-rose-100'
            };
            case 'Neutral': return { 
                bgHeader: 'bg-amber-50', textHeader: 'text-amber-500', 
                border: 'border-amber-100', icon: 'remove_circle',
                textTitle: 'text-amber-600', divider: 'bg-amber-100'
            };
        }
    };

    const displayCard = isShuffling ? tempDisplayCard : drawnCard;
    const cardStyles = getOracleStyles(displayCard?.type);
    const hasActiveCard = displayCard || isShuffling;

    return (
        <div className="flex min-h-screen flex-col bg-[#fcfaff]"> {/* Subtle Purple Tint Background */}
            <Header title="Oráculo Divino" actionIcon="settings" onBack={() => navigate(ROUTES.GAME)} />
            
            <div className={`flex-1 flex flex-col items-center p-4 relative min-h-[360px] pb-28 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-300 ${hasActiveCard ? 'justify-start pt-6' : 'justify-center'}`}>
                
                {/* Empty State / Deck */}
                {!displayCard && !isShuffling && (
                    <div 
                        onClick={handleActivate}
                        className="flex flex-col items-center text-center opacity-80 animate-float transition-all duration-300 cursor-pointer active:scale-95"
                    >
                        <div className="w-48 h-64 bg-purple-50 rounded-2xl border-4 border-purple-200 border-dashed flex items-center justify-center mb-4 relative">
                            {poolExhausted ? (
                                <span className="material-symbols-outlined text-6xl text-amber-400">replay</span>
                            ) : (
                                <span className="material-symbols-outlined text-6xl text-purple-300">auto_awesome</span>
                            )}
                            <div className="absolute -right-2 -bottom-2 size-12 bg-white rounded-full flex items-center justify-center shadow-md border border-purple-100">
                                <span className="font-bold text-purple-400 text-xs">{poolExhausted ? 0 : availablePool.length}</span>
                            </div>
                        </div>
                        <p className="typo-h3 text-purple-900/50">{poolExhausted ? '¡Destinos Agotados!' : 'Invocar Oráculo'}</p>
                        {poolExhausted && <p className="text-xs text-amber-500 font-bold mt-1">Toca para revolver</p>}
                    </div>
                )}

                {/* The Card */}
                {displayCard && (
                    <div className={`relative w-full max-w-[320px] aspect-[63/88] bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out border-2 ${cardStyles.border} ${isShuffling ? 'scale-95 blur-[1px]' : 'animate-pop-in'}`}>
                        {/* Header */}
                        <div className={`w-full py-4 px-4 flex flex-col items-center justify-center shrink-0 border-b border-dashed ${cardStyles.border} ${cardStyles.bgHeader}`}>
                            <span className={`material-symbols-outlined text-2xl mb-1 ${cardStyles.icon}`}>
                                {cardStyles.icon}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${cardStyles.textHeader}`}>
                                {displayCard.type}
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col overflow-hidden relative w-full bg-white">
                             {/* Title Removed - Only Divider remains, pushed down for spacing */}
                            <div className={`w-12 h-1.5 mx-auto rounded-full shrink-0 my-1 mt-6 ${cardStyles.divider}`}></div>

                            <div className="flex-1 px-6 pb-6 pt-2 overflow-hidden relative w-full mb-2">
                                <div className={`absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white via-white/90 to-transparent z-10 pointer-events-none transition-opacity duration-300 flex items-start justify-center pt-1 ${canScrollUp && !isShuffling ? 'opacity-100' : 'opacity-0'}`}>
                                    <span className="material-symbols-outlined text-slate-300 animate-bounce">keyboard_arrow_up</span>
                                </div>
                                
                                <div ref={descriptionRef} onScroll={checkScroll} className="h-full overflow-y-auto no-scrollbar text-center flex items-start justify-center">
                                    <p className="font-rounded font-semibold text-[17px] text-slate-600 leading-snug w-full whitespace-pre-line pb-4 pt-2">
                                        {displayCard.description}
                                    </p>
                                </div>
                                
                                <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none transition-opacity duration-300 z-10 flex items-end justify-center pb-2 ${canScrollDown && !isShuffling ? 'opacity-100' : 'opacity-0'}`}>
                                    <span className="material-symbols-outlined text-slate-300 animate-bounce">keyboard_arrow_down</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <BottomBar className="bg-white border-t border-purple-50">
                 <div className="flex w-full gap-3 items-center">
                    <Button 
                        fullWidth 
                        className={`shadow-[0_4px_20px_rgba(147,51,234,0.3)] bg-purple-600 hover:bg-purple-700 text-white ${isShuffling || cooldown > 0 ? 'opacity-80' : ''}`} 
                        onClick={handleActivate}
                        disabled={!canDraw && !poolExhausted}
                        icon={isShuffling ? 'cached' : poolExhausted ? 'replay' : 'visibility'}
                    >
                        {isShuffling ? 'Consultando...' : cooldown > 0 ? `Espere... (${cooldown}s)` : poolExhausted ? 'Restaurar' : drawnCard ? 'Otro Oráculo' : 'Revelar Destino'}
                    </Button>
                 </div>
            </BottomBar>
        </div>
    );
};