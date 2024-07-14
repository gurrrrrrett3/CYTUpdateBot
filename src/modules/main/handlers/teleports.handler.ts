import { db } from "../../../core/index.js";
import LiveLocation from "../classes/liveLocation.js";
import LivePlayer from "../classes/livePlayer.js";
import { RankedLocation } from "../entities/RankedLocation.entity.js";
import { Teleport } from "../entities/Teleport.entity.js";
import EventManager from "../managers/event.manager.js";

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
