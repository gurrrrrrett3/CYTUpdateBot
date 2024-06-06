import LiveLocation from "./liveLocation";

export default class LivePlayer {

    public uuid: string;
    public name: string;
    public health: number;
    public armor: number;

    public location: LiveLocation;

    constructor(uuid: string, name: string, health: number, armor: number, location: LiveLocation) {
        this.uuid = uuid;
        this.name = name;
        this.health = health;
        this.armor = armor;
        this.location = location;
    }

    public update(health: number, armor: number, location: LiveLocation) {
        this.health = health;
        this.armor = armor;
        this.location.update(location.world, location.x, location.z);
    }


}