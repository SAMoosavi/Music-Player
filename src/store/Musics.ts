import {defineStore} from "pinia";

export const useMusic = defineStore("music", {
    state: () => ({
        musicsWithDir: <any>{},
        allMusic: <any>{},
        playLists: <any>{},
        directories: <string[]>[],
    }),
    getters: {
        getMusicsWithDir: (state) => state.musicsWithDir,
        getAllMusic: (state) => state.allMusic,
        getPlayLists: (state) => (playList: string) => state.playLists[playList],
        getDirectories: (state) => state.directories,
    },
    actions: {
        setMusic(pathMusics: string[]) {
            for (const pathMusic of pathMusics) {
                this.allMusic[pathMusic] = {
                    path: pathMusic,
                    name: pathMusic.split("/").pop(),
                    star: 0,
                    status: 0,
                }
            }
            localStorage.setItem("musics", JSON.stringify(this.allMusic))
        },
        setDirectory(pathDirectories: string[]) {
            this.directories = [...this.directories, ...pathDirectories]
            localStorage.setItem("directories", JSON.stringify(this.directories))
        },
        setPlayList(name: string, list: string[]) {
            this.playLists[name] = list;
        },
    },
});
