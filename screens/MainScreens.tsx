import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background overflow-hidden max-w-md mx-auto shadow-2xl">
             <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.08] mix-blend-multiply grayscale" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3RwclW-6L2OYrgdY1Hk_rKW2-hQLFqhp8Ii5OYxEAUZTyH6S3YEG-0_vjW2fne3ekkbc0WtIMZ3EM9Whc-oPdIOabbYPutIEejGEvRvWtjqEGyU5bscKlRtjZ1h-IQe5kttxTtZsgdvD8WbuJPhwqNk4X9ddygeY6c6vEEgitYZAiBCNueDV-qgZszt9SJL1XlEtc6DiHmQ4pynpviq1EINlahGsDhGCblUg4xoE11XUZN2M4OrIdlh7rsjZM3H65rKndEHHRnD0")'}}></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-100/40 via-background/50 to-background"></div>

            <div className="relative z-10 w-full p-4 flex justify-between items-center pt-8">
                <button className="flex items-center justify-center size-12 rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">settings</span>
                </button>
                <button className="flex items-center justify-center size-12 rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">volume_up</span>
                </button>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 w-full">
                <div className="flex flex-col items-center justify-center mb-10 w-full">
                    <div className="relative w-48 h-48 mb-6">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-white to-purple-50 rounded-3xl border border-white/80 shadow-xl flex items-center justify-center p-4 animate-float">
                            <div className="w-full h-full bg-center bg-contain bg-no-repeat" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAWjwyX0TYR79Q1qqIZ8qT_iykfcOl-WeITNgC9FktM6HGOs5Lvz9VIFGVI_b7Gp6XwGzKVViIMBFBZuIPBdyNl25Csv0Lhe6nldJKQhSN7HjNVTC4TQUpXKMWXlDvv-2q7imiNsatYy8JYetX63eZh9QM4omeVU2zOch52VBWuD6eO2T6qkZmRLISa7CwLGB221LuJNWEaA76hPQHQfKk56qV5oFlp6dCzyqEg8HkClqzGPKDErSnZEG2gq29i1TxKky-ugQ5ZIFo")'}}></div>
                        </div>
                    </div>
                    <h1 className="typo-h1 text-center drop-shadow-sm">
                        Los Dioses <br/>
                        <span className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-primary">Están Locos</span>
                    </h1>
                    <p className="mt-3 text-slate-500 typo-caption bg-white/80 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm backdrop-blur-sm">Companion App</p>
                </div>
                
                <div className="w-full flex flex-col gap-4 mt-auto mb-8">
                    <button onClick={handleStartGame} className="group relative w-full h-20 bg-primary hover:bg-primary-dark text-white rounded-2xl shadow-[0_6px_0_0_#3b0764] active:shadow-none active:translate-y-[6px] transition-all duration-150 flex items-center justify-between px-6 overflow-hidden">
                        <div className="flex flex-col items-start z-10">
                            <span className="text-xl font-black tracking-wide uppercase italic">Empezar Partida</span>
                            <span className="text-xs font-medium text-purple-200">¡Desafía al Olimpo!</span>
                        </div>
                        <div className="size-10 rounded-full bg-white/20 flex items-center justify-center z-10">
                            <span className="material-symbols-outlined text-yellow-300 fill-current animate-pulse" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                        </div>
                    </button>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <Button variant="outline" onClick={() => navigate('/learn-intro')} className="shadow-[0_4px_0_0_#cbd5e1]">
                            <span className="material-symbols-outlined text-purple-500">menu_book</span> Aprender
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/extras')} className="shadow-[0_4px_0_0_#cbd5e1]">
                            <span className="material-symbols-outlined text-amber-500">emoji_events</span> Extras
                        </Button>
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
                        <div className="flex flex-col gap-3 w-full">
                            <button onClick={resumeGame} className="w-full py-3 rounded-xl bg-primary text-white font-bold shadow-md">Continuar Partida</button>
                            <button onClick={startNewGame} className="w-full py-3 rounded-xl bg-slate-100 font-bold text-slate-600">Nueva Partida (Borrar datos)</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Registration Screen ---
