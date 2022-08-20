import {defineStore} from "pinia";
import {reactive} from "vue";
import {Setting} from "../types/types";
import WorkFile from "../functions/workFile";

export const useSetting = defineStore("setting", () => {
    const setting: Setting = reactive({pPath: "", numberOfMusicOnList: -1, hasShuffle: false, hasLoop: false})
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
        const settingOnStore = settingStore.read()
        if (settingOnStore) {
            for (const settingKey in setting) {
                // @ts-ignore
                setting[settingKey] = settingOnStore[settingKey]
            }
        }
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
