import { AutocompleteInteraction } from "discord.js";
import LivePlayer from "../classes/livePlayer.js";
import { db } from "../../../core/index.js";
import { Player } from "../entities/Player.entity.js";

export default class PlayerManager {

    public static playerData: Record<string, LivePlayer> = {};

    public static onlineCount() {
        return Object.keys(this.playerData).length;
    }

    public static async livePlayerUuidAutoComplete(interaction: AutocompleteInteraction, text: string) {
        const players = Object.values(PlayerManager.playerData).filter(player => player.name.toLowerCase().includes(text.toLowerCase())).slice(0, 25)

        return players.map(player => ({
            name: player.name,
            value: player.uuid
        }))
    }

    public static async dbPlayerUuidAutoComplete(interaction: AutocompleteInteraction, text: string) {
        const repo = db.em.getRepository(Player)
        const players = await repo.find({ name: { $ilike: `%${text}%` } }, { limit: 25, fields: ['name', 'uuid'] })

        return players.map(player => ({
            name: player.name,
            value: player.uuid
        }))
    }
}