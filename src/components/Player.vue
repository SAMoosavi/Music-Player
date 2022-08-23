<template>
  <div class="card mx-1">
    <div>
      {{ name }}
    </div>
    <br>
    <img width="100" height="100" :src="cover" :alt="`cover-${name}`" class="avatar rounded-full">
    <br>
    <div class="relative">
      <div v-if="start" class="absolute bg-red-800 w-1 h-5 -top-3 z-50"
           :style="`left: ${startTime/duration*100}%`"></div>
      <div v-if="end" class="absolute bg-green-800 w-1 h-5 -top-3 z-50"
           :style="`left: ${endTime/duration*100}%`"></div>
      <input
          :disabled="!hasMusic"
          type="range"
          min="0"
          :max="duration"
          :value="time"
          @input="setTime"
          class="range range-xs  radio-primary">
      <div v-for="likeTime in likeTimes" :key="likeTime" class="absolute bg-yellow-500 w-1 h-5 top-3 z-50"
           :style="`left: ${likeTime/duration*100}%`"
           @click="deleteLikeTime(likeTime)"></div>
    </div>
    <br>
    <div class="flex justify-between">
      <span>{{ secondToTime(time / audio.playbackRate) }}</span>
      <span>{{ secondToTime(duration / audio.playbackRate) }}</span>
    </div>
    <br>
    <div class="flex ">
      <input type="range" min="0" max="100" :value="audio.volume*100" @input="setVolume">
      <input type="range" min="0.5" max="10" :value="audio.playbackRate" @input="setPlaybackRate" step="0.5"
      >
    </div>
    <br>
    <div class="btn-group ">
      <button @click="play" class="btn btn-secondary basis-1/2 ">play</button>
      <button @click="stop" class="btn btn-primary basis-1/2 " :disabled="!hasMusic">stop</button>
    </div>
    <br>
    <div class="btn-group ">
      <button @click="setStart" class="btn btn-secondary basis-1/3 " :disabled="!hasMusic">setStart</button>
      <button @click="setEnd" class="btn btn-primary basis-1/3 " :disabled="!hasMusic">setEnd</button>
      <button @click="deleteTime" class="btn btn-secondary basis-1/3 " :disabled="!hasMusic">deleteTime</button>
    </div>
    <br>
    <div class="btn-group">
      <button @click="addLikeTime" class="btn btn-secondary basis-full " :disabled="!hasMusic">add like time</button>
      <div class="flex flex-wrap gap-0 rounded-md">
        <div v-for="likeTime in likeTimes" :key="likeTime" class="btn btn-sm rounded-none"
             @click="goToLikeTime(likeTime)">
          {{ secondToTime(likeTime / audio.playbackRate) }}
        </div>
      </div>
    </div>
    <br>
    <div class="btn-group">
      <button @click="emits('next')" class="btn btn-secondary basis-1/2 " :disabled="!hasNext">
        next
      </button>
      <button @click="emits('prevent')" class="btn btn-primary basis-1/2 " :disabled=" !hasPrevent">
        prevent
      </button>
    </div>
    <br>
    <div class="btn-group">
      <button @click="emits('shuffle')" class="btn btn-secondary basis-1/2 " :class="{'btn-outline':hasShuffle}">
        shuffle
      </button>
      <button @click="emits('loop')" class="btn btn-primary basis-1/2 " :class="{'btn-outline':hasLoop}">
        loop
      </button>
    </div>
    <br>
    <div class="rating">
      <input value="0" type="radio" v-model="rating" class="hidden">
      <input v-for="i in 5" :key="i" type="radio" :value="i" v-model="rating"
             class="mask mask-star-2 bg-orange-400"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {copyFileSync, rmSync, existsSync} from "node:fs"
import {defineProps, onMounted, onUnmounted, ref, watch} from "vue";
import type {Ref} from "vue";
import {Music, Tags} from "../types/types";
import {useSetting} from "../store/setting";
import {storeToRefs} from "pinia";


const props = defineProps<{ music: Music, hasNext: boolean, hasPrevent: boolean, hasShuffle: boolean, hasLoop: boolean }>()
const emits = defineEmits(['notFound', "finish", "prevent", "next", "loop", "shuffle"])

