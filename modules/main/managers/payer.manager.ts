import { AutocompleteInteraction } from "discord.js";
import LivePlayer from "../classes/livePlayer";

export default class PlayerManager {

    public static playerData: Record<string, LivePlayer> = {};

    public static onlineCount() {
        return Object.keys(this.playerData).length;
    }

    public static async playerUuidAutoComplete(interaction: AutocompleteInteraction, text: string) {
        const players = Object.values(PlayerManager.playerData).filter(player => player.name.toLowerCase().includes(text.toLowerCase()));

        return players.map(player => ({
            name: player.name,
            value: player.uuid
        }))
    }
}