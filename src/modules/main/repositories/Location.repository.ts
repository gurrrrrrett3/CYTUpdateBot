import { EntityRepository } from "@mikro-orm/core";
import { Location } from "../entities/Location.entity.js";
import { ServerEnum } from "../types/serverEnum.js";
import LiveLocation from "../classes/liveLocation.js";

export class LocationRepository extends EntityRepository<Location> {

    public async findOrCreate(server: ServerEnum, world: string, x: number, z: number) {
        const foundLocation = await this.findOne({ server, world, x, z });

        if (foundLocation) {
            return foundLocation;
        }

        const newLocation = new Location(server, world, x, z);
        this.getEntityManager().persistAndFlush(newLocation);

        return newLocation;
    }

    public async findOrCreateByLiveLocation(location: LiveLocation) {
        return this.findOrCreate(location.server, location.world, location.x, location.z);
    }

}
