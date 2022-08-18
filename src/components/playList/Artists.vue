<template>
  <div @click="setPlayListArtist(0)"
       class="  btn btn-primary normal-case ">
    all
  </div>
  <div v-for="artist in artistsList " :key="artist" @click="setPlayListArtist(artist)"
       class="flex justify-between btn btn-primary normal-case">
    <div class="text-lg">
      {{ artist }}
    </div>
    <div class="text-neutral">
      [{{ artists[artist].length }}]
    </div>

  </div>
</template>

<script setup lang="ts">

import {useMusic} from "../../store/Musics";
import {storeToRefs} from "pinia";
import {onMounted, ref, watch} from "vue";
import type {Ref} from "vue";

const Music = useMusic()

const {artists,  currentPlayListName} = storeToRefs(Music)

const artistsList: Ref<string[]> = ref([])

onMounted(() => {
  getArtist()
})

function getArtist() {
  for (const artistsKey in artists.value) {
    artistsList.value.push(artistsKey)
  }
}

watch(() => artists.value.length, () => getArtist())

function setPlayListArtist(artist: string | 0) {
  if (artist == 0) {
    if (!(currentPlayListName.value == 'all')) {
      Music.setCurrentList("all")
    }
  } else {
    if (!(currentPlayListName.value == artist)) {
      Music.setCurrentList(artist, artists.value[artist])
    }
  }
}
</script>