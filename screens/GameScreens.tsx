import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Button, BottomBar } from '../components/UI';

// --- Game Session (Main Hub) ---
export const GameSessionScreen: React.FC = () => {
    const navigate = useNavigate();
    
    const handleEndGameClick = () => {
        // Direct navigation to calculator (which leads to leaderboard)
        navigate('/calculator');
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#f8fafc]">
            <Header 
                title="Partida Activa" 
                showBack={true} 
                onBack={() => navigate('/')}
                actionIcon="settings"
            />

            <div className="flex-1 px-4 py-6">
                {/* SECTION 1: CARD PILES */}
                <h3 className="text-slate-400 tracking-wide text-xs font-bold uppercase px-1 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">style</span> PILAS DE CARTAS
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Minigame Card */}
                    <Card onClick={() => navigate('/minigame-selector')} className="h-64 border-4 border-white group" bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAlkW3Xim0uV0HK2wLarIuDmnPNIxq6jxurfDoWcgSZFCnSnp0hxr3dUMh7AALzEB-Jt-KtfY7CdDHk7lAel5YbztNTT9y39EWZ4ZP_xLE7-aHS2eWLwDTc9j-Kp8WmsK17sl2a-ObIvNoekXKRK7ncyL3JdigLfAjcUG054BZ2EA2G5jG4MkLOPam8H1uNyb45kjrApoEC72QAapwFAR7ECEgl975PQ4rqaIYwqnv79kxuSnrLgfddpi1yS6iPbBuZmm4kjG0StSo">
                        {/* Darker overlay for better text contrast since icons are gone */}
                        <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50"></div>
                        <div className="relative z-10 flex flex-col justify-center items-center h-full p-4 text-center">
                            <h4 className="text-white text-2xl font-extrabold leading-tight tracking-tight drop-shadow-md">Jugar Minijuego</h4>
                        </div>
                    </Card>
                    
                    {/* Oracle Card */}
                    <Card onClick={() => navigate('/oracle')} className="h-64 border-4 border-white group" bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuD9QZx7CtrJnAHf9WfZTyPOlTMAK7huKeUFgLtc33PrED9FikKC8usbyisSCOi2BuhW9d-S0tLyBUDMBiK6TOoPDH6JRgJCZgVj9G7sDmv4-KrLTdPS93yBc0VxGPm-pEYNK_gjxy266cH0TZBTo1tFrOg9RHQlJFGjxwImcPf5mCwVmTOOd6LB5o0f85239Cd1aL1iyspDGfYPpGdptQX4tqVOczJJbjZ6RFrzl8zBoRfDwyFQWNihIv34b0I9Yrw7t6SOra7hIC8">
                        <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50"></div>
                        <div className="relative z-10 flex flex-col justify-center items-center h-full p-4 text-center">
                            <h4 className="text-white text-2xl font-extrabold leading-tight tracking-tight drop-shadow-md">Activar Oráculo</h4>
                        </div>
                    </Card>
                </div>

                {/* SECTION 2: SUPPORT TOOLS */}
                <h3 className="text-slate-400 tracking-wide text-xs font-bold uppercase px-1 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">widgets</span> HERRAMIENTAS DE APOYO
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-8">
                     {[
                         {icon: 'timer', color: 'teal', label: 'Temporizador / Cronómetro', path: '/timer'},
                         {icon: 'casino', color: 'amber', label: 'Destinos', path: '/destinies-public'}, // Icon changed to 'casino' (dice/randomness)
                         {icon: 'menu_book', color: 'pink', label: 'Bitácora', path: '/victory-log'},
                     ].map((t, i) => {
                         return (
                             <button 
                                key={i} 
                                onClick={() => navigate(t.path)} 
                                className={`flex flex-col items-center justify-center bg-white rounded-2xl p-3 h-32 shadow-sm border border-slate-200 transition-all hover:border-primary/50 active:scale-95`}
                             >
                                <div className={`size-12 rounded-full bg-${t.color}-50 text-${t.color}-600 flex items-center justify-center mb-3`}>
                                    <span className="material-symbols-outlined">{t.icon}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-700 text-center flex flex-col items-center leading-tight">
                                    {t.label}
                                </span>
                             </button>
                         )
                     })}
                </div>

                <Button 
                    variant="primary" 
                    fullWidth 
                    icon="emoji_events" 
                    onClick={handleEndGameClick}
                    className="h-auto py-3 !bg-[#f44611] hover:!bg-[#d63b0b] text-white !shadow-[0_4px_15px_rgba(244,70,17,0.4)]"
                >
                    <div className="flex flex-col items-center leading-none">
                        <span className="text-lg font-bold">Terminar Partida</span>
                    </div>
                </Button>
            </div>
        </div>
    );
};

