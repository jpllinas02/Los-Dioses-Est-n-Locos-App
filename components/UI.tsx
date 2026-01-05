import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightElement?: React.ReactNode;
    actionIcon?: string;
    onAction?: () => void;
    transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
    title, 
    showBack = true, 
    onBack, 
    rightElement,
    actionIcon,
    onAction,
    transparent = false 
}) => {
    const navigate = useNavigate();
    const handleBack = onBack || (() => navigate(-1));

    return (
        <header className={`sticky top-0 z-50 flex items-center justify-between px-4 py-3 transition-all duration-200 ${transparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm'}`}>
            <div className="flex w-12 shrink-0 items-center justify-start">
                {showBack ? (
                    <button 
                        onClick={handleBack} 
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors active:scale-95 ${transparent ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
                        aria-label="Atrás"
                    >
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                ) : (
                    <div className="w-10" />
                )}
            </div>
            
            <div className="flex-1 flex justify-center px-2">
                {title && (
                    <h2 className={`text-lg font-bold leading-tight tracking-tight text-center truncate ${transparent ? 'text-white drop-shadow-md' : 'text-slate-900'}`}>
                        {title}
                    </h2>
                )}
            </div>

            <div className="flex w-12 shrink-0 items-center justify-end">
                {actionIcon ? (
                    <button 
                        onClick={onAction}
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors active:scale-95 ${transparent ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
                        aria-label="Acción"
                    >
                        <span className="material-symbols-outlined text-2xl">{actionIcon}</span>
                    </button>
                ) : (
                    rightElement || <div className="w-10" />
                )}
            </div>
        </header>
    );
};

export const BottomBar: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
    return (
        <div className={`fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8 z-40 ${className}`}>
            <div className="max-w-md mx-auto w-full flex gap-3">
                {children}
            </div>
        </div>
    );
};

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    bgImage?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "", onClick, bgImage }) => {
    return (
        <div 
            onClick={onClick}
            className={`relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 transition-all ${onClick ? 'cursor-pointer active:scale-[0.98] hover:shadow-md' : ''} ${className}`}
            style={bgImage ? { backgroundImage: `url('${bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
            {bgImage && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0"></div>}
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    icon?: string;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, fullWidth = false, className = "", ...props }) => {
    const baseStyles = "h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none touch-manipulation";
    
    // Switch from hover: to active: for mobile responsiveness without sticking
    const variants = {
        primary: "bg-primary text-white shadow-[0_4px_15px_rgba(51,13,242,0.3)] active:bg-primary-dark",
        secondary: "bg-secondary text-white shadow-md active:bg-amber-600",
        danger: "bg-danger text-white shadow-[0_4px_15px_rgba(242,70,13,0.3)] active:bg-red-700",
        outline: "border-2 border-slate-200 bg-white text-slate-700 active:bg-slate-50",
        ghost: "bg-transparent text-slate-600 active:bg-slate-100"
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} 
            {...props}
        >
            {icon && <span className="material-symbols-outlined">{icon}</span>}
            <span>{children}</span>
        </button>
    );
};

// --- NEW PLAYER NAME COMPONENT ---
export const PlayerName: React.FC<{ name: string; className?: string }> = ({ name, className = "" }) => {
    // 1. "Caos": Chaos effect (independent jittery letters)
    if (name === "Caos") {
        return (
            <span className={`inline-flex ${className}`}>
                {name.split('').map((char, i) => (
                    <span 
                        key={i} 
                        className="animate-chaos inline-block origin-center" 
                        style={{ animationDelay: `${i * -1.5}s`, animationDuration: `${1 + (i * 0.1)}s` }}
                    >
                        {char}
                    </span>
                ))}
            </span>
        );
    }

    // 2. "Error 404": Glitch effect (blinking/shifting)
    if (name === "Error 404") {
        return (
            <span className={`animate-glitch font-mono text-red-800 tracking-tighter ${className}`}>
                {name}
            </span>
        );
    }

    // Default
    return <span className={className}>{name}</span>;
};