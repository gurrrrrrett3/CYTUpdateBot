import { ServerEnum } from "../types/serverEnum";

export default class LiveLocation {
    public x: number;
    public z: number;
    public world: string;
    public server: ServerEnum;

    constructor(server: ServerEnum, world: string, x: number, z: number) {
        this.server = server;
        this.world = world;
        this.x = x;
        this.z = z;
    }

    public clone() {
        return new LiveLocation(this.server, this.world, this.x, this.z);
    }

    public updatePosition(x: number, z: number) {
        this.x = x;
        this.z = z;
    }

    public update(world: string, x: number, z: number) {
        this.world = world;
        this.x = x;
        this.z = z;
    }

    public getDistance(location: LiveLocation) {
        return Math.sqrt(Math.pow(this.x - location.x, 2) + Math.pow(this.z - location.z, 2));
    }

    public floor() {
        return new LiveLocation(this.server, this.world, Math.floor(this.x), Math.floor(this.z));
    }

    public equals(location: LiveLocation) {
        return this.server === location.server && this.world === location.world && this.x === location.x && this.z === location.z;
    }

    public toString() {
        return `${this.server} ${this.world} ${this.x} ${this.z}`;
    }
}