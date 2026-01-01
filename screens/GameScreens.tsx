import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Card, Button, BottomBar } from '../components/UI';
import { Player, GameColor } from '../types';

// --- Game Session (Main Hub) ---
export const GameSessionScreen: React.FC = () => {
    const navigate = useNavigate();
    
    // Logic simplification: We don't check for players to disable buttons anymore
    // because "Skip Registration" now creates default players, and Tools have fallbacks.

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
                <h3 className="text-slate-400 tracking-wide text-xs font-bold uppercase px-1 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">bolt</span> Acciones Principales
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Card onClick={() => navigate('/minigame-selector')} className="h-64 border-4 border-white group" bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAlkW3Xim0uV0HK2wLarIuDmnPNIxq6jxurfDoWcgSZFCnSnp0hxr3dUMh7AALzEB-Jt-KtfY7CdDHk7lAel5YbztNTT9y39EWZ4ZP_xLE7-aHS2eWLwDTc9j-Kp8WmsK17sl2a-ObIvNoekXKRK7ncyL3JdigLfAjcUG054BZ2EA2G5jG4MkLOPam8H1uNyb45kjrApoEC72QAapwFAR7ECEgl975PQ4rqaIYwqnv79kxuSnrLgfddpi1yS6iPbBuZmm4kjG0StSo">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="relative z-10 flex flex-col justify-end h-full p-4">
                            <div className="size-12 rounded-xl bg-primary flex items-center justify-center shadow-lg border-2 border-white/20 mb-3">
                                <span className="material-symbols-outlined text-white text-2xl">videogame_asset</span>
                            </div>
                            <h4 className="text-white text-lg font-extrabold leading-tight">Jugar Minijuego</h4>
                            <p className="text-white/80 text-xs mt-1 font-medium">Desafía a los dioses.</p>
                        </div>
                    </Card>
                    <Card onClick={() => navigate('/oracle')} className="h-64 border-4 border-white group" bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuD9QZx7CtrJnAHf9WfZTyPOlTMAK7huKeUFgLtc33PrED9FikKC8usbyisSCOi2BuhW9d-S0tLyBUDMBiK6TOoPDH6JRgJCZgVj9G7sDmv4-KrLTdPS93yBc0VxGPm-pEYNK_gjxy266cH0TZBTo1tFrOg9RHQlJFGjxwImcPf5mCwVmTOOd6LB5o0f85239Cd1aL1iyspDGfYPpGdptQX4tqVOczJJbjZ6RFrzl8zBoRfDwyFQWNihIv34b0I9Yrw7t6SOra7hIC8">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="relative z-10 flex flex-col justify-end h-full p-4">
                            <div className="size-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg border-2 border-white/20 mb-3">
                                <span className="material-symbols-outlined text-white text-2xl">visibility</span>
                            </div>
                            <h4 className="text-white text-lg font-extrabold leading-tight">Activar Oráculo</h4>
                            <p className="text-white/80 text-xs mt-1 font-medium">Consulta el destino.</p>
                        </div>
                    </Card>
                </div>

                <h3 className="text-slate-400 tracking-wide text-xs font-bold uppercase px-1 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">build</span> Herramientas
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-8">
                     {[
                         {icon: 'timer', color: 'teal', label: 'Temporizador', path: '/timer'},
                         {icon: 'map', color: 'amber', label: 'Destinos', path: '/destinies-public'},
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
                                <span className="text-xs font-bold text-slate-700 text-center flex flex-col items-center">
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
    
    // Scroll Detection State
    const descriptionRef = useRef<HTMLDivElement>(null);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [canScrollUp, setCanScrollUp] = useState(false);

    // Derived
    const availablePool = MINIGAMES_DB.filter(game => filters.includes(game.type));
    const canDraw = availablePool.length > 0 && !isShuffling;

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
            // Show bottom fade if content is taller than container AND we haven't scrolled to bottom
            setCanScrollDown(scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 5);
            // Show top fade if we have scrolled down
            setCanScrollUp(scrollTop > 5);
        }
    };

    // Draw Logic
    const handleDraw = () => {
        if (!canDraw) return;
        
        setIsShuffling(true);
        setDrawnCard(null);

        // Shuffle Animation Logic
        let iterations = 0;
        const maxIterations = 15; // How many flips before stopping
        const interval = setInterval(() => {
            const randomTemp = availablePool[Math.floor(Math.random() * availablePool.length)];
            setTempDisplayCard(randomTemp);
            iterations++;

            if (iterations >= maxIterations) {
                clearInterval(interval);
                finishDraw();
            }
        }, 100); // Speed of shuffle
    };

    const finishDraw = () => {
        const finalCard = availablePool[Math.floor(Math.random() * availablePool.length)];
        setDrawnCard(finalCard);
        setTempDisplayCard(null);
        setIsShuffling(false);
    };

    // Re-check scroll on card change
    useEffect(() => {
        checkScroll();
        // Allow time for layout to settle
        const t = setTimeout(checkScroll, 100);
        return () => clearTimeout(t);
    }, [drawnCard, tempDisplayCard, isShuffling]);

    const navigateToWinnerLog = () => {
        // Pass state to auto-open the modal in Victory Log
        navigate('/victory-log', { state: { openMinigameModal: true } });
    };

    // Style Helpers - CLEAN & MINIMALIST
    const getCardStyles = (type?: MinigameType) => {
        if (!type) return { 
            bgHeader: 'bg-slate-50', 
            textHeader: 'text-slate-400', 
            textTitle: 'text-slate-500', 
            icon: 'text-slate-300',
            border: 'border-slate-200',
            divider: 'bg-slate-200'
        };
        switch(type) {
            case 'Individual': return { 
                bgHeader: 'bg-red-50', 
                textHeader: 'text-red-500', 
                textTitle: 'text-red-600',
                icon: 'text-red-400',
                border: 'border-red-100',
                divider: 'bg-red-100'
            };
            case 'Team': return { 
                bgHeader: 'bg-blue-50', 
                textHeader: 'text-blue-500', 
                textTitle: 'text-blue-600',
                icon: 'text-blue-400',
                border: 'border-blue-100',
                divider: 'bg-blue-100'
            };
            case 'Special': return { 
                bgHeader: 'bg-green-50', 
                textHeader: 'text-green-500', 
                textTitle: 'text-green-600',
                icon: 'text-green-400',
                border: 'border-green-100',
                divider: 'bg-green-100'
            };
            default: return { 
                bgHeader: 'bg-slate-50', 
                textHeader: 'text-slate-400', 
                textTitle: 'text-slate-500', 
                icon: 'text-slate-300',
                border: 'border-slate-200',
                divider: 'bg-slate-200'
            };
        }
    };

    // Determine what to show
    const displayCard = isShuffling ? tempDisplayCard : drawnCard;
    const cardStyles = getCardStyles(displayCard?.type);
    const hasActiveCard = displayCard || isShuffling;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header 
                title="Selector de Minijuegos" 
                actionIcon="settings" 
                onBack={() => navigate('/game')} 
            />
            
            {/* Filters */}
            <div className="w-full px-4 pt-4 pb-2 z-20">
                <h3 className="typo-caption mb-2 ml-1">Filtrar por Tipo</h3>
                <div className="flex gap-2 w-full">
                    {[
                        { id: 'Individual', label: 'Individual', color: 'red' },
                        { id: 'Team', label: 'En Equipo', color: 'blue' },
                        { id: 'Special', label: 'Especial', color: 'green' }
                    ].map((f) => {
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
                    <div className="flex flex-col items-center text-center opacity-60 animate-float transition-all duration-300">
                        <div className="w-48 h-64 bg-slate-200 rounded-2xl border-4 border-slate-300 border-dashed flex items-center justify-center mb-4 relative">
                            <span className="material-symbols-outlined text-6xl text-slate-400">playing_cards</span>
                            <div className="absolute -right-2 -bottom-2 size-12 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-200">
                                <span className="font-bold text-slate-400 text-xs">{availablePool.length}</span>
                            </div>
                        </div>
                        <p className="typo-h3 text-slate-400">Toca para sacar carta</p>
                    </div>
                )}

                {/* The Card - Minimalist Flex Design without Exit Animation */}
                {displayCard && (
                    <div 
                        className={`relative w-full max-w-[320px] aspect-[63/88] bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col 
                            transition-all duration-300 ease-in-out border-2 ${cardStyles.border}
                            ${isShuffling ? 'scale-95 blur-[1px]' : 'animate-pop-in'}
                        `}
                    >
                        
                        {/* Header: Category Icon & Name */}
                        <div className={`w-full py-4 px-4 flex flex-col items-center justify-center shrink-0 border-b border-dashed ${cardStyles.border} ${cardStyles.bgHeader}`}>
                            <span className={`material-symbols-outlined text-2xl mb-1 ${cardStyles.icon}`}>
                                {displayCard.type === 'Individual' ? 'person' : displayCard.type === 'Team' ? 'groups' : 'auto_awesome'}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${cardStyles.textHeader}`}>
                                {displayCard.type === 'Team' ? 'En Equipo' : displayCard.type}
                            </span>
                        </div>

                        {/* Body: Flex Column to handle variable content height */}
                        <div className="flex-1 flex flex-col overflow-hidden relative w-full">
                            
                            {/* Title Section (Auto height, will push description down) */}
                            <div className="px-6 pt-5 pb-2 text-center shrink-0 z-10">
                                <h2 className={`font-cartoon text-2xl leading-tight ${cardStyles.textTitle}`}>
                                    {displayCard.title}
                                </h2>
                            </div>

                            {/* Divider Pill */}
                            <div className={`w-12 h-1.5 mx-auto rounded-full shrink-0 my-1 ${cardStyles.divider}`}></div>

                            {/* Description Section (Fills remaining space) */}
                            <div className="flex-1 px-6 pb-6 pt-2 overflow-hidden relative w-full mb-2">
                                {/* Top Fade (Dynamic) */}
                                <div className={`absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white via-white/90 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollUp ? 'opacity-100' : 'opacity-0'}`}></div>

                                <div 
                                    ref={descriptionRef}
                                    onScroll={checkScroll}
                                    className="h-full overflow-y-auto no-scrollbar text-center flex items-start justify-center"
                                >
                                    <p className="font-rounded font-semibold text-[17px] text-slate-600 leading-snug w-full whitespace-pre-line pb-4 pt-2">
                                        {displayCard.description}
                                    </p>
                                </div>
                                
                                {/* Bottom Fade (Dynamic) */}
                                <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none transition-opacity duration-300 z-10 ${canScrollDown ? 'opacity-100' : 'opacity-0'}`}></div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
            
            {/* Controls */}
            <BottomBar className="bg-white border-t border-slate-100">
                 <div className="flex w-full gap-3 items-center">
                     {/* Secondary Action: Register Winner */}
                    {drawnCard && !isShuffling && (
                        <Button 
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 shadow-sm px-0 active:bg-slate-200" 
                            onClick={navigateToWinnerLog} 
                            icon="emoji_events"
                        >
                            <span className="text-sm font-bold truncate">Registrar</span>
                        </Button>
                    )}

                    {/* Primary Action: Shuffle/Draw */}
                    <Button 
                        className={`flex-[2] shadow-[0_4px_20px_rgba(37,140,244,0.4)] bg-action ${isShuffling ? 'opacity-80' : ''}`}
                        onClick={handleDraw} 
                        disabled={availablePool.length === 0 || isShuffling}
                        icon={isShuffling ? 'cached' : 'style'}
                    >
                        {isShuffling ? '...' : drawnCard ? 'Otra Carta' : 'Sacar Carta'}
                    </Button>
                 </div>
            </BottomBar>
        </div>
    );
};

