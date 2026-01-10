import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, BottomBar, PlayerName } from '../components/UI';
import { ROUTES } from '../constants';
import { useNewGameLogic } from '../hooks/useNewGameLogic';
import { useGameSession } from '../hooks/useGameSession';
import { ConfigWizard } from '../components/NewGame/ConfigWizard';
import { PlayerInputForm } from '../components/NewGame/PlayerInputForm';
import { ReviewModal } from '../components/NewGame/ReviewModal';
import { getColorStyle } from '../utils';

// --- ASSETS IMPORTS ---
// Asegúrate de que estos archivos existan en /src/assets/
import ateneaCarta from '../assets/atenea_carta.png';
import lokiCarta from '../assets/loki_carta.png';
import longwangCarta from '../assets/longwang_carta.png';

// --- MAIN SCREEN ---
export const RegistrationScreen: React.FC = () => {
    const navigate = useNavigate();
    const { state, actions } = useNewGameLogic();
    const { startGame } = useGameSession();

    // Helper for specific UI logic (player styling)
    const pactDetails: Record<string, any> = {
        'Atenea': { 
            label: 'Atenea', 
            image: ateneaCarta, // Usamos la imagen importada
            scoring: {r: 3, p: -1, w: 0}, 
            color: 'text-amber-600' 
        },
        'Loki': { 
            label: 'Loki', 
            image: lokiCarta, 
            scoring: {r: 2, p: 1, w: 0}, 
            color: 'text-deep-purple-600' 
        },
        'Longwang': { 
            label: 'Longwang', 
            image: longwangCarta, 
            scoring: {r: 2, p: -1, w: 1}, 
            color: 'text-blue-600' 
        },
    };

    // Wrapper for Final Action
    const handleGameStart = () => {
        const result = actions.finalizeReview();
        if (result.readyToPlay) {
            startGame(result.players);
        }
    };

    // Wrapper for Reveal Confirmation
    const handleRevealConfirm = () => {
        const finished = actions.nextReveal();
        if (finished) {
            startGame(state.players);
        }
    };

    const handleRevealBack = () => {
        actions.setRevealState(prev => ({...prev, showQuit: true}));
    };

    return (
        <>
            {/* VIEW 1: CONFIGURATION */}
            {state.step === 'CONFIG' && (
                <>
                    <Header title="Configuración de Partida" onBack={() => navigate(ROUTES.HOME)} helpTarget="setup" />
                    <ConfigWizard 
                        config={state.config} 
                        onUpdate={actions.updateConfig} 
                        onContinue={actions.confirmConfig} 
                    />
                </>
            )}

            {/* VIEW 2: INPUT NAMES */}
            {state.step === 'INPUT_NAMES' && (
                <div className="flex h-screen w-full flex-col bg-[#f6f5f8]">
                    <Header title="Registro de Jugadores" onBack={actions.handleInputBack} helpTarget="setup" />
                    
                    <div className="flex-1 px-6 pt-8 flex flex-col items-center animate-fade-in pb-32 overflow-y-auto">
                        <PlayerInputForm 
                            tempInput={state.tempInput}
                            setTempInput={actions.setTempInput}
                            onSubmit={actions.addPlayer}
                            errors={state.errors}
                            usedColors={state.players.map(p => p.color)}
                            isStrategicMode={state.config.pactMode === 'STRATEGIC'}
                        />

                        {/* Progress Dots */}
                        <div className="flex gap-2 mb-4">
                            {Array.from({ length: state.config.playerCount }).map((_, i) => (
                                <div key={i} className={`h-2 rounded-full transition-all ${i < state.players.length ? 'w-4 bg-primary' : (i === state.players.length ? 'w-4 bg-slate-300' : 'w-2 bg-slate-200')}`}></div>
                            ))}
                        </div>
                    </div>

                    <BottomBar className="bg-white border-t border-slate-100">
                        <Button fullWidth onClick={actions.addPlayer} icon={state.players.length === state.config.playerCount - 1 ? "check" : "arrow_forward"}>
                            {state.players.length === state.config.playerCount - 1 ? 'Revisar y Finalizar' : 'Siguiente Jugador'}
                        </Button>
                    </BottomBar>
                </div>
            )}

            {/* VIEW 3: REVEAL PACTS */}
            {state.step === 'REVEAL_PACTS' && (
                <div className={`flex h-screen w-full flex-col bg-[#f6f5f8]`}>
                    <Header 
                        title="Asignación de Pactos" 
                        showBack={true} 
                        onBack={handleRevealBack} 
                        helpTarget="setup" 
                        onHelp={handleRevealBack} 
                    />
                    
                    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
                        {/* Reveal Card UI */}
                        <div className={`w-full aspect-[4/5] max-h-[60vh] bg-white rounded-[2.5rem] shadow-xl border-4 ${getColorStyle(state.players[state.revealState.index].color).border} relative overflow-hidden flex flex-col items-center justify-center p-6 text-center transition-all duration-300`} key={state.revealState.index}>
                             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent opacity-90 pointer-events-none"></div>

                            {!state.revealState.isRevealed ? (
                                <div className="w-full flex flex-col items-center animate-fade-in relative z-10">
                                    <div className={`w-24 h-24 rounded-full ${getColorStyle(state.players[state.revealState.index].color).bg} border-4 ${getColorStyle(state.players[state.revealState.index].color).border || 'border-slate-100'} shadow-md flex items-center justify-center mx-auto mb-6`}>
                                        <span className={`material-symbols-outlined text-5xl ${state.players[state.revealState.index].color === 'white' ? 'text-slate-900' : 'text-white'}`}>face</span>
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Turno de</h2>
                                    <h1 className="typo-h1 mb-8"><PlayerName name={state.players[state.revealState.index].name} /></h1>
                                    <div className="bg-slate-50 rounded-2xl p-4 mb-2 flex items-center gap-3 text-left w-full border border-slate-100">
                                        <div className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined">smartphone</span></div>
                                        <p className="text-xs text-slate-500 font-medium leading-tight">Toma el dispositivo y asegúrate de que nadie más mire la pantalla.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center animate-pop-in relative z-10 pt-4">
                                    <div className="mb-4"><span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Tu Pacto Es Con</span></div>
                                    
                                    {/* 2. IMAGEN */}
                                    <div className="flex-1 w-full flex items-center justify-center relative min-h-0">
                                        <img 
                                            src={pactDetails[state.players[state.revealState.index].pact].image} 
                                            alt={`Carta de ${pactDetails[state.players[state.revealState.index].pact].label}`}
                                            className="max-h-full max-w-full object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    
                                    {/* PACTO */}
                                    <h1 className={`text-4xl font-bold mb-4 ${pactDetails[state.players[state.revealState.index].pact].color} drop-shadow-sm`}>
                                        {pactDetails[state.players[state.revealState.index].pact].label}
                                    </h1>
                                    
                                    <div className="mt-4 pb-2">
                                        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1"><span className="material-symbols-outlined text-sm">lock</span> Información Secreta</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-8 w-full max-w-sm px-2">
                            {!state.revealState.isRevealed ? (
                                <Button fullWidth onClick={actions.handleRevealCard} className="shadow-xl shadow-primary/20 h-16 text-lg" icon="visibility">Revelar mi Pacto</Button>
                            ) : (
                                <Button 
                                    fullWidth 
                                    onClick={handleRevealConfirm} 
                                    disabled={state.revealState.isLocked}
                                    className={`h-16 text-lg shadow-xl shadow-slate-900/20 bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 border-2 border-slate-900 ${state.revealState.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    icon={state.revealState.isLocked ? 'lock_clock' : 'check'}
                                >
                                    {state.revealState.isLocked ? 'Leyendo...' : (state.revealState.index < state.players.length - 1 ? 'Ocultar y Pasar' : 'Empezar Partida')}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Quit Confirmation Modal inside Reveal Phase */}
                    {state.revealState.showQuit && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => actions.setRevealState(p => ({...p, showQuit: false}))}></div>
                            <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-6 flex flex-col items-center text-center animate-float">
                                <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">warning</span>
                                <h3 className="typo-h3 mb-2">¿Cancelar Partida?</h3>
                                <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">Se perderá el avance de la configuración de los jugadores.</p>
                                <div className="flex gap-3 w-full">
                                    <button onClick={() => actions.setRevealState(p => ({...p, showQuit: false}))} className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-600 text-sm">Cancelar</button>
                                    <button onClick={() => navigate(ROUTES.HOME)} className="flex-[2] py-3 rounded-xl bg-[#330df2] text-white font-bold shadow-md">Salir</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* REVIEW MODAL */}
            <ReviewModal 
                isOpen={state.showReviewModal}
                players={state.players}
                config={state.config}
                onClose={actions.closeReviewModal}
                onConfirm={handleGameStart}
                onAddPlayer={actions.addNewInReview}
                editingId={state.editingId}
                onEdit={actions.startEditing}
                onSave={actions.savePlayerChanges}
                onCancel={actions.cancelEditing}
                onDelete={actions.deletePlayer}
            />
        </>
    );
};
