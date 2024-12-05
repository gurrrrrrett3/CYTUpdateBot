export enum ServerEnum {
    TOWNY,
    SMP,
}

export const ServerUrls = {
    [ServerEnum.TOWNY]: "https://towny.craftyourtown.com",
    [ServerEnum.SMP]: "https://survival.craftyourtown.com",
}

export const ServerNames = {
    [ServerEnum.TOWNY]: "Towny",
    [ServerEnum.SMP]: "SMP",
}

export const worldLists = {
    [ServerEnum.TOWNY]: ["minecraft_overworld"],
    [ServerEnum.SMP]: [],
} as Record<ServerEnum, string[]>
