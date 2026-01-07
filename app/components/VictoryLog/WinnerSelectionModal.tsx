import React from 'react';
import { Player } from '../../types';
import { getColorStyle } from '../../utils';
import { Button, PlayerName } from '../UI';

interface WinnerSelectionModalProps {
    isOpen: boolean;
    players: Player[];
    selectedWinners: string[];
    isEditing: boolean;
    onToggleWinner: (playerId: string) => void;
    onConfirm: () => void;
    onDelete: () => void;
    onClose: () => void;
}

export const WinnerSelectionModal: React.FC<WinnerSelectionModalProps> = ({
    isOpen, players, selectedWinners, isEditing, onToggleWinner, onConfirm, onDelete, onClose
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                <div className="p-5 border-b border-slate-100 bg-white text-center relative">
                    <h3 className="typo-h3 text-slate-900">{isEditing ? 'Editar Resultado' : '¿Quién Ganó el Minijuego?'}</h3>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Selecciona los ganadores de la Ronda</p>
                </div>
                
                <div className="p-5 overflow-y-auto grid grid-cols-2 gap-3 bg-[#f8fafc]">
                    {players.map(p => {
                        const isSelected = selectedWinners.includes(p.id);
                        const style = getColorStyle(p.color);
                        return (
                            <button 
                                key={p.id}
                                onClick={() => onToggleWinner(p.id)}
                                className={`relative p-3 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 h-28 shadow-sm ${isSelected ? `border-action bg-white ring-2 ring-action/20` : 'border-white bg-white hover:border-slate-200'}`}
                            >
                                <div className={`size-12 rounded-full ${style.bg} flex items-center justify-center border ${style.border} shadow-md transition-transform ${isSelected ? 'scale-110' : ''}`}>
                                    <span className={`material-symbols-outlined text-2xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                </div>
                                <span className={`text-sm font-bold truncate w-full text-center ${isSelected ? 'text-action' : 'text-slate-700'}`}>
                                    <PlayerName name={p.name} />
                                </span>
                                
                                <div className={`absolute top-2 right-2 size-5 rounded-full flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-action text-white scale-100' : 'bg-slate-100 text-slate-300 scale-0 opacity-0'}`}>
                                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
                
                <div className="p-5 border-t border-slate-100 bg-white flex flex-col gap-3">
                    <div className="flex gap-3 w-full">
                        <Button variant="ghost" className="flex-1" onClick={onClose}>Cancelar</Button>
                        <Button className="flex-[2] shadow-xl shadow-primary/20" onClick={onConfirm}>
                            {(selectedWinners.length === 0 || selectedWinners.length === players.length) ? 'No Hubo Ganadores' : 'Confirmar'}
                        </Button>
                    </div>
                    
                    {isEditing && (
                        <button 
                            onClick={onDelete} 
                            className="w-full py-3 rounded-xl text-danger font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            <span className="material-symbols-outlined icon-sm">delete</span> Eliminar este registro
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};