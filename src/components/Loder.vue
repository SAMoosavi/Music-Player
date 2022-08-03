<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.0"
      width="90"
      height="90"
      class="fill-transparent stroke-primary"
    >
      <path class="stroke-1" ref="element" :d="svgPath" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import { svgCreat } from "../functions/anime";
import { loderSvgPath } from "../globalVariable/const";

const svgPath = loderSvgPath;
const element: Ref<JSX.IntrinsicElements | null> = ref(null);
onMounted(() => {
  svgCreat(element.value);
});
</script>
