import {defineStore} from "pinia";
import {AllMusic, Artists, Music, PlayLists} from "../types/types";
import {ref} from "vue";
import type {Ref} from "vue";

function findDir(allMusic: AllMusic, directory: string): boolean {
    for (const allMusicKey in allMusic) {
        if (allMusic[allMusicKey].path.indexOf(directory) != -1)
            return true
    }
    return false
}

export const useMusic = defineStore("music", () => {

    const allMusic: Ref<AllMusic> = ref({});
    const playLists: Ref<PlayLists> = ref({})
    const directories: Ref<string[]> = ref([])
    const artists: Ref<Artists> = ref({})


    function setMusic(pathMusics: string[]) {
        const {read} = require("jsmediatags")

        for (const pathMusic of pathMusics) {
            allMusic.value[pathMusic] = <Music>{
                path: pathMusic,
                name: pathMusic.split("/").pop(),
                type: pathMusic.split("/").pop()?.split('.').pop(),
                star: 0,
                status: 0,
            }
            read(pathMusic, {
                onSuccess: async (result: any) => {
                    console.log(Date.now())
                    if (artists.value[result.tags.artist])
                        artists.value[result.tags.artist].push(pathMusic)
                    else artists.value[result.tags.artist] = <string[]>[pathMusic]

                    localStorage.setItem("artists", JSON.stringify(artists))
                },
                onError: ((error: any) => {
                    console.log(error)
                }),
            })
        }
        localStorage.setItem("musics", JSON.stringify(allMusic.value))
    }

    function setDirectory(pathDirectories: string[]) {
        for (const pathDirectory of pathDirectories) {
            if (findDir(allMusic.value, pathDirectory) && !directories.value.find((el) => el == pathDirectory))
                directories.value.push(pathDirectory)
        }
        localStorage.setItem("directories", JSON.stringify(directories))
    }

    function setPlayList(name: string, list: string[]) {
        playLists.value[name] = list;
    }

    function setMusicOnLocalStorage() {
        const musics = localStorage.getItem("musics");
        if (musics)
            allMusic.value = JSON.parse(musics)
    }

    return{
        allMusic,
        playLists,
        directories,
        artists,
        setMusic,
        setDirectory,
        setPlayList,
        setMusicOnLocalStorage
    }
});
