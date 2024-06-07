import LiveTown from "../classes/liveTown";
import EventManager from "./event.manager";

export default class TownManager {

    public static towns: Record<string, LiveTown> = {};

    public static update(towns: Record<string, LiveTown>) {

        const oldTowns = this.towns;

        // deleted towns
        for (const townName in oldTowns) {
            if (!towns[townName]) {
                EventManager.emit("townDelete", oldTowns[townName])
            }
        }

        for (const townName in towns) {

            // new towns
            if (!oldTowns[townName]) {
                EventManager.emit("townCreate", towns[townName])
            }

            // mayor changes
            if (oldTowns[townName] && oldTowns[townName].mayor !== towns[townName].mayor) {
                EventManager.emit("townMayorChange", towns[townName], towns[townName].mayor)
            }

            // assistant changes
            const oldAssistants = oldTowns[townName]?.assistants || []
            const newAssistants = towns[townName].assistants

            for (const assistant of newAssistants) {
                if (!oldAssistants.includes(assistant)) {
                    EventManager.emit("townAssistantAdd", towns[townName], assistant)
                }
            }

            for (const assistant of oldAssistants) {
                if (!newAssistants.includes(assistant)) {
                    EventManager.emit("townAssistantRemove", towns[townName], assistant)
                }
            }

            // resident changes

            const oldResidents = oldTowns[townName]?.residents || []
            const newResidents = towns[townName].residents

            for (const resident of newResidents) {
                if (!oldResidents.includes(resident)) {
                    EventManager.emit("townResidentAdd", towns[townName], resident)
                }
            }

            for (const resident of oldResidents) {
                if (!newResidents.includes(resident)) {
                    EventManager.emit("townResidentRemove", towns[townName], resident)
                }
            }

            // outpost changes
            const oldOutposts = oldTowns[townName]?.outposts || []
            const newOutposts = towns[townName].outposts

            for (const outpost of newOutposts) {
                if (oldOutposts.find(o => o.equals(outpost) === undefined)) {
                    EventManager.emit("townOutpostAdd", towns[townName], outpost)
                }
            }

            for (const outpost of oldOutposts) {
                if (newOutposts.find(o => o.equals(outpost) === undefined)) {
                    EventManager.emit("townOutpostRemove", towns[townName], outpost)
                }
            }

        }
    }
}