// --- Minigame Selector ---

type MinigameType = 'Individual' | 'Team' | 'Special';

interface Minigame {
    id: string;
    title: string;
    type: MinigameType;
    description: string;
}

const MINIGAMES_DB: Minigame[] = [
    // Individual (Red) - 6
    { id: 'i1', type: 'Individual', title: 'Del Ahogado, El Sombrero', description: 'A la cuenta de tres, todos los jugadores deben contener la respiración. El primero en soltarla o inhalar pierde un turno y debe imitar a un pez fuera del agua durante 10 segundos.\n\nGanarán los 2 jugadores que más tiempo aguanten la respiración.' },
    { id: 'i2', type: 'Individual', title: 'Miradas Incesantes', description: 'El jugador que espabile, pierde. Todos tienen que mirarse los unos a los otros. Se descalifica el que tape sus ojos.\n\nSi después de 30 segundos nadie pierde, todos pierden. Puede haber varios ganadores.' },
    { id: 'i3', type: 'Individual', title: 'Sonrisas Contagiosas', description: 'El jugador que sonría, pierde. Todos los jugadores pueden decir y hacer lo que quieran para hacer reír a los demás, pero no pueden tocarlos y deben siempre mantener contacto visual.\n\nSi después de 30 segundos nadie pierde, todos pierden. Puede haber varios ganadores.' },
    { id: 'i4', type: 'Individual', title: 'Balidos y Onomatopeyas', description: 'Por turnos, cada jugador debe imitar el sonido de un animal o inventárselo, pero primero debe repetir, en orden, los sonidos de los jugadores anteriores (máximo 5 segundos para recordar cada sonido).\n\nEl Minijuego termina cuando haya 2 perdedores o hayan pasado 5 minutos. Si nadie pierde, todos pierden.' },
    { id: 'i5', type: 'Individual', title: 'Besos Ruidosos', description: 'Entre todos, por turnos, se contará desde el 1 hasta el 50. Cuando un jugador deba decir un múltiplo de 3, debe mandarle un beso a alguien en lugar de decir el número. Quien se equivoque o tarde 3 segundos, pierde.\n\nCuando haya tres o cinco jugadores, el beso es con múltiplos de 2; cuando haya seis, con múltiplos de 5.\n\nSi nadie pierde al llegar al 50, todos pierden.' },
    { id: 'i6', type: 'Individual', title: '¡Preguntas Difíciles!', description: 'Cada jugador, por turnos, le hace una pregunta al de su derecha, quien debe responder con otra pregunta (ninguna afirmación) y dirigirla al siguiente jugador, manteniendo la cadena y el sentido entre las preguntas.\n\nPierde quien repita una pregunta, responda con algo que no sea una pregunta o tarde más de 5 segundos en responder. El Minijuego termina cuando dos jugadores pierdan.' },

    // Team (Blue) - 5
    { id: 't1', type: 'Team', title: 'Ni Finura Ni Motricidad', description: 'Juego en parejas. Por turnos, sigan la siguiente secuencia con sus manos:\n\nAplaudir - Chocar palma izquierda - Aplaudir - Chocar palma derecha - Aplaudir - Chocar dorso derecho - Aplaudir - Chocar dorso izquierdo - Aplaudir - Decir número de secuencia.\n\nLleven cuenta de cuántas secuencias terminan. Cada pareja tendrá 1 minuto para hacer cuantas secuencias pueda sin error. Gana la que haga más.' },
    { id: 't2', type: 'Team', title: 'Tontos, Ciegos Y Mudos', description: 'Por turnos, un equipo le dice a un adversario un objeto (1 palabra) que se encuentre en una casa u oficina. Este jugador debe hacer que su equipo adivine el objeto (1 minuto máximo) haciendo mímicas sin decir palabras ni hacer formas de letras y con los ojos vendados o cerrados.\n\nEl equipo que adivine más rápido, gana. ¿Nadie adivina? Todos pierden.' },
    { id: 't3', type: 'Team', title: 'No Apto Para Lentos', description: 'El Elegido define una temática. Por turnos, cada jugador tendrá 3 segundos para decir una palabra o expresión que esté relacionada con dicha temática. Quien falle, queda eliminado.\n\nCuando todos los integrantes de un equipo sean eliminados, ese equipo pierde y el Minijuego termina. El otro equipo gana, incluyendo sus jugadores eliminados.' },
    { id: 't4', type: 'Team', title: '“El Arte Es Subjetivo”', description: 'Un integrante de cada equipo recibirá de un adversario una palabra (o nombre), y deberá dibujar pistas para que sus compañeros la adivinen en máximo 1 minuto. No se permite escribir letras ni números.\n\nLa palabra (o nombre) estará relacionada con una categoría que El Elegido escoja entre: Película, Persona, Animal, Oficio u Objeto. El equipo que adivine más rápido, gana.' },
    { id: 't5', type: 'Team', title: 'O-C-I-T-Ó-A-C', description: 'Por turnos, un equipo le entrega a su rival una palabra relacionada con el mejor juego que existe (sí, Los Dioses Están Locos). Ese equipo tendrá 1 minuto para deletrear la palabra al revés, turnándose entre sus integrantes para decir una letra cada uno.\n\nLa palabra debe ser máximo de 10 letras. El equipo que lo deletree más rápido y sin errores, gana.' },

    // Special (Green) - 7
    { id: 's1', type: 'Special', title: 'Cuentas Traicioneras', description: 'Todos menos El Elegido seleccionarán a un Valiente que enfrentará al Elegido en un duelo. Los otros jugadores, por turnos y rápidamente, dirán un número entre 1 y 9, hasta decir seis números en total.\n\nAl decir el sexto dígito, el primer jugador entre El Elegido y El Valiente que diga el resultado de la suma de los números, gana. Tienen un solo intento. Si ambos se equivocan o tardan 5 segundos, ganan los otros.' },
    { id: 's2', type: 'Special', title: 'Cinéfilos Unidos', description: 'El Elegido escribe en secreto el nombre de una película en español y selecciona a un adversario, a quien le dice el nombre de la película, para que este logre que sus compañeros no-elegidos adivinen la película en 1 minuto o menos. Este jugador podrá comunicar máximo 5 pistas (sin decir parte del nombre) y responder todas las preguntas que quiera.\n\nSi alguno adivina, todos ganan excepto El Elegido. Sino, gana El Elegido.' },
    { id: 's3', type: 'Special', title: 'Mentir Es Pecado', description: 'El Elegido tomará 1 Reliquia y 1 Plaga que esconderá cada una en una mano, y dirá dónde está la Reliquia (puede mentir). Los demás deben elegir la mano donde crean que está la Reliquia.\n\nCada jugador que acierte recibe el Beneficio de la Victoria. El Elegido recibe un Beneficio de la Victoria por cada Jugador al que logre engañar.' },
    { id: 's4', type: 'Special', title: 'Si Las Miradas Mataran...', description: 'Todos se sientan en círculo y se miran unos a otros. Un jugador, seleccionado en secreto con los Destinos, debe asesinar a un adversario guiñándole un ojo sin ser descubierto. Quien reciba el guiño, espera 3 segundos y muere dramáticamente sin revelar al culpable.\n\nTras dicha muerte, se hace una votación para sentenciar al culpable. Si sentencian a un inocente, gana el asesino. Si sentencian al asesino, ganan los inocentes.' },
    { id: 's5', type: 'Special', title: 'Al Caído, Caerle', description: 'El Elegido pondrá a prueba el equilibrio de sus adversarios, los cuales deberán mantenerse de pie mientras que El Elegido, cada 5 segundos, da instrucciones de posición o movimiento para aumentar la dificultad. Quien pierda el equilibrio, queda descalificado.\n\nCada jugador que resista durante 1 minuto recibe el Beneficio de la Victoria. Por cada jugador descalificado, El Elegido gana un Beneficio de la Victoria.' },
    { id: 's6', type: 'Special', title: '¿Quién Dibujó Esto?', description: 'El Elegido escribe en secreto una palabra relacionada con una categoría entre: Película, Persona, Animal, Oficio u Objeto. Otro jugador verá la palabra y dibujará con los ojos vendados pistas de esa palabra sin usar letras ni números. El resto tendrá 1 minuto para adivinar y escribir en secreto la palabra.\n\nCada uno que acierte gana el Beneficio de la Victoria. El dibujante gana un Beneficio por cada acierto. El Elegido gana un Beneficio por cada desacierto.' },
    { id: 's7', type: 'Special', title: 'Danza De La Lluvia', description: 'El Elegido deberá crear una danza con 4 pasos distintos (cada uno con movimiento y sonido). Luego, el resto de jugadores deberá imitarla exactamente, de pie y en orden.\n\nQuien se niegue a danzar perderá 1 Reliquia (o no recibirá la siguiente). Si El Elegido se niega, quien cree la danza recibirá 1 Reliquia adicional.\n\nTodos los que hagan la danza ganan un Beneficio de la Victoria.' },
];

