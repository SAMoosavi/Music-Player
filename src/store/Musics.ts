import { defineStore } from "pinia";

export const useMusic = defineStore("music", {
  state: () => ({
    musicsWithDir: {},
    allMusic: {},
  }),
  getters: {
    getMusicsWithDir: (state) => state.musicsWithDir,
    getAllMusic: (state) => state.allMusic,
  },
  actions: {
    setMusicWithDir(val: object) {
      this.musicsWithDir = val;
      localStorage.setItem("musicsWithDir", JSON.stringify(val));
      let allMusic = this.allMusic;
      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key)) {
          const element = val[key];
          for (const iterator of element) {
            if (!allMusic[iterator]) {
              allMusic[iterator] = {
                path: iterator,
                name: iterator.split("/")[-1],
                star: 0,
                status: 0,
              };
            }
          }
        }
      }
      this.allMusic = allMusic;
    },
  },
});
