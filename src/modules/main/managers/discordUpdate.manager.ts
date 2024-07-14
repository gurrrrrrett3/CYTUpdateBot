import { APIEmbedField, Colors, EmbedBuilder, TextChannel } from "discord.js";
import LiveTown from "../classes/liveTown.js";
import EventManager from "./event.manager.js";
import Util from "../util/index.js";
import { bot } from "../../../core/index.js";
import LivePlayer from "../classes/livePlayer.js";
import LiveLocation from "../classes/liveLocation.js";

export enum DiscordUpdateType {
    CREATE,
    DELETE,
    UPDATE
}

export default class DiscordUpdateManager {

    public static readonly TOWN_FALL_CHANNEL = "1248730334837870715"
    public static readonly TOWN_UPDATE_CHANNEL = "1248730360154558607"
    public static readonly JOIN_LEAVE_CHANNEL = "984683631379357716"
    public static readonly EMBED_COLORS = {
        [DiscordUpdateType.CREATE]: Colors.Green,
        [DiscordUpdateType.DELETE]: Colors.Red,
        [DiscordUpdateType.UPDATE]: Colors.Blue
    }

    public static init() {
        EventManager.on('townCreate', this.onTownCreate.bind(this))
        EventManager.on('townDelete', this.onTownDelete.bind(this))
        EventManager.on('townMayorChange', this.onTownMayorChange.bind(this))
        EventManager.on('townAssistantAdd', this.onTownAssistantAdd.bind(this))
        EventManager.on('townAssistantRemove', this.onTownAssistantRemove.bind(this))
        EventManager.on('townResidentAdd', this.onTownResidentAdd.bind(this))
        EventManager.on('townResidentRemove', this.onTownResidentRemove.bind(this))
        EventManager.on('townOutpostAdd', this.onTownOutpostAdd.bind(this))
        EventManager.on('townOutpostRemove', this.onTownOutpostRemove.bind(this))
        EventManager.on('townNationChange', this.onTownNationChange.bind(this))

        EventManager.on('playerJoin', this.onPlayerJoin.bind(this))
        EventManager.on('playerLeave', this.onPlayerLeave.bind(this))
    }

    private static async onTownCreate(town: LiveTown) {
        this.sendTownEmbed(town, DiscordUpdateType.CREATE, "Town Created", `${town.name} has been created by ${town.mayor}.`)
    }

    private static async onTownDelete(town: LiveTown) {
        this.sendTownEmbed(town, DiscordUpdateType.DELETE, "Town Deleted", `${town.name} has fallen.`)
    }

    private static async onTownMayorChange(town: LiveTown, mayor: string) {
        this.sendTownEmbed(town, DiscordUpdateType.UPDATE, "Mayor Change", `${town.name}'s mayor has changed to ${mayor}.`)
    }

    private static async onTownAssistantAdd(town: LiveTown, assistant: string) {
        this.sendTownEmbed(town, DiscordUpdateType.UPDATE, "Assistant Added", `${assistant} has been added as an assistant to ${town.name}.`)
    }

    private static async onTownAssistantRemove(town: LiveTown, assistant: string) {
        this.sendTownEmbed(town, DiscordUpdateType.UPDATE, "Assistant Removed", `${assistant} has been removed as an assistant from ${town.name}.`)
    }

    private static async onTownResidentAdd(town: LiveTown, resident: string) {
        this.sendTownEmbed(town, DiscordUpdateType.UPDATE, "Resident Added", `${resident} has been added as a resident of ${town.name}.`)
    }

    private static async onTownResidentRemove(town: LiveTown, resident: string) {
        this.sendTownEmbed(town, DiscordUpdateType.UPDATE, "Resident Removed", `${resident} has been removed as a resident of ${town.name}.`)
    }

