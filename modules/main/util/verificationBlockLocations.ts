import LiveLocation from "../classes/liveLocation";
import { ServerEnum } from "../types/serverEnum";

export const VerificationBlockLocations = {
    centerPos: new LiveLocation(ServerEnum.TOWNY, "minecraft_overworld", 11619, -2436),
    // starting at the north west corner, going east, then south
    blocks: [
        "Coal Block",
        "Lapis Block",
        "Copper Block",
        "Gold Block",
        "Emerald Block",
        "Diamond Block",
        "Redstone Block",
        "Netherite Block",
        "Iron Block"
    ]
}

export const VerificationBlockLocationOffsets = [
    { x: -1, z: -1 },
    { x: 0, z: -1 },
    { x: 1, z: -1 },
    { x: -1, z: 0 },
    { x: 0, z: 0 },
    { x: 1, z: 0 },
    { x: -1, z: 1 },
    { x: 0, z: 1 },
    { x: 1, z: 1 }
]