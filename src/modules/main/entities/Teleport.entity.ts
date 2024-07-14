import { Entity, EntityRepositoryType, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import id from "../util/id.js";
import { Player } from "./Player.entity.js";
import TeleportRepository from "../repositories/Teleport.repository.js";

@Entity({ repository: () => TeleportRepository })
export class Teleport {

    [EntityRepositoryType]?: TeleportRepository

    @PrimaryKey()
    id: string = id();

    @ManyToOne(() => Player)
    player: Rel<Player>

    @Property()
    fromLocationId: string

    @Property()
    toLocationId: string

    @Property()
    at: Date = new Date()

    constructor(player: Player, fromLocationId: string, toLocationId: string) {
        this.player = player;
        this.fromLocationId = fromLocationId;
        this.toLocationId = toLocationId;
    }
}