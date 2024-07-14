import { EntityRepository } from "@mikro-orm/core";
import { RankedLocation } from "../entities/RankedLocation.entity.js";
import LiveLocation from "../classes/liveLocation.js";
import { Location } from "../entities/Location.entity.js";

export default class RankedLocationRepository extends EntityRepository<RankedLocation> {
    public async updateLocationFromLiveLocation(liveLocation: LiveLocation) {
        const locationRepo = this.getEntityManager().getRepository(Location)
        const location = await locationRepo.findOrCreate(liveLocation.server, liveLocation.world, liveLocation.x, liveLocation.z)
        const rankedLocation = await this.findOrCreateFromLocation(location)
        rankedLocation.increment()
        this.getEntityManager().persistAndFlush(rankedLocation)
    }

    public async findOrCreateFromLocation(location: Location) {
        const foundLocation = await this.findOne({ locationId: location.id });

        if (foundLocation) {
            return foundLocation;
        }

        const newRankedLocation = new RankedLocation(location.id);
        this.getEntityManager().persistAndFlush(newRankedLocation);

        return newRankedLocation;
    }

}