// --- Oracle Screen ---
export const OracleScreen: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header title="Activación de Oráculos" actionIcon="settings" />
            <div className="flex-1 flex flex-col items-center px-6 pt-4 w-full pb-32">
                <div className="w-full animate-float">
                    <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-xl border border-slate-100">
                        <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                            <div className="h-full w-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDO4FEqbIhBr1HqIATV6fhQX4eX9w-1oi9qG34WCkoxGmFzAjcI2KJtt5tktFV3QHcj35Ac0v7jySWvRo3wCtfrLcyXZB3bINfMKeYxHTpuPNCtkO_OUoYtBZlhet_ssQHHpz322Ynh4UTXCt80MIt8MXN6stSmiIy6svcltHWcv4hms_fnwW-2n1ECvyu4zhK4Qz0YuiEG24xSN4ERMDDlARKWGSjrDmCHiowNPMEJupqnBcrLZMivu-QqXarMWyLYs3ylCHYqPSc')"}}></div>
                            <div className="absolute top-4 right-4 z-20">
                                <div className="flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-md border border-white/20">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-90">TIPO</span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Favorable</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 p-7 pt-5">
                            <div>
                                <h3 className="typo-caption text-action mb-1.5">Resultado</h3>
                                <h2 className="typo-h2">La Bendición del Trueno</h2>
                            </div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <p className="typo-body">
                                Zeus te sonríe desde el Olimpo. La tormenta despeja el camino de tus enemigos. <span className="text-action font-bold bg-blue-50 px-1 rounded">Roba dos cartas de acción extra</span> inmediatamente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <BottomBar>
                <Button fullWidth className="bg-action shadow-[0_8px_20px_rgb(37,140,244,0.3)]" icon="auto_awesome">ACTIVAR ORÁCULO</Button>
            </BottomBar>
        </div>
    );
};

