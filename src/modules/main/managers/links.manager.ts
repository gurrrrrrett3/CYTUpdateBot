import LivePlayer from "../classes/livePlayer.js";
import { VerificationBlockLocationOffsets, VerificationBlockLocations } from "../util/verificationBlockLocations.js";
import EventManager from "./event.manager.js";

export default class LinkManager {

    // uuid
    public static links: Record<string, {
        blockId: number,
        resolve: (value: string) => void
    }> = {};

    public static init() {
        EventManager.on('playerPositionUpdate', this.onPlayerData.bind(this))
    }

    public static async link(playerUuid: string) {
        const blockId = Math.floor(Math.random() * 9);

        const promise = new Promise<string | undefined>((resolve) => {
            setTimeout(() => {
                delete this.links[playerUuid]
                resolve(undefined)
            }, 1000 * 60 * 5)

            this.links[playerUuid] = {
                blockId,
                resolve
            }
        })

        return {
            block: VerificationBlockLocations.blocks[blockId],
            promise
        }
    }

    private static async onPlayerData(data: LivePlayer[]) {
        for (const [uuid, linkInfo] of Object.entries(this.links)) {
            const player = data.find(player => player.uuid === uuid);
            if (!player) {
                delete this.links[uuid];
                continue;
            }

            const blockLocation = this.getBlockLocation(linkInfo.blockId);
            const playerLocation = player.location.floor()

            if (playerLocation.equals(blockLocation)) {

                linkInfo.resolve(uuid)

                delete this.links[uuid];
            }
        }
    }

    public static getBlockLocation(blockId: number) {
        const location = VerificationBlockLocations.centerPos.clone();
        location.x += VerificationBlockLocationOffsets[blockId].x;
        location.z += VerificationBlockLocationOffsets[blockId].z;

        return location;
    }



}