export const ROUTES = {
    HOME: '/',
    SETTINGS: '/settings',
    EXTRAS: '/extras',
    APP_GUIDE: '/app-guide',
    RULES: '/rules',
    REGISTRATION: '/registration',
    GAME: '/game',
    MINIGAME_SELECTOR: '/minigame-selector',
    ORACLE: '/oracle',
    TIMER: '/timer',
    DESTINIES: '/destinies-public',
    VICTORY_LOG: '/victory-log',
    CALCULATOR: '/calculator',
    LEADERBOARD: '/leaderboard',
};

export const STORAGE_KEYS = {
    PLAYERS: 'game_players',
    RESULTS: 'game_results',
    STATS: 'game_stats',
    LOG: 'game_log',
    MINIGAME_HISTORY: 'game_minigame_history',
    MINIGAME_HISTORY_IDS: 'game_minigame_history_ids',
    ORACLE_HISTORY_IDS: 'game_oracle_history_ids',
};

export const VOTE_CATEGORIES = [
    { id: 'strategy', label: 'Estratega', modalTitle: 'El Más Estratégico', icon: 'psychology', color: 'purple' },
    { id: 'chaos', label: 'Caótico', modalTitle: 'El Más Caótico', icon: 'local_fire_department', color: 'red' },
    { id: 'fun', label: 'Gracioso', modalTitle: 'Quien Más Hizo Reír', icon: 'sentiment_very_satisfied', color: 'amber' },
    { id: 'liar', label: 'Mentiroso', modalTitle: 'El Mejor Mentiroso', icon: 'theater_comedy', color: 'slate' },
];