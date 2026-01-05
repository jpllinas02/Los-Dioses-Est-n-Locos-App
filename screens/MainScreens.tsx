import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Card, Button, BottomBar } from '../components/UI';
import { Player, PactType, GameColor } from '../types';

// --- Home Screen ---
export const HomeScreen: React.FC = () => {
    const navigate = useNavigate();
    const [showResumeModal, setShowResumeModal] = useState(false);

    const handleStartGame = () => {
        const existingData = localStorage.getItem('game_players');
        if (existingData && JSON.parse(existingData).length > 0) {
            setShowResumeModal(true);
        } else {
            navigate('/registration');
        }
    };

    const startNewGame = () => {
        // Clear all game data
        localStorage.removeItem('game_players');
        localStorage.removeItem('game_results');
        localStorage.removeItem('game_stats'); 
        localStorage.removeItem('game_log');   
        localStorage.removeItem('game_minigame_history'); 
        navigate('/registration');
    };

    const resumeGame = () => {
        navigate('/game');
    };

    const navigateToPlaceholder = (title: string, description: string) => {
        navigate('/extras', { state: { title, description } });
    };

    // Helper for 3D Button Style
    // Removed 'uppercase' to allow Title Case (Nombre Propio)
    const secondaryBtnClass = "relative w-full py-3 bg-white border-2 border-slate-200 border-b-[5px] border-b-slate-300 rounded-xl text-slate-600 font-extrabold text-sm tracking-wide active:border-b-2 active:translate-y-[3px] transition-all duration-100 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700";

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background overflow-hidden max-w-md mx-auto shadow-2xl">
             <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.08] mix-blend-multiply grayscale" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3RwclW-6L2OYrgdY1Hk_rKW2-hQLFqhp8Ii5OYxEAUZTyH6S3YEG-0_vjW2fne3ekkbc0WtIMZ3EM9Whc-oPdIOabbYPutIEejGEvRvWtjqEGyU5bscKlRtjZ1h-IQe5kttxTtZsgdvD8WbuJPhwqNk4X9ddygeY6c6vEEgitYZAiBCNueDV-qgZszt9SJL1XlEtc6DiHmQ4pynpviq1EINlahGsDhGCblUg4xoE11XUZN2M4OrIdlh7rsjZM3H65rKndEHHRnD0")'}}></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-100/40 via-background/50 to-background"></div>

            {/* Top Bar Icons Removed per request */}
            <div className="w-full pt-8"></div>

            <div className="relative z-10 flex-1 flex flex-col items-center px-6 w-full pt-4">
                {/* Logo Section */}
                <div className="flex flex-col items-center justify-center mb-8 w-full">
                    <div className="relative w-40 h-40 mb-4">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-white to-purple-50 rounded-3xl border border-white/80 shadow-xl flex items-center justify-center p-4 animate-float">
                            <div className="w-full h-full bg-center bg-contain bg-no-repeat" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAWjwyX0TYR79Q1qqIZ8qT_iykfcOl-WeITNgC9FktM6HGOs5Lvz9VIFGVI_b7Gp6XwGzKVViIMBFBZuIPBdyNl25Csv0Lhe6nldJKQhSN7HjNVTC4TQUpXKMWXlDvv-2q7imiNsatYy8JYetX63eZh9QM4omeVU2zOch52VBWuD6eO2T6qkZmRLISa7CwLGB221LuJNWEaA76hPQHQfKk56qV5oFlp6dCzyqEg8HkClqzGPKDErSnZEG2gq29i1TxKky-ugQ5ZIFo")'}}></div>
                        </div>
                    </div>
                    <h1 className="typo-h1 text-center drop-shadow-sm leading-none">
                        Los Dioses <br/>
                        <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-primary">Están Locos</span>
                    </h1>
                    {/* Updated Companion App Text Style */}
                    <p className="mt-2 text-primary/60 font-bold uppercase tracking-[0.2em] text-[10px]">Aplicación Acompañante</p>
                </div>
                
                {/* Menu System */}
                <div className="w-full flex flex-col items-center justify-start flex-1 mb-8">
                    
                    {/* Main Button - 3D Style with Aura & Increased Height & Softer Bottom Edge */}
                    <div className="w-full max-w-xs mb-6">
                        <button 
                            onClick={handleStartGame} 
                            // Changed shadow bottom color from #1a0b7e (blackish) to #280bc4 (vibrant dark blue)
                            // Reduced 3D height from 8px to 6px for a cleaner look
                            className="group relative w-full py-8 px-4 bg-[#330df2] text-white rounded-2xl shadow-[0_6px_0_0_#280bc4,0_0_40px_rgba(51,13,242,0.5)] active:shadow-none active:translate-y-[6px] transition-all duration-150 flex flex-col items-center justify-center hover:bg-[#3b16f2]"
                        >
                            <span className="text-xl font-extrabold tracking-tight leading-none mb-1">Empieza Partida Nueva</span>
                            <span className="text-sm font-medium text-white/80 leading-none">O Retoma una iniciada</span>
                        </button>
                    </div>
                    
                    {/* Secondary List - Fun Video Game Menu Style */}
                    <div className="flex flex-col gap-2.5 w-full max-w-[240px]">
                        <button 
                            className={secondaryBtnClass}
                            onClick={() => navigateToPlaceholder("¿Cómo Usar Esta App?", "Aquí encontrarás una guía paso a paso sobre cómo utilizar todas las funciones de la aplicación acompañante para mejorar tu experiencia de juego.")}
                        >
                            ¿Cómo Usar Esta App?
                        </button>

                        <button 
                            className={secondaryBtnClass}
                            onClick={() => navigateToPlaceholder("Reglas Del Juego", "El reglamento completo de 'Los Dioses Están Locos' estará disponible aquí para consulta rápida durante tus partidas.")}
                        >
                            Reglas Del Juego
                        </button>

                        <button 
                            className={secondaryBtnClass}
                            onClick={() => navigateToPlaceholder("Configuración", "Próximamente podrás ajustar el volumen, idioma, notificaciones y otras preferencias de la aplicación desde este menú.")}
                        >
                            Configuración
                        </button>

                        <button 
                            className={secondaryBtnClass}
                            onClick={() => navigateToPlaceholder("Extras", "Esta sección contendrá Galería de imágenes, Prototipos y versiones iniciales, y Agradecimientos especiales.")}
                        >
                            Extras
                        </button>
                    </div>
                </div>
            </div>

            {/* Resume/New Game Modal */}
            {showResumeModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowResumeModal(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-6 flex flex-col items-center text-center animate-float">
                        <span className="material-symbols-outlined text-4xl text-primary mb-2">save</span>
                        <h3 className="typo-h3 mb-2">Partida Encontrada</h3>
                        <p className="text-sm text-slate-500 mb-6">Existe una partida anterior guardada. ¿Deseas continuarla o empezar de cero?</p>
                        <div className="flex gap-3 w-full">
                             <button onClick={startNewGame} className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-600 text-sm">Nueva Partida</button>
                             <button onClick={resumeGame} className="flex-[2] py-3 rounded-xl bg-primary text-white font-bold shadow-md">Continuar Partida</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Registration Screen (Redesigned Flow) ---
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
    const [nameError, setNameError] = useState<string | null>(null);
    const [colorError, setColorError] = useState<string | null>(null);

    // Reveal Phase State
    const [revealIndex, setRevealIndex] = useState(0);
    const [isCardRevealed, setIsCardRevealed] = useState(false);

    // --- Constants ---
    const colors: { id: GameColor, bg: string, shadow: string, ring: string, text: string, checkColor?: string, border?: string, line: string }[] = [
        { id: 'red', bg: 'bg-red-500', shadow: 'shadow-red-500/20', ring: 'peer-checked:ring-red-200', text: 'text-red-600', line: 'bg-white/90' },
        { id: 'blue', bg: 'bg-blue-500', shadow: 'shadow-blue-500/20', ring: 'peer-checked:ring-blue-200', text: 'text-blue-600', line: 'bg-white/90' },
        { id: 'yellow', bg: 'bg-yellow-400', shadow: 'shadow-yellow-400/20', ring: 'peer-checked:ring-yellow-200', text: 'text-yellow-600', line: 'bg-slate-800/60' },
        { id: 'green', bg: 'bg-green-500', shadow: 'shadow-green-500/20', ring: 'peer-checked:ring-green-200', text: 'text-green-600', line: 'bg-white/90' },
        { id: 'black', bg: 'bg-slate-900', shadow: 'shadow-slate-900/20', ring: 'peer-checked:ring-slate-400', text: 'text-slate-900', line: 'bg-white/90' },
        { id: 'white', bg: 'bg-white', shadow: 'shadow-slate-200/50', ring: 'peer-checked:ring-slate-200', text: 'text-slate-600', checkColor: 'text-slate-900', border: 'border-slate-200', line: 'bg-slate-800/60' },
    ];

    const pactDetails: Record<PactType, {label: string, icon: string, scoring: {r: number, p: number, w: number}, color: string}> = {
        'Atenea': { label: 'Atenea', icon: 'school', scoring: {r: 3, p: -1, w: 0}, color: 'text-yellow-600' },
        'Loki': { label: 'Loki', icon: 'theater_comedy', scoring: {r: 2, p: 1, w: 0}, color: 'text-green-600' },
        'Longwang': { label: 'Longwang', icon: 'tsunami', scoring: {r: 2, p: -1, w: 1}, color: 'text-cyan-600' },
    };

    // --- Helpers ---
    const shuffle = (array: any[]) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

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
        }
    };

    // --- Actions: Generation Logic ---
    const generatePacts = (count: number, mode: PactMode): PactType[] => {
        let pacts: PactType[] = [];
        
        if (mode === 'BALANCED') {
            // 1 Loki always
            pacts.push('Loki');
            // Fill rest with Atenea/Longwang randomly but somewhat balanced
            const remaining = count - 1;
            for(let i=0; i<remaining; i++) {
                pacts.push(i % 2 === 0 ? 'Atenea' : 'Longwang');
            }
        } else if (mode === 'CHAOTIC') {
            // 0, 1, or 2 Lokis
            const lokiCount = Math.floor(Math.random() * 3); // 0, 1, 2
            for(let i=0; i<lokiCount; i++) pacts.push('Loki');
            // Fill rest
            while(pacts.length < count) {
                pacts.push(Math.random() > 0.5 ? 'Atenea' : 'Longwang');
            }
        } else {
            // STRATEGIC (Public Roles logic, but assignment is still random initially)
            // Assuming similar to Balanced but maybe slightly more varied
            pacts.push('Loki');
            while(pacts.length < count) {
                pacts.push(Math.random() > 0.5 ? 'Atenea' : 'Longwang');
            }
        }
        
        // Shuffle the pacts so position doesn't matter
        return shuffle(pacts);
    };

    const generateRandomPlayers = () => {
        const pool = ["Coco", "Tete", "Nono", "Rorro", "Nadie", "Casi", "Pro", "Bebé", "Caos", "Osi", "Bicho", "Pulga", "Mole", "Cinco", "Rex", "Piojo"];
        const shuffledNames = shuffle([...pool]);
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
        setStep('REVEAL_PACTS');
    };

    // --- Actions: Name Input Phase ---
    const handleNextName = () => {
        setNameError(null);
        setColorError(null);

        if (!tempName.trim()) {
            setNameError('Escribe un nombre');
            return;
        }
        if (players.some(p => p.color === tempColor)) {
            setColorError('Color ocupado');
            return;
        }

        // Just store name/color for now, pact added later
        const newPartialPlayer = {
            id: `p-${Date.now()}`,
            name: tempName.trim(),
            color: tempColor,
            pact: 'Atenea' as PactType // Placeholder, will be overwritten
        };

        const updatedList = [...players, newPartialPlayer];
        setPlayers(updatedList);
        setTempName('');
        
        // Auto pick next color
        const nextColor = colors.find(c => !updatedList.some(p => p.color === c.id))?.id;
        if (nextColor) setTempColor(nextColor);

        // Check if done
        if (updatedList.length >= config.playerCount) {
            // FINISH INPUT -> ASSIGN PACTS -> GO TO REVEAL
            const finalPacts = generatePacts(config.playerCount, config.pactMode);
            const finalPlayers = updatedList.map((p, idx) => ({
                ...p,
                pact: finalPacts[idx]
            }));
            setPlayers(finalPlayers);
            setStep('REVEAL_PACTS');
        } else {
            // Focus input for next
            setTimeout(() => nameInputRef.current?.focus(), 100);
        }
    };

    // --- Actions: Reveal Phase ---
    const handleReveal = () => {
        setIsCardRevealed(true);
    };

    const handleConfirmPact = () => {
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
        if (isCardRevealed) {
            // If card is revealed, back simply flips it over to "Pass Phone" state
            // It does NOT go to previous player yet.
            setIsCardRevealed(false);
        } else {
            // Card is NOT revealed (Pass Phone state)
            if (revealIndex === 0) {
                // If Player 1, go back to Config/Input
                if (config.nameMode === 'RANDOM') {
                    setStep('CONFIG');
                } else {
                    setStep('INPUT_NAMES');
                    setPlayers([]);
                }
            } else {
                // If Player 2+, go back to Previous Player but in HIDDEN state
                setRevealIndex(prev => prev - 1);
                setIsCardRevealed(false);
            }
        }
    };

    const getColorStyle = (colorId: string) => colors.find(c => c.id === colorId) || colors[0];

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
                    <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out bg-slate-50 border-t border-slate-100`}
                    style={{ maxHeight: isOpen ? '500px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    // --- VIEW 1: CONFIGURATION ---
    if (step === 'CONFIG') {
        return (
            <div className="flex h-screen w-full flex-col bg-[#f6f5f8]">
                <Header title="Configuración de Partida" onBack={() => navigate('/')} />
                
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
                            ].map((m) => (
                                <button 
                                    key={m.id}
                                    onClick={() => updateConfig('pactMode', m.id, 2)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${config.pactMode === m.id ? 'bg-primary/5 border-primary' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`font-bold ${config.pactMode === m.id ? 'text-primary' : 'text-slate-800'}`}>{m.label}</span>
                                        {config.pactMode === m.id && <span className="material-symbols-outlined text-primary text-xl">check_circle</span>}
                                    </div>
                                    <p className="text-xs text-slate-500">{m.desc}</p>
                                </button>
                            ))}
                        </div>
                    </AccordionSection>

                    {/* Section 3: Name Mode */}
                    <AccordionSection index={2} title="Nombres" valueLabel={config.nameMode === 'CUSTOM' ? 'Personalizados' : 'Aleatorios'}>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => updateConfig('nameMode', 'CUSTOM', null)}
                                className={`py-4 rounded-xl font-bold text-sm border-2 transition-all flex flex-col items-center gap-2 ${config.nameMode === 'CUSTOM' ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-slate-200 text-slate-600'}`}
                            >
                                <span className="material-symbols-outlined">edit</span>
                                Manual
                            </button>
                            <button 
                                onClick={() => updateConfig('nameMode', 'RANDOM', null)}
                                className={`py-4 rounded-xl font-bold text-sm border-2 transition-all flex flex-col items-center gap-2 ${config.nameMode === 'RANDOM' ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-slate-200 text-slate-600'}`}
                            >
                                <span className="material-symbols-outlined">shuffle</span>
                                Automático
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
        );
    }

    // --- VIEW 2: NAME INPUT (Loop) ---
    if (step === 'INPUT_NAMES') {
        return (
            <div className="flex h-screen w-full flex-col bg-[#f6f5f8]">
                <Header title="Registro" onBack={() => setStep('CONFIG')} />
                
                <div className="flex-1 px-6 pt-8 flex flex-col items-center animate-fade-in">
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
                        <div className="flex justify-between items-center px-1">
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
                        {players.length === config.playerCount - 1 ? 'Finalizar y Asignar' : 'Siguiente Jugador'}
                    </Button>
                </BottomBar>
            </div>
        );
    }

    // --- VIEW 3: SECRET REVEAL (Loop) ---
    if (step === 'REVEAL_PACTS') {
        const currentPlayer = players[revealIndex];
        const currentPact = pactDetails[currentPlayer.pact];
        const style = getColorStyle(currentPlayer.color);

        // Shared container style for seamless transition between states
        const cardClass = "w-full aspect-[4/5] max-h-[60vh] bg-white rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center transition-all duration-300";

        return (
            <div className={`flex h-screen w-full flex-col bg-[#f6f5f8]`}>
                {/* Header: Back allowed (logic in handleRevealBack) */}
                <Header 
                    title="Asignación de Pactos" 
                    showBack={true} 
                    onBack={handleRevealBack} 
                    actionIcon="settings" 
                />
                
                <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
                    
                    {/* CARD CONTAINER */}
                    {/* Key ensures React completely re-renders the card when player changes, preventing stale state */}
                    <div className={cardClass} key={revealIndex}>
                        {/* Static Background Decoration for Card */}
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent opacity-60 pointer-events-none"></div>

                        {!isCardRevealed ? (
                            // STATE: Pass the Phone
                            <div className="w-full flex flex-col items-center animate-fade-in relative z-10">
                                <div className={`absolute top-[-24px] left-0 w-full h-2 bg-gradient-to-r from-transparent via-${style.id === 'white' || style.id === 'black' ? 'slate' : style.id}-400 to-transparent opacity-50`}></div>
                                
                                <div className={`w-24 h-24 rounded-full ${style.bg} border-4 ${style.border || 'border-slate-100'} shadow-md flex items-center justify-center mx-auto mb-6`}>
                                    <span className={`material-symbols-outlined text-5xl ${style.id === 'white' ? 'text-slate-900' : 'text-white'}`}>face</span>
                                </div>
                                
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Turno de</h2>
                                <h1 className="typo-h1 mb-8">{currentPlayer.name}</h1>
                                
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
                                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Tu Pacto Es</span>
                                </div>
                                
                                <div className={`text-6xl mb-4 ${currentPact.color} drop-shadow-sm transform scale-110`}>
                                    <span className="material-symbols-outlined text-[80px]">{currentPact.icon}</span>
                                </div>
                                
                                <h1 className={`font-cartoon text-4xl mb-6 ${currentPact.color} drop-shadow-sm`}>{currentPact.label}</h1>
                                
                                <div className="w-16 h-1 bg-slate-200 rounded-full mb-6"></div>
                                
                                {/* Scoring Summary */}
                                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex flex-col items-center w-12">
                                        <span className="material-symbols-outlined text-cyan-500 mb-1">diamond</span>
                                        <span className={`font-black text-lg ${currentPact.scoring.r > 0 ? 'text-green-600' : 'text-slate-500'}`}>
                                            {currentPact.scoring.r > 0 ? `+${currentPact.scoring.r}` : currentPact.scoring.r}
                                        </span>
                                    </div>
                                    <div className="w-[1px] h-8 bg-slate-200"></div>
                                    <div className="flex flex-col items-center w-12">
                                        <span className="material-symbols-outlined text-purple-500 mb-1">skull</span>
                                        <span className={`font-black text-lg ${currentPact.scoring.p > 0 ? 'text-green-600' : (currentPact.scoring.p < 0 ? 'text-red-500' : 'text-slate-500')}`}>
                                            {currentPact.scoring.p > 0 ? `+${currentPact.scoring.p}` : currentPact.scoring.p}
                                        </span>
                                    </div>
                                    <div className="w-[1px] h-8 bg-slate-200"></div>
                                    <div className="flex flex-col items-center w-12">
                                        <span className="material-symbols-outlined text-yellow-500 mb-1">bolt</span>
                                        <span className={`font-black text-lg ${currentPact.scoring.w > 0 ? 'text-green-600' : 'text-slate-500'}`}>
                                            {currentPact.scoring.w > 0 ? `+${currentPact.scoring.w}` : currentPact.scoring.w}
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
                                // High Contrast Style for Readability - Dark Navy/Black
                                className="h-16 text-lg shadow-xl shadow-slate-900/20 bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 border-2 border-slate-900"
                                icon="check"
                            >
                                {revealIndex < players.length - 1 ? 'Ocultar y Pasar' : 'Empezar Partida'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

// --- Leaderboard Screen ---
export const LeaderboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState<Player[]>([]);
    const [gameLog, setGameLog] = useState<{minigames: Record<string, number>, mentions?: Record<string, Record<string, number>>, decisions?: Record<string, number>} | null>(null);
    const [honorCounts, setHonorCounts] = useState<Record<string, number>>({});

    // Helper to calculate how many *TITLES* (Honors) a player won.
    const calculateHonorCounts = (players: Player[], log: any) => {
        const counts: Record<string, number> = {};
        players.forEach(p => counts[p.id] = 0);

        if (!log) return counts;

        // 1. Minigame Master
        if (log.minigames) {
            let max = 0;
            const minigames = log.minigames as Record<string, number>;
            Object.values(minigames).forEach((v) => { if (v > max) max = v; });
            
            if (max > 0) {
                const winners = Object.keys(minigames).filter(id => minigames[id] === max);
                winners.forEach(id => { if(counts[id] !== undefined) counts[id]++; });
            }
        }

        // 2. Voting Categories
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
        const storedResults = localStorage.getItem('game_results');
        const storedLog = localStorage.getItem('game_log');
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

    // --- Honors Logic for Display ---
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
        
        const categories = [
             { id: 'strategy', title: 'El Más Estratégico', icon: 'psychology' },
             { id: 'chaos', title: 'El Más Caótico', icon: 'local_fire_department' },
             { id: 'fun', title: 'Quien Más Hizo Reír', icon: 'sentiment_very_satisfied' },
             { id: 'liar', title: 'El Mejor Mentiroso', icon: 'theater_comedy' },
        ];

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

    const minigameHonor = getMinigameHonor();
    const categoryHonors = getCategoryHonors();
    const hasHonors = minigameHonor || categoryHonors.length > 0;

    const getColorStyle = (color: GameColor) => {
        switch(color) {
            case 'red': return {bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200'};
            case 'blue': return {bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200'};
            case 'yellow': return {bg: 'bg-yellow-400', text: 'text-yellow-600', border: 'border-yellow-200'};
            case 'green': return {bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200'};
            case 'black': return {bg: 'bg-slate-900', text: 'text-slate-900', border: 'border-slate-800'};
            case 'white': return {bg: 'bg-white', text: 'text-slate-600', border: 'border-slate-300'};
            default: return {bg: 'bg-slate-500', text: 'text-slate-600', border: 'border-slate-200'};
        }
    };

    const getHonorColorStyles = (color: GameColor) => {
        switch(color) {
            case 'red': return {
                gradient: 'from-red-50', 
                border: 'border-red-200 border-l-4 border-l-red-500', 
                bgIcon: 'bg-red-500 shadow-md shadow-red-500/30', 
                textIcon: 'text-white',
                textTitle: 'text-red-900',
                badge: 'bg-white border border-red-200 text-red-700'
            };
            case 'blue': return {
                gradient: 'from-blue-50', 
                border: 'border-blue-200 border-l-4 border-l-blue-500', 
                bgIcon: 'bg-blue-500 shadow-md shadow-blue-500/30', 
                textIcon: 'text-white',
                textTitle: 'text-blue-900',
                badge: 'bg-white border border-blue-200 text-blue-700'
            };
            case 'green': return {
                gradient: 'from-green-50', 
                border: 'border-green-200 border-l-4 border-l-green-500', 
                bgIcon: 'bg-green-500 shadow-md shadow-green-500/30', 
                textIcon: 'text-white',
                textTitle: 'text-green-900',
                badge: 'bg-white border border-green-200 text-green-700'
            };
            case 'yellow': return {
                gradient: 'from-yellow-50', 
                border: 'border-yellow-200 border-l-4 border-l-yellow-400', 
                bgIcon: 'bg-yellow-400 shadow-md shadow-yellow-400/30', 
                textIcon: 'text-white',
                textTitle: 'text-yellow-800',
                badge: 'bg-white border border-yellow-200 text-yellow-700'
            };
            case 'black': return {
                gradient: 'from-slate-100', 
                border: 'border-slate-300 border-l-4 border-l-slate-900', 
                bgIcon: 'bg-slate-900 shadow-md shadow-slate-900/30', 
                textIcon: 'text-white',
                textTitle: 'text-slate-900',
                badge: 'bg-white border border-slate-300 text-slate-800'
            };
            case 'white': return {
                gradient: 'from-slate-50', 
                border: 'border-slate-200 border-l-4 border-l-slate-400', 
                bgIcon: 'bg-white border border-slate-200', 
                textIcon: 'text-slate-500', 
                textTitle: 'text-slate-600',
                badge: 'bg-slate-50 border border-slate-200 text-slate-600'
            };
            default: return {
                gradient: 'from-slate-50',
                border: 'border-slate-100 border-l-4 border-l-slate-400',
                bgIcon: 'bg-slate-100',
                textIcon: 'text-slate-500',
                textTitle: 'text-slate-600',
                badge: 'bg-slate-100 text-slate-500'
            };
        }
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

    if (results.length === 0) {
        return (
            <div className="flex min-h-screen flex-col bg-background items-center justify-center p-6 text-center">
                 <h2 className="typo-h2">No hay resultados aún</h2>
                 <p className="typo-body mb-4">Termina una partida para ver la tabla.</p>
                 <Button onClick={()=>navigate('/game')}>Volver al Juego</Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header title="Resultados Finales" actionIcon="share" />
            <div className="flex-1 overflow-y-auto pb-32 relative">
                 <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>
                 <div className="relative z-10 pt-4 pb-2 px-4 text-center mt-6">
                    <h1 className="typo-h1">
                        ¡Campeón Supremo!
                    </h1>
                 </div>

                 {winner && (
                     <div className="p-4 relative z-10">
                         <div className="flex flex-col items-center justify-center rounded-2xl shadow-lg bg-white border-2 border-primary overflow-hidden relative p-6">
                            <div className="absolute top-3 right-3 animate-bounce">
                                <span className="material-symbols-outlined text-yellow-500 text-4xl filled" style={{fontVariationSettings: "'FILL' 1"}}>crown</span>
                            </div>
                            <div className={`w-32 h-32 rounded-full border-4 shadow-md flex items-center justify-center mb-4 ${getColorStyle(winner.color).bg}`}>
                                <span className={`material-symbols-outlined text-7xl ${winner.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                            </div>
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold mb-2">
                                {getRank(0) === 1 ? '1er Lugar' : `${getRank(0)}º Lugar`}
                            </div>
                            <p className="typo-h2">{winner.name}</p>
                            <p className="text-text-muted text-sm font-medium">Pacto: <span className="font-bold text-slate-800">{winner.pact}</span></p>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-4xl font-extrabold text-primary">{winner.score}</span>
                                <span className="text-lg font-medium text-text-muted">PTS</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 w-full mt-4 bg-slate-50 p-2 rounded-xl">
                                <div className="text-center">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Reliquias</span>
                                    <span className="font-bold text-cyan-600">{winner.scoreDetails?.relics || 0}</span>
                                </div>
                                <div className="text-center border-l border-slate-200">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Plagas</span>
                                    <span className="font-bold text-purple-600">{winner.scoreDetails?.plagues || 0}</span>
                                </div>
                                <div className="text-center border-l border-slate-200">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Poderes</span>
                                    <span className="font-bold text-yellow-600">{winner.scoreDetails?.powers || 0}</span>
                                </div>
                            </div>
                         </div>
                     </div>
                 )}

                 <div className="px-4 mt-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="grid grid-cols-[3rem_1fr_4rem] bg-slate-50 border-b border-slate-200 py-2 px-3">
                             <div className="text-xs font-bold text-slate-400 uppercase text-center">Pos</div>
                             <div className="text-xs font-bold text-slate-400 uppercase text-left pl-2">Jugador</div>
                             <div className="text-xs font-bold text-slate-400 uppercase text-right">Pts</div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {others.map((p, i) => {
                                const overallIndex = i + 1; // 0 is winner
                                const rank = getRank(overallIndex);
                                return (
                                <div key={p.id} className="grid grid-cols-[3rem_1fr_4rem] items-center py-3 px-3">
                                    <div className="flex justify-center">
                                        <div className="flex size-7 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-sm border border-slate-200">{rank}</div>
                                    </div>
                                    <div className="flex items-center gap-3 pl-2 overflow-hidden">
                                        <div className={`size-9 rounded-full flex items-center justify-center shadow-sm shrink-0 border ${getColorStyle(p.color).border} ${getColorStyle(p.color).bg}`}>
                                            <span className={`material-symbols-outlined text-lg ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-slate-900 font-bold text-sm truncate">{p.name}</p>
                                            <p className="text-slate-400 text-xs truncate">Pacto: {p.pact}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-900 font-bold text-lg">{p.score}</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                 </div>

                 {hasHonors && (
                    <div className="px-4 mt-8 mb-4">
                        <h3 className="text-center typo-h3 mb-4 text-slate-500">Menciones Honoríficas</h3>
                        <div className="grid gap-3">
                            {minigameHonor && (
                                <div className={`bg-gradient-to-r ${getHonorColorStyles(minigameHonor.player.color).gradient} to-white p-4 rounded-xl border ${getHonorColorStyles(minigameHonor.player.color).border} flex items-center gap-4 shadow-sm`}>
                                    <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${getHonorColorStyles(minigameHonor.player.color).bgIcon} ${getHonorColorStyles(minigameHonor.player.color).textIcon}`}>
                                        <span className="material-symbols-outlined text-2xl">{minigameHonor.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <p className={`text-xs font-bold uppercase tracking-wider ${getHonorColorStyles(minigameHonor.player.color).textTitle}`}>{minigameHonor.title}</p>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getHonorColorStyles(minigameHonor.player.color).badge}`}>{minigameHonor.count} {minigameHonor.count === 1 ? 'Victoria' : 'Victorias'}</span>
                                        </div>
                                        <p className="font-bold text-slate-900 text-lg">{minigameHonor.player.name}</p>
                                    </div>
                                </div>
                            )}
                            {categoryHonors.map((honor) => (
                                <div key={honor.id} className={`bg-gradient-to-r ${getHonorColorStyles(honor.player.color).gradient} to-white p-4 rounded-xl border ${getHonorColorStyles(honor.player.color).border} flex items-center gap-4 shadow-sm`}>
                                    <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${getHonorColorStyles(honor.player.color).bgIcon} ${getHonorColorStyles(honor.player.color).textIcon}`}>
                                        <span className="material-symbols-outlined text-2xl">{honor.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                         <div className="flex justify-between items-baseline">
                                            <p className={`text-xs font-bold uppercase tracking-wider ${getHonorColorStyles(honor.player.color).textTitle}`}>{honor.title}</p>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getHonorColorStyles(honor.player.color).badge}`}>{honor.count} {honor.count === 1 ? 'Voto' : 'Votos'}</span>
                                        </div>
                                        <p className="font-bold text-slate-900 text-lg">{honor.player.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
            </div>
            
            <BottomBar className="bg-white border-t border-slate-100">
                <Button variant="outline" className="flex-1" icon="home" onClick={()=>navigate('/')}>Inicio</Button>
                <Button className="flex-[2]" onClick={()=>navigate('/registration')} icon="replay">Nueva Partida</Button>
            </BottomBar>
        </div>
    );
};

export const ExtrasScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get state from navigation or fallback defaults
    const { title, description } = location.state || {
        title: "Extras",
        description: "Esta sección contendrá Galería de imágenes, Prototipos y versiones iniciales, y Agradecimientos especiales."
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header title={title} actionIcon="settings" />
            <div className="flex-1 flex flex-col items-center justify-center px-6 bg-[#f6f5f8]">
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center max-w-sm w-full">
                    <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl">construction</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">En Construcción</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        {description}
                    </p>
                    <Button fullWidth variant="outline" onClick={() => navigate(-1)}>
                        Volver
                    </Button>
                 </div>
            </div>
        </div>
    );
};