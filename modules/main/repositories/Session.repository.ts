import { EntityRepository } from "@mikro-orm/core";
import { Session } from "../entities/Session.entity";
import LivePlayer from "../classes/livePlayer";
import { Player } from "../entities/Player.entity";
import { Location } from "../entities/Location.entity";

export default class SessionRepository extends EntityRepository<Session> {
    public async createFromLivePlayer(player: LivePlayer) {
        const playerRepo = this.getEntityManager().getRepository(Player)
        const locationRepo = this.getEntityManager().getRepository(Location)
        const playerEntity = await playerRepo.findOrCreateFromLivePlayer(player)
        const session = new Session(playerEntity)
        const location = await locationRepo.findOrCreate(player.location.server, player.location.world, player.location.x, player.location.z)
        session.loginLocationId = location?.id

        this.getEntityManager().persistAndFlush(session)
        return session
    }

    public async findActiveSession(player: LivePlayer) {
        const playerRepo = this.getEntityManager().getRepository(Player)
        const playerEntity = await playerRepo.findOne({ uuid: player.uuid })
        if (!playerEntity) return null
        return this.findOne({ player: playerEntity, endedAt: null })
    }

    public async endSession(session: Session, player: LivePlayer) {
        const locationRepo = this.getEntityManager().getRepository(Location)
        const location = await locationRepo.findOrCreate(player.location.server, player.location.world, player.location.x, player.location.z)
        session.endedAt = new Date()
        session.logoutLocationId = location?.id
        this.getEntityManager().persistAndFlush(session)
        return session
    }

    public async findSessionsByPlayer(player: LivePlayer) {
        const playerRepo = this.getEntityManager().getRepository(Player)
        const playerEntity = await playerRepo.findOne({ uuid: player.uuid })
        if (!playerEntity) return []
        return this.find({ player: playerEntity })
    }

    public async endActiveSessions() {
        const sessions = await this.find({ endedAt: null })
        sessions.forEach((session) => {
            session.endedAt = new Date()
        })
        await this.getEntityManager().flush()
    }
}
