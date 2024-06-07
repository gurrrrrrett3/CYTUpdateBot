import LiveLocation from "../classes/liveLocation";
import LivePlayer from "../classes/livePlayer";
import LiveTown from "../classes/liveTown";

export interface Events {
    "playerJoin": (player: LivePlayer) => void;
    "playerLeave": (player: LivePlayer) => void;
    "playerTeleport": (player: LivePlayer, from: LiveLocation, to: LiveLocation) => void;
    "playerPositionUpdate": (players: LivePlayer[]) => void;

    "townCreate": (town: LiveTown) => void;
    "townDelete": (town: LiveTown) => void;
    "townMayorChange": (town: LiveTown, mayor: string) => void;
    "townAssistantAdd": (town: LiveTown, assistant: string) => void;
    "townAssistantRemove": (town: LiveTown, assistant: string) => void;
    "townResidentAdd": (town: LiveTown, resident: string) => void;
    "townResidentRemove": (town: LiveTown, resident: string) => void;
    "townOutpostAdd": (town: LiveTown, outpost: LiveLocation) => void;
    "townOutpostRemove": (town: LiveTown, outpost: LiveLocation) => void;
}