    private static async onTownOutpostAdd(town: LiveTown, outpost: LiveLocation) {
        this.sendTownEmbed(town, DiscordUpdateType.UPDATE, "Outpost Added", `An outpost has been added to ${town.name}.`, [{
            name: "New Outpost",
            value: `World: \`${outpost.world}\`\nx: \`${outpost.x}\`\nz: \`${outpost.z}\`\n[View on Map](${Util.getMapUrlFromLocation(outpost)})`
        }])
    }

    private static async onTownOutpostRemove(town: LiveTown, outpost: LiveLocation) {
        this.sendTownEmbed(town, DiscordUpdateType.UPDATE, "Outpost Removed", `An outpost has been removed from ${town.name}.`, [{
            name: "Removed Outpost",
            value: `World: \`${outpost.world}\`\nx: \`${outpost.x}\`\nz: \`${outpost.z}\`\n[View on Map](${Util.getMapUrlFromLocation(outpost)})`
        }])
    }

    private static async onTownNationChange(town: LiveTown, oldNation: string, newNation: string) {
        this.sendTownEmbed(town, DiscordUpdateType.UPDATE, "Nation Change", `${town.name} has left ${oldNation} to join ${newNation}.`)
    }

    private static async onPlayerJoin(player: LivePlayer) {
        this.sendPlayerEmbed(player, DiscordUpdateType.CREATE, "Player Join", `${player.name} has joined the server.`)
    }

    private static async onPlayerLeave(player: LivePlayer) {
        this.sendPlayerEmbed(player, DiscordUpdateType.DELETE, "Player Leave", `${player.name} has left the server.`)
    }

    private static async sendPlayerEmbed(player: LivePlayer, type: keyof typeof DiscordUpdateManager.EMBED_COLORS, title: string, message: string) {
        const channel = bot.client.channels.resolve(this.JOIN_LEAVE_CHANNEL) as TextChannel

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(message)
            .addFields([
                {
                    name: "Location",
                    value: `World: \`${player.location.world}\`\nx: \`${player.location.x}\`\nz: \`${player.location.z}\`\n[View on Map](${Util.getMapUrlFromLocation(player.location)})`
                }
            ])
            .setThumbnail(`https://mc-heads.net/head/${player.uuid}`)
            .setColor(DiscordUpdateManager.EMBED_COLORS[type])
            .setTimestamp()

        channel.send({
            embeds: [embed]
        })
    }

    private static async sendTownEmbed(town: LiveTown, type: keyof typeof DiscordUpdateManager.EMBED_COLORS, title: string, message: string, fields?: APIEmbedField[]) {
        const channelId = type === DiscordUpdateType.DELETE ? this.TOWN_FALL_CHANNEL : this.TOWN_UPDATE_CHANNEL
        const channel = bot.client.channels.resolve(channelId) as TextChannel

        if (!channel) return

        const embed = this.buildTownEmbed(town, type, title, message, fields)

        channel.send({
            embeds: [embed]
        })
    }

    private static buildTownEmbed(town: LiveTown, type: keyof typeof DiscordUpdateManager.EMBED_COLORS, title: string, message: string, fields?: APIEmbedField[]) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(message)
            .setColor(type === DiscordUpdateType.CREATE ? Colors.Green : type === DiscordUpdateType.DELETE ? Colors.Red : Colors.Blue)
            .setTimestamp()

        const embedFields: APIEmbedField[] = [
            ...fields || [],
            {
                name: "Spawn",
                value: `World: \`${town.spawn.world}\`\nx: \`${town.spawn.x}\`\nz: \`${town.spawn.z}\`\n[View on Map](${Util.getMapUrlFromLocation(town.spawn)})`,
                inline: true
            },
        ]

        town.outposts.forEach((outpost, index) => {
            embedFields.push({
                name: `Outpost ${index + 1}`,
                value: `World:\`${outpost.world}\`\nx: \`${outpost.x}\`\nz: \`${outpost.z}\`\n[View on Map](${Util.getMapUrlFromLocation(outpost)})`,
                inline: true
            })
        })

        embed.addFields(embedFields)

        return embed

    }

}

