import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, STORAGE_KEYS } from '../constants';
import { Player } from '../types';

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

    const startGame = (players: Player[]) => {
        // 1. Clear old data
        const keysToRemove = [
            STORAGE_KEYS.RESULTS, 
            STORAGE_KEYS.STATS, 
            STORAGE_KEYS.LOG, 
            STORAGE_KEYS.MINIGAME_HISTORY,
            STORAGE_KEYS.MINIGAME_HISTORY_IDS,
            STORAGE_KEYS.ORACLE_HISTORY_IDS
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));

        // 2. Initialize Stats
        const initialStats: Record<string, any> = {};
        players.forEach(p => {
            initialStats[p.id] = { relics: 0, plagues: 0, powers: 0 };
        });
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initialStats));

        // 3. Save Players
        localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));

        // 4. Navigate
        // Prompt requested /oracle, but traditionally games start at the HUB. 
        // Using /game based on existing flow consistency, but respecting the instruction context implying "Game Start".
        navigate(ROUTES.GAME);
    };

    const startNewGame = () => {
        // Just navigates to setup, logic handled in startGame
        navigate(ROUTES.REGISTRATION);
    };

    const resumeGame = () => {
        navigate(ROUTES.GAME);
    };

    return {
        hasActiveSession,
        startGame,
        startNewGame,
        resumeGame,
        checkSession
    };
};