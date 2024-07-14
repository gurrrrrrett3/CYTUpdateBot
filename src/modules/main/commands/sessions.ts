import { EmbedBuilder } from "discord.js";
import { db } from "../../../core/index.js";
import SlashCommandBuilder from "../../../core/loaders/objects/customSlashCommandBuilder.js";
import { Session } from "../entities/Session.entity.js";
import PlayerManager from "../managers/payer.manager.js";
import PagedEmbed from "../util/pagedEmbed.js";
import { Player } from "../entities/Player.entity.js";
import TimeUtil from "../util/time.js";
import { time } from "../../../core/utils/time.js";

const Command = new SlashCommandBuilder()
    .setName("sessions")
    .setDescription("Get a user's sessions.")
    .addStringOption(opt =>
        opt.setName("username")
            .setDescription("The username of the player.")
            .setRequired(true)
            .setAutocomplete(PlayerManager.dbPlayerUuidAutoComplete.bind(PlayerManager))
    )
    .setFunction(async (interaction) => {

        const uuid = interaction.options.getString("username", true);
        const sessionRepository = db.em.getRepository(Session);
        const playerRepository = db.em.getRepository(Player);

        let player = await playerRepository.findOne({
            uuid
        }, {
            fields: ['name']
        })

        if (!player) {
            player = await playerRepository.findOne({
                name: uuid
            }, {
                fields: ['name']
            })
        }

        if (!player) {
            return interaction.reply({
                content: "Player not found.",
                ephemeral: true
            })
        }

        new PagedEmbed(interaction, async (page) => {
            const sessions = await sessionRepository.find({
                player: uuid,
            }, {
                limit: 10,
                offset: page * 10,
                orderBy: {
                    startedAt: "DESC"
                },
                fields: ['startedAt', 'endedAt']
            });

            return new EmbedBuilder()
                .setTitle(`${player!.name}'s sessions`)
                .setFields(sessions.map((session, index) => ({
                    name: `Session ${page * 10 + index + 1}`,
                    value: `Started: ${TimeUtil.discordTimestamp(session.startedAt, "longDateTime")}\nEnded: ${session.endedAt ? TimeUtil.discordTimestamp(session.endedAt, "longDateTime") : "Ongoing"}\nDuration: ${time(session.endedAt ? session.endedAt.getTime() - session.startedAt.getTime() : Date.now() - session.startedAt.getTime()).toString(true)}`
                })))
        }, {
            pageCount: Math.ceil(await sessionRepository.count({
                player: uuid
            }) / 10),
            firstLastButtons: true,
            refreshButton: true,
            footer: true,
        })
    });

export default Command;