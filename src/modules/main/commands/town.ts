import { Colors, EmbedBuilder } from "discord.js";
import SlashCommandBuilder from "../../../core/loaders/objects/customSlashCommandBuilder.js";
import { time } from "../../../core/utils/time.js";
import { db } from "../../../core/index.js";
import { Town } from "../entities/Town.entity.js";
import TownManager from "../managers/town.manager.js";
import Util from "../util/index.js";
import PagedEmbed from "../util/pagedEmbed.js";

const Command = new SlashCommandBuilder()
    .setName("town")
    .setDescription("Lookup town data.")
    .addStringOption(opt =>
        opt.setName("town")
            .setDescription("The town name.")
            .setRequired(true)
            .setAutocomplete(TownManager.townAutoComplete.bind(TownManager))
    )
    .setFunction(async (interaction) => {
        const townName = interaction.options.getString("town", true);
        const townRepository = db.em.getRepository(Town);

        const town = await townRepository.findByName(townName);

        if (!town) {
            return interaction.reply({
                content: "Town not found.",
                ephemeral: true
            })
        }

        console.log(town)

        new PagedEmbed(interaction, async (page) => {
            return new EmbedBuilder()
                .setTitle(town.name)
                .addFields(
                    {
                        name: "Mayor",
                        value: `\`${town.mayor}\``,
                        inline: true
                    },
                    {
                        name: "Location",
                        value: `\`${town.spawnLocation.cleanWorld}: ${town.spawnLocation.x}, ${town.spawnLocation.z}\`\n[View on Map](${Util.getMapUrlFromLocation(town.spawnLocation)})`,
                        inline: true
                    },
                    {
                        name: "PVP",
                        value: town.pvp ? "Enabled" : "Disabled",
                        inline: true
                    },
                    ...town.outposts.map((outpost, i) => ({
                        name: `Outpost ${i + 1}`,
                        value: `${outpost.cleanWorld}: ${outpost.x}, ${outpost.z}\n[View on Map](${Util.getMapUrlFromLocation(outpost)})`,
                    })),
                    {
                        name: "Assistants",
                        value: town.assistants.length ? town.assistants.map(a => `\`${a}\``).join(", ") : "None",
                    },
                    {
                        name: "Residents",
                        value: town.residents.slice(page * 25, (page + 1) * 25).map(r => `\`${r}\``).join(", "),

                    }
                )
                .setColor(Colors.Blue)
                .setTimestamp()
        }, {
            pageCount: Math.ceil(town.residents.length / 25),
            refreshButton: true,
            footer: true,
            firstLastButtons: true
        })
    });

export default Command;