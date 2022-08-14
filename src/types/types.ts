export interface Music {
    path: string,
    name: string,
    type: string,
    star: 0 | 1 | 2 | 3 | 4 | 5,
    status: -1 | 0 | 1,
}

export interface AllMusic {
    [key: string]: Music
}

export interface Artists {
    [key: string]: string[]
}