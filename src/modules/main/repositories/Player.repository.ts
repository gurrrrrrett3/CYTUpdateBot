import { EntityRepository } from "@mikro-orm/core";
import { Player } from "../entities/Player.entity.js";
import LivePlayer from "../classes/livePlayer.js";

export default class PlayerRepository extends EntityRepository<Player> {

    public async findOrCreateFromLivePlayer(player: LivePlayer) {
        const foundPlayer = await this.findOne({ uuid: player.uuid });

        if (foundPlayer) {
            return foundPlayer;
        }

        const newPlayer = new Player(player.uuid, player.name);
        this.getEntityManager().persistAndFlush(newPlayer);

        return newPlayer;
    }
}