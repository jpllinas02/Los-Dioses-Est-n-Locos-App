import { useState, useEffect } from 'react';
import { Player, PactType, GameColor } from '../types';
import { shuffle, DEFAULT_NAME_POOL, GAME_COLORS } from '../utils';

type RegistrationStep = 'CONFIG' | 'INPUT_NAMES' | 'REVEAL_PACTS';
type PactMode = 'BALANCED' | 'CHAOTIC' | 'STRATEGIC';
type NameMode = 'CUSTOM' | 'RANDOM';

export const useNewGameLogic = () => {
    // --- Core State ---
    const [step, setStep] = useState<RegistrationStep>('CONFIG');
    const [players, setPlayers] = useState<Player[]>([]);
    
    // --- Config State ---
    const [config, setConfig] = useState({
        playerCount: 4,
        pactMode: 'BALANCED' as PactMode,
        nameMode: 'CUSTOM' as NameMode
    });

    // --- Input State ---
    const [tempInput, setTempInput] = useState({
        name: '',
        color: 'red' as GameColor,
        pact: 'Atenea' as PactType
    });
    const [errors, setErrors] = useState<{name?: string, color?: string}>({});

    // --- Editing/Review State ---
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // --- Reveal Phase State ---
    const [revealState, setRevealState] = useState({
        index: 0,
        isRevealed: false,
        isLocked: false,
        showQuit: false
    });

    const colors = GAME_COLORS;

    // --- SELF-HEALING: Ghost ID Protection ---
    // If editingId points to a player that no longer exists, clear it immediately.
    useEffect(() => {
        if (editingId && !players.find(p => p.id === editingId)) {
            setEditingId(null);
            setIsAddingNew(false);
        }
    }, [players, editingId]);

    // --- LOGIC: Configuration ---
    const updateConfig = (key: string, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const confirmConfig = () => {
        if (config.nameMode === 'RANDOM') {
            generateRandomPlayers();
        } else {
            setStep('INPUT_NAMES');
            setTempInput(prev => ({ ...prev, color: 'red', pact: 'Atenea' }));
            setPlayers([]);
        }
    };

    // --- LOGIC: Pact Generation (Business Rules) ---
    const generatePacts = (count: number, mode: PactMode): PactType[] => {
        let pacts: PactType[] = [];
        let lokiCount = 0;

        if (mode === 'BALANCED' || mode === 'STRATEGIC') {
            lokiCount = 1;
        } else if (mode === 'CHAOTIC') {
            lokiCount = Math.floor(Math.random() * 3);
        }

        for (let i = 0; i < lokiCount; i++) pacts.push('Loki');

        while (pacts.length < count) {
            const currentAtenea = pacts.filter(p => p === 'Atenea').length;
            const currentLongwang = pacts.filter(p => p === 'Longwang').length;
            const pool: PactType[] = [];
            
            if (currentAtenea < 3) pool.push('Atenea');
            if (currentLongwang < 3) pool.push('Longwang');
            
            if (pool.length === 0) break; 
            pacts.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        
        return shuffle(pacts);
    };

    const generateRandomPlayers = () => {
        const shuffledNames = shuffle([...DEFAULT_NAME_POOL]);
        const pacts = generatePacts(config.playerCount, config.pactMode);
        
        const newPlayers: Player[] = [];
        for (let i = 0; i < config.playerCount; i++) {
            newPlayers.push({
                id: `p-${Date.now()}-${i}`,
                name: shuffledNames[i], // Pool names are unique by definition
                color: colors[i].id,
                pact: pacts[i]
            });
        }
        
        setPlayers(newPlayers);
        setShowReviewModal(true);
    };

    // --- LOGIC: Player Management ---
    const getNextAvailableColor = (currentList: Player[]) => {
        return colors.find(c => !currentList.some(p => p.color === c.id))?.id || 'red';
    };

    const addPlayer = () => {
        setErrors({});

        if (players.length >= config.playerCount) {
             setShowReviewModal(true);
             return true;
        }

        const trimmedName = tempInput.name.trim();

        if (!trimmedName) {
            setErrors({name: 'Escribe un nombre'});
            return false;
        }
        
        // CHECK NAME DUPLICATION
        const nameTaken = players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase());
        if (nameTaken) {
            setErrors({name: 'Nombre ya usado'});
            return false;
        }

        if (players.some(p => p.color === tempInput.color)) {
            setErrors({color: 'Color ocupado'});
            return false;
        }

        const newPlayer: Player = {
            id: `p-${Date.now()}`,
            name: trimmedName,
            color: tempInput.color,
            pact: config.pactMode === 'STRATEGIC' ? tempInput.pact : 'Atenea'
        };

        const updatedList = [...players, newPlayer];
        setPlayers(updatedList);
        
        // Prepare next input
        const nextColor = getNextAvailableColor(updatedList);
        setTempInput({ name: '', color: nextColor, pact: 'Atenea' });

        if (updatedList.length >= config.playerCount) {
            setShowReviewModal(true);
        }
        return true;
    };

    const handleInputBack = () => {
        if (players.length > 0) {
            const prevPlayer = players[players.length - 1];
            setPlayers(prev => prev.slice(0, -1));
            setTempInput({
                name: prevPlayer.name,
                color: prevPlayer.color,
                pact: config.pactMode === 'STRATEGIC' ? prevPlayer.pact : 'Atenea'
            });
            setErrors({});
            // Safety clear
            setEditingId(null);
            setIsAddingNew(false);
        } else {
            setStep('CONFIG');
        }
    };

    // --- LOGIC: Review & Edit ---
    const closeReviewModal = () => {
        setShowReviewModal(false);
        setEditingId(null);
        setIsAddingNew(false);
    };

    const startEditing = (player: Player) => {
        setEditingId(player.id);
        setIsAddingNew(false);
    };

    const addNewInReview = () => {
        if (players.length >= 6) return;
        
        // Ensure unique random name when adding in review
        const usedNames = players.map(p => p.name.toLowerCase());
        const availableNames = DEFAULT_NAME_POOL.filter(n => !usedNames.includes(n.toLowerCase()));
        
        let randomName;
        if (availableNames.length > 0) {
            randomName = shuffle(availableNames)[0];
        } else {
            randomName = `Jugador ${players.length + 1}`;
        }
        
        const nextColor = getNextAvailableColor(players);
        
        const newPlayer: Player = {
            id: `p-add-${Date.now()}`,
            name: randomName,
            color: nextColor,
            pact: 'Atenea'
        };

        setPlayers(prev => [...prev, newPlayer]);
        setEditingId(newPlayer.id);
        setIsAddingNew(true);
    };

    const savePlayerChanges = (id: string, data: Partial<Player>) => {
        // Validate name empty
        if (data.name !== undefined && !data.name.trim()) return false;
        
        // Validate name uniqueness (excluding self)
        if (data.name) {
            const nameTaken = players.some(p => p.name.toLowerCase() === data.name!.trim().toLowerCase() && p.id !== id);
            if (nameTaken) return false;
        }

        // Validate color uniqueness (excluding self)
        const colorTaken = players.some(p => p.color === data.color && p.id !== id);
        if (colorTaken) return false;

        setPlayers(prev => prev.map(p => 
            p.id === id 
                ? { ...p, ...data, pact: config.pactMode === 'STRATEGIC' && data.pact ? data.pact : p.pact }
                : p
        ));
        setEditingId(null);
        setIsAddingNew(false);
        return true;
    };

    const deletePlayer = (id: string) => {
        setPlayers(prev => prev.filter(p => p.id !== id));
        setEditingId(null);
        setIsAddingNew(false);
    };

    const cancelEditing = () => {
        if (isAddingNew && editingId) {
            setPlayers(prev => prev.filter(p => p.id !== editingId));
        }
        setEditingId(null);
        setIsAddingNew(false);
    };

    const finalizeReview = () => {
        // Logic for confirming the roster
        if (config.pactMode === 'STRATEGIC') {
            // Skip reveal phase
            return { readyToPlay: true, players };
        }

        // Assign secret pacts
        const finalPacts = generatePacts(players.length, config.pactMode);
        const finalPlayers = players.map((p, idx) => ({ ...p, pact: finalPacts[idx] }));
        setPlayers(finalPlayers);
        setStep('REVEAL_PACTS');
        setShowReviewModal(false);
        setConfig(prev => ({...prev, playerCount: players.length}));
        
        return { readyToPlay: false, players: finalPlayers };
    };

    // --- LOGIC: Reveal Phase ---
    const handleRevealCard = () => {
        setRevealState(prev => ({ ...prev, isRevealed: true, isLocked: true }));
        setTimeout(() => setRevealState(prev => ({ ...prev, isLocked: false })), 1000);
    };

    const nextReveal = () => {
        if (revealState.isLocked) return;
        
        if (revealState.index < players.length - 1) {
            setRevealState(prev => ({ ...prev, isRevealed: false, index: prev.index + 1 }));
        } else {
            return true; // Finished
        }
        return false;
    };

    return {
        state: {
            step,
            players,
            config,
            tempInput,
            errors,
            editingId,
            showReviewModal,
            revealState,
            isAddingNew
        },
        actions: {
            updateConfig,
            confirmConfig,
            setTempInput,
            addPlayer,
            handleInputBack,
            startEditing,
            addNewInReview,
            savePlayerChanges,
            deletePlayer,
            cancelEditing,
            setShowReviewModal,
            closeReviewModal, // New Safe Close
            finalizeReview,
            handleRevealCard,
            nextReveal,
            setRevealState // exposed for quit modal mainly
        }
    };
};