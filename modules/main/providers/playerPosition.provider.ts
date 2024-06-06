import LiveLocation from "../classes/liveLocation";
import LivePlayer from "../classes/livePlayer";
import EventManager from "../managers/event.manager";
import PlayerManager from "../managers/payer.manager";
import { ResponsePlayers } from "../types/responsePlayers";
import { ServerEnum, ServerUrls } from "../types/serverEnum";

export default class PlayerPositionProvider {

    public static async init() {
        setInterval(async () => {
            await this.updatePlayerPositionData(ServerEnum.TOWNY);
        }, 1000)
    }

    public static async updatePlayerPositionData(server: ServerEnum) {
        const res = await fetch(ServerUrls[server] + "/tiles/players.json").then(res => res.json()) as ResponsePlayers;

        // add new players and update existing players
        const playerData = res.players.map(player => {
            if (!PlayerManager.playerData[player.uuid]) {
                PlayerManager.playerData[player.uuid] = new LivePlayer(player.uuid, player.name, player.health, player.armor, new LiveLocation(server, player.world, player.x, player.z));
                EventManager.emit("playerJoin", PlayerManager.playerData[player.uuid])
            } else {
                const currentLocation = PlayerManager.playerData[player.uuid].location;
                const newLocation = new LiveLocation(server, player.world, player.x, player.z);

                const distance = currentLocation.getDistance(newLocation);
                if (distance > 200 || currentLocation.world !== newLocation.world) {
                    EventManager.emit("playerTeleport", PlayerManager.playerData[player.uuid], currentLocation, newLocation)
                }

                PlayerManager.playerData[player.uuid].update(player.health, player.armor, newLocation);

            }

            return PlayerManager.playerData[player.uuid];
        })

        EventManager.emit("playerPositionUpdate", playerData)

        // remove players that are not in the response
        Object.keys(PlayerManager.playerData).forEach(uuid => {
            if (!res.players.find(player => player.uuid === uuid)) {
                EventManager.emit("playerLeave", PlayerManager.playerData[uuid])
                delete PlayerManager.playerData[uuid];
            }
        })

    }
}
