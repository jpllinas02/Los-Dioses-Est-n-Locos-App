import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button } from '../components/UI';

export const RulebookScreen: React.FC = () => {
    const navigate = useNavigate();
    // Mode Selection State: 'SELECTION' | 'DETAILS'
    const [viewMode, setViewMode] = useState<'SELECTION' | 'DETAILS'>('SELECTION');
    
    // Start with the Objective (0) open by default for first-time context
    const [activeSection, setActiveSection] = useState<number | null>(0);

    const toggleSection = (index: number) => {
        setActiveSection(activeSection === index ? null : index);
    };

    const handleBack = () => {
        if (viewMode === 'DETAILS') {
            setViewMode('SELECTION');
        } else {
            navigate(-1);
        }
    };

    const openSummaryPdf = () => {
        window.open('https://drive.google.com/file/d/1sx2DAzhly_wv_xND52ImQy2kAwqRQbMl/view?usp=drive_link', '_blank');
    };

    const sections = [
        {
            id: 0,
            title: "0. Objetivo del Juego",
            icon: "emoji_events",
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            content: (
                <div className="flex flex-col gap-4">
                    <h2 className="font-display font-bold text-xl text-slate-800 leading-tight">
                        Conviértete en el jugador con más puntos al final de la partida.
                    </h2>
                    
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-sm text-slate-600 leading-7 font-medium">
                            Acumula puntos coleccionando <strong className="text-cyan-600">Reliquias</strong>, 
                            evitando las <strong className="text-purple-600">Plagas</strong> y 
                            superando <strong className="text-blue-600">Minijuegos</strong> mientras 
                            usas los <strong className="text-yellow-600">Poderes</strong> de los Dioses a tu conveniencia.
                        </p>
                    </div>

                    <div className="pl-3 border-l-4 border-slate-200 py-1 mt-1">
                         <p className="text-xs text-slate-500 italic leading-relaxed">
                            Todo esto mientras sobrevives a los impredecibles Oráculos, los engaños de tus amigos y muchas risas.
                         </p>
                    </div>
                </div>
            )
        },
        {
            id: 1,
            title: "I. ¿Qué Trae Este Juego?",
            icon: "inventory_2",
            color: "text-blue-600",
            bg: "bg-blue-50",
            content: (
                <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-2">Componentes Físicos</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">grid_view</span> 1 Tablero</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">casino</span> 1 Dado</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">group</span> 6 Fichas Jugador</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">stars</span> 1 Símbolo Elegido</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">menu_book</span> 1 Folleto Reglas</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">help</span> 6 Guías Jugador</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs font-bold">
                            <div className="bg-cyan-50 text-cyan-700 p-1 rounded">30 Reliquias</div>
                            <div className="bg-purple-50 text-purple-700 p-1 rounded">24 Plagas</div>
                            <div className="bg-amber-50 text-amber-700 p-1 rounded">6 Destinos</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-2">Cartas</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                                <span className="text-sm font-bold text-slate-700">Pactos Divinos (9)</span>
                                <span className="text-xs text-slate-500">Definen cómo ganas o pierdes.</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                                <span className="text-sm font-bold text-yellow-600">Poderes (30)</span>
                                <span className="text-xs text-slate-500">Habilidades para beneficiarte.</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                                <span className="text-sm font-bold text-action">Minijuegos (18)</span>
                                <span className="text-xs text-slate-500">Pruebas creadas por los dioses.</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-purple-600">Oráculos (14)</span>
                                <span className="text-xs text-slate-500">Fortunas divinas impredecibles.</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "II. Preparación del Juego",
            icon: "construction",
            color: "text-amber-600",
            bg: "bg-amber-50",
            content: (
                <ol className="list-decimal list-outside pl-4 space-y-4 text-sm text-slate-600">
                    <li>
                        <strong className="text-slate-800">Primero lo primero:</strong> Entrega una <em>Guía de Jugador</em> a cada uno. Cada jugador escoge una ficha y la ubica en la casilla <strong>Inicio</strong>.
                    </li>
                    <li>
                        <strong className="text-slate-800">Asignación de Pactos:</strong> Los Pactos son secretos. Escoge una modalidad:
                        <ul className="list-disc pl-4 mt-1 space-y-1 text-xs">
                            <li><strong>Equilibrada:</strong> 1 Loki en la partida.</li>
                            <li><strong>Caótica:</strong> 0, 1 o 2 Lokis al azar.</li>
                            <li><strong>Estratégica:</strong> Sin secretos. Cada quien elige su pacto públicamente.</li>
                        </ul>
                    </li>
                    <li>
                        <strong className="text-slate-800">Selección del Poder Inicial:</strong> Revuelve el mazo de Poderes. Cada jugador toma 3, elige el que más le convenga y devuelve el resto.
                    </li>
                    <li>
                        <strong className="text-slate-800">Organización del Tablero:</strong> Revuelve por separado los mazos (Poderes, Minijuegos, Oráculos) y ubícalos en el tablero. Separa las fichas (Reliquias y Plagas). Entrega 1 Reliquia a cada jugador.
                    </li>
                    <li>
                        <strong className="text-slate-800">Elección del Elegido:</strong> Definan quién será el primero en jugar. Quien empieza se convierte en el primer Elegido y recibe el Símbolo.
                    </li>
                </ol>
            )
        },
        {
            id: 3,
            title: "III. Conociendo el Tablero",
            icon: "map",
            color: "text-green-600",
            bg: "bg-green-50",
            content: (
                <div className="space-y-3 text-sm text-slate-600">
                    <p>Todos empiezan en <strong>Inicio</strong> y avanzan hacia la Meta siguiendo las flechas.</p>
                    <div className="bg-slate-100 p-3 rounded-lg border-l-4 border-slate-400">
                        <p className="text-xs">La ronda en la que un jugador alcance la Meta, será la <strong>última ronda del juego</strong>, la cual debe completarse.</p>
                    </div>
                    <p>Varios jugadores pueden alcanzar la Meta. ¡Cada uno que termine el juego aquí ganará <strong>1 Reliquia</strong>!</p>
                    <p className="text-xs italic">Si los jugadores que alcanzaron la Meta son regresados, el juego continúa.</p>
                    
                    <h5 className="font-bold text-slate-800 mt-4 mb-2">Casillas Especiales</h5>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-3 bg-cyan-50 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-cyan-600">diamond</span>
                            <span><strong>Bendición de Sabiduría:</strong> Gana 1 Reliquia.</span>
                        </div>
                        <div className="flex items-center gap-3 bg-yellow-50 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-yellow-600">bolt</span>
                            <span><strong>Bendición de Fuerza:</strong> Gana 1 Poder.</span>
                        </div>
                        <div className="flex items-center gap-3 bg-purple-50 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-purple-600">visibility</span>
                            <span><strong>Oráculo del Valiente:</strong> Toma 1 y aplícate su efecto.</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            title: "IV. Fases de una Ronda (Resumen)",
            icon: "update",
            color: "text-slate-600",
            bg: "bg-slate-100",
            content: (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="bg-slate-800 text-white size-8 rounded-full flex items-center justify-center font-bold">1</div>
                        <span className="font-bold text-slate-700">Turnos de los Jugadores</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="bg-slate-800 text-white size-8 rounded-full flex items-center justify-center font-bold">2</div>
                        <span className="font-bold text-slate-700">Minijuego y Recompensas</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="bg-slate-800 text-white size-8 rounded-full flex items-center justify-center font-bold">3</div>
                        <span className="font-bold text-slate-700">Rotación del Elegido</span>
                    </div>
                </div>
            )
        },
        {
            id: 5,
            title: "V. Fases de una Ronda (Detalle)",
            icon: "list_alt",
            color: "text-red-600",
            bg: "bg-red-50",
            content: (
                <div className="space-y-6 text-sm text-slate-600">
                    
                    {/* Phase 1 */}
                    <div>
                        <h4 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                            <span className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">1</span> Turnos de los Jugadores
                        </h4>
                        <p className="mb-2">El Elegido empieza. Lanza el dado para saber cuántas acciones tienes. Las acciones disponibles son:</p>
                        <ul className="space-y-2">
                            <li className="bg-white p-2 rounded border border-slate-200">
                                <span className="font-bold text-green-600 block">Comprar Poder (2 acciones)</span>
                                Toma una carta de Poder de la pila.
                            </li>
                            <li className="bg-white p-2 rounded border border-slate-200">
                                <span className="font-bold text-yellow-600 block">Usar Poder (1 acción)</span>
                                Activa un Poder de tu mano y descártalo.
                            </li>
                            <li className="bg-white p-2 rounded border border-slate-200">
                                <span className="font-bold text-purple-600 block">Cambiar Poder (1 acción)</span>
                                Descarta uno de la mano y toma otro de la pila.
                            </li>
                            <li className="bg-white p-2 rounded border border-slate-200">
                                <span className="font-bold text-blue-600 block">Avanzar (1 acción)</span>
                                Mueve tu ficha <u>una casilla a la vez</u>.
                            </li>
                        </ul>
                    </div>

                    {/* Phase 2 */}
                    <div>
                        <h4 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                            <span className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">2</span> Minijuego y Recompensas
                        </h4>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Revela <strong>1 carta de Minijuego</strong> y sigue sus instrucciones.</li>
                            <li>
                                Cada ganador recibe un <strong>Beneficio de la Victoria</strong>, que es <strong>1 Reliquia y 1 Plaga</strong>.
                                <span className="block text-xs text-red-500 font-bold mt-1">¡IMPORTANTE! Debes repartir el Beneficio inmediatamente como desees (puedes quedarte con ambas).</span>
                            </li>
                            <li>Si nadie gana o nadie pierde, todos pierden: Cada jugador decide si él de su derecha recibe o no 1 Plaga.</li>
                        </ul>
                        
                        <div className="mt-3 bg-slate-100 p-2 rounded text-xs">
                            <strong>Pregúntate:</strong> ¿La ronda terminó con alguien en la Meta? <br/>
                            Si <strong>NO</strong> → Rotación del Elegido. <br/>
                            Si <strong>SÍ</strong> → Fin del Juego.
                        </div>
                    </div>

                    {/* Phase 3 */}
                    <div>
                        <h4 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                            <span className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">3</span> Rotación del Elegido
                        </h4>
                        <p>El Símbolo del Elegido pasa al jugador de la derecha. Una nueva ronda empieza con el nuevo Elegido como primer jugador.</p>
                    </div>
                </div>
            )
        },
        {
            id: 6,
            title: "VI. Fin del Juego",
            icon: "flag",
            color: "text-slate-900",
            bg: "bg-slate-200",
            content: (
                <div className="space-y-4 text-sm text-slate-600">
                    <p>La primera vez que una ronda acabe y al menos 1 jugador termine en la Meta, el juego termina.</p>
                    <p className="bg-green-50 text-green-700 p-2 rounded border border-green-200 font-bold text-center">Quienes terminen en la Meta, ganarán 1 Reliquia.</p>
                    <p>Todos revelan su Pacto Divino y suman cuántos puntos alcanzaron dependiendo de su Pacto:</p>

                    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                        <table className="w-full text-center text-xs">
                            <thead>
                                <tr className="bg-slate-100 text-slate-700">
                                    <th className="p-2">Pacto</th>
                                    <th className="p-2 bg-cyan-50 text-cyan-700">Reliquia</th>
                                    <th className="p-2 bg-purple-50 text-purple-700">Plaga</th>
                                    <th className="p-2 bg-yellow-50 text-yellow-700">Poder</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                <tr>
                                    <td className="p-2 font-bold text-yellow-600">Atenea</td>
                                    <td className="p-2 font-bold">+3</td>
                                    <td className="p-2 font-bold text-red-500">-1</td>
                                    <td className="p-2 text-slate-400">/</td>
                                </tr>
                                <tr>
                                    <td className="p-2 font-bold text-green-600">Loki</td>
                                    <td className="p-2 font-bold">+2</td>
                                    <td className="p-2 font-bold text-green-600">+1</td>
                                    <td className="p-2 text-slate-400">/</td>
                                </tr>
                                <tr>
                                    <td className="p-2 font-bold text-cyan-600">Longwang</td>
                                    <td className="p-2 font-bold">+2</td>
                                    <td className="p-2 font-bold text-red-500">-1</td>
                                    <td className="p-2 font-bold">+1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg text-xs italic">
                        <strong>Ejemplo Atenea:</strong> 5 Reliquias (15 pts) + 5 Plagas (-5 pts) + 1 Poder (0 pts) = <strong>10 Puntos</strong>.
                    </div>
                </div>
            )
        },
        {
            id: 7,
            title: "VII. Preguntas Frecuentes",
            icon: "contact_support",
            color: "text-pink-600",
            bg: "bg-pink-50",
            content: (
                <div className="space-y-4 text-sm text-slate-600">
                     <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                            1. ¿Podemos jugar completamente en equipos?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <p className="mt-2 text-xs bg-white p-2 rounded border border-slate-100">
                            ¡Sí! Pueden formar dos grupos fijos. Los Minijuegos Especiales no están disponibles. El Pacto con Loki no está disponible.
                        </p>
                    </details>
                    
                    <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                            2. ¿Qué significa ser El Elegido?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <p className="mt-2 text-xs bg-white p-2 rounded border border-slate-100">
                            Es el primero de la ronda. Decide el orden de los jugadores, forma equipos y resuelve cualquier situación no prevista en el juego.
                        </p>
                    </details>

                     <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                            3. ¿Las acciones se guardan?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <p className="mt-2 text-xs bg-white p-2 rounded border border-slate-100">
                            No. Las acciones o movimientos sin usar se pierden.
                        </p>
                    </details>

                    <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                            4. ¿Cómo se reciben o entregan fichas?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <ul className="mt-2 text-xs bg-white p-2 rounded border border-slate-100 list-disc pl-4">
                            <li><strong>Ganar/Tomar:</strong> Recibes del banco o de la pila.</li>
                            <li><strong>Perder/Descartar:</strong> Entregas al banco o a la pila.</li>
                            <li><strong>Robar:</strong> Recibes de un jugador.</li>
                        </ul>
                    </details>
                    
                    <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                            5. ¿Me puedo elegir como objetivo?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <p className="mt-2 text-xs bg-white p-2 rounded border border-slate-100">
                            Si la carta dice "Cualquiera", sí puedes. Si dice "Otro jugador" o "Adversario", no.
                        </p>
                    </details>

                    <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                             6. ¿Cuándo se usa "Declaro Que No"?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <p className="mt-2 text-xs bg-white p-2 rounded border border-slate-100">
                            Puede usarse en el turno de <strong>cualquier</strong> jugador. Evita el objetivo del efecto que se planea cancelar (incluso si el escudo se activó turnos atrás).
                        </p>
                    </details>

                     <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                             7. ¿Cuándo se activan las Casillas Especiales?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <p className="mt-2 text-xs bg-white p-2 rounded border border-slate-100">
                            Al <strong>caer o pasar</strong> por ellas, se activan inmediatamente. Si un Oráculo te regresa, no activas casilla especial hasta que regreses a donde estabas.
                        </p>
                    </details>

                     <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                             8. ¿Puedo quedarme con el Beneficio de Victoria?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <p className="mt-2 text-xs bg-white p-2 rounded border border-slate-100">
                            No. El Beneficio (1 Reliquia y 1 Plaga) debe repartirse antes de que termine la ronda. Puedes quedarte con la Plaga si deseas.
                        </p>
                    </details>

                    <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                             9. ¿Somos 5 jugadores y sale un Minijuego en Equipo?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <p className="mt-2 text-xs bg-white p-2 rounded border border-slate-100">
                            El Elegido se convierte en <strong>El Apostador</strong>. En lugar de jugar, apostará quién será uno de los ganadores. Si acierta, gana 1 Poder. Si falla, pierde 1 Poder (o gana 1 Plaga si no tiene Poderes).
                            <br/>Alternativa: Juegan sin Minijuegos en Equipo.
                        </p>
                    </details>

                    <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                             10. ¿Qué pasa si alguien revela su Pacto?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <p className="mt-2 text-xs bg-white p-2 rounded border border-slate-100">
                            Esto puede afectar la experiencia. Pueden aplicar una penalización de 3 puntos, o definir otra sanción por consenso.
                        </p>
                    </details>

                    <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                             11. ¿Qué pasa si hay empate al final?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <p className="mt-2 text-xs bg-white p-2 rounded border border-slate-100">
                            Pueden desempatar con el número de victorias de Minijuegos, con un Minijuego Individual o por acuerdo entre los jugadores (quien haya jugado mejor, por ejemplo).
                        </p>
                    </details>

                    <details className="group">
                        <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                             12. ¿Más información?
                            <span className="material-symbols-outlined text-slate-400 transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="mt-2 text-xs bg-white p-2 rounded border border-slate-100">
                            <p>¡Síguenos y entérate de más!</p>
                            <p className="font-bold mt-1">Instagram: @LosDiosesEstanLocos</p>
                            <p className="font-bold">Web: LosDiosesEstanLocos.com</p>
                        </div>
                    </details>

                </div>
            )
        },
    ];

    if (viewMode === 'SELECTION') {
        return (
            <div className="flex min-h-screen flex-col bg-background">
                <Header title="Reglas del Juego" showBack={true} onBack={handleBack} />
                
                <div className="flex-1 flex flex-col justify-center gap-6 p-6 pb-24">
                    <div className="text-center mb-2">
                         <h2 className="typo-h2">¿Cómo prefieres leerlas?</h2>
                         <p className="typo-body text-slate-500 mt-2">Elige el formato que mejor se adapte a tu tiempo.</p>
                    </div>

                    <button 
                        onClick={() => setViewMode('DETAILS')}
                        className="w-full bg-white rounded-3xl p-6 shadow-xl shadow-primary/5 border-2 border-primary/10 flex flex-col items-center gap-4 transition-all active:scale-[0.98] group hover:border-primary/30"
                    >
                        <div className="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <span className="material-symbols-outlined text-5xl">auto_stories</span>
                        </div>
                        <div className="text-center">
                             <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">Reglas Detalladas</h3>
                             <p className="text-sm text-slate-500 font-medium">Reglas completas paso a paso.</p>
                        </div>
                    </button>

                    <button 
                         onClick={openSummaryPdf}
                         className="w-full bg-white rounded-3xl p-6 shadow-xl shadow-orange-500/5 border-2 border-orange-500/10 flex flex-col items-center gap-4 transition-all active:scale-[0.98] group hover:border-orange-500/30"
                    >
                        <div className="size-20 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                            <span className="material-symbols-outlined text-5xl">timer</span>
                        </div>
                        <div className="text-center">
                             <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">Resumen en 1 Minuto</h3>
                             <p className="text-sm text-slate-500 font-medium">Enlace a una guía visual resumida (Imagen).</p>
                        </div>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header title="Reglas del Juego" showBack={true} onBack={handleBack} />

            <div className="flex-1 overflow-y-auto pb-24 pt-4">
                {/* ACCORDION SECTIONS */}
                <div className="px-4 flex flex-col gap-3">
                    {sections.map((section, index) => {
                        const isOpen = activeSection === section.id;
                        return (
                            <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
                                <button 
                                    onClick={() => toggleSection(section.id)}
                                    className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-slate-50' : 'bg-white'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${section.bg} ${section.color}`}>
                                            <span className="material-symbols-outlined">{section.icon}</span>
                                        </div>
                                        <span className={`font-bold text-sm ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {section.title}
                                        </span>
                                    </div>
                                    <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-500 ease-in-out`}
                                    style={{ maxHeight: isOpen ? '1000px' : '0px', opacity: isOpen ? 1 : 0 }}
                                >
                                    <div className="p-5 border-t border-slate-100 bg-white">
                                        {section.content}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};