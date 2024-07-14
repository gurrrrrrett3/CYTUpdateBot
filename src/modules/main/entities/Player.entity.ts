import { Collection, Entity, EntityRepositoryType, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Session } from "./Session.entity.js";
import PlayerRepository from "../repositories/Player.repository.js";

@Entity({ repository: () => PlayerRepository })
export class Player {

    [EntityRepositoryType]?: PlayerRepository

    @PrimaryKey()
    uuid: string;

    @Property()
    name: string

    @OneToMany(() => Session, session => session.player)
    sessions = new Collection<Session>(this);

    @Property({
        nullable: true
    })
    townId?: string;

    constructor(uuid: string, name: string) {
        this.uuid = uuid;
        this.name = name;
    }
}
