import { Entity, EntityRepositoryType, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import { LocationRepository } from "../repositories/Location.repository.js";
import { ServerEnum } from "../types/serverEnum.js";
import id from "../util/id.js";

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

    get cleanWorld() {
        return this.world.replace("minecraft_", "");
    }

    constructor(server: ServerEnum, world: string, x: number, z: number) {
        this.server = server;
        this.world = world;
        this.x = x;
        this.z = z;
    }
}
