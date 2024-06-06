import LiveLocation from "../classes/liveLocation";
import LivePlayer from "../classes/livePlayer";

export interface Events {
    "playerJoin": (player: LivePlayer) => void;
    "playerLeave": (player: LivePlayer) => void;
    "playerTeleport": (player: LivePlayer, from: LiveLocation, to: LiveLocation) => void;
    "playerPositionUpdate": (players: LivePlayer[]) => void;
}
