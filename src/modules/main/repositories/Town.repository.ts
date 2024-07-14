import { EntityRepository } from "@mikro-orm/core";
import { Town } from "../entities/Town.entity.js";
import LiveLocation from "../classes/liveLocation.js";
import { Location } from "../entities/Location.entity.js";
import { Player } from "../entities/Player.entity.js";

export default class TownRepository extends EntityRepository<Town> {

    async findByName(name: string) {
        const town = await this.findOne({ name });

        if (!town) {
            return null;
        }

        const locationRepository = this.em.getRepository(Location);

        const [spawnLocation, outposts] = await Promise.all([
            locationRepository.findOne({ id: town.spawnLocationId }),
            locationRepository.find({ id: { $in: town.outpostLocationIds } })
        ]);

        console.log(town);


        return {
            id: town.id,
            name: town.name,
            pvp: town.pvp,
            nation: town.nation,
            spawnLocation: spawnLocation!,
            mayor: town.mayor,
            assistants: town.assistants,
            residents: town.residents,
            outposts: outposts!,
            createdAt: town.createdAt,
            updatedAt: town.updatedAt
        }
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
