import LiveLocation from "../classes/liveLocation.js";
import { Location } from "../entities/Location.entity.js";
import { ServerEnum, ServerUrls } from "../types/serverEnum.js";

export default class Util {
    public static getMapUrl(server: ServerEnum, world: string, x: number, z: number, zoom: number = 3) {
        return `${ServerUrls[server]}/#${world};flat;${x},64,${z};${zoom}`
    }

    public static getMapUrlFromLocation(location: LiveLocation | Location, zoom: number = 3) {
        return this.getMapUrl(location.server, location.world, location.x, location.z, zoom);
    }
}