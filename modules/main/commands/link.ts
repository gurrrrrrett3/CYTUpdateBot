import { Colors, EmbedBuilder } from "discord.js";
import SlashCommandBuilder from "../../../core/loaders/objects/customSlashCommandBuilder";
import LinkManager from "../managers/links.manager";
import PlayerManager from "../managers/payer.manager";

const Command = new SlashCommandBuilder()
  .setName("link")
  .setDescription("Link your Minecraft account to your Discord account.")
  .addStringOption(opt =>
    opt.setName("username")
      .setDescription("Your Minecraft username.")
      .setRequired(true)
      .setAutocomplete(PlayerManager.livePlayerUuidAutoComplete.bind(PlayerManager))
  )
  .setFunction(async (interaction) => {
    const uuid = interaction.options.getString("username")!;
    const player = PlayerManager.playerData[uuid];

    if (!player) {
      return interaction.reply("Player not found.")
    }

    const linkInfo = await LinkManager.link(player.uuid)

    const embed = new EmbedBuilder()
      .setTitle("Linking your account")
      .setDescription(`Join the towny server and stand on the **${linkInfo.block}** to link your account.\nThis will expire in 5 minutes.`)
      .setColor(Colors.Blue)

    const msg = await interaction.reply({
      embeds: [embed]
    })

    linkInfo.promise.then(async uuid => {
      const message = await msg.fetch()
      const embed = new EmbedBuilder()
        .setTitle("Account linked")
        .setDescription(`Your account has been successfully linked to \`${player.name}\``)
        .setColor(Colors.Green)

      message.channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [embed]
      })

    })



  });

export default Command;

// Use the "command" snippet to create a new command