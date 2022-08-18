<template>
  <div class="grid md:grid-cols-3">
    <div class="flex flex-col gap-3 mx-2 mt-5">
      <div class="btn-group">
        <button class="btn btn-primary" @click="whichPlayList('dir')">directories</button>
        <button class="btn btn-secondary" @click="whichPlayList('artist')">artist</button>
        <button class="btn btn-primary" @click="whichPlayList('addPlayList')">add paly list</button>
        <button class="btn btn-secondary" @click="whichPlayList('playLists')">play Lists</button>
      </div>
      <component :is="playLists[playList]" @play="play" @go-to="goTo"/>
      <div class="border border-2"></div>
      <div v-for="a in currentPlayList" :key="a">
        {{ a }}
      </div>
    </div>
    <Player class="col-span-2" :music="currentMusic" @notFound="" @finish="next" @next="next" @prevent="prevent"
            :hasNext="hasLoop ||n !== currentPlayList.length - 1" :hasPrevent="hasLoop || n !== 0"
            @shuffle="shuffle" @loop="loop"
    />
  </div>


</template>

<script setup lang="ts">
import Directories from "./components/playList/Directories.vue"
import Artists from "./components/playList/Artists.vue"
import AddPlayList from "./components/playList/AddPlayList.vue"
import PlayLists from "./components/playList/PlayLists.vue"
import Player from "./components/Player.vue";
import {onMounted, Ref, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useMusic} from "./store/Musics";

const Music = useMusic()

const {allMusic, currentPlayList, currentPlayListName} = storeToRefs(Music);
let key: string = ""
let n: Ref<number> = ref(0)
const hasLoop: Ref<boolean> = ref(false)

const playList: Ref<string> = ref("addPlayList")

const playLists = {
  'dir': Directories,
  'artist': Artists,
  'addPlayList': AddPlayList,
  'playLists': PlayLists
}

function goTo(name: string) {
  whichPlayList('playLists')
}

function whichPlayList(name: string) {
  playList.value = name
}

function play() {
  n.value = 0
  getCurrentMusic(n.value)
}

function shuffle() {
  const shuffledCurrentPlayList = currentPlayList.value.sort(() => 0.5 - Math.random())
  Music.setCurrentList(Music.currentPlayListName, shuffledCurrentPlayList)
  n.value = 0;
  getCurrentMusic(n.value)
}

function loop() {
  hasLoop.value = !hasLoop.value
}

const currentMusic = ref()


function prevent() {
  n.value--;
  if (n.value < 0) {
    if (hasLoop.value)
      n.value = currentPlayList.value.length - 1
  }
  getCurrentMusic(n.value)
}

function next() {
  n.value++;
  if (n.value > currentPlayList.value.length - 1) {
    if (hasLoop.value)
      n.value = 0
  }
  getCurrentMusic(n.value)
}

function getCurrentMusic(n: number) {
  key = currentPlayList.value[n]
  currentMusic.value = allMusic.value[key]
}

watch(() => currentPlayList.value, () => {
  n.value = 0
  getCurrentMusic(n.value)
})

watch(() => currentPlayListName.value, () => {
  n.value = 0
  getCurrentMusic(n.value)
})

onMounted(() => {
  getCurrentMusic(n.value)
})
</script>