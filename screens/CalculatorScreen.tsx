import React from 'react';
import { Header, Button, BottomBar, PlayerName } from '../components/UI';
import { getColorStyle } from '../utils';
import { useCalculator } from '../hooks/useCalculator';

export const CalculatorScreen: React.FC = () => {
    const { 
        players, 
        currentPlayer, 
        currentPlayerIndex, 
        currentStats, 
        stats, 
        ui, 
        actions 
    } = useCalculator();

    let mainButtonText = "Siguiente";
    let mainButtonIcon = "arrow_forward";

    if (ui.isEditingFromSummary) {
        mainButtonText = "Guardar y Volver";
        mainButtonIcon = "check";
    } else if (currentPlayerIndex === players.length - 1) {
        mainButtonText = "Finalizar";
        mainButtonIcon = "list_alt";
    }

    if (players.length === 0) return <div className="flex h-screen items-center justify-center">Cargando...</div>;

    const playerStyle = getColorStyle(currentPlayer.color);

    return (
        <div className="flex min-h-screen flex-col bg-background">
             <Header 
                title={ui.showFinalSummary ? "Resumen Final" : "Calculadora"} 
                showBack={true} 
                onBack={actions.handleBackArrow}
             />
            
            {!ui.showFinalSummary ? (
                // --- INPUT VIEW ---
                <>
                    <div 
                        className="flex-1 overflow-y-auto no-scrollbar pb-32"
                        onTouchStart={actions.onTouchStart}
                        onTouchMove={actions.onTouchMove}
                        onTouchEnd={actions.onTouchEnd}
                    >
                        {!ui.isEditingFromSummary && (
                            <div className="flex w-full flex-row items-center justify-center gap-2 py-6">
                                {players.map((p, idx) => {
                                    const pStyle = getColorStyle(p.color);
                                    const isActive = idx === currentPlayerIndex;
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`h-2.5 rounded-full transition-all duration-300 ${isActive ? `w-8 shadow-sm ${pStyle.bg}` : 'w-2.5 bg-gray-200'}`}
                                        ></div>
                                    );
                                })}
                            </div>
                        )}
                        
                        {ui.isEditingFromSummary && <div className="h-8"></div>}

                        <div className="relative flex items-center justify-center px-2 mb-8 w-full max-w-lg mx-auto">
                            {!ui.isEditingFromSummary && currentPlayerIndex > 0 && (
                                <button
                                    onClick={actions.goToPrevPlayer}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-slate-300/60 hover:text-primary transition-colors z-20 animate-pulse active:scale-95"
                                    aria-label="Jugador Anterior"
                                >
                                    <span className="material-symbols-outlined text-6xl">chevron_left</span>
                                </button>
                            )}

                            <div className="flex flex-col items-center gap-5 z-10">
                                <div className={`relative h-32 w-32 bg-white flex items-center justify-center rounded-full border-[6px] shadow-lg transition-all duration-500 ${playerStyle.border}`}>
                                    <span className={`material-symbols-outlined text-7xl text-slate-800`}>face</span>
                                    <div className={`absolute bottom-0 right-0 h-10 w-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${playerStyle.bg}`}>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <h1 className="typo-h1 text-center">
                                        <PlayerName name={currentPlayer.name} />
                                    </h1>
                                    <p className="typo-body font-medium text-center mt-1 text-slate-500">Ingresa sus resultados finales</p>
                                </div>
                            </div>

                            {!ui.isEditingFromSummary && currentPlayerIndex < players.length - 1 && (
                                <button
                                    onClick={actions.goToNextPlayer}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-300/60 hover:text-primary transition-colors z-20 animate-pulse active:scale-95"
                                    aria-label="Siguiente Jugador"
                                >
                                    <span className="material-symbols-outlined text-6xl">chevron_right</span>
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 px-4 w-full max-w-md mx-auto">
                            {/* --- RELICS --- */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 transition-colors hover:border-cyan-200">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 border border-cyan-100 shrink-0 h-16 w-16 shadow-sm">
                                        <span className="material-symbols-outlined text-[36px] filled" style={{fontVariationSettings: "'FILL' 1"}}>diamond</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="typo-h3 text-slate-800">Reliquias</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                    <button onClick={() => actions.updateStat('relics', -1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-slate-500 font-bold text-xl">-</button>
                                    <input 
                                        type="number" 
                                        value={currentStats.relics} 
                                        onChange={(e) => actions.handleInputChange('relics', e.target.value)}
                                        className="w-12 text-center text-xl font-black text-slate-800 bg-transparent focus:outline-none focus:bg-slate-100 rounded-md"
                                    />
                                    <button onClick={() => actions.updateStat('relics', 1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyan-500 text-white shadow-md shadow-cyan-200 hover:bg-cyan-600 active:scale-95 transition-all font-bold text-xl">+</button>
                                </div>
                            </div>

                            {/* --- PLAGUES --- */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 transition-colors hover:border-purple-200">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center rounded-2xl bg-purple-50 text-purple-500 border border-purple-100 shrink-0 h-16 w-16 shadow-sm">
                                        <span className="material-symbols-outlined text-[36px] filled" style={{fontVariationSettings: "'FILL' 1"}}>skull</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="typo-h3 text-slate-800">Plagas</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                    <button onClick={() => actions.updateStat('plagues', -1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-slate-500 font-bold text-xl">-</button>
                                    <input 
                                        type="number" 
                                        value={currentStats.plagues} 
                                        onChange={(e) => actions.handleInputChange('plagues', e.target.value)}
                                        className="w-12 text-center text-xl font-black text-slate-800 bg-transparent focus:outline-none focus:bg-slate-100 rounded-md"
                                    />
                                    <button onClick={() => actions.updateStat('plagues', 1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-500 text-white shadow-md shadow-purple-200 hover:bg-purple-600 active:scale-95 transition-all font-bold text-xl">+</button>
                                </div>
                            </div>

                            {/* --- POWERS --- */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 transition-colors hover:border-yellow-200">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500 border border-yellow-100 shrink-0 h-16 w-16 shadow-sm">
                                        <span className="material-symbols-outlined text-[36px] filled" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="typo-h3 text-slate-800">Poderes</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                    <button onClick={() => actions.updateStat('powers', -1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-slate-500 font-bold text-xl">-</button>
                                    <input 
                                        type="number" 
                                        value={currentStats.powers} 
                                        onChange={(e) => actions.handleInputChange('powers', e.target.value)}
                                        className="w-12 text-center text-xl font-black text-slate-800 bg-transparent focus:outline-none focus:bg-slate-100 rounded-md"
                                    />
                                    <button onClick={() => actions.updateStat('powers', 1)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-yellow-400 text-white shadow-md shadow-yellow-200 hover:bg-yellow-500 active:scale-95 transition-all font-bold text-xl">+</button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <BottomBar className="bg-white border-t border-slate-100">
                        <Button fullWidth onClick={actions.handleNextButton} icon={mainButtonIcon}>
                            {mainButtonText}
                        </Button>
                    </BottomBar>
                </>
            ) : (
                // --- SUMMARY TABLE VIEW ---
                <>
                    <div className="flex-1 overflow-y-auto p-4 pb-32">
                         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="grid grid-cols-5 gap-2 p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                                <div className="col-span-2 text-left pl-2">Jugador</div>
                                <div><span className="material-symbols-outlined text-lg align-middle text-cyan-500">diamond</span></div>
                                <div><span className="material-symbols-outlined text-lg align-middle text-purple-500">skull</span></div>
                                <div><span className="material-symbols-outlined text-lg align-middle text-yellow-500">bolt</span></div>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {players.map((p, index) => {
                                    const s = stats[p.id];
                                    const pStyle = getColorStyle(p.color);
                                    return (
                                        <div 
                                            key={p.id} 
                                            onClick={() => actions.handleEditPlayerFromSummary(index)}
                                            className="grid grid-cols-5 gap-2 p-4 items-center text-center cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors group"
                                        >
                                            <div className="col-span-2 flex items-center gap-3 text-left overflow-hidden">
                                                <div className={`size-8 rounded-full ${pStyle.bg} flex items-center justify-center shrink-0 border border-black/10`}>
                                                    <span className={`material-symbols-outlined text-lg ${p.color === 'white' ? 'text-slate-800' : 'text-white'}`}>face</span>
                                                </div>
                                                <span className="font-bold text-slate-900 truncate text-sm group-hover:text-primary transition-colors">
                                                    <PlayerName name={p.name} />
                                                </span>
                                            </div>
                                            <div className="font-bold text-slate-600">{s.relics}</div>
                                            <div className="font-bold text-slate-600">{s.plagues}</div>
                                            <div className="font-bold text-slate-600">{s.powers}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <p className="text-center text-slate-400 text-xs mt-4 px-4 leading-relaxed">
                            Toca el nombre de un jugador para modificar sus puntos.<br/>
                            Revisa que todo esté correcto antes de calcular.
                        </p>
                    </div>
                    <BottomBar className="bg-white border-t border-slate-100">
                        <div className="w-full flex flex-col gap-3">
                            <Button 
                                fullWidth 
                                onClick={actions.handleFinalizeGame} 
                                icon="emoji_events" 
                                className="h-auto py-3 !bg-[#f44611] hover:!bg-[#d63b0b] text-white !shadow-[0_4px_15px_rgba(244,70,17,0.4)]"
                            >
                                <div className="flex flex-col items-center leading-none">
                                    <span className="text-lg font-bold">Calcular Ganador</span>
                                    <span className="text-[10px] font-medium opacity-80 mt-1 tracking-wide">Y Revelar Pactos</span>
                                </div>
                            </Button>
                            <Button 
                                fullWidth 
                                variant="ghost" 
                                onClick={actions.navigateToLog}
                                icon="menu_book" 
                                className="text-sm font-bold text-slate-500"
                            >
                                Actualizar la Bitácora
                            </Button>
                        </div>
                    </BottomBar>
                </>
            )}
        </div>
    );
};