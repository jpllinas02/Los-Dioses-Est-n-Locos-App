import React, { useEffect, useState } from 'react';
import { Player, PactType } from '../../types';
import { GAME_COLORS, getColorStyle } from '../../utils';
import { PlayerName } from '../UI';

interface PlayerListProps {
    players: Player[];
    editingId: string | null;
    onEdit: (player: Player) => void;
    // Props for editing form
    onSave: (id: string, data: any) => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
    isStrategicMode: boolean;
}

export const PlayerList: React.FC<PlayerListProps> = ({ 
    players, editingId, onEdit, onSave, onCancel, onDelete, isStrategicMode 
}) => {
    // Local state for the inline editing form
    const [editForm, setEditForm] = useState({ name: '', color: '', pact: '' });

    // Sync form when editingId changes
    useEffect(() => {
        if (editingId) {
            const p = players.find(pl => pl.id === editingId);
            if (p) {
                setEditForm({ name: p.name, color: p.color, pact: p.pact });
                // Auto scroll
                const element = document.getElementById(`player-card-${editingId}`);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [editingId, players]);

    const handleSave = () => {
        if (editingId) {
            onSave(editingId, editForm);
        }
    };

    const pactDetails: Record<string, any> = {
        'Atenea': { icon: 'school', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
        'Loki': { icon: 'theater_comedy', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
        'Longwang': { icon: 'tsunami', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    };

    if (players.length === 0) {
        return <p className="text-center text-slate-400 py-8">No hay jugadores</p>;
    }

    return (
        <div className="flex flex-col gap-3 pb-4">
            {players.map(p => {
                const isEditing = editingId === p.id;
                
                if (isEditing) {
                    const isNameDuplicate = players.some(other => other.id !== p.id && other.name.trim().toLowerCase() === editForm.name.trim().toLowerCase());

                    return (
                        <div key={p.id} id={`player-card-${p.id}`} className="bg-white rounded-2xl p-4 shadow-lg border-2 border-primary animate-slide-down">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Editando</span>
                            </div>
                            
                            <div className="relative mb-4">
                                <input 
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && !isNameDuplicate && handleSave()}
                                    className={`w-full bg-slate-50 border-2 rounded-xl h-12 px-4 font-bold text-lg outline-none transition-colors text-slate-900 ${isNameDuplicate ? 'border-red-400 focus:border-red-500' : 'border-primary'}`}
                                    placeholder="Nombre"
                                    autoFocus
                                />
                                {isNameDuplicate && (
                                    <span className="text-red-500 text-[10px] font-bold absolute -bottom-4 left-1">Nombre ya usado</span>
                                )}
                            </div>
                            
                            {/* Color Selector */}
                            <div className="flex justify-between items-center mb-6 px-1">
                                {GAME_COLORS.map((c) => {
                                    const isTaken = players.some(existing => existing.color === c.id && existing.id !== p.id);
                                    return (
                                        <button 
                                            key={c.id}
                                            onClick={() => !isTaken && setEditForm(prev => ({ ...prev, color: c.id }))}
                                            disabled={isTaken}
                                            className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center transition-all relative border ${c.border || 'border-transparent'} ${editForm.color === c.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''} ${isTaken ? 'opacity-30' : 'hover:scale-105'}`}
                                        >
                                            {editForm.color === c.id && <span className={`material-symbols-outlined text-xs ${c.checkColor || 'text-white'} font-bold`}>check</span>}
                                            {isTaken && <div className={`absolute w-[140%] h-[2px] ${c.line} rotate-[-45deg]`}></div>}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Pact Selector (Strategic) */}
                            {isStrategicMode && (
                                <div className="mb-6">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Pacto Divino</span>
                                    <div className="grid grid-cols-3 gap-2 w-full">
                                        {(['Atenea', 'Loki', 'Longwang'] as PactType[]).map(pact => {
                                            const details = pactDetails[pact];
                                            const isSelected = editForm.pact === pact;
                                            return (
                                                <button
                                                    key={pact}
                                                    onClick={() => setEditForm(prev => ({...prev, pact}))}
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

                            <div className="flex gap-2">
                                <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-500 text-sm hover:bg-slate-200 transition-colors">Cancelar</button>
                                <button 
                                    onClick={handleSave} 
                                    disabled={isNameDuplicate || !editForm.name.trim()}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-md transition-colors ${isNameDuplicate || !editForm.name.trim() ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#330df2] text-white hover:bg-[#280bc4]'}`}
                                >
                                    Guardar
                                </button>
                            </div>

                            <button onClick={() => onDelete(p.id)} className="w-full mt-3 py-3 rounded-xl border border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined icon-sm">delete</span> Eliminar Jugador
                            </button>
                        </div>
                    );
                }

                const pStyle = getColorStyle(p.color);
                return (
                    <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-full ${pStyle.bg} flex items-center justify-center border ${pStyle.border || 'border-transparent'}`}>
                                <span className={`material-symbols-outlined text-xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900"><PlayerName name={p.name} /></span>
                                <span className={`text-xs ${isStrategicMode ? pactDetails[p.pact].color + ' font-bold' : 'text-slate-400'}`}>
                                    {isStrategicMode ? p.pact : 'Pacto Secreto'}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => onEdit(p)} disabled={editingId !== null} className="text-slate-300 hover:text-primary p-2 transition-colors disabled:opacity-30">
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                    </div>
                )
            })}
        </div>
    );
};