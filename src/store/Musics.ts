import {defineStore} from "pinia";
import {AllMusic, Artists, Music} from "../types/types";

function findDir(allMusic: AllMusic, directory: string): boolean {
    for (const allMusicKey in allMusic) {
        if (allMusic[allMusicKey].path.indexOf(directory) != -1)
            return true
    }
    return false
}

export const useMusic = defineStore("music", {
    state: () => ({
        allMusic: <AllMusic>{},
        playLists: <any>{},
        directories: <string[]>[],
        artists: <Artists>{},
    }),
    getters: {
        getAllMusic: (state) => state.allMusic,
        getPlayLists: (state) => (playList: string) => state.playLists[playList],
        getDirectories: (state) => state.directories,
    },
    actions: {
        setMusic(pathMusics: string[]) {
            const {read} = require("jsmediatags")

            for (const pathMusic of pathMusics) {
                this.allMusic[pathMusic] = <Music>{
                    path: pathMusic,
                    name: pathMusic.split("/").pop(),
                    type: pathMusic.split("/").pop()?.split('.').pop(),
                    star: 0,
                    status: 0,
                }
                read(pathMusic, {
                    onSuccess: async (result: any) => {
                        console.log(Date.now())
                        if (this.artists[result.tags.artist])
                            this.artists[result.tags.artist].push(pathMusic)
                        else this.artists[result.tags.artist] = <string[]>[pathMusic]

                        localStorage.setItem("artists", JSON.stringify(this.artists))
                    },
                    onError: ((error: any) => {
                        console.log(error)
                    }),
                })
            }
            localStorage.setItem("musics", JSON.stringify(this.allMusic))
        },
        setDirectory(pathDirectories: string[]) {
            for (const pathDirectory of pathDirectories) {
                if (findDir(this.allMusic, pathDirectory) && !this.directories.find((el) => el == pathDirectory))
                    this.directories.push(pathDirectory)
            }
            localStorage.setItem("directories", JSON.stringify(this.directories))
        },
        setPlayList(name: string, list: string[]) {
            this.playLists[name] = list;
        },
        setMusicOnLocalStorage() {
            const musics = localStorage.getItem("musics");
            if (musics)
                this.allMusic = JSON.parse(musics)
        }
    },
});
