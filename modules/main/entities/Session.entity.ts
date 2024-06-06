import { Entity, EntityRepositoryType, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import id from "../util/id";
import { Player } from "./Player.entity";
import SessionRepository from "../repositories/Session.repository";

@Entity({ repository: () => SessionRepository })
export class Session {

    [EntityRepositoryType]?: SessionRepository

    @PrimaryKey()
    id: string

    @ManyToOne(() => Player)
    player: Player

    @Property()
    startedAt: Date = new Date();

    @Property({ nullable: true })
    endedAt?: Date

    @Property()
    loginLocationId!: string

    @Property({
        nullable: true
    })
    logoutLocationId!: string

    constructor(player: Player) {
        this.id = id();
        this.player = player;
    }
}
