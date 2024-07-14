import fetch from "node-fetch";
import LiveLocation from "../classes/liveLocation.js";
import LivePlayer from "../classes/livePlayer.js";
import EventManager from "../managers/event.manager.js";
import PlayerManager from "../managers/payer.manager.js";
import { ResponsePlayers } from "../types/responsePlayers.js";
import { ServerEnum, ServerUrls } from "../types/serverEnum.js";

export default class PlayerPositionProvider {

    public static isFirstUpdate = true;

    public static async init() {
        setInterval(async () => {
            await this.updatePlayerPositionData(ServerEnum.TOWNY);
        }, 1000)
    }

    public static async updatePlayerPositionData(server: ServerEnum) {
        const res: ResponsePlayers = await fetch(ServerUrls[server] + "/tiles/players.json")
            .then(res => res.json())
            .catch(err => {
                console.error("Error fetching player data", err);
                return
            });


        // add new players and update existing players
        const playerData = res.players.map(player => {
            if (!PlayerManager.playerData[player.uuid]) {
                PlayerManager.playerData[player.uuid] = new LivePlayer(player.uuid, player.name, player.health, player.armor, new LiveLocation(server, player.world, player.x, player.z));
                if (!this.isFirstUpdate) {
                    EventManager.emit("playerJoin", PlayerManager.playerData[player.uuid])
                }
            } else {
                const currentLocation = PlayerManager.playerData[player.uuid].location;
                const newLocation = new LiveLocation(server, player.world, player.x, player.z);

                const distance = currentLocation.getDistance(newLocation);
                if (distance > 200 || currentLocation.world !== newLocation.world) {
                    if (!this.isFirstUpdate) {
                        EventManager.emit("playerTeleport", PlayerManager.playerData[player.uuid], currentLocation, newLocation)
                    }
                }

                PlayerManager.playerData[player.uuid].update(player.health, player.armor, newLocation);

            }

            return PlayerManager.playerData[player.uuid];
        })

        EventManager.emit("playerPositionUpdate", playerData)

        // remove players that are not in the response
        Object.keys(PlayerManager.playerData).forEach(uuid => {
            if (!res.players.find(player => player.uuid === uuid)) {
                if (!this.isFirstUpdate) {
                    EventManager.emit("playerLeave", PlayerManager.playerData[uuid])
                }
                delete PlayerManager.playerData[uuid];
            }
        })

        this.isFirstUpdate = false;
    }
}
