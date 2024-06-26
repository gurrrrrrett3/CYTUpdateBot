export enum ServerEnum {
    TOWNY,
    SMP,
}

export const ServerUrls = {
    [ServerEnum.TOWNY]: "https://towny.craftyourtown.com",
    [ServerEnum.SMP]: "https://survival.craftyourtown.com",
}

export const worldLists = {
    [ServerEnum.TOWNY]: ["minecraft_overworld", "minecraft_fishing"],
    [ServerEnum.SMP]: [],
} as Record<ServerEnum, string[]>
