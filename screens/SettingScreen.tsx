import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, BottomBar } from '../components/UI';

export const SettingScreen: React.FC = () => {
    const navigate = useNavigate();

    // Settings specific items
    const settingsItems = [
        { icon: 'volume_up', label: 'Control de Volumen', type: 'slider' },
        { icon: 'translate', label: 'Idioma (Español/Inglés)', type: 'row' },
        { icon: 'notifications', label: 'Notificaciones', type: 'toggle' },
        { icon: 'palette', label: 'Modo Oscuro', type: 'toggle' },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-[#f8fafc]">
            <Header title="Configuración" showBack={true} />
            
            <div className="flex-1 overflow-y-auto pb-32">
                {/* Hero Section */}
                <div className="relative w-full flex flex-col items-center justify-center pt-10 pb-8 px-6 text-center">
                    <div className="size-28 rounded-3xl text-slate-600 bg-slate-100 flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 border-4 border-white animate-float relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
                        <span className="material-symbols-outlined text-6xl relative z-10">tune</span>
                    </div>
                    
                    <h2 className="typo-h2 text-slate-900 mb-2">Configuración</h2>
                    <p className="typo-body text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
                        Personaliza tu experiencia de juego.
                    </p>
                </div>

                {/* Coming Soon List */}
                <div className="px-6 w-full max-w-md mx-auto">
                    <div className="flex items-center gap-2 mb-4 opacity-50">
                        <span className="h-px flex-1 bg-slate-300"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Próximamente</span>
                        <span className="h-px flex-1 bg-slate-300"></span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {settingsItems.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm opacity-60 grayscale cursor-not-allowed select-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                                </div>
                                
                                {/* Fake UI Elements */}
                                {item.type === 'toggle' && (
                                    <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                                        <div className="absolute left-1 top-1 size-3 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                )}
                                {item.type === 'slider' && (
                                    <div className="w-16 h-1.5 bg-slate-200 rounded-full relative">
                                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 bg-slate-300 rounded-full shadow-sm"></div>
                                    </div>
                                )}
                                {item.type === 'row' && (
                                    <span className="material-symbols-outlined text-slate-300 text-lg">chevron_right</span>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 items-start">
                        <span className="material-symbols-outlined text-blue-500 text-xl mt-0.5">info</span>
                        <p className="text-xs text-blue-800 leading-relaxed font-medium">
                            Estamos trabajando duro para traer estas funciones en la próxima actualización. ¡Mantén tu app al día!
                        </p>
                    </div>
                </div>
            </div>

            <BottomBar className="bg-white border-t border-slate-100">
                <Button fullWidth onClick={() => navigate(-1)} icon="arrow_back">
                    Volver
                </Button>
            </BottomBar>
        </div>
    );
};