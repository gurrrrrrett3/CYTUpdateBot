import { db } from "../../../core/index.js";
import LivePlayer from "../classes/livePlayer.js";
import { Session } from "../entities/Session.entity.js";
import EventManager from "../managers/event.manager.js";

export default class SessionHandler {

    public static init() {
        EventManager.on('playerJoin', this.onPlayerJoin)
        EventManager.on('playerLeave', this.onPlayerLeave)

        process.once('SIGINT', this.onExit)
        process.once('SIGTERM', this.onExit)
    }

    private static async onPlayerJoin(player: LivePlayer) {
        const repo = db.em.getRepository(Session)
        await repo.createFromLivePlayer(player)
    }

    private static async onPlayerLeave(player: LivePlayer) {
        const repo = db.em.getRepository(Session)
        const session = await repo.findActiveSession(player)
        if (session) {
            await repo.endSession(session, player)
        }
    }

    private static async onExit() {
        const repo = db.em.getRepository(Session)
        await repo.endActiveSessions()
        process.exit(0)
    }

}