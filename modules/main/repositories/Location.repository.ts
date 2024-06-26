import { EntityRepository } from "@mikro-orm/core";
import { Location } from "../entities/Location.entity";
import { ServerEnum } from "../types/serverEnum";
import LiveLocation from "../classes/liveLocation";

export class LocationRepository extends EntityRepository<Location> {

    public async findOrCreate(server: ServerEnum, world: string, x: number, z: number) {
        const foundLocation = await this.findOne({ server, world, x, z });

        if (foundLocation) {
            return foundLocation;
        }

        const newLocation = new Location(server, world, x, z);
        this.getEntityManager().persist(newLocation);

        return newLocation;
    }

    public async findOrCreateByLiveLocation(location: LiveLocation) {
        return this.findOrCreate(location.server, location.world, location.x, location.z);
    }

}
