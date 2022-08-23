import {defineStore} from "pinia";
import type {AllMusic, Artists, Music, PlayLists, Tags} from "../types/types";
import {ref} from "vue";
import type {Ref} from "vue";
import WorkFile from "../functions/workFile";

function findDir(allMusic: AllMusic, directory: string): boolean {
    for (const allMusicKey in allMusic) {
        if (allMusic[allMusicKey].path.indexOf(directory) != -1)
            return true
    }
    return false
}

export const useMusic = defineStore("music", () => {

    const allMusic: Ref<AllMusic> = ref({});
    const allMusicStore = new WorkFile("allMusic")
    const playLists: Ref<PlayLists> = ref({all: []})
    const playListsStore = new WorkFile("playLists")
    const directories: Ref<string[]> = ref([])
    const directoriesStore = new WorkFile("directories")
    const artists: Ref<Artists> = ref({})
    const artistsStore = new WorkFile("artists")
    const currentPlayList: Ref<string[]> = ref([])
    const currentPlayListStore = new WorkFile('currentPlayList')
    const currentPlayListName: Ref<string> = ref("")
    const currentPlayListNameStore = new WorkFile("currentPlayListName")

    function setCurrentList(name: string, List?: string[]) {
        currentPlayListName.value = name
        currentPlayListNameStore.write(currentPlayListName.value)
        if (List)
            currentPlayList.value = List
        else if (hasPlayList(name)) {
            currentPlayList.value = playLists.value[name]
        } else {
            throw "not found List"
        }
        currentPlayListStore.write(currentPlayList.value)
    }

    async function setMusic(pathMusics: string[]) {
        const NodeID3 = require('node-id3')

        for (const pathMusic of pathMusics) {
            allMusic.value[pathMusic] = <Music>{
                path: pathMusic,
                name: pathMusic.split("/").pop(),
                type: pathMusic.split("/").pop()?.split('.').pop(),
                star: 0,
                status: 0,
            }
            playLists.value['all'].push(pathMusic)
            NodeID3.read(pathMusic, (err: any, tags: Tags) => {
                if (err)
                    throw err

                if (artists.value[tags.artist])
                    artists.value[tags.artist].push(pathMusic)
                else artists.value[tags.artist] = <string[]>[pathMusic]
                allMusic.value[pathMusic].name = tags.title ? allMusic.value[pathMusic].name + '(' + tags.title + ')' : allMusic.value[pathMusic].name
                artistsStore.write(artists.value)
                allMusicStore.write(allMusic.value)


                playListsStore.write(playLists.value)
            })
        }
    }

    function setDirectory(pathDirectories: string[]) {
        for (const pathDirectory of pathDirectories) {
            if (findDir(allMusic.value, pathDirectory) && !directories.value.find((el) => el == pathDirectory))
                directories.value.push(pathDirectory)
        }
        directoriesStore.write(directories.value)
    }

    function setPlayList(name: string, list: string[]) {
        if (hasPlayList(name))
            playLists.value[name] = list;
        else {
            playLists.value = {[name]: list, ...playLists.value}
        }
        playListsStore.write(playLists.value)
    }

    function setAllMusicOnData() {
        const musics = allMusicStore.read();
        if (musics)
            allMusic.value = musics
    }

    function setDirectoryOnData() {
        const directory = directoriesStore.read()
        if (directory)
            directories.value = directory
    }

    function setArtistOnData() {
        const artist = artistsStore.read()
        if (artist)
            artists.value = artist
    }

    function setCurrentPlayListOnData() {
        const currentListNameOnStore = currentPlayListNameStore.read()
        if (currentListNameOnStore)
            currentPlayListName.value = currentListNameOnStore
        const currentPlayListOnLocalstorage = currentPlayListStore.read()
        if (currentPlayListOnLocalstorage)
            currentPlayList.value = currentPlayListOnLocalstorage
    }

    function setPlayListOnData() {
        const playList = playListsStore.read()
        if (playList) {
            playLists.value = playList
        }
    }

    function setMusicOnData() {
        setAllMusicOnData()
        setDirectoryOnData()
        setArtistOnData()
        setCurrentPlayListOnData()
        setPlayListOnData()
    }

    function hasPlayList(name: string) {
        return name in playLists.value
    }

    return {
        allMusic,
        playLists,
        directories,
        artists,
        currentPlayListName,
        currentPlayList,
        setMusic,
        setDirectory,
        setPlayList,
        setCurrentList,
        setMusicOnData,
        hasPlayList,
    }
});
