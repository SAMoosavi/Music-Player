import {defineStore} from "pinia";
import {reactive} from "vue";
import {Setting} from "../types/types";
import WorkFile from "../functions/workFile";

export const useSetting = defineStore("setting", () => {
    const setting: Setting = reactive({pPath: "", numberOfMusicOnList: 0, hasShuffle: false, hasLoop: false})
    const settingStore = new WorkFile("setting")

    function setPPath(path: string) {
        setting.pPath = path
        settingStore.write(setting)
    }

    function setNumberOfMusicOnList(num: number) {
        setting.numberOfMusicOnList = num
        settingStore.write(setting)
    }

    function setHasShuffle(status: boolean) {
        setting.hasShuffle = status
        settingStore.write(setting)
    }

    function setHasLoop(status: boolean) {
        setting.hasLoop = status
        settingStore.write(setting)
    }


    function setSettingOnData() {
        const path = settingStore.read()
        if (path)
            setting.pPath = path
        const num = settingStore.read()
        if (num)
            setting.numberOfMusicOnList = Number(num)
        const shuffle = settingStore.read()
        if (shuffle)
            setting.hasShuffle = Boolean(shuffle)
        const loop = settingStore.read()
        if (loop)
            setting.hasLoop = Boolean(loop)
    }

    return {
        setting,
        setPPath,
        setNumberOfMusicOnList,
        setHasLoop,
        setHasShuffle,
        setSettingOnData
    }

});
