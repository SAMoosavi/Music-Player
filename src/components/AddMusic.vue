<template>
  <button class="btn " @click="openFiles">add Folder</button>

</template>

<script setup lang="ts">
// electron
import {dialog} from "@electron/remote";
// node js
import {readdirSync} from "fs";
import {join} from "path";
// pinia
import {useMusic} from "../store/Musics";
import {storeToRefs} from "pinia";

const Music = useMusic()
const {allMusic, directories} = storeToRefs(Music)

let musics: string[] = [];
let directory: string[] = []

function checkType(name: string): boolean {
  let type = name.split('.').pop()
  if (!type)
    return false
  type = type.toLowerCase()
  return type == "mp3" || type == "ogg" || type == "wav";
}

function nextDir(path: string): void {
  for (let file of readDir(path)) {
    const filePath = join(path, file.name)
    if (file.isFile()) {
      if (!allMusic.value[filePath] && checkType(filePath)) musics.push(filePath)
    } else if (file.isDirectory()) {
      if (!directories.value.find((direct) => direct == filePath)) {
        directory.push(filePath)
        nextDir(filePath)
      }
    }
  }
}

function openFiles() {
  dialog.showOpenDialog({
    title: "Select Folder Music",
    properties: ['openDirectory']
  }).then((result: any) => {
        if (!result.canceled) {
          nextDir(result.filePaths[0])
        } else alert("canceled")
        Music.setMusic(musics)
        Music.setDirectory(directory)
        console.log(directories, directory)
      }
  ).catch((error: any) => {
    console.error(error)
  }).finally(() => {
    directory = []
    musics = []
  })
}

function readDir(dir: string) {
  return readdirSync(dir, {withFileTypes: true})
}

</script>

