import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, BottomBar, PlayerName } from '../components/UI';
import { Player, PactType, GameColor } from '../types';
import { shuffle, DEFAULT_NAME_POOL, GAME_COLORS } from '../utils';

// --- Registration Screen ---
export const RegistrationScreen: React.FC = () => {
    const navigate = useNavigate();
    const nameInputRef = useRef<HTMLInputElement>(null);

    // --- State Types ---
    type RegistrationStep = 'CONFIG' | 'INPUT_NAMES' | 'REVEAL_PACTS';
    type PactMode = 'BALANCED' | 'CHAOTIC' | 'STRATEGIC';
    type NameMode = 'CUSTOM' | 'RANDOM';

    // --- Core State ---
    const [step, setStep] = useState<RegistrationStep>('CONFIG');
    const [players, setPlayers] = useState<Player[]>([]);
    
    // Config State
    const [activeSection, setActiveSection] = useState<number | null>(null); // 0, 1, 2. Null means all collapsed
    const [config, setConfig] = useState({
        playerCount: 4,
        pactMode: 'BALANCED' as PactMode,
        nameMode: 'CUSTOM' as NameMode
    });

    // Input Names State
    const [tempName, setTempName] = useState('');
    const [tempColor, setTempColor] = useState<GameColor>('red');
    const [tempPact, setTempPact] = useState<PactType>('Atenea'); // For Strategic Mode
    const [nameError, setNameError] = useState<string | null>(null);
    const [colorError, setColorError] = useState<string | null>(null);

    // Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState<GameColor>('red');
    const [editPact, setEditPact] = useState<PactType>('Atenea'); // For Strategic Mode Editing
    const [isAddingNew, setIsAddingNew] = useState(false); // Track if we are editing a brand new player

    // Reveal Phase State
    const [revealIndex, setRevealIndex] = useState(0);
    const [isCardRevealed, setIsCardRevealed] = useState(false);
    const [isRevealLocked, setIsRevealLocked] = useState(false); // Safety lock to prevent skipping
    const [showQuitModal, setShowQuitModal] = useState(false);

    const colors = GAME_COLORS;

    const pactDetails: Record<PactType, {label: string, icon: string, scoring: {r: number, p: number, w: number}, color: string, bg: string, border: string}> = {
        'Atenea': { label: 'Atenea', icon: 'school', scoring: {r: 3, p: -1, w: 0}, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
        'Loki': { label: 'Loki', icon: 'theater_comedy', scoring: {r: 2, p: 1, w: 0}, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
        'Longwang': { label: 'Longwang', icon: 'tsunami', scoring: {r: 2, p: -1, w: 1}, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    };

    // --- Effects ---
    
    // Auto-scroll to editing card AND auto-select text if new
    useEffect(() => {
        if (editingPlayerId) {
            // Small timeout to allow the "slide-down" animation to start/layout to update
            setTimeout(() => {
                // 1. Auto Scroll
                const element = document.getElementById(`player-card-${editingPlayerId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // 2. Auto Select Text (Only if adding new)
                if (isAddingNew) {
                    const inputElement = document.getElementById(`edit-name-input-${editingPlayerId}`) as HTMLInputElement;
                    if (inputElement) {
                        inputElement.select();
                    }
                }
            }, 150);
        }
    }, [editingPlayerId, isAddingNew]);

    // --- Actions: Config Phase ---
    const updateConfig = (key: string, value: any, nextSectionIndex: number | null) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        setActiveSection(nextSectionIndex);
    };

    const getPactModeLabel = (mode: PactMode) => {
        switch(mode) {
            case 'BALANCED': return 'Principal Equilibrada';
            case 'CHAOTIC': return 'Incertidumbre Caótica';
            case 'STRATEGIC': return 'Guerra Estratégica';
        }
    };

    const handleConfigContinue = () => {
        if (config.nameMode === 'RANDOM') {
            generateRandomPlayers();
        } else {
            setStep('INPUT_NAMES');
            // Auto-select first available color
            setTempColor('red');
            // Reset temp pact
            setTempPact('Atenea');
            // Ensure lists are clean when starting fresh
            setPlayers([]);
        }
    };

    // --- Actions: Generation Logic ---
    const generatePacts = (count: number, mode: PactMode): PactType[] => {
        // If Strategic, we don't generate random pacts here (they are assigned manually)
        // But for random name generation flow, we might need this logic if we support random strategic (which we can simply assign randomly)
        
        let pacts: PactType[] = [];
        
        // 1. Assign Lokis based on Mode
        let lokiCount = 0;
        if (mode === 'BALANCED' || mode === 'STRATEGIC') {
            // Exactly 1 Loki (though in strategic user picks, this is for random flow)
            lokiCount = 1;
        } else if (mode === 'CHAOTIC') {
            // 0, 1, or 2 Lokis randomly
            lokiCount = Math.floor(Math.random() * 3);
        }

        // Add Lokis to list
        for (let i = 0; i < lokiCount; i++) {
            pacts.push('Loki');
        }

        // 2. Fill remaining slots randomly with Atenea or Longwang
        
        while (pacts.length < count) {
            const currentAtenea = pacts.filter(p => p === 'Atenea').length;
            const currentLongwang = pacts.filter(p => p === 'Longwang').length;
            
            // Build pool of available cards based on caps
            const pool: PactType[] = [];
            
            if (currentAtenea < 3) pool.push('Atenea');
            if (currentLongwang < 3) pool.push('Longwang');
            
            if (pool.length === 0) break; 

            // Random selection from available pool
            const randomPick = pool[Math.floor(Math.random() * pool.length)];
            pacts.push(randomPick);
        }
        
        // Shuffle the pacts so position doesn't matter
        return shuffle(pacts);
    };

    const generateRandomPlayers = () => {
        const shuffledNames = shuffle([...DEFAULT_NAME_POOL]);
        const pacts = generatePacts(config.playerCount, config.pactMode);
        
        const newPlayers: Player[] = [];
        for (let i = 0; i < config.playerCount; i++) {
            newPlayers.push({
                id: `p-${Date.now()}-${i}`,
                name: shuffledNames[i],
                color: colors[i].id,
                pact: pacts[i]
            });
        }
        
        setPlayers(newPlayers);
        setShowReviewModal(true); // Modal will now render because it's at root level
    };

    // --- Actions: Name Input Phase ---
    
    const handleInputBack = () => {
        if (players.length > 0) {
            // Go back to previous player: Pop last player, restore to inputs
            const prevPlayer = players[players.length - 1];
            const newPlayers = players.slice(0, -1);
            
            setPlayers(newPlayers);
            setTempName(prevPlayer.name);
            setTempColor(prevPlayer.color);
            if (config.pactMode === 'STRATEGIC') {
                setTempPact(prevPlayer.pact);
            }
            
            // Clear errors
            setNameError(null);
            setColorError(null);
        } else {
            // No players left, go back to config and CLEAN SLATE
            setPlayers([]);
            setTempName('');
            setTempColor('red');
            setTempPact('Atenea');
            setNameError(null);
            setColorError(null);
            setStep('CONFIG');
        }
    };

    const handleNextName = () => {
        setNameError(null);
        setColorError(null);

        // Security check
        if (players.length >= config.playerCount) {
             setShowReviewModal(true);
             return;
        }

        if (!tempName.trim()) {
            setNameError('Escribe un nombre');
            return;
        }
        if (players.some(p => p.color === tempColor)) {
            setColorError('Color ocupado');
            return;
        }

        const newPartialPlayer = {
            id: `p-${Date.now()}`,
            name: tempName.trim(),
            color: tempColor,
            // If Strategic, use selected pact. If Random/Balanced, use placeholder 'Atenea' until generation
            pact: config.pactMode === 'STRATEGIC' ? tempPact : 'Atenea' as PactType 
        };

        const updatedList = [...players, newPartialPlayer];
        setPlayers(updatedList);
        setTempName('');
        setTempPact('Atenea'); // Reset to default
        
        // Auto pick next color for the *next* player
        const nextColor = colors.find(c => !updatedList.some(p => p.color === c.id))?.id;
        if (nextColor) setTempColor(nextColor);

        // Check if done
        if (updatedList.length >= config.playerCount) {
            // Open review modal
            setShowReviewModal(true);
        } else {
            // Focus input for next
            setTimeout(() => nameInputRef.current?.focus(), 100);
        }
    };

    // --- Actions: Review Phase (Edit/Delete/Add) ---

    const startEditing = (player: Player) => {
        setEditingPlayerId(player.id);
        setEditName(player.name);
        setEditColor(player.color);
        setEditPact(player.pact); // Load current pact
        setIsAddingNew(false);
    };

    const cancelEditing = () => {
        // If we were adding a new player, cancelling means removing it
        if (isAddingNew && editingPlayerId) {
            setPlayers(prev => prev.filter(p => p.id !== editingPlayerId));
        }

        setEditingPlayerId(null);
        setEditName('');
        setIsAddingNew(false);
    };

    const handleCloseReviewModal = () => {
        // If we are currently editing, cancel the edit/add process first
        if (editingPlayerId) {
            cancelEditing();
        }
        
        setShowReviewModal(false);

        // Logic to return to "last player input" if we are in CUSTOM mode and have a full list
        if (config.nameMode === 'CUSTOM' && players.length >= 4) {
            const lastPlayer = players[players.length - 1];
            const remainingPlayers = players.slice(0, -1);
            
            setPlayers(remainingPlayers);
            setTempName(lastPlayer.name);
            setTempColor(lastPlayer.color);
            if (config.pactMode === 'STRATEGIC') {
                setTempPact(lastPlayer.pact);
            }
            // This ensures the input view renders correctly
            setStep('INPUT_NAMES'); 
        } 
        else if (config.nameMode === 'RANDOM') {
            // If random and they cancel, reset to config
            setPlayers([]);
            setStep('CONFIG');
        }
    };

    const saveEditing = () => {
        if (!editName.trim()) return;
        
        // Check color collision only against other players
        const colorTaken = players.some(p => p.color === editColor && p.id !== editingPlayerId);
        if (colorTaken) {
            return; 
        }

        setPlayers(prev => prev.map(p => 
            p.id === editingPlayerId 
                ? { ...p, name: editName, color: editColor, pact: config.pactMode === 'STRATEGIC' ? editPact : p.pact }
                : p
        ));
        setEditingPlayerId(null);
        setIsAddingNew(false);
    };

    const deletePlayer = () => {
        setPlayers(prev => prev.filter(p => p.id !== editingPlayerId));
        setEditingPlayerId(null);
        setIsAddingNew(false);
    };

    const addPlayer = () => {
        if (players.length >= 6) return;

        // Find first unused color
        const usedColors = players.map(p => p.color);
        const nextColor = colors.find(c => !usedColors.includes(c.id))?.id || 'red';
        
        // Generate random name
        const randomName = shuffle([...DEFAULT_NAME_POOL])[0];

        const newPlayer: Player = {
            id: `p-add-${Date.now()}`,
            name: randomName,
            color: nextColor,
            pact: 'Atenea' // Placeholder (or actual default if Strategic)
        };

        const newPlayers = [...players, newPlayer];
        setPlayers(newPlayers);
        
        // Automatically start editing the new player
        setEditingPlayerId(newPlayer.id);
        setEditName(newPlayer.name);
        setEditColor(newPlayer.color);
        setEditPact('Atenea');
        setIsAddingNew(true); // MARK AS NEW
    };

    const handleConfirmReview = () => {
        // If Strategic War, players ALREADY have their pacts selected manually.
        // We SKIP the random generation and SKIP the Reveal Phase.
        if (config.pactMode === 'STRATEGIC') {
            const currentCount = players.length;
            setConfig(prev => ({...prev, playerCount: currentCount}));
            
            // Go straight to game
            localStorage.setItem('game_players', JSON.stringify(players));
            navigate('/game');
            return;
        }

        // --- Standard Logic (Balanced/Chaotic) ---
        const currentCount = players.length;
        const finalPacts = generatePacts(currentCount, config.pactMode);
        
        const finalPlayers = players.map((p, idx) => ({
            ...p,
            pact: finalPacts[idx]
        }));
        
        setPlayers(finalPlayers);
        setConfig(prev => ({...prev, playerCount: currentCount}));
        setShowReviewModal(false);
        setStep('REVEAL_PACTS');
    };


    // --- Actions: Reveal Phase ---
    const handleReveal = () => {
        setIsCardRevealed(true);
        // Start Safety Lock
        setIsRevealLocked(true);
        setTimeout(() => {
            setIsRevealLocked(false);
        }, 1000);
    };

    const handleConfirmPact = () => {
        if (isRevealLocked) return;

        if (revealIndex < players.length - 1) {
            setIsCardRevealed(false);
            setRevealIndex(prev => prev + 1);
        } else {
            // Game Start
            localStorage.setItem('game_players', JSON.stringify(players));
            navigate('/game');
        }
    };

    const handleRevealBack = () => {
        setShowQuitModal(true);
    };

    const confirmQuit = () => {
        setShowQuitModal(false);
        setRevealIndex(0);
        setPlayers([]); 
        setStep('CONFIG');
    };

    const getColorStyle = (colorId: string) => colors.find(c => c.id === colorId) || colors[0];

    // Helper to get subtler border colors for the card
    const getPlayerBorderColor = (colorId: string) => {
        switch(colorId) {
            case 'red': return 'border-red-200';
            case 'blue': return 'border-blue-200';
            case 'yellow': return 'border-yellow-300';
            case 'green': return 'border-green-200';
            case 'black': return 'border-slate-600';
            case 'white': return 'border-slate-200';
            default: return 'border-slate-100';
        }
    };

    // --- Helper Component: Pact Selector ---
    const PactSelector = ({ selected, onSelect }: { selected: PactType, onSelect: (p: PactType) => void }) => (
        <div className="grid grid-cols-3 gap-2 w-full">
            {(['Atenea', 'Loki', 'Longwang'] as PactType[]).map(pact => {
                const details = pactDetails[pact];
                const isSelected = selected === pact;
                return (
                    <button
                        key={pact}
                        onClick={() => onSelect(pact)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${isSelected ? `${details.bg} ${details.border} ring-2 ring-offset-1 ring-slate-300` : 'bg-white border-slate-100 hover:border-slate-200'} active:scale-95`}
                    >
                        <span className={`material-symbols-outlined text-2xl mb-1 ${details.color}`}>{details.icon}</span>
                        <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>{pact}</span>
                    </button>
                )
            })}
        </div>
    );

    // --- RENDER: Accordion Section Component ---
    const AccordionSection = ({ 
        index, 
        title, 
        valueLabel, 
        children 
    }: { index: number, title: string, valueLabel: string, children?: React.ReactNode }) => {
        const isOpen = activeSection === index;
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 ease-in-out">
                <button 
                    onClick={() => setActiveSection(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left"
                >
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{title}</span>
                        <span className={`text-lg font-bold ${isOpen ? 'text-primary' : 'text-slate-900'}`}>{valueLabel}</span>
                    </div>
                    <span className={`material-symbols-outlined text-slate-400 transition-transform duration-700 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                <div 
                    className={`overflow-hidden transition-all duration-700 ease-in-out bg-slate-50 border-t border-slate-100`}
                    style={{ maxHeight: isOpen ? '600px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* --- VIEW 1: CONFIGURATION --- */}
            {step === 'CONFIG' && (
                <div className="flex h-screen w-full flex-col bg-[#f6f5f8]">
                    <Header title="Configuración de Partida" onBack={() => navigate('/')} actionIcon="settings" />
                    
                    <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
                        
                        {/* Section 1: Players */}
                        <AccordionSection index={0} title="Cantidad" valueLabel={`${config.playerCount} Jugadores`}>
                            <div className="grid grid-cols-3 gap-3">
                                {[4, 5, 6].map(num => (
                                    <button 
                                        key={num}
                                        onClick={() => updateConfig('playerCount', num, 1)}
                                        className={`h-16 rounded-xl font-bold text-xl border-2 transition-all ${config.playerCount === num ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </AccordionSection>

                        {/* Section 2: Pact Mode */}
                        <AccordionSection index={1} title="Modalidad" valueLabel={getPactModeLabel(config.pactMode)}>
                            <div className="flex flex-col gap-3">
                                {[
                                    { id: 'BALANCED', label: 'Principal Equilibrada', desc: '1 Loki asegurado.' },
                                    { id: 'CHAOTIC', label: 'Incertidumbre Caótica', desc: '0, 1 o 2 Lokis al azar.' },
                                    { id: 'STRATEGIC', label: 'Guerra Estratégica', desc: 'Roles públicos desde el inicio.' }
                                ].map((m) => {
                                    const isSelected = config.pactMode === m.id;
                                    return (
                                        <button 
                                            key={m.id}
                                            onClick={() => updateConfig('pactMode', m.id, 2)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>{m.label}</span>
                                            </div>
                                            <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>{m.desc}</p>
                                        </button>
                                    )
                                })}
                            </div>
                        </AccordionSection>

                        {/* Section 3: Name Mode */}
                        <AccordionSection index={2} title="Nombres" valueLabel={config.nameMode === 'CUSTOM' ? 'Personalizados' : 'Aleatorios'}>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => updateConfig('nameMode', 'CUSTOM', null)}
                                    className={`py-4 rounded-xl font-bold text-sm border-2 transition-all flex flex-col items-center gap-2 ${config.nameMode === 'CUSTOM' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white border-slate-200 text-slate-600'}`}
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                    Personalizados
                                </button>
                                <button 
                                    onClick={() => updateConfig('nameMode', 'RANDOM', null)}
                                    className={`py-4 rounded-xl font-bold text-sm border-2 transition-all flex flex-col items-center gap-2 ${config.nameMode === 'RANDOM' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white border-slate-200 text-slate-600'}`}
                                >
                                    <span className="material-symbols-outlined">shuffle</span>
                                    Aleatorios
                                </button>
                            </div>
                        </AccordionSection>

                    </div>

                    <BottomBar className="bg-white border-t border-slate-100">
                        <Button fullWidth onClick={handleConfigContinue} icon="arrow_forward">
                            Continuar
                        </Button>
                    </BottomBar>
                </div>
            )}

            {/* --- VIEW 2: NAME INPUT (Loop) --- */}
            {step === 'INPUT_NAMES' && (
                <div className="flex h-screen w-full flex-col bg-[#f6f5f8]">
                    <Header title="Registro de Jugadores" onBack={handleInputBack} actionIcon="settings" />
                    
                    {/* Hide content if we are 'done' but waiting for modal to confirm/edit */}
                    {players.length < config.playerCount ? (
                        <>
                            <div className="flex-1 px-6 pt-8 flex flex-col items-center animate-fade-in pb-32 overflow-y-auto">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    Jugador {players.length + 1} de {config.playerCount}
                                </span>
                                
                                <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
                                    <h3 className="typo-h3 mb-4">Nombre del Jugador</h3>
                                    <div className="relative mb-6">
                                        <input 
                                            ref={nameInputRef}
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            className={`w-full bg-slate-50 border-2 rounded-xl h-14 px-4 pl-12 font-bold text-lg outline-none transition-colors ${nameError ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-primary'}`}
                                            placeholder="Escribe aquí..."
                                            autoFocus
                                        />
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                                    </div>
                                    
                                    <h3 className="typo-h3 mb-4">Color de Ficha</h3>
                                    <div className="flex justify-between items-center px-1 mb-6">
                                        {colors.map((c) => {
                                            const isTaken = players.some(p => p.color === c.id);
                                            return (
                                                <button 
                                                    key={c.id}
                                                    onClick={() => !isTaken && setTempColor(c.id)}
                                                    disabled={isTaken}
                                                    className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center transition-all relative ${tempColor === c.id ? 'ring-4 ring-offset-2 ring-slate-200 scale-110' : ''} ${isTaken ? 'opacity-30' : 'hover:scale-105'} border ${c.border || 'border-transparent'}`}
                                                >
                                                    {tempColor === c.id && <span className={`material-symbols-outlined text-base ${c.checkColor || 'text-white'}`}>check</span>}
                                                    {isTaken && <div className={`absolute w-[140%] h-[2px] ${c.line} rotate-[-45deg]`}></div>}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Strategic War: Pact Selection */}
                                    {config.pactMode === 'STRATEGIC' && (
                                        <div className="animate-fade-in">
                                            <h3 className="typo-h3 mb-4">Pacto Divino</h3>
                                            <PactSelector selected={tempPact} onSelect={setTempPact} />
                                        </div>
                                    )}

                                    {(nameError || colorError) && (
                                        <p className="text-red-500 text-xs font-bold mt-4 text-center animate-pulse">
                                            {nameError || colorError}
                                        </p>
                                    )}
                                </div>

                                {/* Progress Dots */}
                                <div className="flex gap-2 mb-4">
                                    {Array.from({ length: config.playerCount }).map((_, i) => (
                                        <div key={i} className={`h-2 rounded-full transition-all ${i < players.length ? 'w-4 bg-primary' : (i === players.length ? 'w-4 bg-slate-300' : 'w-2 bg-slate-200')}`}></div>
                                    ))}
                                </div>
                            </div>

                            <BottomBar className="bg-white border-t border-slate-100">
                                <Button fullWidth onClick={handleNextName} icon={players.length === config.playerCount - 1 ? "check" : "arrow_forward"}>
                                    {players.length === config.playerCount - 1 ? 'Revisar y Finalizar' : 'Siguiente Jugador'}
                                </Button>
                            </BottomBar>
                        </>
                    ) : (
                        // Placeholder while modal is active for full list
                        <div className="flex-1 flex items-center justify-center">
                            <span className="text-slate-400">Generando lista...</span>
                        </div>
                    )}
                </div>
            )}

            {/* --- VIEW 3: SECRET REVEAL (Loop) --- */}
            {step === 'REVEAL_PACTS' && (
                <div className={`flex h-screen w-full flex-col bg-[#f6f5f8]`}>
                    <Header 
                        title="Asignación de Pactos" 
                        showBack={true} 
                        onBack={handleRevealBack} 
                        actionIcon="settings"
                    />
                    
                    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
                        
                        <div className={`w-full aspect-[4/5] max-h-[60vh] bg-white rounded-[2.5rem] shadow-xl border-4 ${getPlayerBorderColor(players[revealIndex].color)} relative overflow-hidden flex flex-col items-center justify-center p-6 text-center transition-all duration-300`} key={revealIndex}>
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent opacity-60 pointer-events-none"></div>

                            {!isCardRevealed ? (
                                // STATE: Pass the Phone
                                <div className="w-full flex flex-col items-center animate-fade-in relative z-10">
                                    <div className={`w-24 h-24 rounded-full ${getColorStyle(players[revealIndex].color).bg} border-4 ${getColorStyle(players[revealIndex].color).border || 'border-slate-100'} shadow-md flex items-center justify-center mx-auto mb-6`}>
                                        <span className={`material-symbols-outlined text-5xl ${getColorStyle(players[revealIndex].color).id === 'white' ? 'text-slate-900' : 'text-white'}`}>face</span>
                                    </div>
                                    
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Turno de</h2>
                                    <h1 className="typo-h1 mb-8">
                                        <PlayerName name={players[revealIndex].name} />
                                    </h1>
                                    
                                    <div className="bg-slate-50 rounded-2xl p-4 mb-2 flex items-center gap-3 text-left w-full border border-slate-100">
                                        <div className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                                            <span className="material-symbols-outlined">smartphone</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium leading-tight">Toma el dispositivo y asegúrate de que nadie más mire la pantalla.</p>
                                    </div>
                                </div>
                            ) : (
                                // STATE: Reveal Secret
                                <div className="w-full flex flex-col items-center animate-pop-in relative z-10">
                                    <div className="mb-2">
                                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Tu Pacto Es Con</span>
                                    </div>
                                    
                                    <div className={`text-6xl mb-4 ${pactDetails[players[revealIndex].pact].color} drop-shadow-sm transform scale-110`}>
                                        <span className="material-symbols-outlined text-[80px]">{pactDetails[players[revealIndex].pact].icon}</span>
                                    </div>
                                    
                                    <h1 className={`font-cartoon text-4xl mb-6 ${pactDetails[players[revealIndex].pact].color} drop-shadow-sm`}>{pactDetails[players[revealIndex].pact].label}</h1>
                                    
                                    <div className="w-16 h-1 bg-slate-200 rounded-full mb-6"></div>
                                    
                                    {/* Scoring Summary */}
                                    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex flex-col items-center w-12">
                                            <span className="material-symbols-outlined text-cyan-500 mb-1">diamond</span>
                                            <span className={`font-black text-lg ${pactDetails[players[revealIndex].pact].scoring.r > 0 ? 'text-green-600' : 'text-slate-500'}`}>
                                                {pactDetails[players[revealIndex].pact].scoring.r > 0 ? `+${pactDetails[players[revealIndex].pact].scoring.r}` : pactDetails[players[revealIndex].pact].scoring.r}
                                            </span>
                                        </div>
                                        <div className="w-[1px] h-8 bg-slate-200"></div>
                                        <div className="flex flex-col items-center w-12">
                                            <span className="material-symbols-outlined text-purple-500 mb-1">skull</span>
                                            <span className={`font-black text-lg ${pactDetails[players[revealIndex].pact].scoring.p > 0 ? 'text-green-600' : (pactDetails[players[revealIndex].pact].scoring.p < 0 ? 'text-red-500' : 'text-slate-500')}`}>
                                                {pactDetails[players[revealIndex].pact].scoring.p > 0 ? `+${pactDetails[players[revealIndex].pact].scoring.p}` : pactDetails[players[revealIndex].pact].scoring.p}
                                            </span>
                                        </div>
                                        <div className="w-[1px] h-8 bg-slate-200"></div>
                                        <div className="flex flex-col items-center w-12">
                                            <span className="material-symbols-outlined text-yellow-500 mb-1">bolt</span>
                                            <span className={`font-black text-lg ${pactDetails[players[revealIndex].pact].scoring.w > 0 ? 'text-green-600' : 'text-slate-500'}`}>
                                                {pactDetails[players[revealIndex].pact].scoring.w > 0 ? `+${pactDetails[players[revealIndex].pact].scoring.w}` : pactDetails[players[revealIndex].pact].scoring.w}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Security Warning */}
                                    <div className="absolute -bottom-10 left-0 right-0 py-3">
                                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined text-sm">lock</span> Información Secreta
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* BUTTON AREA */}
                        <div className="mt-8 w-full max-w-sm px-2">
                            {!isCardRevealed ? (
                                <Button fullWidth onClick={handleReveal} className="shadow-xl shadow-primary/20 h-16 text-lg" icon="visibility">
                                    Revelar mi Pacto
                                </Button>
                            ) : (
                                <Button 
                                    fullWidth 
                                    onClick={handleConfirmPact} 
                                    disabled={isRevealLocked}
                                    className={`h-16 text-lg shadow-xl shadow-slate-900/20 bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 border-2 border-slate-900 ${isRevealLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    icon={isRevealLocked ? 'lock_clock' : 'check'}
                                >
                                    {isRevealLocked ? 'Leyendo...' : (revealIndex < players.length - 1 ? 'Ocultar y Pasar' : 'Empezar Partida')}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Quit Confirmation Modal */}
                    {showQuitModal && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowQuitModal(false)}></div>
                            <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-6 flex flex-col items-center text-center animate-float">
                                <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">warning</span>
                                <h3 className="typo-h3 mb-2">¿Cancelar Partida?</h3>
                                <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
                                    Se perderá la configuración de los jugadores y los roles asignados. Tendrás que empezar de nuevo.
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setShowQuitModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-600 text-sm hover:bg-slate-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmQuit}
                                        className="flex-[2] py-3 rounded-xl bg-[#330df2] text-white font-bold shadow-md hover:bg-[#280bc4] transition-colors"
                                    >
                                        Salir
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- REVIEW MODAL (Now at Root Level for All Steps) --- */}
            {showReviewModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => !editingPlayerId && handleCloseReviewModal()}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                        <div className="p-6 border-b border-slate-100 bg-white text-center">
                            <h3 className="typo-h3 text-slate-900">Lista de Jugadores</h3>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc] flex flex-col gap-3">
                            {players.length === 0 ? (
                                <p className="text-center text-slate-400 py-8">No hay jugadores</p>
                            ) : (
                                players.map((p, idx) => {
                                    const isEditing = editingPlayerId === p.id;
                                    const pStyle = getColorStyle(isEditing ? editColor : p.color);

                                    if (isEditing) {
                                        return (
                                            <div key={p.id} id={`player-card-${p.id}`} className="bg-white rounded-2xl p-4 shadow-lg border-2 border-primary animate-slide-down">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Editando</span>
                                                </div>
                                                
                                                <input 
                                                    id={`edit-name-input-${p.id}`}
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-primary rounded-xl h-12 px-4 font-bold text-lg outline-none mb-4 text-slate-900"
                                                    placeholder="Nombre"
                                                    autoFocus
                                                />
                                                
                                                <div className="flex justify-between items-center mb-6 px-1">
                                                    {colors.map((c) => {
                                                        const isTaken = players.some(existing => existing.color === c.id && existing.id !== p.id);
                                                        return (
                                                            <button 
                                                                key={c.id}
                                                                onClick={() => !isTaken && setEditColor(c.id)}
                                                                disabled={isTaken}
                                                                className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center transition-all relative border ${c.border || 'border-transparent'} ${editColor === c.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''} ${isTaken ? 'opacity-30' : 'hover:scale-105'}`}
                                                            >
                                                                {editColor === c.id && <span className={`material-symbols-outlined text-xs ${c.checkColor || 'text-white'} font-bold`}>check</span>}
                                                                {isTaken && <div className={`absolute w-[140%] h-[2px] ${c.line} rotate-[-45deg]`}></div>}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Strategic War: Edit Pact */}
                                                {config.pactMode === 'STRATEGIC' && (
                                                    <div className="mb-6">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Pacto Divino</span>
                                                        <PactSelector selected={editPact} onSelect={setEditPact} />
                                                    </div>
                                                )}

                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={cancelEditing}
                                                        className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-500 text-sm hover:bg-slate-200 transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button 
                                                        onClick={saveEditing}
                                                        className="flex-1 py-3 rounded-xl bg-[#330df2] text-white font-bold text-sm shadow-md hover:bg-[#280bc4] transition-colors"
                                                    >
                                                        Guardar
                                                    </button>
                                                </div>

                                                <button 
                                                    onClick={deletePlayer}
                                                    className="w-full mt-3 py-3 rounded-xl border border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined icon-sm">delete</span> Eliminar Jugador
                                                </button>
                                            </div>
                                        )
                                    }

                                    return (
                                        <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-10 rounded-full ${pStyle.bg} flex items-center justify-center border ${pStyle.border || 'border-transparent'}`}>
                                                    <span className={`material-symbols-outlined text-xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">
                                                        <PlayerName name={p.name} />
                                                    </span>
                                                    <span className={`text-xs ${config.pactMode === 'STRATEGIC' ? pactDetails[p.pact].color + ' font-bold' : 'text-slate-400'}`}>
                                                        {config.pactMode === 'STRATEGIC' ? p.pact : 'Pacto Secreto'}
                                                    </span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => startEditing(p)}
                                                disabled={editingPlayerId !== null}
                                                className="text-slate-300 hover:text-primary p-2 transition-colors disabled:opacity-30"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-white flex flex-col gap-3 relative z-20">
                            <p className="text-center text-xs text-slate-400 mb-2">
                                {players.length < 4 ? 'Mínimo 4 jugadores requeridos' : '¿Todo listo para empezar el juego?'}
                            </p>
                            
                            <Button 
                                fullWidth 
                                onClick={handleConfirmReview} 
                                disabled={editingPlayerId !== null || players.length < 4 || players.length > 6}
                                className={`shadow-xl shadow-primary/20 transition-all ${editingPlayerId !== null || players.length < 4 || players.length > 6 ? 'opacity-50 grayscale' : ''}`}
                                icon="play_arrow"
                            >
                                Confirmar y Jugar
                            </Button>
                            
                            <Button 
                                fullWidth 
                                variant="secondary"
                                onClick={addPlayer}
                                disabled={editingPlayerId !== null || players.length >= 6}
                                className={`shadow-xl shadow-secondary/20 transition-all ${editingPlayerId !== null || players.length >= 6 ? 'opacity-50 grayscale' : ''}`}
                                icon="person_add"
                            >
                                Añadir Jugador
                            </Button>

                            <button 
                                onClick={handleCloseReviewModal}
                                className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};