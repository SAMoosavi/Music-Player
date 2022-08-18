<template>
  <div class="flex flex-col gap-2 ">
    <div v-for="(_,namePlayList) in playLists" :key="namePlayList" class="btn btn-primary"
         @click="Music.setCurrentList(namePlayList)">
      {{ namePlayList }}
    </div>
  </div>
</template>

<script setup lang="ts">

import {useMusic} from "../../store/Musics";
import {storeToRefs} from "pinia";

const Music = useMusic()
const {playLists} = storeToRefs(Music)
</script>
