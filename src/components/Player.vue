<template>
  <div class="flex justify-center">

    <div class=" w-96">
      {{ name }}
      <img width="100" height="100" :src="cover" :alt="`cover-${name}`" class="avatar rounded-full">
      <br>

      <input
          type="range"
          min="0"
          :max="duration"
          :value="time"
          @input="setTime"
          class="range range-xs radio-primary">

      <div class="flex justify-between">
        <span>{{ secondToTime(time / audio.playbackRate) }}</span>
        <span>{{ secondToTime(duration / audio.playbackRate) }}</span>
      </div>
      <div class="flex ">
        <input type="range" min="0" max="100" :value="audio.volume*100" @input="setVolume">
        <input type="range" min="0.5" max="10" :value="audio.playbackRate" @input="setPlaybackRate" step="0.5">
      </div>

      <div class="btn-group ">
        <button @click="play(audio)" class="btn btn-secondary basis-1/2 ">play</button>
        <button @click="stop(audio)" class="btn btn-primary basis-1/2 ">stop</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {copyFileSync} from "node:fs"
import {defineProps, onUnmounted, ref} from "vue";
import type {Ref} from "vue";
import {Music} from "../types/types";


const props = defineProps<{ music: Music }>()
const emit = defineEmits(['notFound', "finish"])

const cover: Ref<string> = ref("")
const name: Ref<string> = ref("")
const time: Ref<number> = ref(0)
const duration: Ref<number> = ref(0)
const audio: Ref<HTMLAudioElement> = ref(new Audio())

if (props.music) {
  const pathMusic = props.music.path
  const type = props.music.type

  const {read} = require("jsmediatags")
  read(pathMusic, {
    onSuccess: function (result: any) {
      getCover(result);
      getName(result)
    },
    onError: function (error: { type: any; info: any; }) {
      console.error(':(', error.type, error.info);
    }
  });

  copyFileSync(pathMusic, `./music.${type}`)
  audio.value = new Audio(`./music.${type}`)
  if (audio.value)
    if (isNaN(audio.value.duration))
      setTimeout(() => {
        if (audio.value)
          duration.value = audio.value.duration
      }, 500)
    else
      duration.value = audio.value.duration
} else emit('notFound')

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
  if (audio.value)
    audio.value.pause()
})

let getTime: NodeJS.Timer | null = null;

function play(audio: HTMLAudioElement) {
  audio.play()
  getTime = setInterval(() => {
    time.value = audio.currentTime
    if (time.value == duration.value) {
      if (getTime)
        clearInterval(getTime)
      emit('finish')
    }
  }, 1000)
}

function stop(audio: HTMLAudioElement) {
  audio.pause()
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

function getCover(music: { tags: { picture: { data: any; }; }; }) {
  const {data} = music.tags.picture
  let base64String = "";
  for (let i = 0; i < data.length; i++) {
    base64String += String.fromCharCode(data[i]);
  }
  cover.value = `data:${data.format};base64,${window.btoa(base64String)}`;

}

function getName(music: { tags: { title: string; }; }) {
  name.value = music.tags.title
}

</script>
