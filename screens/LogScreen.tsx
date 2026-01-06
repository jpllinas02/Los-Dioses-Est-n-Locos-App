import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Button, BottomBar } from '../components/UI';
import { ROUTES, VOTE_CATEGORIES } from '../constants';
import { useVictoryLog } from '../hooks/useVictoryLog';
import { MinigameHistoryList } from '../components/VictoryLog/MinigameHistoryList';
import { WinnerSelectionModal } from '../components/VictoryLog/WinnerSelectionModal';
import { VotingModal } from '../components/VictoryLog/VotingModal';

// --- LOG SCREEN ---
export const LogScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check flags
    const isFromCalculator = location.state?.fromCalculator;
    const shouldAutoOpenModal = location.state?.openMinigameModal;

    // Use Custom Hook for Logic
    const { 
        players, 
        minigameHistory, 
        ui, 
        actions 
    } = useVictoryLog(shouldAutoOpenModal);

    const handleBack = () => {
        if (isFromCalculator) {
            navigate(ROUTES.CALCULATOR, { state: { initialShowSummary: true } });
        } else {
            navigate(-1);
        }
    };

    const handleConfirmMinigameWrapper = () => {
        const success = actions.confirmMinigame();
        if (success && shouldAutoOpenModal) {
            navigate(-1);
        }
    };

    const handleCloseMinigameWrapper = () => {
        actions.closeMinigameModal();
        if (shouldAutoOpenModal) {
            navigate(-1);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#f5f7f8]">
            <Header title="Bitácora de Partida" onBack={handleBack} />
            
            <div className="flex-1 px-4 pt-6 pb-36 overflow-y-auto no-scrollbar">
                {/* Intro Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 text-center relative overflow-hidden">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-500 mb-4">
                        <span className="material-symbols-outlined text-[32px]">emoji_events</span>
                    </div>
                    <p className="text-gray-600 text-base font-medium leading-relaxed">
                        Registra los eventos de la partida para otorgar las menciones de honor.
                    </p>
                </div>
                
                <div className="space-y-8">
                    
                    {/* SECTION 1: MINIGAMES */}
                    <div>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="typo-h3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-action">trophy</span>
                                Minijuegos
                            </h3>
                            <button 
                                onClick={() => ui.setIsHistoryExpanded(!ui.isHistoryExpanded)}
                                className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                {ui.isHistoryExpanded ? 'Ocultar Lista' : 'Mostrar Lista'}
                                <span className={`material-symbols-outlined text-sm transition-transform ${ui.isHistoryExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                        </div>

                        <Button 
                            fullWidth 
                            className="bg-action shadow-lg shadow-action/20 mb-4" 
                            icon="add_circle"
                            onClick={() => actions.openMinigameModal()}
                        >
                            Registrar Ganador de Minijuego
                        </Button>

                        {ui.isHistoryExpanded && (
                            <MinigameHistoryList 
                                history={minigameHistory}
                                players={players}
                                onEdit={actions.openMinigameModal}
                            />
                        )}
                    </div>

                    <hr className="border-slate-200" />

                    {/* SECTION 2: OTHERS (VOTING) */}
                    <div>
                        <div className="mb-4 px-1">
                             <h3 className="typo-h3 flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-purple-500">hotel_class</span>
                                Otros
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">Votaciones opcionales para destacar jugadores.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {VOTE_CATEGORIES.map(cat => {
                                const totalVotes = actions.getTotalVotesForCategory(cat.id);
                                return (
                                    <button 
                                        key={cat.id}
                                        onClick={() => actions.openVoteModal(cat.id)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-${cat.color}-200 hover:bg-${cat.color}-50 transition-all active:scale-[0.98] group`}
                                    >
                                        <div className={`size-10 rounded-full bg-${cat.color}-100 text-${cat.color}-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                            <span className="material-symbols-outlined">{cat.icon}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                                        <span className="text-[10px] font-bold text-slate-400 mt-0.5">({totalVotes} {totalVotes === 1 ? 'voto' : 'votos'})</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* Modals */}
            <WinnerSelectionModal 
                isOpen={ui.showMinigameModal}
                players={players}
                selectedWinners={ui.selectedWinners}
                isEditing={!!ui.editingRecordId}
                onToggleWinner={actions.toggleWinnerSelection}
                onConfirm={handleConfirmMinigameWrapper}
                onDelete={actions.deleteMinigameRecord}
                onClose={handleCloseMinigameWrapper}
            />

            <VotingModal 
                isOpen={ui.showVoteModal}
                activeCategory={ui.activeCategory}
                players={players}
                totalVotes={ui.activeCategory ? actions.getTotalVotesForCategory(ui.activeCategory) : 0}
                justVotedId={ui.justVotedId}
                isClearingVotes={ui.isClearingVotes}
                onVote={actions.confirmVote}
                onClear={actions.clearCategoryVotes}
                onClose={() => ui.setShowVoteModal(false)}
            />

            {isFromCalculator && (
                <BottomBar className="bg-white border-t border-slate-100">
                    <Button 
                        fullWidth 
                        onClick={() => navigate(ROUTES.CALCULATOR, { state: { initialShowSummary: true } })} 
                        icon="check"
                    >
                        Volver al Resumen
                    </Button>
                </BottomBar>
            )}

        </div>
    );
};