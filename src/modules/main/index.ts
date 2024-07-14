import { bot } from "../../core/index.js";
import Module from "../../core/base/module.js";
import SessionHandler from "./handlers/sessions.handler.js";
import StatusHandler from "./handlers/status.handler.js";
import TeleportHandler from "./handlers/teleports.handler.js";
import DiscordUpdateManager from "./managers/discordUpdate.manager.js";
import LinkManager from "./managers/links.manager.js";
import MarkerProvider from "./providers/marker.provider.js";
import PlayerPositionProvider from "./providers/playerPosition.provider.js";


export default class MainModule extends Module {
    constructor() {
        super({
            name: "main",
            description: "No description provided"
        });
    }

    public static getMainModule(): MainModule {
        return bot.moduleLoader.getModule("main") as MainModule;
    }

    async onLoad(): Promise<boolean> {

        PlayerPositionProvider.init()
        MarkerProvider.init()
        LinkManager.init()
        SessionHandler.init()
        TeleportHandler.init()
        StatusHandler.init()
        DiscordUpdateManager.init()

        return true;
    }

}   
