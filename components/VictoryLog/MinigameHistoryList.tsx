import React from 'react';
import { MinigameRecord, Player } from '../../types';
import { getColorStyle } from '../../utils';

interface MinigameHistoryListProps {
    history: MinigameRecord[];
    players: Player[];
    onEdit: (record: MinigameRecord) => void;
}

export const MinigameHistoryList: React.FC<MinigameHistoryListProps> = ({ history, players, onEdit }) => {
    return (
        <div className="flex flex-col gap-3" style={{scrollbarGutter: 'stable'}}>
            {history.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No hay minijuegos registrados aún.
                </div>
            ) : (
                history.map((record) => (
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
                                onClick={() => onEdit(record)}
                                className="size-8 rounded-full text-slate-400 hover:text-action hover:bg-slate-50 flex items-center justify-center transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};