export const RegistrationScreen: React.FC = () => {
    const navigate = useNavigate();
    const contentRef = useRef<HTMLDivElement>(null);
    const topBarRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    
    // Config State
    const [isConfigConfirmed, setIsConfigConfirmed] = useState(false);
    const [totalPlayers, setTotalPlayers] = useState<number>(4);
    
    // Registration State
    const [registeredPlayers, setRegisteredPlayers] = useState<Player[]>([]);
    const [name, setName] = useState('');
    const [selectedPact, setSelectedPact] = useState<PactType | null>(null);
    const [selectedColor, setSelectedColor] = useState<GameColor>('red');
    
    // Random Generation State
    const [randomPlayers, setRandomPlayers] = useState<Player[]>([]);
    const [showRandomSummary, setShowRandomSummary] = useState(false);

    // Specific Error States
    const [nameError, setNameError] = useState<string | null>(null);
    const [pactError, setPactError] = useState<string | null>(null);
    const [colorError, setColorError] = useState<string | null>(null);

    // Summary Modal State
    const [showSummary, setShowSummary] = useState(false);
    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState<GameColor>('red');
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    // Skip Confirmation State
    const [showSkipConfirm, setShowSkipConfirm] = useState(false);

    // Constants
    const pacts = [
        { id: 'Atenea', label: 'Atenea', icon: 'school', colorClass: 'text-yellow-600', bgClass: 'bg-yellow-100', borderClass: 'border-yellow-200' },
        { id: 'Loki', label: 'Loki', icon: 'theater_comedy', colorClass: 'text-green-600', bgClass: 'bg-green-100', borderClass: 'border-green-200' },
        { id: 'Longwang', label: 'Longwang', icon: 'tsunami', colorClass: 'text-cyan-600', bgClass: 'bg-cyan-100', borderClass: 'border-cyan-200' },
    ];

    const colors: { id: GameColor, bg: string, shadow: string, ring: string, text: string, checkColor?: string, border?: string, line: string }[] = [
        { id: 'red', bg: 'bg-red-500', shadow: 'shadow-red-500/20', ring: 'peer-checked:ring-red-200', text: 'text-red-600', line: 'bg-white/90' },
        { id: 'blue', bg: 'bg-blue-500', shadow: 'shadow-blue-500/20', ring: 'peer-checked:ring-blue-200', text: 'text-blue-600', line: 'bg-white/90' },
        { id: 'yellow', bg: 'bg-yellow-400', shadow: 'shadow-yellow-400/20', ring: 'peer-checked:ring-yellow-200', text: 'text-yellow-600', line: 'bg-slate-800/60' },
        { id: 'green', bg: 'bg-green-500', shadow: 'shadow-green-500/20', ring: 'peer-checked:ring-green-200', text: 'text-green-600', line: 'bg-white/90' },
        { id: 'black', bg: 'bg-slate-900', shadow: 'shadow-slate-900/20', ring: 'peer-checked:ring-slate-400', text: 'text-slate-900', line: 'bg-white/90' },
        { id: 'white', bg: 'bg-white', shadow: 'shadow-slate-200/50', ring: 'peer-checked:ring-slate-200', text: 'text-slate-600', checkColor: 'text-slate-900', border: 'border-slate-200', line: 'bg-slate-800/60' },
    ];

    // Helper to get color object styles
    const getColorStyle = (colorId: string) => colors.find(c => c.id === colorId) || colors[0];

    // Derived State
    const currentPlayerNumber = registeredPlayers.length + 1;
    const isRegistrationComplete = registeredPlayers.length >= totalPlayers;
    const progressText = `${Math.min(currentPlayerNumber, totalPlayers)} / ${totalPlayers}`;

    // Fisher-Yates Shuffle
    const shuffle = (array: string[]) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
        if (isConfigConfirmed && !showSummary) {
            setTimeout(() => {
                 nameInputRef.current?.focus();
            }, 100);
        }
    }, [registeredPlayers.length, isConfigConfirmed, showSummary]);

    useEffect(() => {
        if (topBarRef.current) {
            const activeElement = document.getElementById('current-player-slot');
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else if (registeredPlayers.length > 0 && isRegistrationComplete) {
                const lastPlayer = topBarRef.current.lastElementChild;
                if (lastPlayer) {
                    lastPlayer.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
                }
            }
        }
    }, [registeredPlayers.length, isConfigConfirmed, isRegistrationComplete]);

    const handleRegister = () => {
        setNameError(null);
        setPactError(null);
        setColorError(null);
        
        let isValid = true;
        const trimmedName = name.trim();
        
        if (!trimmedName) {
            setNameError("Por favor escribe un nombre.");
            isValid = false;
        } else if (registeredPlayers.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
            setNameError("Ese nombre ya está en uso.");
            isValid = false;
        }

        if (!selectedPact) {
            setPactError("¡Debes elegir un Pacto Divino!");
            isValid = false;
        }

        if (registeredPlayers.some(p => p.color === selectedColor)) {
            setColorError("Ese color ya fue elegido.");
            isValid = false;
        }

        if (!isValid) return;

        const newPlayer: Player = {
            id: `p${Date.now()}`,
            name: trimmedName,
            pact: selectedPact!,
            color: selectedColor
        };

        const updatedList = [...registeredPlayers, newPlayer];
        setRegisteredPlayers(updatedList);
        
        setName('');
        setSelectedPact(null);
        
        const nextAvailable = colors.find(c => !updatedList.some(p => p.color === c.id));
        if (nextAvailable) setSelectedColor(nextAvailable.id);
        
        if (updatedList.length >= totalPlayers) {
             setShowSummary(true);
        }
    };

    const handleSkipRegistration = () => {
        // Clear old data first
        localStorage.removeItem('game_players');
        localStorage.removeItem('game_results');
        localStorage.removeItem('game_stats'); 
        localStorage.removeItem('game_log');   
        localStorage.removeItem('game_minigame_history'); 

        // Generate Players based on SELECTED TotalPlayers with unique random names using Fisher-Yates
        const pool = ["Coco", "Tete", "Nono", "Rorro", "Nadie", "Casi Casi", "Pro", "Bebé", "Caos", "Osi", "Bicho", "Pulga", "Mole", "Cinco", "'VIP'", "Admin", "¿Yo?", "Pie Grande", "Cálico"];
        const shuffledPool = shuffle([...pool]);

        const defaultColors: GameColor[] = ['red', 'blue', 'yellow', 'green', 'black', 'white'];
        
        // Take only the number of colors needed for the selected player count
        const selectedColors = defaultColors.slice(0, totalPlayers);

        const defaults: Player[] = selectedColors.map((color, index) => ({
            id: `def-${index}`,
            name: shuffledPool[index], // Assign unique random name
            pact: 'Longwang', // Default pact as per confirmation modal
            color: color
        }));

        setRandomPlayers(defaults);
        setShowSkipConfirm(false);
        setShowRandomSummary(true);
    };

    const handleConfirmRandomGame = () => {
        localStorage.setItem('game_players', JSON.stringify(randomPlayers));
        navigate('/game');
    }

    const handleAddPlayerFromModal = () => {
        if (registeredPlayers.length < 6) {
            setTotalPlayers(registeredPlayers.length + 1);
            setShowSummary(false);
        }
    }

    const startEditing = (player: Player) => {
        setEditingPlayerId(player.id);
        setEditName(player.name);
        setEditColor(player.color);
    };

    const deletePlayer = (playerId: string) => {
        const updatedList = registeredPlayers.filter(p => p.id !== playerId);
        setRegisteredPlayers(updatedList);
        setTotalPlayers(Math.max(updatedList.length, totalPlayers));
        setEditingPlayerId(null);
    };

    const saveEdit = () => {
        if (!editName.trim()) return;
        
        if (registeredPlayers.some(p => p.id !== editingPlayerId && p.name.toLowerCase() === editName.trim().toLowerCase())) {
            return;
        }

        const updatedList = registeredPlayers.map(p => {
            if (p.id === editingPlayerId) {
                return { ...p, name: editName.trim(), color: editColor };
            }
            return p;
        });
        
        setRegisteredPlayers(updatedList);
        setEditingPlayerId(null);
    };

    const startGame = () => {
        if (registeredPlayers.length >= 4) {
            localStorage.setItem('game_players', JSON.stringify(registeredPlayers));
            navigate('/game');
        }
    };

    const missingPlayersCount = 4 - registeredPlayers.length;
    const missingPlayersText = missingPlayersCount === 1 
        ? "Falta 1 Jugador" 
        : `Faltan ${missingPlayersCount} Jugadores`;
    
    // Helper to check if buttons should be disabled
    const isEditing = editingPlayerId !== null;

    return (
        <div className="flex h-screen w-full flex-col bg-[#f6f5f8] overflow-hidden">
            <Header title="Registro de Jugadores" onBack={() => navigate('/')} actionIcon="settings"/>
            
            {!isConfigConfirmed ? (
                <div className="flex-1 flex flex-col items-center justify-center px-6 animate-float">
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center w-full max-w-sm">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl">groups</span>
                        </div>
                        <h2 className="typo-h2 mb-2">Número de Jugadores</h2>
                        <p className="text-slate-500 mb-8 text-sm">¿Cuántos osados se atreverán a competir hoy?</p>
                        
                        <div className="flex gap-3 mb-8">
                             {[4, 5, 6].map(num => (
                                 <button 
                                    key={num}
                                    onClick={() => setTotalPlayers(num)}
                                    className={`flex-1 aspect-square rounded-2xl font-bold text-2xl transition-all border-2 flex items-center justify-center ${totalPlayers === num ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30 scale-110' : 'bg-white text-slate-400 border-slate-200 hover:border-primary/50 hover:text-primary hover:bg-slate-50'}`}
                                 >
                                     {num}
                                 </button>
                             ))}
                        </div>
                        
                        <div className="flex flex-col gap-3 w-full">
                            <Button fullWidth onClick={() => setIsConfigConfirmed(true)} icon="play_arrow">
                                Registrar Jugadores
                            </Button>
                            
                            <Button 
                                fullWidth 
                                variant="secondary"
                                onClick={() => setShowSkipConfirm(true)}
                                icon="shuffle"
                            >
                                Nombres Aleatorios
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="bg-white pb-3 px-4 shadow-sm border-b border-slate-100 z-40 shrink-0">
                        <div className="flex items-center justify-between mb-5 pt-3">
                            <h3 className="typo-caption text-slate-500">JUGADORES REGISTRADOS</h3>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">{progressText}</span>
                        </div>
                        <div ref={topBarRef} className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x pt-2 px-1">
                            {registeredPlayers.map((p, i) => {
                                 const style = getColorStyle(p.color);
                                 return (
                                    <div key={p.id} className="flex flex-col items-center gap-2 min-w-[70px] snap-start transition-all cursor-default">
                                        <div className={`h-16 w-16 rounded-full ${style.bg} border-4 ${style.border || 'border-white'} shadow-md flex items-center justify-center relative overflow-hidden`}>
                                            <span className={`material-symbols-outlined text-3xl ${style.id === 'white' ? 'text-slate-900' : 'text-white'}`}>face</span>
                                        </div>
                                        <span className={`text-xs font-bold ${style.text} truncate max-w-[70px]`}>{p.name}</span>
                                    </div>
                                 );
                            })}
                            
                            {!isRegistrationComplete && (
                                <div id="current-player-slot" className="flex flex-col items-center gap-2 min-w-[70px] snap-start">
                                    <div className="h-16 w-16 rounded-full bg-primary/5 border-2 border-dashed border-primary flex items-center justify-center text-primary animate-pulse shadow-sm">
                                        <span className="material-symbols-outlined text-2xl">add</span>
                                    </div>
                                    <span className="text-xs font-bold text-primary truncate max-w-[70px]">Tú</span>
                                </div>
                            )}

                            {Array.from({ length: Math.max(0, totalPlayers - registeredPlayers.length - 1) }).map((_, i) => (
                                <div key={`empty-${i}`} className="flex flex-col items-center gap-2 min-w-[70px] snap-start opacity-30">
                                    <div className="h-16 w-16 rounded-full bg-slate-100 border-2 border-slate-100"></div>
                                    <div className="h-3 w-12 bg-slate-200 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div ref={contentRef} className="flex-1 px-4 gap-6 pt-6 pb-40 overflow-y-auto no-scrollbar">
                         {/* ... Form inputs ... */}
                         <div>
                            <div className="text-left mb-2">
                                <h3 className="typo-h3 leading-tight">Nombre del Jugador</h3>
                            </div>
                            <div className="relative group">
                                <input 
                                    ref={nameInputRef}
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setNameError(null);
                                    }}
                                    className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 focus:outline-0 focus:ring-4 focus:ring-primary/20 border ${nameError ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-primary'} bg-white h-14 placeholder:text-slate-400 px-[15px] pl-12 text-lg font-semibold leading-normal transition-all shadow-sm`} 
                                    placeholder="Nombre..." 
                                    type="text" 
                                />
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${nameError ? 'text-red-400' : 'text-slate-400 group-focus-within:text-primary'}`}>
                                    <span className="material-symbols-outlined">edit</span>
                                </div>
                            </div>
                            {nameError && <p className="text-red-500 text-xs font-bold mt-2 ml-1 animate-pulse flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span> {nameError}</p>}
                         </div>

                         <hr className="my-6 border-slate-200"/>

                         <div>
                             <div className="text-left mb-3">
                                <h3 className="typo-h3 leading-tight">Selecciona tu Pacto Divino</h3>
                             </div>
                             <div className={`p-3 rounded-2xl border transition-colors ${pactError ? 'bg-red-50 border-red-100' : 'border-transparent'}`}>
                                 <div className="grid grid-cols-3 gap-2">
                                     {pacts.map((pact) => (
                                         <label key={pact.id} className="relative cursor-pointer group w-full">
                                            <input 
                                                type="radio" 
                                                name="pact" 
                                                className="peer sr-only" 
                                                checked={selectedPact === pact.id}
                                                onChange={() => {
                                                    setSelectedPact(pact.id as PactType);
                                                    setPactError(null);
                                                }}
                                            />
                                            <div className={`relative h-full overflow-hidden rounded-xl border-2 bg-white p-2 transition-all shadow-sm border-slate-100 hover:bg-slate-50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-2 peer-checked:ring-primary/20 flex flex-col items-center text-center gap-2`}>
                                                <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center border shadow-sm ${pact.bgClass} ${pact.colorClass} ${pact.borderClass}`}>
                                                    <span className="material-symbols-outlined text-lg">{pact.icon}</span>
                                                </div>
                                                <h3 className="text-xs font-bold text-slate-900 leading-tight">{pact.label}</h3>
                                                
                                                <div className={`absolute top-1 right-1 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all transform shadow-sm ${selectedPact === pact.id ? 'border-primary bg-primary scale-100 opacity-100' : 'border-slate-200 bg-slate-50 scale-0 opacity-0'}`}>
                                                    <span className={`material-symbols-outlined text-white text-[8px] font-bold`}>check</span>
                                                </div>
                                            </div>
                                         </label>
                                     ))}
                                 </div>
                                 {pactError && (
                                    <div className="mt-2 text-center">
                                        <p className="text-red-500 text-sm font-bold animate-pulse flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined text-sm">warning</span> 
                                            {pactError}
                                        </p>
                                    </div>
                                 )}
                             </div>
                             <div className="flex items-center justify-center gap-1.5 mt-2 text-slate-400 w-full">
                                <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-center">Tu pacto será secreto</p>
                            </div>
                         </div>

                         <hr className="my-6 border-slate-200"/>

                         <div>
                            <div className="text-left mb-4">
                                <h3 className="typo-h3 leading-tight">Elige el color de tu ficha</h3>
                            </div>
                            <div className="flex items-center justify-between gap-2 px-1">
                                {colors.map((c) => {
                                    const isTaken = registeredPlayers.some(p => p.color === c.id);
                                    return (
                                        <label key={c.id} className={`cursor-pointer group relative ${isTaken ? 'opacity-100 pointer-events-none' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="color" 
                                                value={c.id} 
                                                className="peer sr-only"
                                                checked={selectedColor === c.id}
                                                onChange={() => {
                                                    setSelectedColor(c.id);
                                                    setColorError(null);
                                                }}
                                                disabled={isTaken}
                                            />
                                            <div className={`w-10 h-10 rounded-full ${c.bg} shadow-md ${c.shadow} group-hover:scale-110 transition-transform peer-checked:ring-4 ${c.ring} peer-checked:scale-110 relative flex items-center justify-center border-2 ${c.border || 'border-white'} overflow-hidden`}>
                                                
                                                {/* Checkmark for Selected */}
                                                <span className={`material-symbols-outlined ${c.checkColor || 'text-white'} text-lg font-bold drop-shadow-md transition-opacity ${selectedColor === c.id ? 'opacity-100' : 'opacity-0'}`}>check</span>
                                                
                                                {/* Diagonal Line for Taken */}
                                                {isTaken && (
                                                    <div className={`absolute w-[140%] h-[2px] ${c.line} rotate-[-45deg] z-10`}></div>
                                                )}

                                            </div>
                                            {isTaken && (
                                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-400 uppercase whitespace-nowrap opacity-60">Ocupado</div>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                            {colorError && <p className="text-red-500 text-xs font-bold mt-3 text-center animate-pulse">{colorError}</p>}
                         </div>
                    </div>

                    <BottomBar>
                        <button 
                            onClick={handleRegister}
                            className="w-full flex items-center justify-center gap-3 rounded-xl bg-primary hover:bg-primary/90 active:scale-[0.98] text-white p-4 transition-all shadow-xl shadow-primary/30 group border border-primary/10 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <span className="text-lg font-bold">{isRegistrationComplete ? 'Revisar y Finalizar' : 'Siguiente Jugador'}</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </BottomBar>
                </>
            )}

            {/* Skip Confirmation Modal */}
            {showSkipConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowSkipConfirm(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col p-6 items-center text-center animate-float">
                        <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">warning</span>
                        <h3 className="typo-h3 mb-2">¿Usar Nombres Aleatorios?</h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                             Se generarán <strong>{totalPlayers} perfiles</strong> al azar. Para el cálculo de puntaje, se asumirá el pacto <strong>Longwang</strong> para todos.
                        </p>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setShowSkipConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-600">Cancelar</button>
                            <button onClick={handleSkipRegistration} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold">Continuar</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Random Players Summary Modal */}
            {showRandomSummary && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowRandomSummary(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                        <div className="p-5 border-b border-slate-100 bg-white text-center">
                             <span className="material-symbols-outlined text-4xl text-primary mb-2">shuffle</span>
                            <h3 className="typo-h3">Equipo Aleatorio</h3>
                            <p className="text-xs text-slate-500 mt-1">Estos son los jugadores generados</p>
                        </div>
                        <div className="p-4 overflow-y-auto bg-[#f8fafc]">
                            <div className="space-y-3">
                                {randomPlayers.map((p) => {
                                    const style = getColorStyle(p.color);
                                    return (
                                        <div key={p.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                            <div className={`size-10 rounded-full flex items-center justify-center ${style.bg} border ${style.border}`}>
                                                <span className={`material-symbols-outlined text-xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-800">{p.name}</p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Pacto: Longwang</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-white flex flex-col gap-3">
                            <Button fullWidth onClick={handleConfirmRandomGame} icon="play_arrow">
                                Jugar Ahora
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ... Summary Modal code remains same ... */}
            {showSummary && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => !showExitConfirm && setShowSummary(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                        {showExitConfirm ? (
                            <div className="p-6 flex flex-col items-center text-center">
                                <span className="material-symbols-outlined text-4xl text-danger mb-2">warning</span>
                                <h3 className="typo-h3 mb-2">¿Seguro que quieres salir?</h3>
                                <p className="text-sm text-slate-500 mb-6">Se perderá todo el progreso del registro.</p>
                                <div className="flex gap-3 w-full">
                                    <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-600">Quedarse</button>
                                    <button onClick={() => navigate('/')} className="flex-1 py-3 rounded-xl bg-danger text-white font-bold">Salir</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-5 border-b border-slate-100 bg-white flex justify-center items-center">
                                    <h2 className="typo-h3">Lista de Jugadores</h2>
                                </div>
                                <div className="p-4 overflow-y-auto">
                                    <p className="text-sm text-slate-500 mb-4 text-center">Revisa que todo esté en orden o haz cambios. No se pueden ver o cambiar los Pactos elegidos.</p>
                                    <div className="space-y-3">
                                        {registeredPlayers.map((player) => (
                                            <div key={player.id} className="border border-slate-200 rounded-xl p-3 flex flex-col bg-white">
                                                {editingPlayerId === player.id ? (
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold uppercase text-slate-400">Editando</span>
                                                        </div>
                                                        <input 
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            className="w-full border border-primary rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        />
                                                        <div className="flex gap-2 justify-between">
                                                            {colors.map(c => {
                                                                const isAvail = player.color === c.id || !registeredPlayers.some(p => p.color === c.id);
                                                                return (
                                                                    <button 
                                                                        key={c.id} 
                                                                        onClick={() => isAvail && setEditColor(c.id)}
                                                                        className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center ${!isAvail ? 'opacity-20 cursor-not-allowed' : ''} ${editColor === c.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''} border ${c.border || 'border-transparent'} relative overflow-hidden`}
                                                                    >
                                                                        {editColor === c.id && <span className={`material-symbols-outlined text-xs ${c.checkColor || 'text-white'}`}>check</span>}
                                                                        {!isAvail && c.id !== player.color && (
                                                                             <div className={`absolute w-[140%] h-[2px] ${c.line} rotate-[-45deg] z-10`}></div>
                                                                        )}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                        <div className="flex gap-2 mt-1">
                                                            <button onClick={() => setEditingPlayerId(null)} className="flex-1 py-2 rounded-lg text-sm font-bold text-slate-500 bg-slate-100">Cancelar</button>
                                                            <button onClick={saveEdit} className="flex-1 py-2 rounded-lg text-sm font-bold text-white bg-primary">Guardar</button>
                                                        </div>
                                                        <button onClick={() => deletePlayer(player.id)} className="w-full py-2 rounded-lg text-sm font-bold text-danger border border-danger/20 hover:bg-red-50 flex items-center justify-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">delete</span> Eliminar Jugador
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full ${getColorStyle(player.color).bg} border ${getColorStyle(player.color).border || 'border-transparent'} flex items-center justify-center shadow-sm`}>
                                                                <span className={`material-symbols-outlined ${getColorStyle(player.color).id === 'white' ? 'text-slate-900' : 'text-white'}`}>face</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900">{player.name}</p>
                                                                <p className="text-xs text-slate-500">Pacto Secreto</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => startEditing(player)} 
                                                            disabled={isEditing}
                                                            className={`p-2 rounded-full ${isEditing ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-primary hover:bg-slate-50'}`}
                                                        >
                                                            <span className="material-symbols-outlined">edit</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 border-t border-slate-100 bg-white flex flex-col gap-3">
                                    <Button 
                                        fullWidth 
                                        onClick={startGame} 
                                        icon="play_arrow" 
                                        disabled={registeredPlayers.length < 4 || isEditing}
                                        className={isEditing ? 'opacity-50' : ''}
                                    >
                                        {registeredPlayers.length < 4 ? missingPlayersText : 'Confirmar y Jugar'}
                                    </Button>
                                    
                                    {registeredPlayers.length < 6 && (
                                        <Button 
                                            fullWidth 
                                            variant="secondary" 
                                            onClick={handleAddPlayerFromModal} 
                                            icon="person_add"
                                            disabled={isEditing}
                                            className={isEditing ? 'opacity-50' : ''}
                                        >
                                            Añadir Jugador
                                        </Button>
                                    )}

                                    <button 
                                        onClick={() => setShowExitConfirm(true)} 
                                        disabled={isEditing}
                                        className={`text-slate-400 text-sm font-bold py-2 hover:text-danger transition-colors ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
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
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header title="Extras" actionIcon="settings" />
            <div className="flex-1 flex flex-col items-center justify-center px-6 bg-[#f6f5f8]">
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center max-w-sm w-full">
                    <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl">construction</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">En Construcción</h2>
                    <p className="text-slate-500 mb-8">
                        Esta sección contendrá Galería de imágenes, Prototipos y versiones iniciales, y Agradecimientos especiales.
                    </p>
                    <Button fullWidth variant="outline" onClick={() => navigate(-1)}>
                        Volver
                    </Button>
                 </div>
            </div>
        </div>
    );
};