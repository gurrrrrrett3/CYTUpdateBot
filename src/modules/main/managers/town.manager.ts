import { AutocompleteInteraction } from "discord.js";
import { db } from "../../../core/index.js";
import { Logger } from "../../../core/utils/logger.js";
import LiveTown from "../classes/liveTown.js";
import { Location } from "../entities/Location.entity.js";
import { Town } from "../entities/Town.entity.js";
import EventManager from "./event.manager.js";

export default class TownManager {

    public static isFirstUpdate = true;
    public static towns: Record<string, LiveTown> = {};
    public static logger = new Logger("TownManager");

    public static init() {
    }

    public static update(towns: Record<string, LiveTown>) {

        const oldTowns = this.towns;
        const townsToUpdate: Record<string, LiveTown> = {};

        if (this.isFirstUpdate) {
            this.logger.info("First update, skipping comparison")

            this.isFirstUpdate = false;

            this.towns = towns;
            this.updateTownData(towns)
            return;
        }

        // deleted towns
        for (const townName in oldTowns) {
            if (!towns[townName]) {
                EventManager.emit("townDelete", oldTowns[townName])
                townsToUpdate[townName] = oldTowns[townName]
            }
        }

        for (const townName in towns) {
            let needsUpdate = false;

            // new towns
            if (!oldTowns[townName]) {
                EventManager.emit("townCreate", towns[townName])
                needsUpdate = true;
            }

            // mayor changes
            if (oldTowns[townName] && oldTowns[townName].mayor !== towns[townName].mayor) {
                EventManager.emit("townMayorChange", towns[townName], oldTowns[townName].mayor, towns[townName].mayor)
                needsUpdate = true;
            }

            // assistant changes
            const oldAssistants = oldTowns[townName]?.assistants || []
            const newAssistants = towns[townName].assistants

            for (const assistant of newAssistants) {
                if (!oldAssistants.includes(assistant)) {
                    EventManager.emit("townAssistantAdd", towns[townName], assistant)
                    needsUpdate = true;
                }
            }

            for (const assistant of oldAssistants) {
                if (!newAssistants.includes(assistant)) {
                    EventManager.emit("townAssistantRemove", towns[townName], assistant)
                    needsUpdate = true;
                }
            }

            // resident changes

            const oldResidents = oldTowns[townName]?.residents || []
            const newResidents = towns[townName].residents

            for (const resident of newResidents) {
                if (!oldResidents.includes(resident)) {
                    EventManager.emit("townResidentAdd", towns[townName], resident)
                    needsUpdate = true;
                }
            }

            for (const resident of oldResidents) {
                if (!newResidents.includes(resident)) {
                    EventManager.emit("townResidentRemove", towns[townName], resident)
                    needsUpdate = true;
                }
            }

            // outpost changes
            const oldOutposts = oldTowns[townName]?.outposts || []
            const newOutposts = towns[townName].outposts

            for (const outpost of newOutposts) {
                if (oldOutposts.find(o => o.equals(outpost) === undefined)) {
                    EventManager.emit("townOutpostAdd", towns[townName], outpost)
                    needsUpdate = true;
                }
            }

            for (const outpost of oldOutposts) {
                if (newOutposts.find(o => o.equals(outpost) === undefined)) {
                    EventManager.emit("townOutpostRemove", towns[townName], outpost)
                    needsUpdate = true;
                }
            }

            // nation changes
            if (oldTowns[townName]?.nation !== towns[townName].nation) {
                EventManager.emit("townNationChange", towns[townName], oldTowns[townName]?.nation || "None", towns[townName].nation || "None")
                needsUpdate = true;
            }

            // pvp changes
            if (oldTowns[townName]?.pvpEnabled !== towns[townName].pvpEnabled) {
                EventManager.emit("townPvpChange", towns[townName], towns[townName]?.pvpEnabled)
                needsUpdate = true;
            }

            if (needsUpdate) {
                townsToUpdate[townName] = towns[townName]
            }

        }

        this.towns = towns;
        this.updateTownData(townsToUpdate)
    }

    public static async updateTownData(townData: Record<string, LiveTown>) {
        const towns = Object.values(townData)

        const townRepo = db.em.getRepository(Town)
        const locationRepo = db.em.getRepository(Location)

        const townEntities = await Promise.all(towns.map(town => townRepo.findOrCreateNoPerist(town.name, town.spawn, town.mayor, town.pvpEnabled)))

        await Promise.all(townEntities.map(async town => {
            const liveTown = townData[town.name]
            town.mayor = liveTown.mayor
            town.pvp = liveTown.pvpEnabled
            town.nation = liveTown.nation
            town.assistants = liveTown.assistants
            town.residents = liveTown.residents
            town.outpostLocationIds = await Promise.all(liveTown.outposts.map(outpost => locationRepo.findOrCreateByLiveLocation(outpost).then(location => location.id)))
        }))

        await db.em.persistAndFlush(townEntities)
    }

    public static async townAutoComplete(interaction: AutocompleteInteraction, text: string) {
        if (text == "") {
            return Object.keys(this.towns).slice(0, 25).map(townName => ({
                name: townName,
                value: townName
            }))
        }

        return Object.keys(this.towns).filter(townName => townName.toLowerCase().includes(text.toLowerCase())).slice(0, 25).map(townName => ({
            name: townName,
            value: townName
        }))
    }

}
