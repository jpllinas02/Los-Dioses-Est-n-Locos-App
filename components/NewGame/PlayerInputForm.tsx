import React, { useRef, useEffect } from 'react';
import { GAME_COLORS } from '../../utils';
import { PactType, Player, GameColor } from '../../types';

interface PlayerInputFormProps {
    tempInput: { name: string; color: GameColor; pact: PactType };
    setTempInput: React.Dispatch<React.SetStateAction<{ name: string; color: GameColor; pact: PactType }>>;
    onSubmit: () => void;
    errors: { name?: string; color?: string };
    usedColors: string[];
    isStrategicMode: boolean;
}

export const PlayerInputForm: React.FC<PlayerInputFormProps> = ({ 
    tempInput, setTempInput, onSubmit, errors, usedColors, isStrategicMode 
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto focus on mount
    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
        }
    };

    const pactDetails: Record<string, any> = {
        'Atenea': { icon: 'school', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
        'Loki': { icon: 'theater_comedy', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
        'Longwang': { icon: 'tsunami', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    };

    return (
        <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
            <h3 className="typo-h3 mb-4">Nombre del Jugador</h3>
            <div className="relative mb-6">
                <input 
                    ref={inputRef}
                    value={tempInput.name}
                    onChange={(e) => setTempInput(prev => ({ ...prev, name: e.target.value }))}
                    onKeyDown={handleKeyDown}
                    className={`w-full bg-slate-50 border-2 rounded-xl h-14 px-4 pl-12 font-bold text-lg outline-none transition-colors ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-primary'}`}
                    placeholder="Escribe aquí..."
                    autoFocus
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
            </div>
            
            <h3 className="typo-h3 mb-4">Color de Ficha</h3>
            <div className="flex justify-between items-center px-1 mb-6">
                {GAME_COLORS.map((c) => {
                    const isTaken = usedColors.includes(c.id) && c.id !== tempInput.color; // Don't disable selected
                    return (
                        <button 
                            key={c.id}
                            onClick={() => !isTaken && setTempInput(prev => ({ ...prev, color: c.id }))}
                            disabled={isTaken}
                            className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center transition-all relative ${tempInput.color === c.id ? 'ring-4 ring-offset-2 ring-slate-200 scale-110' : ''} ${isTaken ? 'opacity-30' : 'hover:scale-105'} border ${c.border || 'border-transparent'}`}
                        >
                            {tempInput.color === c.id && <span className={`material-symbols-outlined text-base ${c.checkColor || 'text-white'}`}>check</span>}
                            {isTaken && <div className={`absolute w-[140%] h-[2px] ${c.line} rotate-[-45deg]`}></div>}
                        </button>
                    );
                })}
            </div>

            {isStrategicMode && (
                <div className="animate-fade-in">
                    <h3 className="typo-h3 mb-4">Pacto Divino</h3>
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {(['Atenea', 'Loki', 'Longwang'] as PactType[]).map(pact => {
                            const details = pactDetails[pact];
                            const isSelected = tempInput.pact === pact;
                            return (
                                <button
                                    key={pact}
                                    onClick={() => setTempInput(prev => ({ ...prev, pact }))}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${isSelected ? `${details.bg} ${details.border} ring-2 ring-offset-1 ring-slate-300` : 'bg-white border-slate-100 hover:border-slate-200'} active:scale-95`}
                                >
                                    <span className={`material-symbols-outlined text-2xl mb-1 ${details.color}`}>{details.icon}</span>
                                    <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>{pact}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {(errors.name || errors.color) && (
                <p className="text-red-500 text-xs font-bold mt-4 text-center animate-pulse">
                    {errors.name || errors.color}
                </p>
            )}
        </div>
    );
};