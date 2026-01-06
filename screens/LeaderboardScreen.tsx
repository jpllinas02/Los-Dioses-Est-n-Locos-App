import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, BottomBar, PlayerName } from '../components/UI';
import { GameColor } from '../types';
import { getColorStyle } from '../utils';
import { ROUTES } from '../constants';
import { useLeaderboard } from '../hooks/useLeaderboard';

export const LeaderboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const { 
        results, 
        winner, 
        others, 
        minigameHonor, 
        categoryHonors, 
        hasHonors, 
        getRank 
    } = useLeaderboard();

    const getHonorColorStyles = (color: GameColor) => {
        switch(color) {
            case 'red': return {
                gradient: 'from-red-50', 
                border: 'border-red-200 border-l-4 border-l-red-500', 
                bgIcon: 'bg-red-500 shadow-md shadow-red-500/30', 
                textIcon: 'text-white',
                textTitle: 'text-red-900',
                badge: 'bg-white border border-red-200 text-red-700'
            };
            case 'blue': return {
                gradient: 'from-blue-50', 
                border: 'border-blue-200 border-l-4 border-l-blue-500', 
                bgIcon: 'bg-blue-500 shadow-md shadow-blue-500/30', 
                textIcon: 'text-white',
                textTitle: 'text-blue-900',
                badge: 'bg-white border border-blue-200 text-blue-700'
            };
            case 'green': return {
                gradient: 'from-green-50', 
                border: 'border-green-200 border-l-4 border-l-green-500', 
                bgIcon: 'bg-green-500 shadow-md shadow-green-500/30', 
                textIcon: 'text-white',
                textTitle: 'text-green-900',
                badge: 'bg-white border border-green-200 text-green-700'
            };
            case 'yellow': return {
                gradient: 'from-yellow-50', 
                border: 'border-yellow-200 border-l-4 border-l-yellow-400', 
                bgIcon: 'bg-yellow-400 shadow-md shadow-yellow-400/30', 
                textIcon: 'text-white',
                textTitle: 'text-yellow-800',
                badge: 'bg-white border border-yellow-200 text-yellow-700'
            };
            case 'black': return {
                gradient: 'from-slate-100', 
                border: 'border-slate-300 border-l-4 border-l-slate-900', 
                bgIcon: 'bg-slate-900 shadow-md shadow-slate-900/30', 
                textIcon: 'text-white',
                textTitle: 'text-slate-900',
                badge: 'bg-white border border-slate-300 text-slate-800'
            };
            case 'white': return {
                gradient: 'from-slate-50', 
                border: 'border-slate-200 border-l-4 border-l-slate-400', 
                bgIcon: 'bg-white border border-slate-200', 
                textIcon: 'text-slate-500', 
                textTitle: 'text-slate-600',
                badge: 'bg-slate-50 border border-slate-200 text-slate-600'
            };
            default: return {
                gradient: 'from-slate-50',
                border: 'border-slate-100 border-l-4 border-l-slate-400',
                bgIcon: 'bg-slate-100',
                textIcon: 'text-slate-500',
                textTitle: 'text-slate-600',
                badge: 'bg-slate-100 text-slate-500'
            };
        }
    };

    if (results.length === 0) {
        return (
            <div className="flex min-h-screen flex-col bg-background items-center justify-center p-6 text-center">
                 <h2 className="typo-h2">No hay resultados aún</h2>
                 <p className="typo-body mb-4">Termina una partida para ver la tabla.</p>
                 <Button onClick={()=>navigate(ROUTES.GAME)}>Volver al Juego</Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header title="Resultados Finales" actionIcon="share" />
            <div className="flex-1 overflow-y-auto pb-32 relative">
                {/* ... Winner/Leaderboard UI ... */}
                 <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>
                 <div className="relative z-10 pt-4 pb-2 px-4 text-center mt-6">
                    <h1 className="typo-h1">
                        ¡Campeón Supremo!
                    </h1>
                 </div>

                 {winner && (
                     <div className="p-4 relative z-10">
                         <div className="flex flex-col items-center justify-center rounded-2xl shadow-lg bg-white border-2 border-primary overflow-hidden relative p-6">
                            <div className="absolute top-3 right-3 animate-bounce">
                                <span className="material-symbols-outlined text-yellow-500 text-4xl filled" style={{fontVariationSettings: "'FILL' 1"}}>crown</span>
                            </div>
                            <div className={`w-32 h-32 rounded-full border-4 shadow-md flex items-center justify-center mb-4 ${getColorStyle(winner.color).bg}`}>
                                <span className={`material-symbols-outlined text-7xl ${winner.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                            </div>
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold mb-2">
                                {getRank(0) === 1 ? '1er Lugar' : `${getRank(0)}º Lugar`}
                            </div>
                            <p className="typo-h2">
                                <PlayerName name={winner.name} />
                            </p>
                            <p className="text-text-muted text-sm font-medium">Pacto: <span className="font-bold text-slate-800">{winner.pact}</span></p>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-4xl font-extrabold text-primary">{winner.score}</span>
                                <span className="text-lg font-medium text-text-muted">PTS</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 w-full mt-4 bg-slate-50 p-2 rounded-xl">
                                <div className="text-center">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Reliquias</span>
                                    <span className="font-bold text-cyan-600">{winner.scoreDetails?.relics || 0}</span>
                                </div>
                                <div className="text-center border-l border-slate-200">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Plagas</span>
                                    <span className="font-bold text-purple-600">{winner.scoreDetails?.plagues || 0}</span>
                                </div>
                                <div className="text-center border-l border-slate-200">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Poderes</span>
                                    <span className="font-bold text-yellow-600">{winner.scoreDetails?.powers || 0}</span>
                                </div>
                            </div>
                         </div>
                     </div>
                 )}

                 <div className="px-4 mt-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="grid grid-cols-[3rem_1fr_4rem] bg-slate-50 border-b border-slate-200 py-2 px-3">
                             <div className="text-xs font-bold text-slate-400 uppercase text-center">Pos</div>
                             <div className="text-xs font-bold text-slate-400 uppercase text-left pl-2">Jugador</div>
                             <div className="text-xs font-bold text-slate-400 uppercase text-right">Pts</div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {others.map((p, i) => {
                                const overallIndex = i + 1; // 0 is winner
                                const rank = getRank(overallIndex);
                                return (
                                <div key={p.id} className="grid grid-cols-[3rem_1fr_4rem] items-center py-3 px-3">
                                    <div className="flex justify-center">
                                        <div className="flex size-7 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-sm border border-slate-200">{rank}</div>
                                    </div>
                                    <div className="flex items-center gap-3 pl-2 overflow-hidden">
                                        <div className={`size-9 rounded-full flex items-center justify-center shadow-sm shrink-0 border ${getColorStyle(p.color).border} ${getColorStyle(p.color).bg}`}>
                                            <span className={`material-symbols-outlined text-lg ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-slate-900 font-bold text-sm truncate">
                                                <PlayerName name={p.name} />
                                            </p>
                                            <p className="text-slate-400 text-xs truncate">Pacto: {p.pact}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-900 font-bold text-lg">{p.score}</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                 </div>

                 {hasHonors && (
                    <div className="px-4 mt-8 mb-4">
                        <h3 className="text-center typo-h3 mb-4 text-slate-500">Menciones Honoríficas</h3>
                        <div className="grid gap-3">
                            {minigameHonor && (
                                <div className={`bg-gradient-to-r ${getHonorColorStyles(minigameHonor.player.color).gradient} to-white p-4 rounded-xl border ${getHonorColorStyles(minigameHonor.player.color).border} flex items-center gap-4 shadow-sm`}>
                                    <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${getHonorColorStyles(minigameHonor.player.color).bgIcon} ${getHonorColorStyles(minigameHonor.player.color).textIcon}`}>
                                        <span className="material-symbols-outlined text-2xl">{minigameHonor.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <p className={`text-xs font-bold uppercase tracking-wider ${getHonorColorStyles(minigameHonor.player.color).textTitle}`}>{minigameHonor.title}</p>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getHonorColorStyles(minigameHonor.player.color).badge}`}>{minigameHonor.count} {minigameHonor.count === 1 ? 'Victoria' : 'Victorias'}</span>
                                        </div>
                                        <p className="font-bold text-slate-900 text-lg">
                                            <PlayerName name={minigameHonor.player.name} />
                                        </p>
                                    </div>
                                </div>
                            )}
                            {categoryHonors.map((honor) => (
                                <div key={honor.id} className={`bg-gradient-to-r ${getHonorColorStyles(honor.player.color).gradient} to-white p-4 rounded-xl border ${getHonorColorStyles(honor.player.color).border} flex items-center gap-4 shadow-sm`}>
                                    <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${getHonorColorStyles(honor.player.color).bgIcon} ${getHonorColorStyles(honor.player.color).textIcon}`}>
                                        <span className="material-symbols-outlined text-2xl">{honor.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                         <div className="flex justify-between items-baseline">
                                            <p className={`text-xs font-bold uppercase tracking-wider ${getHonorColorStyles(honor.player.color).textTitle}`}>{honor.title}</p>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getHonorColorStyles(honor.player.color).badge}`}>{honor.count} {honor.count === 1 ? 'Voto' : 'Votos'}</span>
                                        </div>
                                        <p className="font-bold text-slate-900 text-lg">
                                            <PlayerName name={honor.player.name} />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
            </div>
            
            <BottomBar className="bg-white border-t border-slate-100">
                <Button variant="outline" className="flex-1" icon="home" onClick={()=>navigate(ROUTES.HOME)}>Inicio</Button>
                <Button className="flex-[2]" onClick={()=>navigate(ROUTES.REGISTRATION)} icon="replay">Nueva Partida</Button>
            </BottomBar>
        </div>
    );
};