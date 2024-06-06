import { db } from "../../../core";
import LiveLocation from "../classes/liveLocation";
import LivePlayer from "../classes/livePlayer";
import { RankedLocation } from "../entities/RankedLocation.entity";
import { Teleport } from "../entities/Teleport.entity";
import EventManager from "../managers/event.manager";

export default class TeleportHandler {

    public static async init() {
        EventManager.on('playerTeleport', this.onPlayerTeleport)
    }

    private static async onPlayerTeleport(player: LivePlayer, from: LiveLocation, to: LiveLocation) {
        const teleportRepo = db.em.getRepository(Teleport)
        const RankedLocationRepo = db.em.getRepository(RankedLocation)

        await Promise.all([
            teleportRepo.createFromLivePlayer(player, from, to),
            RankedLocationRepo.updateLocationFromLiveLocation(to)
        ])
    }
}