export const MinigameSelectorScreen: React.FC = () => {
    const navigate = useNavigate();
    
    // State
    const [filters, setFilters] = useState<MinigameType[]>(['Individual', 'Team', 'Special']);
    const [isShuffling, setIsShuffling] = useState(false);
    const [drawnCard, setDrawnCard] = useState<Minigame | null>(null);
    const [tempDisplayCard, setTempDisplayCard] = useState<Minigame | null>(null); // For shuffle animation
    const [cooldown, setCooldown] = useState(0); // Lockout timer
    
    // Used Cards Persistence
    const [usedCards, setUsedCards] = useState<string[]>([]);
    
    // Scroll Detection State
    const descriptionRef = useRef<HTMLDivElement>(null);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [canScrollUp, setCanScrollUp] = useState(false);

    // Cooldown Timer Logic
    useEffect(() => {
        let interval: any;
        if (cooldown > 0) {
            interval = setTimeout(() => setCooldown(c => c - 1), 1000);
        }
        return () => clearTimeout(interval);
    }, [cooldown]);

    // Load used cards on mount
    useEffect(() => {
        const storedUsed = localStorage.getItem('game_minigame_history_ids');
        if (storedUsed) {
            setUsedCards(JSON.parse(storedUsed));
        }
    }, []);

    // Derived: Available Pool considers Filters AND Excludes Used Cards
    const filteredByFilters = MINIGAMES_DB.filter(game => filters.includes(game.type));
    const availablePool = filteredByFilters.filter(game => !usedCards.includes(game.id));
    
    // Determine if we need to reset pool
    const poolExhausted = filteredByFilters.length > 0 && availablePool.length === 0;

    const canDraw = (availablePool.length > 0 || poolExhausted) && !isShuffling && cooldown === 0;

    // Toggle Filter
    const toggleFilter = (type: MinigameType) => {
        const newFilters = filters.includes(type) 
            ? filters.filter(t => t !== type) 
            : [...filters, type];

        setFilters(newFilters);
        // Instant reset when changing filters (restart to deck)
        setDrawnCard(null);
    };

    // Scroll Checker
    const checkScroll = () => {
        if (descriptionRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = descriptionRef.current;
            setCanScrollDown(scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 5);
            setCanScrollUp(scrollTop > 5);
        }
    };

    const resetPool = () => {
        // Only reset cards that match current filters (or just reset all to be safe/simple)
        setUsedCards([]);
        localStorage.removeItem('game_minigame_history_ids');
        setDrawnCard(null); // Clear card to show deck and reset state
    }

    // Draw Logic
    const handleDraw = () => {
        if (isShuffling || cooldown > 0) return;

        // Auto-reset if pool exhausted
        if (poolExhausted) {
            resetPool();
            return; // Explicitly stop here to force user to draw again
        }
        
        // Check availability again (in case we just reset)
        // We need to calculate pool locally because state update might be async
        const currentUsed = poolExhausted ? [] : usedCards;
        const currentPool = MINIGAMES_DB.filter(game => filters.includes(game.type) && !currentUsed.includes(game.id));
        
        if (currentPool.length === 0) return; // Should allow draw now

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
                finishDraw(currentPool);
            }
        }, 80); 
    };

    const finishDraw = (currentPool: Minigame[]) => {
        const finalCard = currentPool[Math.floor(Math.random() * currentPool.length)];
        
        // Save as used
        const newUsed = [...usedCards, finalCard.id];
        // If we just reset, newUsed is just [finalCard.id]
        const actualUsed = poolExhausted ? [finalCard.id] : newUsed;
        
        setUsedCards(actualUsed);
        localStorage.setItem('game_minigame_history_ids', JSON.stringify(actualUsed));

        setDrawnCard(finalCard);
        setTempDisplayCard(null);
        setIsShuffling(false);
        setCooldown(3); // Lock for 3 seconds to prevent accidental skip
    };

    // Re-check scroll on card change
    useEffect(() => {
        checkScroll();
        const t = setTimeout(checkScroll, 100);
        return () => clearTimeout(t);
    }, [drawnCard, tempDisplayCard, isShuffling]);

    const navigateToWinnerLog = () => {
        navigate('/victory-log', { state: { openMinigameModal: true } });
    };

    // Style Helpers
    const getCardStyles = (type?: MinigameType) => {
        if (!type) return { 
            bgHeader: 'bg-slate-50', textHeader: 'text-slate-400', textTitle: 'text-slate-500', 
            icon: 'text-slate-300', border: 'border-slate-200', divider: 'bg-slate-200'
        };
        switch(type) {
            case 'Individual': return { 
                bgHeader: 'bg-red-50', textHeader: 'text-red-500', textTitle: 'text-red-600',
                icon: 'text-red-400', border: 'border-red-100', divider: 'bg-red-100'
            };
            case 'Team': return { 
                bgHeader: 'bg-blue-50', textHeader: 'text-blue-500', textTitle: 'text-blue-600',
                icon: 'text-blue-400', border: 'border-blue-100', divider: 'bg-blue-100'
            };
            case 'Special': return { 
                bgHeader: 'bg-green-50', textHeader: 'text-green-500', textTitle: 'text-green-600',
                icon: 'text-green-400', border: 'border-green-100', divider: 'bg-green-100'
            };
            default: return { 
                bgHeader: 'bg-slate-50', textHeader: 'text-slate-400', textTitle: 'text-slate-500', 
                icon: 'text-slate-300', border: 'border-slate-200', divider: 'bg-slate-200'
            };
        }
    };

    const displayCard = isShuffling ? tempDisplayCard : drawnCard;
    const cardStyles = getCardStyles(displayCard?.type);
    const hasActiveCard = displayCard || isShuffling;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header title="Selector de Minijuegos" actionIcon="settings" onBack={() => navigate('/game')} />
            
            {/* Filters */}
            <div className="w-full px-4 pt-4 pb-2 z-20">
                <h3 className="typo-caption mb-2 ml-1">Filtrar por Tipo</h3>
                <div className="flex gap-2 w-full">
                    {[{ id: 'Individual', label: 'Individual', color: 'red' }, { id: 'Team', label: 'En Equipo', color: 'blue' }, { id: 'Special', label: 'Especial', color: 'green' }].map((f) => {
                        const isActive = filters.includes(f.id as MinigameType);
                        return (
                            <button 
                                key={f.id}
                                onClick={() => toggleFilter(f.id as MinigameType)}
                                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all border-2 
                                    ${isActive 
                                        ? `bg-${f.color}-500 text-white border-${f.color}-500 shadow-md` 
                                        : `bg-white text-slate-400 border-slate-200 hover:border-${f.color}-200`
                                    }`}
                            >
                                {f.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Main Stage */}
            <div className={`flex-1 flex flex-col items-center p-4 relative min-h-[360px] pb-28 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-300 ${hasActiveCard ? 'justify-start pt-2' : 'justify-center'}`}>
                
                {/* Empty State / Deck */}
                {!displayCard && !isShuffling && (
                    <div 
                        onClick={handleDraw}
                        className="flex flex-col items-center text-center opacity-60 animate-float transition-all duration-300 cursor-pointer active:scale-95"
                    >
                        <div className="w-48 h-64 bg-slate-200 rounded-2xl border-4 border-slate-300 border-dashed flex items-center justify-center mb-4 relative">
                            {poolExhausted ? (
                                <span className="material-symbols-outlined text-6xl text-amber-400">replay</span>
                            ) : (
                                <span className="material-symbols-outlined text-6xl text-slate-400">playing_cards</span>
                            )}
                            <div className="absolute -right-2 -bottom-2 size-12 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-200">
                                <span className="font-bold text-slate-400 text-xs">{poolExhausted ? 0 : availablePool.length}</span>
                            </div>
                        </div>
                        <p className="typo-h3 text-slate-400">{poolExhausted ? '¡Mazo agotado!' : 'Toca para sacar carta'}</p>
                        {poolExhausted && <p className="text-xs text-amber-500 font-bold mt-1">Toca para revolver</p>}
                    </div>
                )}

                {/* The Card */}
                {displayCard && (
                    <div className={`relative w-full max-w-[320px] aspect-[63/88] bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out border-2 ${cardStyles.border} ${isShuffling ? 'scale-95 blur-[1px]' : 'animate-pop-in'}`}>
                        <div className={`w-full py-4 px-4 flex flex-col items-center justify-center shrink-0 border-b border-dashed ${cardStyles.border} ${cardStyles.bgHeader}`}>
                            <span className={`material-symbols-outlined text-2xl mb-1 ${cardStyles.icon}`}>
                                {displayCard.type === 'Individual' ? 'person' : displayCard.type === 'Team' ? 'groups' : 'auto_awesome'}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${cardStyles.textHeader}`}>
                                {displayCard.type === 'Team' ? 'En Equipo' : displayCard.type}
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col overflow-hidden relative w-full">
                            <div className="px-6 pt-5 pb-2 text-center shrink-0 z-10">
                                <h2 className={`font-cartoon text-2xl leading-tight ${cardStyles.textTitle}`}>{displayCard.title}</h2>
                            </div>
                            <div className={`w-12 h-1.5 mx-auto rounded-full shrink-0 my-1 ${cardStyles.divider}`}></div>
                            <div className="flex-1 px-6 pb-6 pt-2 overflow-hidden relative w-full mb-2">
                                <div className={`absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white via-white/90 to-transparent z-10 pointer-events-none transition-opacity duration-300 flex items-start justify-center pt-1 ${canScrollUp && !isShuffling ? 'opacity-100' : 'opacity-0'}`}>
                                    <span className="material-symbols-outlined text-slate-300 animate-bounce">keyboard_arrow_up</span>
                                </div>
                                <div ref={descriptionRef} onScroll={checkScroll} className="h-full overflow-y-auto no-scrollbar text-center flex items-start justify-center">
                                    <p className="font-rounded font-semibold text-[17px] text-slate-600 leading-snug w-full whitespace-pre-line pb-4 pt-2">{displayCard.description}</p>
                                </div>
                                <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none transition-opacity duration-300 z-10 flex items-end justify-center pb-2 ${canScrollDown && !isShuffling ? 'opacity-100' : 'opacity-0'}`}>
                                    <span className="material-symbols-outlined text-slate-300 animate-bounce">keyboard_arrow_down</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <BottomBar className="bg-white border-t border-slate-100">
                 <div className="flex w-full gap-3 items-center">
                    {drawnCard && !isShuffling && (
                        <Button 
                            className="flex-1 bg-white text-slate-600 border-2 border-slate-200 border-b-[4px] border-b-slate-300 active:border-b-0 active:translate-y-[4px] transition-all hover:bg-slate-50 px-0 rounded-xl"
                            onClick={navigateToWinnerLog} 
                            icon="emoji_events"
                            disabled={cooldown > 0}
                        >
                            <span className="text-sm font-bold truncate">Registrar</span>
                        </Button>
                    )}
                    <Button 
                        className={`flex-[2] shadow-[0_4px_20px_rgba(37,140,244,0.4)] bg-action ${isShuffling || cooldown > 0 ? 'opacity-80' : ''}`}
                        onClick={handleDraw} 
                        disabled={!canDraw && !poolExhausted}
                        icon={isShuffling ? 'cached' : poolExhausted ? 'replay' : 'style'}
                    >
                        {isShuffling ? '...' : cooldown > 0 ? `Espere... (${cooldown}s)` : poolExhausted ? 'Barajar de Nuevo' : drawnCard ? 'Otra Carta' : 'Sacar Carta'}
                    </Button>
                 </div>
            </BottomBar>
        </div>
    );
};

// --- Oracle Screen ---

type OracleType = 'Favorable' | 'Desfavorable' | 'Neutral';

interface OracleCard {
    id: string;
    title: string;
    type: OracleType;
    description: string;
}

const ORACLES_DB: OracleCard[] = [
    // --- FAVORABLE (6) ---
    { id: 'fav1', type: 'Favorable', title: 'Oportunidad Dorada', description: 'Elige una opción entre:\n\n1. Ganar una Reliquia.\n2. Mover la ficha de cualquier jugador dos casillas hacia atrás.\n\nTú decides si puede activar alguna casilla especial hasta que regrese a su casilla.' },
    { id: 'fav2', type: 'Favorable', title: 'El Nuevo Elegido', description: 'Elige el siguiente Minijuego que se jugará al final de la ronda.\n\nAdemás, el Símbolo del Elegido pasa a ser tuyo. Si ya lo era, lo mantendrás el siguiente turno.\n\nLos turnos de esta ronda no cambian.' },
    { id: 'fav3', type: 'Favorable', title: 'Fuente de Poder', description: 'Elige una opción entre:\n\n1. Tomar un Poder de la pila, el que tú quieras, y baraja la pila.\n2. Perder una Plaga.' },
    { id: 'fav4', type: 'Favorable', title: 'Caos Controlado', description: 'Elige una opción entre:\n\n1. Cambiar tu Pacto con el de otro jugador.\n2. Intercambiar un Poder al azar por una Plaga entre dos jugadores cualquiera.' },
    { id: 'fav5', type: 'Favorable', title: 'Gloria Adicional', description: 'Si eres uno de los ganadores del siguiente Minijuego, recibes un Beneficio de la Victoria adicional.' },
    { id: 'fav6', type: 'Favorable', title: 'Robo de Poder', description: 'Todos los jugadores te muestran sus Poderes. Quédate con uno de esos Poderes, el que quieras.\n\nDevuelve el resto a sus dueños.' },

    // --- DESFAVORABLE (6) ---
    { id: 'unfav1', type: 'Desfavorable', title: 'Cambio de Posición', description: 'Intercambia tu puesto con uno de los jugadores que estén en la casilla más distante de La Meta. No activas casilla especial hasta que regreses a tu casilla.\n\nEl otro jugador decide si quiere activar su Oráculo. En caso que sí, se activa enseguida.' },
    { id: 'unfav2', type: 'Desfavorable', title: 'Sacrificio Inevitable', description: 'Elige 1 opción entre:\n\n1. Perder una Reliquia.\n2. Perder hasta tres Poderes (o los que tengas, si tienes menos).\n\nPara elegir una opción, debes tener al menos una Reliquia o un Poder, respectivamente. Si no tienes nada, pierdes tu próximo turno.' },
    { id: 'unfav3', type: 'Desfavorable', title: 'Retroceso Menor', description: 'Mueve tu ficha 2 casillas hacia atrás.\n\nNo activas casilla especial hasta que regreses a tu casilla.' },
    { id: 'unfav4', type: 'Desfavorable', title: 'Dilema del Secreto', description: 'Elige una opción entre:\n\n1. Mover tu ficha tres casillas hacia atrás. No activas casilla especial hasta que regreses a tu casilla.\n2. Revelar tu Pacto a un adversario. Él no puede mostrárselo a nadie pero sí decir lo que quiera.' },
    { id: 'unfav5', type: 'Desfavorable', title: 'Caridad Obligada', description: 'Elige una opción entre:\n\n1. Todos tus adversarios ganan un Poder.\n2. Perder una Reliquia (debes tener al menos una).' },
    { id: 'unfav6', type: 'Desfavorable', title: 'Voto de Silencio', description: 'No puedes pronunciar ninguna palabra hasta el comienzo de tu siguiente turno, a menos que un Minijuego lo requiera.\n\nSi no cumples, pierdes 1 Reliquia (si no tienes, no recibirás la próxima).' },

    // --- NEUTRAL (2) ---
    { id: 'neu1', type: 'Neutral', title: 'Duelo por el Botín', description: 'Reta a un adversario a un Duelo.\n\nJugarán el primer Minijuego Individual que salga. El ganador:\n1. Roba 1 Reliquia al perdedor, o\n2. Roba 2 Poderes al perdedor.\n\nSi el perdedor no tiene lo elegido, se toma del banco. Si nadie pierde, cada quien decide si pierde 1 Reliquia o 2 Poderes.' },
    { id: 'neu2', type: 'Neutral', title: 'Ley de Compensación', description: 'Si eres uno de los que está más cerca de La Meta, en tu siguiente turno Avanzar te costará dos acciones.\n\nSi eres uno de los que está más lejos de La Meta, en tu siguiente turno Usar Poder no te costará acción.' },
];

export const OracleScreen: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [isShuffling, setIsShuffling] = useState(false);
    const [drawnCard, setDrawnCard] = useState<OracleCard | null>(null);
    const [tempDisplayCard, setTempDisplayCard] = useState<OracleCard | null>(null);
    const [usedCards, setUsedCards] = useState<string[]>([]);
    const [cooldown, setCooldown] = useState(0); // Lockout timer

    // Scroll States
    const descriptionRef = useRef<HTMLDivElement>(null);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [canScrollUp, setCanScrollUp] = useState(false);

    // Persistence Check
    useEffect(() => {
        const storedUsed = localStorage.getItem('game_oracle_history_ids');
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
        localStorage.removeItem('game_oracle_history_ids');
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

    const finishActivation = (currentPool: OracleCard[]) => {
        const finalCard = currentPool[Math.floor(Math.random() * currentPool.length)];
        
        const newUsed = [...usedCards, finalCard.id];
        const actualUsed = poolExhausted ? [finalCard.id] : newUsed;
        
        setUsedCards(actualUsed);
        localStorage.setItem('game_oracle_history_ids', JSON.stringify(actualUsed));

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
            <Header title="Oráculo Divino" actionIcon="settings" onBack={() => navigate('/game')} />
            
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