const rating: Ref<number> = ref(0)
const likeTimes: Ref<number[]> = ref([])
const start: Ref<boolean> = ref(false)
const startTime: Ref<number> = ref(0)
const end: Ref<boolean> = ref(false)
const endTime: Ref<number> = ref(0)
const cover: Ref<string> = ref("")
const name: Ref<string> = ref("")
const time: Ref<number> = ref(0)
const duration: Ref<number> = ref(0)
const audio: Ref<HTMLAudioElement> = ref(new Audio())

const hasMusic: Ref<boolean> = ref(!!props.music)

const Setting = useSetting()
const {setting} = storeToRefs(Setting)

onMounted(() => createMusic())
watch(() => props.music, () => {
  hasMusic.value = !!props.music
  createMusic()
})


function removeFile() {
  if (setting.value.pPath != "") {
    if (existsSync(setting.value.pPath))
      rmSync(setting.value.pPath)
  }
}

function createMusic() {
  if (hasMusic.value) {
    const pathMusic = props.music.path
    name.value = props.music.name

    const nodeId3 = require('node-id3')
    nodeId3.read(pathMusic, (err: any, tags: Tags) => {
      if (err)
        throw err
      getCover(tags)
    })

    const type = props.music.type.toLowerCase()
    const i = Math.random().toString().split('.').pop()
    let newPath = `./src/Music/${i}.${type}`
    audio.value.pause()
    removeFile()
    copyFileSync(pathMusic, newPath)
    Setting.setPPath(newPath)
    audio.value = new Audio(newPath)
    audio.value.load()
    play()

    if (isNaN(audio.value.duration))
      setTimeout(() => {
        if (audio.value)
          duration.value = audio.value.duration
        while (isNaN(duration.value))
          duration.value = audio.value.duration
      }, 500)
    else duration.value = audio.value.duration
  } else
    emits('notFound')
}

function goToLikeTime(likeTime: number) {
  likeTime -= 3
  if (likeTime < 0)
    likeTime = 0
  audio.value.currentTime = likeTime
  time.value = likeTime
}

function deleteLikeTime(time: number) {
  likeTimes.value.splice(likeTimes.value.indexOf(time), 1)
}

function addLikeTime() {
  if (likeTimes.value.indexOf(audio.value.currentTime) == -1) {
    likeTimes.value.push(audio.value.currentTime)
    likeTimes.value.sort((a, b) => a - b)
  }
}

function deleteTime() {
  start.value = false
  end.value = false
}

function setStart() {
  startTime.value = audio.value.currentTime
  start.value = true
}

function setEnd() {
  endTime.value = audio.value.currentTime
  end.value = true
}

function setPlaybackRate(ev: any) {
  audio.value.playbackRate = ev.target.value
}

function setVolume(ev: any) {
  audio.value.volume = ev.target.value / 100
}

function setTime(ev: any) {
  audio.value.currentTime = ev.target.value
  time.value = ev.target.value
}

onUnmounted(() => {
  audio.value.pause()
  removeFile()
})

let getTime: NodeJS.Timer | null = null;

function play() {
  if (hasMusic.value) {
    audio.value.play()
    getTime = setInterval(() => {
      if (start.value && audio.value.currentTime < startTime.value)
        audio.value.currentTime = startTime.value
      else if (end.value && audio.value.currentTime > endTime.value)
        audio.value.currentTime = startTime.value

      time.value = audio.value.currentTime
      if (time.value == duration.value) {
        if (getTime)
          clearInterval(getTime)
        emits('finish')
      }
    }, 1000)
  } else emits('next')
}

function stop() {
  audio.value.pause()
  if (getTime)
    clearInterval(getTime)
}

function setTwoNum(num: number | string) {
  if (+num < 10) {
    return "0" + num
  }
  return num
}

function secondToTime(timeNum: number) {
  timeNum = Math.floor(timeNum)
  const second = timeNum % 60
  timeNum = Math.floor((timeNum / 60))
  const minot = timeNum % 60
  timeNum = Math.floor((timeNum / 60))
  return (timeNum > 0 ? timeNum + ":" : "") + setTwoNum(minot) + ":" + setTwoNum(second)
}

function getCover(music: Tags) {
  const image = music.image
  const data = image.imageBuffer
  let base64String = "";
  for (let i = 0; i < data.length; i++) {
    base64String += String.fromCharCode(data[i]);
  }
  cover.value = `data:${image.type};base64,${window.btoa(base64String)}`;
}

</script>
