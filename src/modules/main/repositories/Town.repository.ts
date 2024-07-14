import { EntityRepository } from "@mikro-orm/core";
import { Town } from "../entities/Town.entity.js";
import LiveLocation from "../classes/liveLocation.js";
import { Location } from "../entities/Location.entity.js";

export default class TownRepository extends EntityRepository<Town> {

    async findByName(name: string) {
        return this.findOne({ name });
    }

    async findOrCreate(name: string, location: LiveLocation, mayor: string, pvp: boolean) {
        const locationRepo = this.em.getRepository(Location);
        let spawnLocation = await locationRepo.findOrCreateByLiveLocation(location);

        let town = await this.findOne({ name });

        if (!town) {
            town = this.create(new Town(name, spawnLocation.id, mayor, pvp), {
                managed: true
            });

            this.em.persistAndFlush(town);
        }

        return town;
    }

    async findOrCreateNoPerist(name: string, location: LiveLocation, mayor: string, pvp: boolean) {
        const locationRepo = this.em.getRepository(Location);
        let spawnLocation = await locationRepo.findOrCreateByLiveLocation(location);

        let town = await this.findOne({ name });

        if (!town) {
            town = new Town(name, spawnLocation.id, mayor, pvp);
        }

        return town;
    }
}
