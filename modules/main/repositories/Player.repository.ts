import { EntityRepository } from "@mikro-orm/core";
import { Player } from "../entities/Player.entity";
import LivePlayer from "../classes/livePlayer";

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