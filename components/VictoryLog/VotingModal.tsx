import React from 'react';
import { Player } from '../../types';
import { VOTE_CATEGORIES } from '../../constants';
import { getColorStyle } from '../../utils';
import { Button, PlayerName } from '../UI';

interface VotingModalProps {
    isOpen: boolean;
    activeCategory: string | null;
    players: Player[];
    totalVotes: number;
    justVotedId: string | null;
    isClearingVotes: boolean;
    onVote: (playerId: string) => void;
    onClear: () => void;
    onClose: () => void;
}

export const VotingModal: React.FC<VotingModalProps> = ({ 
    isOpen, activeCategory, players, totalVotes, justVotedId, isClearingVotes, onVote, onClear, onClose 
}) => {
    if (!isOpen) return null;

    const categoryInfo = VOTE_CATEGORIES.find(c => c.id === activeCategory);
    const modalTitle = categoryInfo?.modalTitle || 'Votación';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isClearingVotes && onClose()}></div>
            <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-float">
                    
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
                    <h3 className="typo-h3 text-slate-900">{modalTitle}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wide">
                        ({totalVotes} {totalVotes === 1 ? 'voto recibido' : 'votos recibidos'})
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
                                onClick={() => onVote(p.id)}
                                disabled={justVotedId !== null || isClearingVotes}
                                className={`relative p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 h-28 shadow-sm active:scale-95 overflow-hidden ${isJustVoted ? 'bg-green-50 border-green-500 scale-105' : 'border-white bg-white hover:border-slate-200'}`}
                            >
                                {isJustVoted ? (
                                    <div className="flex flex-col items-center justify-center w-full h-full animate-pop-in">
                                        <div className="size-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg mb-2 border-4 border-white">
                                            <span className="material-symbols-outlined text-3xl font-bold">check</span>
                                        </div>
                                        <span className="text-green-600 font-bold text-sm animate-pulse">¡Voto!</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`size-12 rounded-full ${style.bg} flex items-center justify-center border ${style.border} shadow-md transition-transform`}>
                                            <span className={`material-symbols-outlined text-2xl ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                        </div>
                                        <div className="w-full text-center relative z-10">
                                            <span className="block text-sm font-bold truncate w-full text-slate-700">
                                                <PlayerName name={p.name} />
                                            </span>
                                        </div>
                                    </>
                                )}
                            </button>
                        )
                        })}
                </div>
                <div className="p-5 border-t border-slate-100 bg-white flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={isClearingVotes}>Cancelar</Button>
                    
                    <button 
                        onClick={onClear} 
                        disabled={isClearingVotes}
                        className="flex-1 py-3 rounded-xl text-danger font-bold text-sm hover:bg-red-50 border border-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined icon-sm">delete</span> Borrar votos
                    </button>
                </div>
            </div>
        </div>
    );
};