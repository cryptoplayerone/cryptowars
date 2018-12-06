export const GameState = {
    null: 0,
    open: 1,
    closed: 2,
    resolved: 3,
}

export const GameStateIndex = {
    0: 'null',
    1: 'open',
    2: 'closed',
    3: 'resolved',
}

export const PlayerToIndex = {
    vader: 1,
    yoda: 2,
}

export const IndexToPlayer = {
    1: 'vader',
    2: 'yoda',
}

export const MovesToIndex = {
    rock: 1,
    paper: 2,
    scissors: 3,
}

export const IndexToMoves = {
    1: 'rock',
    2: 'paper',
    3: 'scissors',
}

export const GameGuardian = {
    host: 'http://127.0.0.1:3000',
    raiden_address: {
        3: '0xCd9492Cdae7E8F8B5a648c6E15c4005C4cd9028b',
    },
    token_address: {
        3: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    },
    amount: 100000,
}

export const Network = 3;
