import { Entity, EntityRepositoryType, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import { LocationRepository } from "../repositories/Location.repository";
import { ServerEnum } from "../types/serverEnum";
import id from "../util/id";

@Entity({ repository: () => LocationRepository })
export class Location {

    [EntityRepositoryType]?: LocationRepository

    @PrimaryKey()
    id: string = id();

    @Enum({ items: () => ServerEnum })
    server: ServerEnum

    @Property()
    world: string

    @Property()
    x: number

    @Property()
    z: number

    constructor(server: ServerEnum, world: string, x: number, z: number) {
        this.server = server;
        this.world = world;
        this.x = x;
        this.z = z;
    }
}
