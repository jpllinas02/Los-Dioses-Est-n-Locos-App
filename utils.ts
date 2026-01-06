import { GameColor } from './types';

// Fisher-Yates Shuffle Generic
export const shuffle = <T>(array: T[]): T[] => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

export const DEFAULT_NAME_POOL = [
    "AFK", "¡VIP!", "Pro", "Noob", "Caos", "NPC",
    "Osi", "Tete", "Nono", "Mole", "Oh La la",
    "Nadie", "Casi Casi", "¿Quién?", "¿Yo?", "Cinco", "Error 404", "¡Ouch!",
    "Bicho", "Pulga", "G.O.A.T", "Bombón", "Burbuja", "Bellota"
];

export const GAME_COLORS: { id: GameColor, bg: string, shadow: string, ring: string, text: string, checkColor?: string, border?: string, line: string }[] = [
    { id: 'red', bg: 'bg-red-500', shadow: 'shadow-red-500/20', ring: 'peer-checked:ring-red-200', text: 'text-red-600', line: 'bg-white/90' },
    { id: 'blue', bg: 'bg-blue-500', shadow: 'shadow-blue-500/20', ring: 'peer-checked:ring-blue-200', text: 'text-blue-600', line: 'bg-white/90' },
    { id: 'yellow', bg: 'bg-yellow-400', shadow: 'shadow-yellow-400/20', ring: 'peer-checked:ring-yellow-200', text: 'text-yellow-600', line: 'bg-slate-800/60' },
    { id: 'green', bg: 'bg-green-500', shadow: 'shadow-green-500/20', ring: 'peer-checked:ring-green-200', text: 'text-green-600', line: 'bg-white/90' },
    { id: 'black', bg: 'bg-slate-900', shadow: 'shadow-slate-900/20', ring: 'peer-checked:ring-slate-400', text: 'text-slate-900', line: 'bg-white/90' },
    { id: 'white', bg: 'bg-white', shadow: 'shadow-slate-200/50', ring: 'peer-checked:ring-slate-200', text: 'text-slate-600', checkColor: 'text-slate-900', border: 'border-slate-200', line: 'bg-slate-800/60' },
];

export const getColorStyle = (color: GameColor) => {
    switch(color) {
        case 'red': return {bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200'};
        case 'blue': return {bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200'};
        case 'yellow': return {bg: 'bg-yellow-400', text: 'text-yellow-600', border: 'border-yellow-200'};
        case 'green': return {bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200'};
        case 'black': return {bg: 'bg-slate-900', text: 'text-slate-900', border: 'border-slate-800'};
        case 'white': return {bg: 'bg-white', text: 'text-slate-600', border: 'border-slate-300'};
        default: return {bg: 'bg-slate-500', text: 'text-slate-600', border: 'border-slate-200'};
    }
};