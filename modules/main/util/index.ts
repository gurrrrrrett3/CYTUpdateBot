import LiveLocation from "../classes/liveLocation";
import { ServerEnum, ServerUrls } from "../types/serverEnum";

export default class Util {
    public static getMapUrl(server: ServerEnum, world: string, x: number, z: number, zoom: number = 3) {
        return `${ServerUrls[server]}/#${world};flat;${x};64:${z};${zoom}`
    }

    public static getMapUrlFromLocation(location: LiveLocation, zoom: number = 3) {
        return this.getMapUrl(location.server, location.world, location.x, location.z, zoom);
    }
}