// --- Victory Log ---
interface MinigameRecord {
    id: string;
    round: number;
    winners: string[]; // Player IDs
    timestamp: number;
}

export const VictoryLogScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [players, setPlayers] = useState<Player[]>([]);
    
    // Check if we came from calculator
    const isFromCalculator = location.state?.fromCalculator;
    // Check if we came from Minigame Selector to auto-open modal
    const shouldAutoOpenModal = location.state?.openMinigameModal;

    // Core stats for Leaderboard compatibility
    // 'mentions' structure: { [category: string]: { [playerId: string]: number } }
    const [log, setLog] = useState<{minigames: Record<string, number>, mentions: Record<string, Record<string, number>>}>({ minigames: {}, mentions: {} });
    
    // Detailed history for this screen
    const [minigameHistory, setMinigameHistory] = useState<MinigameRecord[]>([]);
    
    // UI States
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
    const [showMinigameModal, setShowMinigameModal] = useState(false);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    
    // New UI State for Vote Feedback
    const [justVotedId, setJustVotedId] = useState<string | null>(null);
    const [isClearingVotes, setIsClearingVotes] = useState(false);

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

    // Initialize Modal from Navigation State
    useEffect(() => {
        if (shouldAutoOpenModal) {
            setShowMinigameModal(true);
            // We don't want to re-open it if the user closes it and component updates, 
            // but cleaning location state is tricky in React Router v6 without navigation.
            // For this app flow, it's acceptable.
        }
    }, [shouldAutoOpenModal]);

    useEffect(() => {
        const storedPlayers = localStorage.getItem('game_players');
        const storedLog = localStorage.getItem('game_log');
        const storedHistory = localStorage.getItem('game_minigame_history');

        let currentPlayers: Player[] = [];

        if (storedPlayers && JSON.parse(storedPlayers).length > 0) {
            currentPlayers = JSON.parse(storedPlayers);
        } else {
             // Fallback: Generate Default Players for Victory Log usage with random names
            const pool = ["Paco", "Lola", "Coco", "Tete", "Nono", "Rorro", "Nadie", "Casi", "El Capo", "Bebé", "Caos", "Osi", "Bicho", "Pulga", "Mole", "Cinco"];
            const shuffledPool = shuffle([...pool]);

            const defaultColors: GameColor[] = ['red', 'blue', 'yellow', 'green', 'black', 'white'];
            currentPlayers = defaultColors.map((color, index) => ({
                id: `def-${index}`,
                name: shuffledPool[index], // Use random name
                pact: 'Atenea',
                color: color
            }));
        }
        
        setPlayers(currentPlayers);
            
        if (storedLog) {
            const parsedLog = JSON.parse(storedLog);
            // Backward compatibility if old 'decisions' exists, move to mentions.strategy
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
    }, []);

    // Persistence
    useEffect(() => {
        if (players.length > 0) {
            localStorage.setItem('game_log', JSON.stringify(log));
            localStorage.setItem('game_minigame_history', JSON.stringify(minigameHistory));
        }
    }, [log, minigameHistory, players]);

    const handleBack = () => {
        if (isFromCalculator) {
            // If coming from Calculator Summary, return there
            navigate('/calculator', { state: { initialShowSummary: true } });
        } else {
            navigate(-1);
        }
    };

    const toggleWinnerSelection = (playerId: string) => {
        setSelectedWinners(prev => 
            prev.includes(playerId) 
                ? prev.filter(id => id !== playerId) 
                : [...prev, playerId]
        );
    };

    const openMinigameModal = (record?: MinigameRecord) => {
        if (record) {
            // Edit Mode
            setEditingRecordId(record.id);
            setSelectedWinners(record.winners);
        } else {
            // New Mode
            setEditingRecordId(null);
            setSelectedWinners([]);
        }
        setShowMinigameModal(true);
    };

    // Smart Close Logic: If we came here from auto-open, go back to selector. Else, just close modal.
    const handleCloseMinigameModal = () => {
        setShowMinigameModal(false);
        setEditingRecordId(null);
        setSelectedWinners([]);
        
        if (shouldAutoOpenModal) {
            navigate(-1);
        }
    };

    const deleteMinigameRecord = () => {
        if (!editingRecordId) return;

        let newHistory = minigameHistory.filter(rec => rec.id !== editingRecordId);
        
        // Re-index rounds so they remain sequential (e.g. Round 1, 2, 3...)
        // Since the list is ordered newest-first, round = total - index
        newHistory = newHistory.map((rec, index) => ({
            ...rec,
            round: newHistory.length - index
        }));

        setMinigameHistory(newHistory);
        recalculateStats(newHistory, log.mentions); // Keep mentions, recalc minigames

        handleCloseMinigameModal(); // Use smart close
    };

    const confirmMinigame = () => {
        let winnersToSave = selectedWinners;
        
        // Handle "All selected" as "No Winners" per user request
        if (selectedWinners.length === players.length) {
            winnersToSave = [];
        }

        let newHistory = [...minigameHistory];
        
        if (editingRecordId) {
             // UPDATE Existing
             newHistory = newHistory.map(rec => {
                 if (rec.id === editingRecordId) {
                     return { ...rec, winners: winnersToSave };
                 }
                 return rec;
             });
        } else {
             // CREATE New
             const newRecord: MinigameRecord = {
                 id: `mg-${Date.now()}`,
                 round: minigameHistory.length + 1,
                 winners: winnersToSave,
                 timestamp: Date.now()
             };
             newHistory = [newRecord, ...newHistory];
             setIsHistoryExpanded(true); // Auto expand on new add
        }
        
        setMinigameHistory(newHistory);
        recalculateStats(newHistory, log.mentions);

        // Reset
        setShowMinigameModal(false);
        setEditingRecordId(null);
        setSelectedWinners([]);

        // Smart return if came from game
        if (shouldAutoOpenModal) {
            navigate(-1);
        }
    };

    // Helper to recalculate total minigame wins based on history
    const recalculateStats = (history: MinigameRecord[], currentMentions: Record<string, Record<string, number>>) => {
        const newMinigamesStats: Record<string, number> = {};
        // Reset to 0
        players.forEach(p => newMinigamesStats[p.id] = 0);
        
        // Sum from history
        history.forEach(rec => {
            rec.winners.forEach(wid => {
                newMinigamesStats[wid] = (newMinigamesStats[wid] || 0) + 1;
            });
        });

        setLog({ minigames: newMinigamesStats, mentions: currentMentions });
    };

    const openVoteModal = (category: string) => {
        setActiveCategory(category);
        setShowVoteModal(true);
    }

    const confirmVote = (winnerId: string) => {
        if (!activeCategory) return;
        
        // 1. Set Visual Feedback
        setJustVotedId(winnerId);

        // 2. Wait 700ms before saving and closing
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
            setJustVotedId(null); // Reset
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
        }, 700); // 700ms duration
    }

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

    const voteCategories = [
        { id: 'strategy', label: 'Estratega', modalTitle: 'El Más Estratégico', icon: 'psychology', color: 'purple' },
        { id: 'chaos', label: 'Caótico', modalTitle: 'El Más Caótico', icon: 'local_fire_department', color: 'red' },
        { id: 'fun', label: 'Gracioso', modalTitle: 'Quien Más Hizo Reír', icon: 'sentiment_very_satisfied', color: 'amber' },
        { id: 'liar', label: 'Mentiroso', modalTitle: 'El Mejor Mentiroso', icon: 'theater_comedy', color: 'slate' },
    ];

    const getActiveCategoryModalTitle = () => {
        return voteCategories.find(c => c.id === activeCategory)?.modalTitle || 'Votación';
    }

    // Calculate total votes for the current active category
    const getTotalVotesForCategory = (catId: string) => {
        if (!log.mentions || !log.mentions[catId]) return 0;
        return Object.values(log.mentions[catId]).reduce((sum: number, count: number) => sum + count, 0);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#f5f7f8]">
            <Header title="Bitácora de Partida" actionIcon="settings" onBack={handleBack} />
            
            <div className="flex-1 px-4 pt-6 pb-36 overflow-y-auto no-scrollbar">
                
                {/* Header Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 text-center relative overflow-hidden">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-500 mb-4">
                        <span className="material-symbols-outlined text-[32px]">emoji_events</span>
                    </div>
                    <p className="text-gray-600 text-base font-medium leading-relaxed">
                        Registra los eventos de la partida para otorgar las menciones de honor.
                    </p>
                </div>
                
                <div className="space-y-8">
                    
                    {/* SECTION 1: MINIGAMES */}
                    <div>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="typo-h3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-action">trophy</span>
                                Minijuegos
                            </h3>
                            <button 
                                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                                className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                {isHistoryExpanded ? 'Ocultar Lista' : 'Mostrar Lista'}
                                <span className={`material-symbols-outlined text-sm transition-transform ${isHistoryExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                        </div>

                        {/* Register Button */}
                        <Button 
                            fullWidth 
                            className="bg-action shadow-lg shadow-action/20 mb-4" 
                            icon="add_circle"
                            onClick={() => openMinigameModal()}
                        >
                            Registrar Ganador de Minijuego
                        </Button>

                        {/* Collapsible History List - Stable Scrollbar */}
                        {isHistoryExpanded && (
                            <div className="flex flex-col gap-3" style={{scrollbarGutter: 'stable'}}>
                                {minigameHistory.length === 0 ? (
                                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        No hay minijuegos registrados aún.
                                    </div>
                                ) : (
                                    minigameHistory.map((record, idx) => (
                                        <div key={record.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ronda {record.round}</span>
                                                <span className="font-bold text-slate-800 text-sm">Minijuego</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    {record.winners.length === 0 ? (
                                                        <span className="text-xs text-slate-400 font-bold italic mr-1">Sin ganadores</span>
                                                    ) : (
                                                        record.winners.map(wid => {
                                                            const p = players.find(pl => pl.id === wid);
                                                            if (!p) return null;
                                                            const style = getColorStyle(p.color);
                                                            return (
                                                                <div key={wid} className={`size-8 rounded-full ${style.bg} flex items-center justify-center border ${style.border} shadow-sm`} title={p.name}>
                                                                    <span className={`material-symbols-outlined text-sm ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                                                </div>
                                                            )
                                                        })
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={() => openMinigameModal(record)}
                                                    className="size-8 rounded-full text-slate-400 hover:text-action hover:bg-slate-50 flex items-center justify-center transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <hr className="border-slate-200" />

                    {/* SECTION 2: OTHERS (VOTING) */}
                    <div>
                        <div className="mb-4 px-1">
                             <h3 className="typo-h3 flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-purple-500">hotel_class</span>
                                Otros
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">Votaciones opcionales para destacar jugadores.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {voteCategories.map(cat => {
                                const totalVotes = getTotalVotesForCategory(cat.id);
                                return (
                                    <button 
                                        key={cat.id}
                                        onClick={() => openVoteModal(cat.id)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-${cat.color}-200 hover:bg-${cat.color}-50 transition-all active:scale-[0.98] group`}
                                    >
                                        <div className={`size-10 rounded-full bg-${cat.color}-100 text-${cat.color}-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                            <span className="material-symbols-outlined">{cat.icon}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                                        <span className="text-[10px] font-bold text-slate-400 mt-0.5">({totalVotes} {totalVotes === 1 ? 'voto' : 'votos'})</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* Minigame Winner Modal */}
            {showMinigameModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    {/* BACKDROP with Smart Close */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseMinigameModal}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                        <div className="p-5 border-b border-slate-100 bg-white text-center relative">
                            {/* NEW: Explicit X Button */}
                            <button 
                                onClick={handleCloseMinigameModal}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <h3 className="typo-h3 text-slate-900">{editingRecordId ? 'Editar Resultado' : '¿Quién Ganó el Minijuego?'}</h3>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Selecciona los ganadores de la Ronda</p>
                        </div>
                        
                        <div className="p-5 overflow-y-auto grid grid-cols-2 gap-3 bg-[#f8fafc]">
                            {players.map(p => {
                                const isSelected = selectedWinners.includes(p.id);
                                const style = getColorStyle(p.color);
                                return (
                                    <button 
                                        key={p.id}
                                        onClick={() => toggleWinnerSelection(p.id)}
                                        className={`relative p-3 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 h-28 shadow-sm ${isSelected ? `border-action bg-white ring-2 ring-action/20` : 'border-white bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`size-12 rounded-full ${style.bg} flex items-center justify-center border ${style.border} shadow-md transition-transform ${isSelected ? 'scale-110' : ''}`}>
                                            <span className={`material-symbols-outlined text-2xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                        </div>
                                        <span className={`text-sm font-bold truncate w-full text-center ${isSelected ? 'text-action' : 'text-slate-700'}`}>{p.name}</span>
                                        
                                        {/* Corner checkmark similar to screenshot/registration */}
                                        <div className={`absolute top-2 right-2 size-5 rounded-full flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-action text-white scale-100' : 'bg-slate-100 text-slate-300 scale-0 opacity-0'}`}>
                                            <span className="material-symbols-outlined text-xs font-bold">check</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                        
                        <div className="p-5 border-t border-slate-100 bg-white flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                {/* CANCEL Button with Smart Close */}
                                <button 
                                    onClick={handleCloseMinigameModal}
                                    className="px-4 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <Button className="flex-1 shadow-xl shadow-primary/20" onClick={confirmMinigame}>
                                    {(selectedWinners.length === 0 || selectedWinners.length === players.length) ? 'No Hubo Ganadores' : 'Confirmar'}
                                </Button>
                            </div>
                            
                            {editingRecordId && (
                                <button 
                                    onClick={deleteMinigameRecord} 
                                    className="w-full py-3 rounded-xl text-danger font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2 mt-2"
                                >
                                    <span className="material-symbols-outlined icon-sm">delete</span> Eliminar este registro
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Vote Modal */}
            {showVoteModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isClearingVotes && setShowVoteModal(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                         
                         {/* Deletion Feedback Overlay - Moved here to cover the whole modal */}
                         {isClearingVotes && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-300">
                                <div className="flex flex-col items-center justify-center animate-pop-in">
                                    <div className="size-14 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-3 shadow-xl border-4 border-white">
                                        <span className="material-symbols-outlined text-3xl font-bold">delete</span>
                                    </div>
                                    <p className="text-red-500 font-bold text-lg animate-pulse">¡Votos Eliminados!</p>
                                </div>
                            </div>
                         )}

                         <div className="p-5 border-b border-slate-100 bg-white text-center">
                            <h3 className="typo-h3 text-slate-900">{getActiveCategoryModalTitle()}</h3>
                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wide">
                                ({activeCategory ? getTotalVotesForCategory(activeCategory) : 0} {activeCategory && getTotalVotesForCategory(activeCategory) === 1 ? 'voto recibido' : 'votos recibidos'})
                            </p>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Toca al jugador que merece este título</p>
                        </div>
                        <div className="p-5 overflow-y-auto grid grid-cols-2 gap-3 bg-[#f8fafc] relative">
                             {players.map(p => {
                                const style = getColorStyle(p.color);
                                const isJustVoted = justVotedId === p.id;
                                
                                return (
                                    <button 
                                        key={p.id}
                                        onClick={() => confirmVote(p.id)}
                                        disabled={justVotedId !== null || isClearingVotes} // Disable all during feedback animation
                                        className={`relative p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 h-28 shadow-sm active:scale-95 overflow-hidden ${isJustVoted ? 'bg-green-50 border-green-500 scale-105' : 'border-white bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`size-12 rounded-full ${style.bg} flex items-center justify-center border ${style.border} shadow-md transition-transform ${isJustVoted ? 'scale-110' : ''}`}>
                                            <span className={`material-symbols-outlined text-2xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                        </div>
                                        <div className="w-full text-center relative z-10">
                                            <span className={`block text-sm font-bold truncate w-full ${isJustVoted ? 'text-green-700' : 'text-slate-700'}`}>{isJustVoted ? '¡Voto!' : p.name}</span>
                                        </div>
                                        
                                        {/* Overlay Feedback Icon */}
                                        {isJustVoted && (
                                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                                <div className="size-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pop-in">
                                                    <span className="material-symbols-outlined text-2xl font-bold">check</span>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                )
                             })}
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-white flex flex-col gap-3">
                            <Button variant="outline" fullWidth onClick={() => setShowVoteModal(false)} disabled={isClearingVotes}>Cancelar</Button>
                            
                            <button 
                                onClick={clearCategoryVotes} 
                                disabled={isClearingVotes}
                                className="w-full py-3 rounded-xl text-danger font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined icon-sm">delete</span> Borrar votos de esta categoría
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Bar for Return to Summary */}
            {isFromCalculator && (
                <BottomBar className="bg-white border-t border-slate-100">
                    <Button 
                        fullWidth 
                        onClick={() => navigate('/calculator', { state: { initialShowSummary: true } })} 
                        icon="check"
                    >
                        Volver al Resumen
                    </Button>
                </BottomBar>
            )}

        </div>
    );
};