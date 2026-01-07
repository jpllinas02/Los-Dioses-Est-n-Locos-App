export interface Player {
    id: string;
    name: string;
    avatar?: string;
    pact: PactType;
    color: GameColor;
    score?: number;
    scoreDetails?: {
        relics: number;
        plagues: number;
        powers: number;
    };
}

export type PactType = 'Atenea' | 'Loki' | 'Longwang';

export type GameColor = 'red' | 'blue' | 'yellow' | 'green' | 'black' | 'white';

export interface NavItem {
    label: string;
    path: string;
    icon: string;
}

export enum DestinyMode {
    PUBLIC = 'Public',
    SECRET = 'Secret'
}

// --- Oracle Types ---
export type OracleType = 'Favorable' | 'Desfavorable' | 'Neutral';

export interface Oracle {
    id: string;
    title: string;
    type: OracleType;
    description: string;
    image?: string;
}

// --- Minigame Types ---
export type MinigameType = 'Individual' | 'Team' | 'Special';

export interface Minigame {
    id: string;
    title: string;
    type: MinigameType;
    description: string;
}

// --- Log Types ---
export interface MinigameRecord {
    id: string;
    round: number;
    winners: string[];
    timestamp: number;
}