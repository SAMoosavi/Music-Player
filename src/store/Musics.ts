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
    const playLists: Ref<PlayLists> = ref({all: []})
    const directories: Ref<string[]> = ref([])
    const artists: Ref<Artists> = ref({})
    const currentPlayList: Ref<string[]> = ref([])
    const currentList: Ref<string> = ref("")

    function setCurrentList(name: string, List?: string[]) {
        currentList.value = name
        localStorage.setItem("currentList", currentList.value)
        if (playLists.value[name])
            currentPlayList.value = playLists.value[name]
        else {
            if (List)
                currentPlayList.value = List
            else
                throw "not found List"
        }
        localStorage.setItem("currentPlayList", JSON.stringify(currentPlayList.value))
    }

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
            playLists.value['all'].push(pathMusic)
            read(pathMusic, {
                onSuccess: async (result: any) => {
                    console.log(Date.now())
                    if (artists.value[result.tags.artist])
                        artists.value[result.tags.artist].push(pathMusic)
                    else artists.value[result.tags.artist] = <string[]>[pathMusic]

                    localStorage.setItem("artists", JSON.stringify(artists.value))
                },
                onError: ((error: any) => {
                    console.log(error)
                }),
            })
        }
        localStorage.setItem("musics", JSON.stringify(allMusic.value))
        localStorage.setItem("playLists", JSON.stringify(playLists.value))
    }

    function setDirectory(pathDirectories: string[]) {
        for (const pathDirectory of pathDirectories) {
            if (findDir(allMusic.value, pathDirectory) && !directories.value.find((el) => el == pathDirectory))
                directories.value.push(pathDirectory)
        }
        localStorage.setItem("directories", JSON.stringify(directories.value))
    }

    function setPlayList(name: string, list: string[]) {
        playLists.value[name] = list;
    }

    function setMusicOnLocalStorage() {
        const musics = localStorage.getItem("musics");
        if (musics)
            allMusic.value = JSON.parse(musics)
    }

    function setDirectoryOnLocalStorage() {
        const directory = localStorage.getItem("directories")
        if (directory)
            directories.value = JSON.parse(directory)
    }

    function setArtistOnLocalStorage() {
        const artist = localStorage.getItem("artists")
        if (artist)
            artists.value = JSON.parse(artist)
    }

    function setCurrentPlayListOnLocalStorage() {
        const currentListOnLocalStorage = localStorage.getItem("currentList")
        if (currentListOnLocalStorage)
            currentList.value = currentListOnLocalStorage
        const currentPlayListOnLocalstorage = localStorage.getItem("currentPlayList")
        if (currentPlayListOnLocalstorage)
            currentPlayList.value = JSON.parse(currentPlayListOnLocalstorage)
    }

    function setPlayListOnLocalStorage() {
        const playListOnLocalStorage = localStorage.getItem('playList')
        if (playListOnLocalStorage)
            playLists.value = JSON.parse(playListOnLocalStorage)
    }

    return {
        allMusic,
        playLists,
        directories,
        artists,
        currentList,
        currentPlayList,
        setMusic,
        setDirectory,
        setPlayList,
        setCurrentList,
        setMusicOnLocalStorage,
        setDirectoryOnLocalStorage,
        setArtistOnLocalStorage,
        setCurrentPlayListOnLocalStorage,
        setPlayListOnLocalStorage,
    }
});
