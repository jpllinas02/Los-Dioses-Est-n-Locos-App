import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Button } from '../components/UI';
import { ROUTES } from '../constants';

// --- DATA STRUCTURE ---

interface GuideItem {
    id: string;
    title: string;
    icon: string;
    color: string; // Tailwind text color class
    bg: string;    // Tailwind bg color class
    description: string; // Short summary for list view
    detailContent: {
        intro: string;
        bullets: string[];
    };
}

interface GuideGroup {
    id: string; // NEW: Group ID for filtering
    groupTitle: string;
    items: GuideItem[];
}

const GUIDE_GROUPS: GuideGroup[] = [
    {
        id: 'group-setup',
        groupTitle: "Configuración",
        items: [
            {
                id: 'setup',
                title: 'Configuración de Partida',
                icon: 'settings_account_box',
                color: 'text-primary',
                bg: 'bg-primary/10',
                description: 'Aprende a registrar jugadores, personalizar fichas y definir la modalidad.',
                detailContent: {
                    intro: 'Antes de comenzar, la aplicación te guiará para configurar la experiencia ideal. Aquí defines quiénes juegan y cómo se comportarán los roles ocultos.',
                    bullets: [
                        'Jugadores: Registra de 4 a 6 participantes.',
                        'Identidad: Asigna nombres (manuales o aleatorios) y colores de ficha para identificar a cada uno.',
                        'Modalidad de Pacto: Elige entre "Equilibrada" (estándar), "Caótica" (azar total) o "Estratégica" (roles públicos) para definir cómo se reparten los objetivos secretos.'
                    ]
                }
            }
        ]
    },
    {
        id: 'group-active',
        groupTitle: "Juego en Curso",
        items: [
            {
                id: 'decks',
                title: 'Mazos Digitales',
                icon: 'style',
                color: 'text-purple-600',
                bg: 'bg-purple-100',
                description: 'Reemplaza las cartas físicas con los Oráculos y Minijuegos virtuales.',
                detailContent: {
                    intro: 'Si no tienes las cartas a mano o prefieres la agilidad digital, la app gestiona los mazos principales del juego por ti.',
                    bullets: [
                        'Oráculos: Genera cartas de efecto Favorable, Desfavorable o Neutral. Son sentencias divinas impredecibles.',
                        'Minijuegos: Pruebas de habilidad, sociales o mentales. Puedes filtrar por tipo (Individual, Equipo, Especial) si desean practicar una categoría específica.',
                        'Barajado: La app mezcla automáticamente cuando se agotan las cartas.'
                    ]
                }
            },
            {
                id: 'tools',
                title: 'Herramientas de Apoyo',
                icon: 'home_repair_service',
                color: 'text-teal-600',
                bg: 'bg-teal-100',
                description: 'Temporizador, Selector de Destinos y Bitácora.',
                detailContent: {
                    intro: 'Un set de utilidades diseñadas para resolver situaciones comunes durante la partida sin necesidad de accesorios externos.',
                    bullets: [
                        'Temporizador: Úsalo para medir el tiempo límite de los Minijuegos.',
                        'Selector de Destinos: Una herramienta imparcial para elegir un jugador al azar (o un destino secreto) cuando una carta lo requiera.',
                        'Bitácora: Crucial para el historial. Úsala para consultar reglas rápidas o verificar eventos pasados.'
                    ]
                }
            },
            {
                id: 'end',
                title: 'Terminar Partida',
                icon: 'flag',
                color: 'text-rose-600',
                bg: 'bg-rose-100',
                description: 'Cómo proceder cuando un jugador alcanza la Meta.',
                detailContent: {
                    intro: 'El juego concluye cuando se completa la ronda en la que al menos un jugador ha llegado a la casilla Meta.',
                    bullets: [
                        'Acceso: Busca el botón "Terminar Partida" en la pantalla principal o el icono del trofeo.',
                        'Transición: Esto bloqueará las herramientas de juego y te llevará a la Calculadora Final.',
                        'Importante: Asegúrate de que todos hayan terminado sus turnos de esa ronda antes de pulsar el botón.'
                    ]
                }
            }
        ]
    },
    {
        id: 'group-end',
        groupTitle: "Final del Juego",
        items: [
            {
                id: 'results',
                title: 'Resultados y Ganador',
                icon: 'emoji_events',
                color: 'text-amber-600',
                bg: 'bg-amber-100',
                description: 'Cálculo de puntajes, Menciones de Honor y el Campeón Supremo.',
                detailContent: {
                    intro: 'La parte más emocionante. La app se encarga de las matemáticas complejas para revelar quién ganó realmente según su Pacto Secreto.',
                    bullets: [
                        'Calculadora: Ingresa la cantidad final de Reliquias, Plagas y Poderes que tiene cada jugador en su tablero físico.',
                        'Puntaje Automático: La app aplica la fórmula única de cada Pacto (Atenea, Loki, Longwang) para determinar los puntos reales.',
                        'Menciones de Honor: Se otorgan títulos especiales (como "Maestro de Minijuegos") basados en el desempeño registrado.',
                        'Campeón: Se revela la tabla de posiciones y el ganador definitivo.'
                    ]
                }
            }
        ]
    }
];

