import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, STORAGE_KEYS } from '../constants';

export const useGameSession = () => {
    const navigate = useNavigate();
    const [hasActiveSession, setHasActiveSession] = useState(false);

    const checkSession = useCallback(() => {
        try {
            const existingData = localStorage.getItem(STORAGE_KEYS.PLAYERS);
            setHasActiveSession(!!existingData && JSON.parse(existingData).length > 0);
        } catch (e) {
            console.error("Error checking game session:", e);
            setHasActiveSession(false);
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const startNewGame = () => {
        // Core game state
        const keysToRemove = [
            STORAGE_KEYS.PLAYERS, 
            STORAGE_KEYS.RESULTS, 
            STORAGE_KEYS.STATS, 
            STORAGE_KEYS.LOG, 
            STORAGE_KEYS.MINIGAME_HISTORY,
            // Also clear deck histories to ensure a fresh start
            STORAGE_KEYS.MINIGAME_HISTORY_IDS,
            STORAGE_KEYS.ORACLE_HISTORY_IDS
        ];
        
        keysToRemove.forEach(k => localStorage.removeItem(k));
        navigate(ROUTES.REGISTRATION);
    };

    const resumeGame = () => {
        navigate(ROUTES.GAME);
    };

    return {
        hasActiveSession,
        startNewGame,
        resumeGame,
        checkSession
    };
};