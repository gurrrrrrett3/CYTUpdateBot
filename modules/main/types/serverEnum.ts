export enum ServerEnum {
    TOWNY,
    SMP,
    PRISON
}

export const ServerUrls = {
    [ServerEnum.TOWNY]: "https://towny.craftyourtown.com",
    [ServerEnum.SMP]: "https://survival.craftyourtown.com",
    [ServerEnum.PRISON]: "https://prison.craftyourtown.com"
}
