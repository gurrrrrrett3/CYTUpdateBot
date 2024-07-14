import { ActivityType } from "discord.js"
import { bot } from "../../../core/index.js"
import PlayerManager from "../managers/payer.manager.js"

export default class StatusHandler {
    public static async init() {

        setInterval(async () => {
            const onlineCount = PlayerManager.onlineCount()

            bot.client.user?.setActivity({
                name: `Online: ${onlineCount} players`,
                type: ActivityType.Custom
            })
        }, 15000)

    }
}