export const AppGuideScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // State now holds the entire Item object instead of just an index
    const [selectedItem, setSelectedItem] = useState<GuideItem | null>(null);

    // Get Target ID from navigation state
    const targetId = location.state?.targetId as string | undefined;

    // --- EFFECT: Auto-Open Item ---
    useEffect(() => {
        if (targetId) {
            // Search through all groups to find a matching item ID
            for (const group of GUIDE_GROUPS) {
                const foundItem = group.items.find(item => item.id === targetId);
                if (foundItem) {
                    setSelectedItem(foundItem);
                    break; // Stop finding once found
                }
            }
        }
    }, [targetId]);

    // --- LOGIC: Filter Groups ---
    // If targetId matches a Group ID, we only show that group. Otherwise show all.
    const visibleGroups = targetId && GUIDE_GROUPS.some(g => g.id === targetId)
        ? GUIDE_GROUPS.filter(g => g.id === targetId)
        : GUIDE_GROUPS;

    // --- RENDER: DETAIL VIEW (Level 3) ---
    if (selectedItem) {
        return (
            <div className="flex min-h-screen flex-col bg-white animate-fade-in">
                <Header 
                    title={selectedItem.title} 
                    showBack={true} 
                    onBack={() => setSelectedItem(null)}
                    showHelp={false}
                />
                
                <div className="flex-1 overflow-y-auto pb-24">
                    {/* Hero Section */}
                    <div className={`w-full py-10 px-6 flex flex-col items-center justify-center text-center bg-slate-50 border-b border-slate-100`}>
                        <div className={`size-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 animate-pop-in ring-4 ring-white`}>
                            <span className={`material-symbols-outlined text-5xl ${selectedItem.color}`}>{selectedItem.icon}</span>
                        </div>
                        <h2 className="typo-h2 text-slate-900 mb-2">{selectedItem.title}</h2>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                            {selectedItem.detailContent.intro}
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Detalles y Funciones</h3>
                        <div className="flex flex-col gap-4">
                            {selectedItem.detailContent.bullets.map((bullet, i) => (
                                <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <div className={`mt-0.5 size-6 rounded-full ${selectedItem.bg} flex items-center justify-center shrink-0`}>
                                        <span className={`text-xs font-bold ${selectedItem.color}`}>{i + 1}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        {bullet}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-20">
                    <Button fullWidth onClick={() => setSelectedItem(null)}>
                        Volver al Menú de Ayuda
                    </Button>
                </div>
            </div>
        );
    }

    // --- RENDER: MASTER LIST VIEW (Level 1 & 2) ---
    return (
        <div className="flex min-h-screen flex-col bg-[#f8fafc]">
            <Header title="Guía de la App" showBack={true} showHelp={false} />
            
            <div className="flex-1 overflow-y-auto px-4 py-2 pb-24">
                {/* Intro */}
                <div className="text-center py-6">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg mb-3 rotate-3">
                        <span className="material-symbols-outlined text-3xl">menu_book</span>
                    </div>
                    <h2 className="typo-h3 text-slate-900">Manual de Usuario</h2>
                    <p className="text-slate-500 text-xs mt-1">
                        {visibleGroups.length === 1 ? 'Viendo sección relevante.' : 'Selecciona un tema para ver los detalles.'}
                    </p>
                </div>

                {/* Grouped List - Uses visibleGroups for filtering */}
                <div className="flex flex-col gap-6">
                    {visibleGroups.map((group, groupIdx) => (
                        <div key={group.id} className="flex flex-col animate-slide-down" style={{animationDelay: `${groupIdx * 100}ms`}}>
                            <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                {group.groupTitle}
                            </h3>
                            
                            <div className="flex flex-col gap-3">
                                {group.items.map((item) => (
                                    <button 
                                        key={item.id} 
                                        onClick={() => setSelectedItem(item)}
                                        className="relative flex gap-4 items-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all active:scale-[0.98] active:bg-slate-50 hover:border-slate-300 group text-left"
                                    >
                                        <div className={`shrink-0 size-12 rounded-full ${item.bg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                                            <span className={`material-symbols-outlined text-2xl ${item.color}`}>{item.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{item.title}</h4>
                                                <span className="material-symbols-outlined text-slate-300 text-lg">chevron_right</span>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-tight line-clamp-2">
                                                {item.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-20">
                <Button fullWidth onClick={() => navigate(ROUTES.HOME)} variant="outline">
                    Volver al Inicio
                </Button>
            </div>
        </div>
    );
};