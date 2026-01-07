import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Player } from '../types';
import { STORAGE_KEYS, ROUTES } from '../constants';

export const useCalculator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // State
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [stats, setStats] = useState<Record<string, {relics: number, plagues: number, powers: number}>>({});
    const [showFinalSummary, setShowFinalSummary] = useState(location.state?.initialShowSummary || false);
    const [isEditingFromSummary, setIsEditingFromSummary] = useState(false);

    // Touch Handling State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Initial Load
    useEffect(() => {
        const storedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
        const storedStats = localStorage.getItem(STORAGE_KEYS.STATS);

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
            // No players found, redirect to home instead of inventing them
            navigate(ROUTES.HOME, { replace: true });
        }
    }, [navigate]);

    // Persistence
    useEffect(() => {
        if (Object.keys(stats).length > 0) {
            localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
        }
    }, [stats]);

    const currentPlayer = players[currentPlayerIndex];
    const currentStats = (currentPlayer && stats[currentPlayer.id]) ? stats[currentPlayer.id] : { relics: 0, plagues: 0, powers: 0 };

    // Actions
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

        navigate(ROUTES.GAME);
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
                    totalScore = (s.relics * 3) + (s.plagues * -1);
                    break;
                case 'Loki':
                    totalScore = (s.relics * 2) + (s.plagues * 1);
                    break;
                case 'Longwang':
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
        
        localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(finalResults));
        navigate(ROUTES.LEADERBOARD);
    };

    const navigateToLog = () => {
        navigate(ROUTES.VICTORY_LOG, { state: { fromCalculator: true } });
    }

    // Touch Handlers
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
        const minSwipeDistance = 50;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentPlayerIndex < players.length - 1) {
             goToNextPlayer();
        }
        if (isRightSwipe && currentPlayerIndex > 0) {
             goToPrevPlayer();
        }
    }

    return {
        players,
        currentPlayer,
        currentPlayerIndex,
        currentStats,
        stats, // Exposed for summary view
        ui: {
            showFinalSummary,
            isEditingFromSummary
        },
        actions: {
            updateStat,
            handleInputChange,
            goToNextPlayer,
            goToPrevPlayer,
            handleNextButton,
            handleBackArrow,
            handleEditPlayerFromSummary,
            handleFinalizeGame,
            navigateToLog,
            onTouchStart,
            onTouchMove,
            onTouchEnd
        }
    };
};