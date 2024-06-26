import LiveLocation from "./liveLocation";

export default class LiveTown {

    public name: string;
    public nation?: string;
    public spawn: LiveLocation;
    public outposts: LiveLocation[] = [];

    public mayor: string;
    public assistants: string[] = [];
    public residents: string[] = [];
    public pvpEnabled: boolean;

    public claims: LiveLocation[] = [];


    constructor(name: string, spawn: LiveLocation, mayor: string, pvpEnabled: boolean) {
        this.name = name;
        this.spawn = spawn;
        this.mayor = mayor;
        this.pvpEnabled = pvpEnabled;
    }
}