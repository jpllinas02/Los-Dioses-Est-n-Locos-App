import { useState, useEffect } from 'react';
import { Player } from '../types';
import { STORAGE_KEYS, VOTE_CATEGORIES } from '../constants';

export const useLeaderboard = () => {
    const [results, setResults] = useState<Player[]>([]);
    const [gameLog, setGameLog] = useState<{minigames: Record<string, number>, mentions?: Record<string, Record<string, number>>, decisions?: Record<string, number>} | null>(null);
    const [honorCounts, setHonorCounts] = useState<Record<string, number>>({});

    const calculateHonorCounts = (players: Player[], log: any) => {
        const counts: Record<string, number> = {};
        players.forEach(p => counts[p.id] = 0);

        if (!log) return counts;

        if (log.minigames) {
            let max = 0;
            const minigames = log.minigames as Record<string, number>;
            Object.values(minigames).forEach((v) => { if (v > max) max = v; });
            
            if (max > 0) {
                const winners = Object.keys(minigames).filter(id => minigames[id] === max);
                winners.forEach(id => { if(counts[id] !== undefined) counts[id]++; });
            }
        }

        if (log.mentions) {
            Object.keys(log.mentions).forEach(catId => {
                const votes = log.mentions[catId] as Record<string, number>;
                let max = 0;
                Object.values(votes).forEach((v) => { if (v > max) max = v; });
                
                if (max > 0) {
                    const winners = Object.keys(votes).filter(id => votes[id] === max);
                    winners.forEach(id => { if(counts[id] !== undefined) counts[id]++; });
                }
            });
        }

        return counts;
    }

    useEffect(() => {
        const storedResults = localStorage.getItem(STORAGE_KEYS.RESULTS);
        const storedLog = localStorage.getItem(STORAGE_KEYS.LOG);
        let parsedLog = null;
        let parsedResults: Player[] = [];

        if (storedLog) {
            parsedLog = JSON.parse(storedLog);
            setGameLog(parsedLog);
        }

        if (storedResults) {
            parsedResults = JSON.parse(storedResults);
            const calculatedHonors = calculateHonorCounts(parsedResults, parsedLog);
            setHonorCounts(calculatedHonors);
            
            const sorted = parsedResults.sort((a: Player, b: Player) => {
                const scoreDiff = (b.score || 0) - (a.score || 0);
                if (scoreDiff !== 0) return scoreDiff;

                const honorsA = calculatedHonors[a.id] || 0;
                const honorsB = calculatedHonors[b.id] || 0;
                return honorsB - honorsA;
            });
            
            setResults(sorted);
        } else {
            setResults([]); 
        }
    }, []);

    const winner = results.length > 0 ? results[0] : null;
    const others = results.length > 1 ? results.slice(1) : [];

    const getMinigameHonor = () => {
        if (!gameLog?.minigames || !results.length) return null;
        let max = 0;
        let bestPids: string[] = [];
        
        Object.entries(gameLog.minigames).forEach(([id, c]) => {
            const count = c as number;
            if (count > max) {
                max = count;
                bestPids = [id];
            } else if (count === max) {
                bestPids.push(id);
            }
        });

        if (max <= 0 || bestPids.length === 0) return null;

        const bestPlayer = results
            .filter(p => bestPids.includes(p.id))
            .sort((a,b) => (b.score || 0) - (a.score || 0))[0];

        if (!bestPlayer) return null;

        return {
            player: bestPlayer,
            count: max,
            title: 'Maestro de Minijuegos',
            icon: 'trophy'
        };
    };

    const getCategoryHonors = () => {
        if (!gameLog?.mentions || !results.length) return [];
        
        const categories = VOTE_CATEGORIES.map(c => ({
             id: c.id, title: c.modalTitle, icon: c.icon
        }));

        const honors: any[] = [];

        categories.forEach(cat => {
            const catVotes = gameLog.mentions![cat.id];
            if (!catVotes) return;

            let max = 0;
            let bestPids: string[] = [];

            Object.entries(catVotes).forEach(([pid, c]) => {
                const count = c as number;
                if (count > max) {
                    max = count;
                    bestPids = [pid];
                } else if (count === max) {
                    bestPids.push(pid);
                }
            });

            if (max > 0 && bestPids.length > 0) {
                 const bestPlayer = results
                    .filter(p => bestPids.includes(p.id))
                    .sort((a,b) => (b.score || 0) - (a.score || 0))[0];
                 
                 if (bestPlayer) {
                     honors.push({
                         player: bestPlayer,
                         count: max,
                         ...cat
                     });
                 }
            }
        });

        return honors;
    };

    const getRank = (index: number) => {
        const actualRank = index + 1;
        if (index === 0) return 1;
        
        const curr = results[index];
        const prev = results[index - 1];
        
        const currHonors = honorCounts[curr.id] || 0;
        const prevHonors = honorCounts[prev.id] || 0;

        if ((curr.score || 0) === (prev.score || 0) && currHonors === prevHonors) {
             const firstIndex = results.findIndex(p => 
                 (p.score || 0) === (curr.score || 0) && 
                 (honorCounts[p.id] || 0) === currHonors
             );
             return firstIndex + 1;
        }
        
        return actualRank;
    }

    const minigameHonor = getMinigameHonor();
    const categoryHonors = getCategoryHonors();
    const hasHonors = minigameHonor || categoryHonors.length > 0;

    return {
        results,
        winner,
        others,
        minigameHonor,
        categoryHonors,
        hasHonors,
        getRank
    };
};