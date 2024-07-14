import { Colors, EmbedBuilder } from "discord.js";
import SlashCommandBuilder from "../../../core/loaders/objects/customSlashCommandBuilder.js";
import { db } from "../../../core/index.js";
import { Town } from "../entities/Town.entity.js";
import { Player } from "../entities/Player.entity.js";
import PlayerManager from "../managers/payer.manager.js";
import { Session } from "../entities/Session.entity.js";
import TimeUtil from "../util/time.js";

const Command = new SlashCommandBuilder()
    .setName("player")
    .setDescription("Lookup player data.")
    .addStringOption(opt =>
        opt.setName("username")
            .setDescription("The username of the player.")
            .setRequired(true)
            .setAutocomplete(PlayerManager.dbPlayerUuidAutoComplete.bind(PlayerManager))
    )
    .setFunction(async (interaction) => {

        const uuid = interaction.options.getString("username", true);
        const playerRepository = db.em.getRepository(Player);
        const townRepo = db.em.getRepository(Town);
        const sessionRepository = db.em.getRepository(Session);

        let player = await playerRepository.findOne({
            uuid
        })

        if (!player) {
            player = await playerRepository.findOne({
                name: uuid
            })
        }

        if (!player) {
            return interaction.reply({
                content: "Player not found.",
                ephemeral: true
            })
        }

        const town = await townRepo.findOne({
            id: player.townId
        })

        const firstSession = await sessionRepository.findOne({
            player: player.uuid
        }, {
            orderBy: {
                startedAt: "ASC"
            }
        })

        const lastSession = await sessionRepository.findOne({
            player: player.uuid
        }, {
            orderBy: {
                startedAt: "DESC"
            }
        })

        const embed = new EmbedBuilder()
            .setTitle(player.name)
            .addFields(
                {
                    name: "UUID",
                    value: player.uuid,
                    inline: true
                },
                {
                    name: "Town",
                    value: town ? town.name : "None",
                    inline: true
                },
                {
                    name: "First Seen",
                    value: firstSession ? `${TimeUtil.discordTimestamp(firstSession.startedAt, "longDateTime")} (${TimeUtil.discordTimestamp(firstSession.startedAt, "relative")})` : "Unknown",
                },
                {
                    name: "Last Seen",
                    value: lastSession ? lastSession.endedAt ? `${TimeUtil.discordTimestamp(lastSession.endedAt, "longDateTime")} (${TimeUtil.discordTimestamp(lastSession.endedAt, "relative")})` : "Currently Online" : "Unknown",
                }
            )
            .setColor(Colors.Blue)
            .setTimestamp()

        interaction.reply({
            embeds: [embed]
        })
    });

export default Command;