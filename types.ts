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

export interface OracleResult {
    title: string;
    type: 'Favorable' | 'Desfavorable' | 'Neutral';
    description: string;
    image: string;
}