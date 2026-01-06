import React from 'react';
import { Button } from '../UI';
import { Player } from '../../types';
import { PlayerList } from './PlayerList';

interface ReviewModalProps {
    isOpen: boolean;
    players: Player[];
    config: { playerCount: number; pactMode: string };
    onClose: () => void;
    onConfirm: () => void;
    onAddPlayer: () => void;
    // Edit props pass-through
    editingId: string | null;
    onEdit: (p: Player) => void;
    onSave: (id: string, data: any) => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
    isOpen, players, config, onClose, onConfirm, onAddPlayer,
    editingId, onEdit, onSave, onCancel, onDelete
}) => {
    if (!isOpen) return null;

    const isStrategic = config.pactMode === 'STRATEGIC';
    const isLocked = editingId !== null || players.length < 4 || players.length > 6;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => !editingId && onClose()}></div>
             <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                <div className="p-6 border-b border-slate-100 bg-white text-center">
                    <h3 className="typo-h3 text-slate-900">Lista de Jugadores</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc]">
                    <PlayerList 
                        players={players}
                        editingId={editingId}
                        onEdit={onEdit}
                        onSave={onSave}
                        onCancel={onCancel}
                        onDelete={onDelete}
                        isStrategicMode={isStrategic}
                    />
                </div>

                <div className="p-6 border-t border-slate-100 bg-white flex flex-col gap-3 relative z-20">
                    <p className="text-center text-xs text-slate-400 mb-2">
                        {players.length < 4 ? 'Mínimo 4 jugadores requeridos' : '¿Todo listo para empezar el juego?'}
                    </p>
                    
                    <Button 
                        fullWidth 
                        onClick={onConfirm} 
                        disabled={isLocked}
                        className={`shadow-xl shadow-primary/20 transition-all ${isLocked ? 'opacity-50 grayscale' : ''}`}
                        icon="play_arrow"
                    >
                        Confirmar y Jugar
                    </Button>
                    
                    <Button 
                        fullWidth 
                        variant="secondary"
                        onClick={onAddPlayer}
                        disabled={editingId !== null || players.length >= 6}
                        className={`shadow-xl shadow-secondary/20 transition-all ${editingId !== null || players.length >= 6 ? 'opacity-50 grayscale' : ''}`}
                        icon="person_add"
                    >
                        Añadir Jugador
                    </Button>

                    <button 
                        onClick={onClose}
                        className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};