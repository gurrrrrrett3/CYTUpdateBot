import { Entity, EntityRepositoryType, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import id from "../util/id";
import { Player } from "./Player.entity";
import TeleportRepository from "../repositories/Teleport.repository";

@Entity({ repository: () => TeleportRepository })
export class Teleport {

    [EntityRepositoryType]?: TeleportRepository

    @PrimaryKey()
    id: string = id();

    @ManyToOne(() => Player)
    player: Player

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