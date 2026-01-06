import React, { useState } from 'react';
import { Button, BottomBar } from '../UI';

interface ConfigWizardProps {
    config: {
        playerCount: number;
        pactMode: string;
        nameMode: string;
    };
    onUpdate: (key: string, value: any) => void;
    onContinue: () => void;
}

export const ConfigWizard: React.FC<ConfigWizardProps> = ({ config, onUpdate, onContinue }) => {
    const [activeSection, setActiveSection] = useState<number | null>(null);

    const getPactModeLabel = (mode: string) => {
        switch(mode) {
            case 'BALANCED': return 'Principal Equilibrada';
            case 'CHAOTIC': return 'Incertidumbre Caótica';
            case 'STRATEGIC': return 'Guerra Estratégica';
            default: return mode;
        }
    };

    const AccordionSection = ({ index, title, valueLabel, children }: any) => {
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
        <div className="flex h-screen w-full flex-col bg-[#f6f5f8]">
            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
                <AccordionSection index={0} title="Cantidad" valueLabel={`${config.playerCount} Jugadores`}>
                    <div className="grid grid-cols-3 gap-3">
                        {[4, 5, 6].map(num => (
                            <button 
                                key={num}
                                onClick={() => { onUpdate('playerCount', num); setActiveSection(1); }}
                                className={`h-16 rounded-xl font-bold text-xl border-2 transition-all ${config.playerCount === num ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30'}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </AccordionSection>

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
                                    onClick={() => { onUpdate('pactMode', m.id); setActiveSection(2); }}
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

                <AccordionSection index={2} title="Nombres" valueLabel={config.nameMode === 'CUSTOM' ? 'Personalizados' : 'Aleatorios'}>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => { onUpdate('nameMode', 'CUSTOM'); setActiveSection(null); }}
                            className={`py-4 rounded-xl font-bold text-sm border-2 transition-all flex flex-col items-center gap-2 ${config.nameMode === 'CUSTOM' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white border-slate-200 text-slate-600'}`}
                        >
                            <span className="material-symbols-outlined">edit</span>
                            Personalizados
                        </button>
                        <button 
                            onClick={() => { onUpdate('nameMode', 'RANDOM'); setActiveSection(null); }}
                            className={`py-4 rounded-xl font-bold text-sm border-2 transition-all flex flex-col items-center gap-2 ${config.nameMode === 'RANDOM' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white border-slate-200 text-slate-600'}`}
                        >
                            <span className="material-symbols-outlined">shuffle</span>
                            Aleatorios
                        </button>
                    </div>
                </AccordionSection>
            </div>

            <BottomBar className="bg-white border-t border-slate-100">
                <Button fullWidth onClick={onContinue} icon="arrow_forward">
                    Continuar
                </Button>
            </BottomBar>
        </div>
    );
};