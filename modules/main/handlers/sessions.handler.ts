import { db } from "../../../core";
import LivePlayer from "../classes/livePlayer";
import { Session } from "../entities/Session.entity";
import EventManager from "../managers/event.manager";

export default class SessionHandler {

    public static init() {
        EventManager.on('playerJoin', this.onPlayerJoin)
        EventManager.on('playerLeave', this.onPlayerLeave)

        process.once('SIGINT', this.onExit)
        process.once('SIGTERM', this.onExit)
    }

    private static async onPlayerJoin(player: LivePlayer) {
        const repo = db.em.getRepository(Session)
        const session = await repo.createFromLivePlayer(player)
        console.log(`${player.name} joined the server`)
    }

    private static async onPlayerLeave(player: LivePlayer) {
        const repo = db.em.getRepository(Session)
        const session = await repo.findActiveSession(player)
        if (session) {
            await repo.endSession(session, player)
            console.log(`${player.name} left the server`)
        }
    }

    private static async onExit() {
        const repo = db.em.getRepository(Session)
        await repo.endActiveSessions()
        process.exit(0)
    }

}