import parse from "node-html-parser";
import { Marker, ResponseMarkers } from "../types/responseMarkers";
import { ServerEnum, ServerUrls, worldLists } from "../types/serverEnum";
import LiveTown from "../classes/liveTown";
import LiveLocation from "../classes/liveLocation";
import TownManager from "../managers/town.manager";

export default class MarkerProvider {

    public static isFirstUpdate = true;

    public static async init() {
        setInterval(async () => {
            await this.updateMarkers(ServerEnum.TOWNY);
        }, 30000)

        this.updateMarkers(ServerEnum.TOWNY)
    }

    public static async updateMarkers(server: ServerEnum) {

        const res = await Promise.all(worldLists[server].map(async world => ({
            world,
            markers: await this.getMarkers(server, world)
        })))

        switch (server) {
            case ServerEnum.TOWNY:
                this.handleTownyMarkers(res)
                break;
            default:
                break;
        }
    }

    public static async getMarkers(server: ServerEnum, world: string): Promise<ResponseMarkers> {
        return fetch(`${ServerUrls[server]}/tiles/${world}/markers.json`).then(res => res.json())
    }

    public static handleTownyMarkers(markers: {
        world: string,
        markers: ResponseMarkers
    }[]) {

        const townyMarkers = markers.map(markerData => ({
            world: markerData.world,
            markers: markerData.markers.find(marker => marker.id === "towny")?.markers || []
        }))

        const townData: IntermediaryTownData[] = []
        const polyData: IntermediaryPolyData[] = []

        townyMarkers.forEach(markerGroup => {
            markerGroup.markers.forEach(marker => {
                const processedTownData = this.processTownyMarker(marker, markerGroup.world)
                if (processedTownData) {
                    switch (processedTownData.type) {
                        case "townMarker":
                            townData.push(processedTownData)
                            break;
                        case "polyMarker":
                            polyData.push(processedTownData)
                            break;
                    }
                }
            })
        })

        if (this.isFirstUpdate) {
            this.isFirstUpdate = false
            return
        }

        TownManager.update(this.mergeTownData(townData, polyData))
    }

    public static processTownyMarker(marker: Marker, world: string) {
        switch (marker.type) {
            case "icon":
                return this.processTownyIconMarker(marker, world)
            case "polygon":
                return this.processTownyPolygonMarker(marker, world)
        }
    }

    public static processTownyIconMarker(marker: Marker, world: string): IntermediaryTownData | undefined {
        if (!marker.popup) {
            return;
        }

        const townData = this.parseTownyIconMarkerPopup(marker.popup)
        const isOutpost = marker.icon == "towny_outpost_icon"
        const position = marker.point!

        if (!townData) {
            return;
        }

        return { type: "townMarker", townData, isOutpost, position, world }

    }

    public static processTownyPolygonMarker(marker: Marker, world: string): IntermediaryPolyData | undefined {

        if (!marker.popup) {
            return;
        }

        const townName = this.parseTownyPolygonMarkerPopup(marker.popup)

        if (!townName) {
            return;
        }

        return { type: "polyMarker", marker, world, townName }
    }

    public static parseTownyIconMarkerPopup(popup: string) {
        const root = parse(popup).querySelector(".infowindow")!
        const iconTitle = root.childNodes[1].innerText
        const iconTitleParsed = /(?<town>\w+) (\((?<nation>\w+)\))?/gm.exec(iconTitle)


        if (!iconTitleParsed) {
            return null
        }

        const town = iconTitleParsed.groups?.town!
        const nation = iconTitleParsed.groups?.nation
        const mayor = root.childNodes[5].innerText
        const assistants = root.childNodes[9].innerText == "None" ? [] : root.childNodes[9].innerText.split(", ")
        const pvp = root.childNodes[13].innerText == "true"
        const residents = root.childNodes[18].innerText == "None" ? [] : root.childNodes[18].innerText.split(", ")

        return { town, nation, mayor, assistants, pvp, residents }

    }

    public static parseTownyPolygonMarkerPopup(popup: string) {
        const root = parse(popup).querySelector(".infowindow")!
        const iconTitle = root.childNodes[1].innerText
        const iconTitleParsed = /(?<town>\w+) (\((?<nation>\w+)\))?/gm.exec(iconTitle)

        if (!iconTitleParsed) {
            return undefined
        }

        const town = iconTitleParsed.groups?.town!

        return town
    }

    public static mergeTownData(townData: IntermediaryTownData[], polyData: IntermediaryPolyData[]) {
        const towns: Record<string, LiveTown> = {}

        townData.forEach(town => {
            if (!towns[town.townData.town]) {
                towns[town.townData.town] = new LiveTown(town.townData.town, new LiveLocation(ServerEnum.TOWNY, town.world, town.position.x, town.position.z), town.townData.mayor, town.townData.pvp)
            }

            if (town.isOutpost) {
                towns[town.townData.town].outposts.push(new LiveLocation(ServerEnum.TOWNY, town.world, town.position.x, town.position.z))
            } else {
                towns[town.townData.town].spawn = new LiveLocation(ServerEnum.TOWNY, town.world, town.position.x, town.position.z)
                towns[town.townData.town].assistants = town.townData.assistants
                towns[town.townData.town].residents = town.townData.residents
            }
        })

        // will implement this later
        // polyData.forEach(poly => {
        // })

        console.log(`Processed ${Object.keys(towns).length} towns and ${Object.values(towns).reduce((acc, town) => acc + town.claims.length, 0)} claims`)

        return towns
    }

    public static isPointInPolygon(x: number, z: number, points: { x: number, z: number }[]) {
        let inside = false
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const xi = points[i].x
            const zi = points[i].z
            const xj = points[j].x
            const zj = points[j].z

            const intersect = ((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)
            if (intersect) {
                inside = !inside
            }
        }

        return inside
    }
}

export interface IntermediaryTownData {
    type: "townMarker"
    townData: {
        town: string,
        nation?: string,
        mayor: string,
        assistants: string[],
        pvp: boolean,
        residents: string[]
    },
    isOutpost: boolean,
    position: { x: number, z: number },
    world: string
}

export interface IntermediaryPolyData {
    type: "polyMarker",
    townName: string,
    marker: Marker,
    world: string
}