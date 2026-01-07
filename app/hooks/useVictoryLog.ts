import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player, MinigameRecord } from '../types';
import { STORAGE_KEYS, ROUTES } from '../constants';

export const useVictoryLog = (shouldAutoOpenModal: boolean = false) => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState<Player[]>([]);
    
    // Data State
    const [log, setLog] = useState<{minigames: Record<string, number>, mentions: Record<string, Record<string, number>>}>({ minigames: {}, mentions: {} });
    const [minigameHistory, setMinigameHistory] = useState<MinigameRecord[]>([]);
    
    // UI State
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
    const [showMinigameModal, setShowMinigameModal] = useState(false);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    
    // Feedback State
    const [justVotedId, setJustVotedId] = useState<string | null>(null);
    const [isClearingVotes, setIsClearingVotes] = useState(false);

    // Initial Load
    useEffect(() => {
        const storedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
        const storedLog = localStorage.getItem(STORAGE_KEYS.LOG);
        const storedHistory = localStorage.getItem(STORAGE_KEYS.MINIGAME_HISTORY);

        if (storedPlayers && JSON.parse(storedPlayers).length > 0) {
            const currentPlayers = JSON.parse(storedPlayers);
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

            if (shouldAutoOpenModal) {
                setShowMinigameModal(true);
            }
        } else {
            // No players found, redirect to home
            navigate(ROUTES.HOME, { replace: true });
        }
    }, [shouldAutoOpenModal, navigate]);

    // Persistence
    useEffect(() => {
        if (players.length > 0) {
            localStorage.setItem(STORAGE_KEYS.LOG, JSON.stringify(log));
            localStorage.setItem(STORAGE_KEYS.MINIGAME_HISTORY, JSON.stringify(minigameHistory));
        }
    }, [log, minigameHistory, players]);

    // Logic Functions
    const recalculateStats = useCallback((history: MinigameRecord[], currentMentions: Record<string, Record<string, number>>) => {
        const newMinigamesStats: Record<string, number> = {};
        players.forEach(p => newMinigamesStats[p.id] = 0);
        
        history.forEach(rec => {
            rec.winners.forEach(wid => {
                newMinigamesStats[wid] = (newMinigamesStats[wid] || 0) + 1;
            });
        });

        setLog({ minigames: newMinigamesStats, mentions: currentMentions });
    }, [players]);

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

    const closeMinigameModal = () => {
        setShowMinigameModal(false);
        setEditingRecordId(null);
        setSelectedWinners([]);
    };

    const confirmMinigame = () => {
        let winnersToSave = selectedWinners;
        if (selectedWinners.length === players.length) {
            winnersToSave = [];
        }

        let newHistory = [...minigameHistory];
        
        if (editingRecordId) {
             newHistory = newHistory.map(rec => {
                 if (rec.id === editingRecordId) {
                     return { ...rec, winners: winnersToSave };
                 }
                 return rec;
             });
        } else {
             const newRecord: MinigameRecord = {
                 id: `mg-${Date.now()}`,
                 round: minigameHistory.length + 1,
                 winners: winnersToSave,
                 timestamp: Date.now()
             };
             newHistory = [newRecord, ...newHistory];
             setIsHistoryExpanded(true);
        }
        
        setMinigameHistory(newHistory);
        recalculateStats(newHistory, log.mentions);
        closeMinigameModal();
        return true; // Signal success
    };

    const deleteMinigameRecord = () => {
        if (!editingRecordId) return;
        let newHistory = minigameHistory.filter(rec => rec.id !== editingRecordId);
        newHistory = newHistory.map((rec, index) => ({
            ...rec,
            round: newHistory.length - index
        }));
        setMinigameHistory(newHistory);
        recalculateStats(newHistory, log.mentions); 
        closeMinigameModal(); 
    };

    const openVoteModal = (category: string) => {
        setActiveCategory(category);
        setShowVoteModal(true);
    };

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
            setJustVotedId(null);
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
        }, 700);
    };

    const getTotalVotesForCategory = (catId: string) => {
        if (!log.mentions || !log.mentions[catId]) return 0;
        return Object.values(log.mentions[catId]).reduce((sum: number, count: number) => sum + count, 0);
    };

    return {
        players,
        log,
        minigameHistory,
        ui: {
            isHistoryExpanded,
            setIsHistoryExpanded,
            showMinigameModal,
            showVoteModal,
            setShowVoteModal, // Exposed for cancel
            activeCategory,
            selectedWinners,
            editingRecordId,
            justVotedId,
            isClearingVotes
        },
        actions: {
            openMinigameModal,
            closeMinigameModal,
            confirmMinigame,
            deleteMinigameRecord,
            toggleWinnerSelection,
            openVoteModal,
            confirmVote,
            clearCategoryVotes,
            getTotalVotesForCategory
        }
    };
};