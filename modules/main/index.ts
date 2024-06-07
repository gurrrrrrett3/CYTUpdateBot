import { bot } from "../../core";
import Module from "../../core/base/module";
import SessionHandler from "./handlers/sessions.handler";
import StatusHandler from "./handlers/status.handler";
import TeleportHandler from "./handlers/teleports.handler";
import DiscordUpdateManager from "./managers/discordUpdate.manager";
import LinkManager from "./managers/links.manager";
import MarkerProvider from "./providers/marker.provider";
import PlayerPositionProvider from "./providers/playerPosition.provider";


export default class MainModule extends Module {
    public name = "main";
    public description = "No description provided";

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
