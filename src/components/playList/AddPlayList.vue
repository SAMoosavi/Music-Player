<template>
  <div class="sticky top-0 bg-primary p-2">
    <label class="label text-secondary" for="name">name:</label>
    <div class="flex flex gap-2 ">
      <input id="name" type="text" v-model="name" class="input input-secondary bg-transparent">
      <button type="button" class="btn btn-secondary" @click="create">create</button>
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <label v-for="music in playLists['all']" :key="music"
           class="label border border-primary p-2 rounded-2xl cursor-pointer">
      {{ allMusic[music].name }}
      <input type="checkbox" class="checkbox checkbox-secondary ml-2" :value="allMusic[music].path" v-model="list"/>
    </label>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {Ref} from "vue"
import {useMusic} from "../../store/Musics";
import {storeToRefs} from "pinia";

const emits = defineEmits(['goTo'])

const Music = useMusic()
const {playLists, allMusic} = storeToRefs(Music)

const name: Ref<string> = ref("")
const list: Ref<string[]> = ref([])

function create() {
  if (!Music.hasPlayList(name.value)) {
    Music.setPlayList(name.value, list.value)
    emits('goTo', name.value)
    Music.setCurrentList(name.value)
    name.value = ""
    list.value = []
  } else alert('has name set other name')
}
</script>
