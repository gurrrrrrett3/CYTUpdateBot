import { EntityRepository } from "@mikro-orm/core";
import { Teleport } from "../entities/Teleport.entity";
import { Player } from "../entities/Player.entity";
import LivePlayer from "../classes/livePlayer";
import LiveLocation from "../classes/liveLocation";
import { Location } from "../entities/Location.entity";

export default class TeleportRepository extends EntityRepository<Teleport> {

    public async findOrCreate(playerUuid: string, fromLocationId: string, toLocationId: string) {
        const playerRepo = this.getEntityManager().getRepository(Player)
        const player = await playerRepo.findOne({ uuid: playerUuid })

        if (!player) {
            return null;
        }

        const foundTeleport = await this.findOne({ player, fromLocationId, toLocationId });

        if (foundTeleport) {
            return foundTeleport;
        }

        const newTeleport = new Teleport(player, fromLocationId, toLocationId);
        this.getEntityManager().persistAndFlush(newTeleport);

        return newTeleport;
    }

    public async createFromLivePlayer(player: LivePlayer, from: LiveLocation, to: LiveLocation) {
        const playerRepo = this.getEntityManager().getRepository(Player)
        const locationRepo = this.getEntityManager().getRepository(Location)

        const [playerEntity, fromLocation, toLocation] = await Promise.all([
            playerRepo.findOrCreateFromLivePlayer(player),
            locationRepo.findOrCreate(from.server, from.world, from.x, from.z),
            locationRepo.findOrCreate(to.server, to.world, to.x, to.z),
        ])

        if (!playerEntity || !fromLocation || !toLocation) {
            return null;
        }

        const teleport = new Teleport(playerEntity, fromLocation.id, toLocation.id);
        this.getEntityManager().persistAndFlush(teleport);
    }

}
