import LiveLocation from "../classes/liveLocation.js";
import LivePlayer from "../classes/livePlayer.js";
import LiveTown from "../classes/liveTown.js";

export interface Events {
    "playerJoin": (player: LivePlayer) => void;
    "playerLeave": (player: LivePlayer) => void;
    "playerTeleport": (player: LivePlayer, from: LiveLocation, to: LiveLocation) => void;
    "playerPositionUpdate": (players: LivePlayer[]) => void;

    "townCreate": (town: LiveTown) => void;
    "townDelete": (town: LiveTown) => void;
    "townMayorChange": (town: LiveTown, oldMayor: string, newMayor: string) => void;
    "townAssistantAdd": (town: LiveTown, assistant: string) => void;
    "townAssistantRemove": (town: LiveTown, assistant: string) => void;
    "townResidentAdd": (town: LiveTown, resident: string) => void;
    "townResidentRemove": (town: LiveTown, resident: string) => void;
    "townOutpostAdd": (town: LiveTown, outpost: LiveLocation) => void;
    "townOutpostRemove": (town: LiveTown, outpost: LiveLocation) => void;
    "townNationChange": (town: LiveTown, oldNation: string, newNation: string) => void;
    "townPvpChange": (town: LiveTown, pvpEnabled: boolean) => void;
}
