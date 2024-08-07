import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    ContextMenuCommandInteraction,
    EmbedBuilder,
    ModalSubmitInteraction,
    StringSelectMenuInteraction,
} from "discord.js";
import id from "./id.js";
import { bot } from "../../../core/index.js";
import MainModule from "../index.js";

export default class PagedEmbed {
    public readonly globalKey = id();
    public currentPage = 0;
    constructor(
        interaction:
            | ChatInputCommandInteraction
            | ButtonInteraction
            | StringSelectMenuInteraction
            | ModalSubmitInteraction
            | ContextMenuCommandInteraction,
        public generateEmbed: (page: number) => Promise<EmbedBuilder>,
        public options?: {
            pageCount?: number;
            currentPage?: number;
            refreshButton?: boolean;
            firstLastButtons?: boolean;
            footer?: boolean;
            extraFooterText?: string;
            firstSendEdit?: boolean;
        }
    ) {
        if (options?.currentPage) {
            this.currentPage = options.currentPage;
        }

        this.registerButtons();
        if (options?.firstSendEdit) {
            this.editReply(interaction).catch((err) => MainModule.getMainModule().logger.error(err));
        } else {
            this.send(interaction).catch((err) => MainModule.getMainModule().logger.error(err));
        }
    }

    public registerButtons() {
        if (this.options?.refreshButton) {
            bot.buttonManager.registerButton(`${this.globalKey}-refresh`, async (btn: ButtonInteraction) => {
                await this.update(btn).catch((err) => MainModule.getMainModule().logger.error(err));
            });
        }

        if (this.options?.firstLastButtons) {
            bot.buttonManager.registerButton(`${this.globalKey}-first`, async (btn: ButtonInteraction) => {
                this.currentPage = 0;
                await this.update(btn).catch((err) => MainModule.getMainModule().logger.error(err));
            });

            bot.buttonManager.registerButton(`${this.globalKey}-last`, async (btn: ButtonInteraction) => {
                this.currentPage = this.options?.pageCount || 0;
                await this.update(btn).catch((err) => MainModule.getMainModule().logger.error(err));
            });
        }

        bot.buttonManager.registerButton(`${this.globalKey}-prev`, async (btn: ButtonInteraction) => {
            this.currentPage--;
            await this.update(btn).catch((err) => MainModule.getMainModule().logger.error(err));
        });

        bot.buttonManager.registerButton(`${this.globalKey}-next`, async (btn: ButtonInteraction) => {
            this.currentPage++;
            await this.update(btn).catch((err) => MainModule.getMainModule().logger.error(err));
        });
    }

    public async generateButtons() {
        const row = new ActionRowBuilder<ButtonBuilder>();
        const prev = new ButtonBuilder()
            .setCustomId(`${this.globalKey}-prev`)
            .setEmoji("⬅️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(this.currentPage === 0);
        const next = new ButtonBuilder()
            .setCustomId(`${this.globalKey}-next`)
            .setEmoji("➡️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(this.options?.pageCount != undefined && this.currentPage === this.options!.pageCount - 1);
        const first = new ButtonBuilder()
            .setCustomId(`${this.globalKey}-first`)
            .setEmoji("⏮️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(this.currentPage === 0);
        const last = new ButtonBuilder()
            .setCustomId(`${this.globalKey}-last`)
            .setEmoji("⏭️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(this.options?.pageCount != undefined && this.currentPage === this.options!.pageCount - 1);
        const refresh = new ButtonBuilder()
            .setCustomId(`${this.globalKey}-refresh`)
            .setEmoji("🔄")
            .setStyle(ButtonStyle.Secondary);

        if (this.options?.firstLastButtons) {
            row.addComponents(first, prev, next, last);
        } else {
            row.addComponents(prev, next);
        }

        if (this.options?.refreshButton) {
            row.addComponents(refresh);
        }

        return row;
    }

    public async update(btn: ButtonInteraction) {
        await btn
            .update({
                embeds: [await this.getEmbed()],
                components: [await this.generateButtons()],
            })
            .catch(console.error);
    }

    public async editReply(
        interaction:
            | ChatInputCommandInteraction
            | ButtonInteraction
            | StringSelectMenuInteraction
            | ModalSubmitInteraction
            | ContextMenuCommandInteraction
    ) {
        await interaction
            .editReply({
                embeds: [await this.getEmbed()],
                components: [await this.generateButtons()],
            })
            .catch(console.error);
    }

    public async send(
        interaction:
            | ChatInputCommandInteraction
            | ButtonInteraction
            | StringSelectMenuInteraction
            | ModalSubmitInteraction
            | ContextMenuCommandInteraction
    ) {
        await interaction
            .reply({
                embeds: [await this.getEmbed()],
                components: [await this.generateButtons()],
            })
            .catch((err) => MainModule.getMainModule().logger.error(err));
    }

    public async getEmbed() {
        const embed = await this.generateEmbed(this.currentPage);
        if (this.options?.footer) {
            embed.setFooter({
                text: `Page ${this.currentPage + 1}/${(this.options?.pageCount || 0)}${this.options?.extraFooterText ? ` | ${this.options?.extraFooterText}` : ""
                    }`,
            });
        }

        return embed;
    }
}