import { Collection, Entity, EntityRepositoryType, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Session } from "./Session.entity";
import PlayerRepository from "../repositories/Player.repository";

@Entity({ repository: () => PlayerRepository })
export class Player {

    [EntityRepositoryType]?: PlayerRepository

    @PrimaryKey()
    uuid: string;

    @Property()
    name: string

    @OneToMany(() => Session, session => session.player)
    sessions = new Collection<Session>(this);

    constructor(uuid: string, name: string) {
        this.uuid = uuid;
        this.name = name;
    }
}
