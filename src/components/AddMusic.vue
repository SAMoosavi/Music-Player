<template>
  <div>
    <input
      ref="inputFile"
      type="file"
      class="hidden"
      @change="changeFile"
      multiple
      webkitdirectory
    />
    <button class="btn" @click="openFils">add Folder</button>
  </div>
</template>

<script setup lang="ts">
//? Pinia
import { useMusic } from "@/store/Musics";
//? vue function
import { ref } from "vue";

const Musics = useMusic();

const inputFile = ref();

function openFils() {
  inputFile.value.click();
}

function checkType(type: string | undefined): boolean {
  return type == "mp3" || type == "ogg" || type == "wav";
}

function changeFile(event: any) {
  const basePath = event.target.files[0].path.substr(
    0,
    event.target.files[0].path.indexOf(
      `/${event.target.files[0].webkitRelativePath}`
    )
  );

  const allMusic = Musics.getAllMusic;
  let music = Musics.getMusicsWithDir;

  for (const file of event.target.files) {
    const pathOfFile: string = file.webkitRelativePath;
    if (!allMusic[pathOfFile]) {
      const splitPathOfFile = pathOfFile.split("/");
      const type = splitPathOfFile[splitPathOfFile.length - 1].split(".").pop();
      if (checkType(type)) {
        const direct = splitPathOfFile[2]
          ? `${basePath}/${splitPathOfFile[0]}/${splitPathOfFile[1]}`
          : `${basePath}/${splitPathOfFile[0]}`;
        const fullPathOfFile = file.path;
        if (direct in music) {
          music[direct] = [fullPathOfFile, ...music[direct]];
        } else {
          music[direct] = [fullPathOfFile];
        }
      }
    }
  }

  Musics.setMusicWithDir(music);
  console.log(Musics.getMusicsWithDir);
}
</script>
