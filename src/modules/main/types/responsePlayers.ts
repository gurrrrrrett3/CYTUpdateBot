export interface ResponsePlayers {
    max: number;
    players: ResponsePlayer[];
}

export interface ResponsePlayer {
    world: string;
    armor: number;
    name: string;
    x: number;
    health: number;
    z: number;
    uuid: string;
    yaw: number;
}
