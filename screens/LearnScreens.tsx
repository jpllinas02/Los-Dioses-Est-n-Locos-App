import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, BottomBar, Header } from '../components/UI';

export const LearnIntroScreen: React.FC = () => {
     const navigate = useNavigate();
     return (
         <div className="bg-background text-text font-display flex flex-col min-h-screen">
             <div className="sticky top-0 z-50 flex items-center p-4 pb-2 justify-between">
                 <div onClick={()=>navigate('/')} className="flex size-12 shrink-0 items-center justify-center rounded-full cursor-pointer hover:bg-slate-100 transition-colors">
                     <span className="material-symbols-outlined text-2xl">close</span>
                 </div>
                 <button onClick={()=>navigate('/learn-concepts')} className="text-primary text-base font-bold">Saltar</button>
             </div>
             <div className="flex-1 flex flex-col w-full max-w-md mx-auto px-6 pb-32">
                <div className="w-full mt-2 mb-6 relative">
                    <div className="w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-2xl shadow-lg border-4 border-white" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBfIgdzRqCY0qDQqI1c9nsE-pu122fhydFbzNxxWxnRMR0ggCxj2rcOnseDAo__sdM82n4e6Z8d0kaEZkGKMJNCFPDq6Ek-o-ge454rZfn_MlkMT32nMq6VGScGNxRwAmcoQ9krAdwzSBVe-xAK_h8_RgZm1iqTxb_WHjVLOxxq8EzXo9OShYr8QliPJO4EBhcHdW1iCDjKo5SHiIMXxoaThFYoYB1vhsdwQqpBpTLR2FA7Iv4-UPFpEdQQPkO3TPKb1igYknmv8yA")'}}></div>
                </div>
                <div className="text-center space-y-3 mb-8">
                    <h1 className="typo-h1 leading-[1.1]">¡Bienvenido al Olimpo!</h1>
                    <p className="typo-body font-medium">Olvídate del manual aburrido.</p>
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                        <div><h3 className="typo-h3">Sin manuales largos</h3><p className="typo-body text-sm text-text-muted">Reglas al instante</p></div>
                    </div>
                </div>
             </div>
             <BottomBar>
                <Button fullWidth onClick={()=>navigate('/learn-concepts')} icon="arrow_forward">Comenzar Tutorial</Button>
             </BottomBar>
         </div>
     )
}

export const LearnConceptsScreen: React.FC = () => {
     const navigate = useNavigate();
     return (
         <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl bg-background">
             <Header title="Conceptos Básicos" />
             <div className="flex w-full flex-row items-center justify-center gap-2 py-4">
                 <div className="h-2 w-8 rounded-full bg-primary"></div>
                 <div className="h-2 w-2 rounded-full bg-[#dddbe6]"></div>
             </div>
             <div className="flex-1 overflow-hidden relative flex items-center px-6 pb-4">
                 <div className="flex flex-col h-full w-full bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden relative">
                     <div className="h-[55%] w-full relative bg-gray-100 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACwSFkeeYOmQRAnlQh5BupoOWr8R0YlbCojlO3W2RQlvBHjemyJCyastzFO6mAjru-YU3YoDXJ1_9_cgvrYdJuLia2xPFj9kMQ4YHg2h6rdEka-dcBAXqtrgsRQ6L5jiCJk0GifXJCysp0zRMqn-VuqpkQszUgPf1RNnOiezifbMkmD5ATm9iLhWebB095rxMY6FZRQvS_l7jOj0YyRKv7AU6jLc8Xt1oGGanj0ezhsCS7b5SJ18he67CkOhqRYijZGEpOE3Avxr0")'}}>
                         <div className="absolute top-4 left-4 flex h-8 items-center justify-center gap-x-2 rounded-full bg-white/90 pl-3 pr-4 shadow-sm">
                             <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                             <p className="typo-caption text-slate-800">Efecto Pasivo</p>
                         </div>
                     </div>
                     <div className="flex-1 p-6 flex flex-col gap-3 relative">
                         <h3 className="typo-h1">Reliquias</h3>
                         <p className="typo-body leading-relaxed">
                             Las reliquias son objetos de inmenso poder.
                         </p>
                     </div>
                 </div>
             </div>
             <BottomBar className="bg-white border-t border-slate-100">
                <Button variant="outline" className="flex-1" onClick={()=>navigate(-1)}>Anterior</Button>
                <Button className="flex-[2]" onClick={()=>navigate('/learn-summary')}>Siguiente</Button>
             </BottomBar>
         </div>
     )
}

export const LearnSummaryScreen: React.FC = () => {
     const navigate = useNavigate();
     return (
         <div className="relative flex h-full min-h-screen w-full flex-col bg-background">
            <Header title="Tutorial Completado" />
            <div className="flex-1 flex flex-col px-5 pb-6 overflow-y-auto no-scrollbar">
                <div className="w-full py-4 flex justify-center">
                    <div className="w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-2xl overflow-hidden shadow-sm" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBr2kwBjP_Vfx3KorRb16Tc1oReUasyW4z1sIcZ7I_a8npqVh4_TKPKwiYHg8xrme3ub7qCEbmy7UPMLRLfYvFKdn1yezQ2hZIfAtGIlOM6pBxtb3VFgX70AvPFvQtfPVY9SfXvYesu9zhUEYxV-pcTC3a-4BVC0liZGf-SkjacJkpp5raWeCRJaptqwYh5YNPS0JXBh3oBCl3j9573NiO1yr5IWwSLF3zu_qj8yX5yaoNGyoGNB57P55bePIs1QNmDmTNhKA5Yss")'}}></div>
                </div>
                <div className="text-center pt-2 pb-6">
                    <h1 className="typo-h1 mb-2">¡Estás listo, mortal!</h1>
                    <p className="typo-body text-text-muted">Demuestra tu valía.</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
                    <h3 className="typo-caption mb-4 pl-1">Resumen</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-sm font-bold">check</span></div>
                            <p className="font-semibold text-slate-700">Cómo mover a tu Dios</p>
                        </div>
                    </div>
                </div>
                <div className="flex-grow"></div>
                <div className="flex flex-col gap-3 mt-4">
                    <Button fullWidth onClick={()=>navigate('/game')} icon="play_arrow">Empezar Partida</Button>
                </div>
            </div>
         </div>
     )
}