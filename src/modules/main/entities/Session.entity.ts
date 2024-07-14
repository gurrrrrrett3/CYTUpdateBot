import { Entity, EntityRepositoryType, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import id from "../util/id.js";
import { Player } from "./Player.entity.js";
import SessionRepository from "../repositories/Session.repository.js";

@Entity({ repository: () => SessionRepository })
export class Session {

    [EntityRepositoryType]?: SessionRepository

    @PrimaryKey()
    id: string

    @ManyToOne(() => Player)
    player: Rel<Player>

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

    constructor(player: Rel<Player>) {
        this.id = id();
        this.player = player;
    }
}
