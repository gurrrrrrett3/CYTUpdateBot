import { Entity, EntityRepositoryType, PrimaryKey, Property } from "@mikro-orm/core";
import id from "../util/id.js";
import TownRepository from "../repositories/Town.repository.js";

@Entity({ repository: () => TownRepository })
export class Town {

    [EntityRepositoryType]?: TownRepository

    @PrimaryKey()
    id: string = id();

    @Property()
    name: string;

    @Property({
        nullable: true
    })
    nation?: string;

    @Property()
    spawnLocationId: string;

    @Property()
    outpostLocationIds: string[] = [];

    @Property()
    mayor: string;

    @Property()
    residents: string[] = [];

    @Property()
    assistants: string[] = [];

    @Property()
    pvp: boolean;

    @Property()
    createdAt: Date = new Date();

    @Property({
        onUpdate: () => new Date()
    })
    updatedAt: Date = new Date();

    constructor(name: string, spawnLocationId: string, mayor: string, pvp: boolean) {
        this.name = name;
        this.spawnLocationId = spawnLocationId;
        this.mayor = mayor;
        this.pvp = pvp;
    }

}
