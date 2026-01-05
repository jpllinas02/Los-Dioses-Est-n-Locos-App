import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button } from '../components/UI';

export const AppGuideScreen: React.FC = () => {
    const navigate = useNavigate();
    const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);

    const guideSteps = [
        {
            icon: 'person_add',
            color: 'text-primary',
            bg: 'bg-primary/10',
            border: 'border-primary/20',
            title: '1. Configura la Partida',
            desc: 'Registra a los jugadores. La app asignará sus Pactos (roles) de forma secreta o pública según la modalidad.',
            detailsTitle: 'Antes de Empezar',
            features: [
                'Elige entre 4, 5 o 6 jugadores.',
                'Selecciona la Modalidad: Define cómo se reparten los roles (Equilibrada, Caótica o Guerra Estratégica).',
                'Nombres: Puedes escribirlos manualmente o dejar que la app genere nombres divertidos al azar.',
                'Al finalizar, pasa el dispositivo a cada jugador para que descubran su Pacto Secreto (si la modalidad lo requiere).'
            ]
        },
        {
            icon: 'style',
            color: 'text-purple-600',
            bg: 'bg-purple-100',
            border: 'border-purple-200',
            title: '2. Mazos Digitales',
            desc: '¿Sin cartas a la mano? Usa el selector de "Minijuegos" y "Oráculos" para sacar cartas virtuales aleatorias.',
            detailsTitle: 'Reemplazo de Cartas Físicas',
            features: [
                'Minijuegos: Filtra por tipo (Individual, Equipo, Especial) si quieres practicar una categoría específica.',
                'La app baraja automáticamente cuando se acaban las cartas.',
                'Oráculo: Genera cartas de efecto Favorable, Desfavorable o Neutral al azar.',
                'Puedes leer la descripción completa de la carta haciendo scroll dentro de la tarjeta.'
            ]
        },
        {
            icon: 'timer',
            color: 'text-teal-600',
            bg: 'bg-teal-100',
            border: 'border-teal-200',
            title: '3. Herramientas',
            desc: 'Usa el Cronómetro para medir los tiempos de los retos y el Selector de Destinos para elegir jugadores al azar.',
            detailsTitle: 'Utilidades de Apoyo',
            features: [
                'Cronómetro: Úsalo en modo "Cuenta Regresiva" para los retos con límite de tiempo, o "Cronómetro" libre.',
                'Selector de Destinos: Elige un jugador al azar para efectos de cartas o desempates.',
                'Destino Secreto: En el selector, puedes usar el modo "Secreto" para que cada jugador mire su pantalla y solo uno sepa que fue elegido (útil para roles de asesino, etc).',
                'Puedes excluir jugadores del sorteo tocando su cara.'
            ]
        },
        {
            icon: 'emoji_events',
            color: 'text-orange-600',
            bg: 'bg-orange-100',
            border: 'border-orange-200',
            title: '4. Bitácora de Victoria',
            desc: '¡Crucial! Registra quién gana cada Minijuego. La app lleva el conteo para las estadísticas finales.',
            detailsTitle: 'Historial de la Partida',
            features: [
                'Después de cada Minijuego, ve a la Bitácora y marca quiénes ganaron.',
                'Esto es importante para generar las estadísticas finales y otorgar títulos honoríficos.',
                'Votaciones: Al final (o durante el juego), pueden votar por quién es el "Más Mentiroso" o "Más Estratega".',
                'Puedes editar o eliminar registros si te equivocaste de ganador.'
            ]
        },
        {
            icon: 'calculate',
            color: 'text-slate-700',
            bg: 'bg-slate-200',
            border: 'border-slate-300',
            title: '5. Ganador Automático',
            desc: 'Al final, ingresa las Reliquias, Plagas y Poderes de cada uno. La app calculará el puntaje y revelará al campeón.',
            detailsTitle: 'Cálculo Final',
            features: [
                'Ve a la pantalla de Calculadora para terminar la partida.',
                'Ingresa cuántas fichas (Reliquias, Plagas, Poderes) tiene cada jugador en su tablero.',
                'La app aplicará la fórmula matemática única de cada Pacto (Atenea, Loki, Longwang) automáticamente.',
                'Se mostrará una tabla de posiciones y se revelarán los roles de todos.'
            ]
        }
    ];

    // --- RENDER: DETAIL VIEW ---
    if (selectedStepIndex !== null) {
        const step = guideSteps[selectedStepIndex];
        return (
            <div className="flex min-h-screen flex-col bg-white animate-fade-in">
                <Header 
                    title={step.title.split('. ')[1]} // Remove number for cleaner header
                    showBack={true} 
                    onBack={() => setSelectedStepIndex(null)} 
                />
                
                <div className="flex-1 overflow-y-auto pb-24">
                    {/* Hero Section */}
                    <div className={`w-full py-10 px-6 flex flex-col items-center justify-center text-center ${step.bg} border-b ${step.border}`}>
                        <div className={`size-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 animate-pop-in`}>
                            <span className={`material-symbols-outlined text-5xl ${step.color.replace('text-', 'text-')}`}>{step.icon}</span>
                        </div>
                        <h2 className={`typo-h2 ${step.color.replace('text-', 'text-').replace('600', '900')}`}>{step.detailsTitle}</h2>
                    </div>

                    {/* Features List */}
                    <div className="p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Lo que puedes hacer</h3>
                        <div className="flex flex-col gap-4">
                            {step.features.map((feature, i) => (
                                <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className={`mt-0.5 size-6 rounded-full ${step.bg} flex items-center justify-center shrink-0`}>
                                        <span className={`text-xs font-bold ${step.color}`}>{i + 1}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        {feature}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-20">
                    <Button fullWidth onClick={() => setSelectedStepIndex(null)}>
                        Volver a la Guía
                    </Button>
                </div>
            </div>
        );
    }

    // --- RENDER: MAIN LIST VIEW ---
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header title="Guía Rápida" showBack={true} onBack={() => navigate('/')} />
            
            <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
                <div className="text-center mb-8">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg mb-4 rotate-3">
                        <span className="material-symbols-outlined text-4xl">smartphone</span>
                    </div>
                    <h2 className="typo-h2 text-slate-900 mb-2">Tu Asistente de Juego</h2>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                        Toca cualquier paso para ver en detalle cómo usar las funciones de la aplicación.
                    </p>
                </div>

                <div className="flex flex-col gap-5 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-slate-100 z-0"></div>

                    {guideSteps.map((step, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setSelectedStepIndex(idx)}
                            className="relative z-10 flex gap-4 items-stretch group text-left transition-transform active:scale-[0.98]"
                        >
                            <div className={`shrink-0 size-14 rounded-full ${step.bg} ${step.color} flex items-center justify-center border-4 border-white shadow-sm group-hover:scale-110 transition-transform relative z-10`}>
                                <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                            </div>
                            <div className="flex-1 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{step.title}</h3>
                                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    {step.desc}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-20">
                <Button fullWidth onClick={() => navigate('/registration')}>
                    ¡Entendido, a Jugar!
                </Button>
            </div>
        </div>
    );
};