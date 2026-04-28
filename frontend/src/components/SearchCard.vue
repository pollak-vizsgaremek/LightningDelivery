<script setup lang="ts">
import { ref, onMounted } from "vue";

const emit = defineEmits<{
  (e: "navigate", tipusId: number): void;
}>();

const etteremTipusok = ref<{ ID: number; EtteremTipus: string }[]>([]);

const imageMap: Record<string, string> = {
  "Gyorsétterem": "/images/gyorskaja.png",
  "Pizza": "/images/pizza.jpg",
  "Burgerek": "/images/burger.jpg",
  "Gyros": "/images/gyros.webp",
  "default": "/images/burger.jpg"
};

const getImageForTipus = (tipus: string): string => {
  return imageMap[tipus] || imageMap["default"];
};

const getEtteremTipusok = async () => {
  const res = await fetch("http://localhost:3300/api/v1/etteremtipusok");
  etteremTipusok.value = await res.json();
};

onMounted(() => {
  getEtteremTipusok();
});

const handleClick = (tipusId: number) => {
  emit("navigate", tipusId);
};
</script>

<template>
  <div
    class="flex items-center text-shadow-lg text-shadow-gray-600 text-center mt-5 justify-center w-full"
  >
    <div
      v-for="tipus in etteremTipusok"
      :key="tipus.ID"
      @click="handleClick(tipus.ID)"
      class="lg:w-1/8 h-45 w-full ml-5 rounded-3xl border border-gray-500/20 bg-black/20 font-semibold text-2xl text-center cursor-pointer relative overflow-hidden group shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/30"
    >
      <ul class="items-center justify-center">
        <li
          class="relative overflow-hidden border border-amber-400/20 bg-black/70"
        >
          <img
            :src="getImageForTipus(tipus.EtteremTipus)"
            :alt="tipus.EtteremTipus"
            class="h-full w-full object-cover opacity-90"
          />
          <div
            class="absolute inset-0 from-black/80 via-black/10 to-black/0"
          ></div>
          <div class="absolute bottom-8 left-8 text-center text-white">
            <h3 class="text-3xl font-bold">{{ tipus.EtteremTipus }}</h3>
            <p class="mt-3 text-gray-200"></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="mt-10 font-semibold text-lg font-serif">
    <h1>
      Fedezd fel a számodra legjobb étkezési lehetőségeket és használd a szűrőt
      a pontos kereséshez!
    </h1>
  </div>
</template>