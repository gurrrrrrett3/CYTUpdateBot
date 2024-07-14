import SlashCommandBuilder from "../../../core/loaders/objects/customSlashCommandBuilder.js";
import PlayerManager from "../managers/payer.manager.js";

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

    });

export default Command;