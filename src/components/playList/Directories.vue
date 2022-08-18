<template>
  <div @click="setPlayListDir(0)"
       class="grid  btn btn-primary normal-case grid-cols-1">
    all
  </div>
  <div v-for="directory in directories " :key="directory" @click="setPlayListDir(directory)"
       class="grid md:grid-cols-2 btn btn-primary normal-case">
    <div class="text-lg">
      {{ directory.split('/').pop() }}
    </div>
    <div class="text-xs font-light text-neutral">
      {{ directory }}
    </div>

  </div>
</template>

<script setup lang="ts">

import {useMusic} from "../../store/Musics";
import {storeToRefs} from "pinia";

const Music = useMusic()

const {directories, allMusic, currentPlayListName} = storeToRefs(Music)

function setPlayListDir(dir: string | 0) {
  if (dir == 0) {
    if (!(currentPlayListName.value == 'all')) {
      Music.setCurrentList("all")
    }
  } else {
    if (!(currentPlayListName.value == dir)) {
      let list: string[] = []
      for (const allMusicKey in allMusic.value) {
        if (allMusicKey.indexOf(dir) == 0) {
          list.push(allMusicKey)
        }
      }
      Music.setCurrentList(dir, list)
    }
  }
}
</script>