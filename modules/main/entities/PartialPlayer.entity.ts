import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity()
export class PartialPlayer {
    @PrimaryKey()
    name: string

    constructor(name: string) {
        this.name = name;
    }
}