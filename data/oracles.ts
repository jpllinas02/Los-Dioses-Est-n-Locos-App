import { Oracle } from '../types';

export const ORACLES_DB: Oracle[] = [
    // --- FAVORABLE (6) ---
    { id: 'fav1', type: 'Favorable', title: 'Oportunidad Dorada', description: 'Elige una opción entre:\n\n1. Ganar una Reliquia.\n2. Mover la ficha de cualquier jugador dos casillas hacia atrás.\n\nTú decides si puede activar alguna casilla especial hasta que regrese a su casilla.' },
    { id: 'fav2', type: 'Favorable', title: 'El Nuevo Elegido', description: 'Elige el siguiente Minijuego que se jugará al final de la ronda.\n\nAdemás, el Símbolo del Elegido pasa a ser tuyo. Si ya lo era, lo mantendrás el siguiente turno.\n\nLos turnos de esta ronda no cambian.' },
    { id: 'fav3', type: 'Favorable', title: 'Fuente de Poder', description: 'Elige una opción entre:\n\n1. Tomar un Poder de la pila, el que tú quieras, y baraja la pila.\n2. Perder una Plaga.' },
    { id: 'fav4', type: 'Favorable', title: 'Caos Controlado', description: 'Elige una opción entre:\n\n1. Cambiar tu Pacto con el de otro jugador.\n2. Intercambiar un Poder al azar por una Plaga entre dos jugadores cualquiera.' },
    { id: 'fav5', type: 'Favorable', title: 'Gloria Adicional', description: 'Si eres uno de los ganadores del siguiente Minijuego, recibes un Beneficio de la Victoria adicional.' },
    { id: 'fav6', type: 'Favorable', title: 'Robo de Poder', description: 'Todos los jugadores te muestran sus Poderes. Quédate con uno de esos Poderes, el que quieras.\n\nDevuelve el resto a sus dueños.' },

    // --- DESFAVORABLE (6) ---
    { id: 'unfav1', type: 'Desfavorable', title: 'Cambio de Posición', description: 'Intercambia tu puesto con uno de los jugadores que estén en la casilla más distante de La Meta. No activas casilla especial hasta que regreses a tu casilla.\n\nEl otro jugador decide si quiere activar su Oráculo. En caso que sí, se activa enseguida.' },
    { id: 'unfav2', type: 'Desfavorable', title: 'Sacrificio Inevitable', description: 'Elige 1 opción entre:\n\n1. Perder una Reliquia.\n2. Perder hasta tres Poderes (o los que tengas, si tienes menos).\n\nPara elegir una opción, debes tener al menos una Reliquia o un Poder, respectivamente. Si no tienes nada, pierdes tu próximo turno.' },
    { id: 'unfav3', type: 'Desfavorable', title: 'Retroceso Menor', description: 'Mueve tu ficha 2 casillas hacia atrás.\n\nNo activas casilla especial hasta que regreses a tu casilla.' },
    { id: 'unfav4', type: 'Desfavorable', title: 'Dilema del Secreto', description: 'Elige una opción entre:\n\n1. Mover tu ficha tres casillas hacia atrás. No activas casilla especial hasta que regreses a tu casilla.\n2. Revelar tu Pacto a un adversario. Él no puede mostrárselo a nadie pero sí decir lo que quiera.' },
    { id: 'unfav5', type: 'Desfavorable', title: 'Caridad Obligada', description: 'Elige una opción entre:\n\n1. Todos tus adversarios ganan un Poder.\n2. Perder una Reliquia (debes tener al menos una).' },
    { id: 'unfav6', type: 'Desfavorable', title: 'Voto de Silencio', description: 'No puedes pronunciar ninguna palabra hasta el comienzo de tu siguiente turno, a menos que un Minijuego lo requiera.\n\nSi no cumples, pierdes 1 Reliquia (si no tienes, no recibirás la próxima).' },

    // --- NEUTRAL (2) ---
    { id: 'neu1', type: 'Neutral', title: 'Duelo por el Botín', description: 'Reta a un adversario a un Duelo.\n\nJugarán el primer Minijuego Individual que salga. El ganador:\n1. Roba 1 Reliquia al perdedor, o\n2. Roba 2 Poderes al perdedor.\n\nSi el perdedor no tiene lo elegido, se toma del banco. Si nadie pierde, cada quien decide si pierde 1 Reliquia o 2 Poderes.' },
    { id: 'neu2', type: 'Neutral', title: 'Ley de Compensación', description: 'Si eres uno de los que está más cerca de La Meta, en tu siguiente turno Avanzar te costará dos acciones.\n\nSi eres uno de los que está más lejos de La Meta, en tu siguiente turno Usar Poder no te costará acción.' },
];