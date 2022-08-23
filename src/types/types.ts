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

export interface PlayLists {
    [key: string]: string[]
}

export interface Setting {
    pPath: string,
    numberOfMusicOnList: number,
    hasShuffle: boolean,
    hasLoop: boolean
}

export interface Tags {
    title: string,
    artist: string,
    image: {
        mime: string,
        type: {
            id: number,
            name: string
        },
        description: string,
        imageBuffer: Buffer
    },
    raw: {
        TIT2: string,
        TPE1: string,
        APIC: object
    }
}