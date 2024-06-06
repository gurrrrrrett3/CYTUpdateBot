import { Entity, EntityRepositoryType, PrimaryKey, Property } from "@mikro-orm/core";
import id from "../util/id";
import RankedLocationRepository from "../repositories/RankedLocation.repository";

@Entity({ repository: () => RankedLocationRepository })
export class RankedLocation {

    [EntityRepositoryType]?: RankedLocationRepository

    @PrimaryKey()
    id = id();

    @Property({
        nullable: true
    })
    name?: string

    @Property()
    locationId: string

    @Property()
    uses: number = 1

    @Property()
    lastUsed: Date = new Date()

    constructor(locationId: string) {
        this.locationId = locationId;
    }

    increment() {
        this.uses++;
        this.lastUsed = new Date();
    }
}
