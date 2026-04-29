<script setup lang="ts">
import { ref, onMounted } from "vue";

const emit = defineEmits<{
  (e: "navigate", tipusId: number): void;
}>();

const etteremTipusok = ref<{ ID: number; EtteremTipus: string }[]>([]);

const imageMap = {
  fast: "/images/gyorskaja.png",
  pizza: "/images/pizza.jpg",
  burger: "/images/burger.jpg",
  gyros: "/images/gyros.webp",
  default: "/images/burger.jpg",
} as const;

const normalizeTypeName = (value: string) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getImageForTipus = (tipus: string): string => {
  const normalized = normalizeTypeName(tipus);

  if (normalized.includes("gyros")) {
    return imageMap.gyros;
  }

  if (normalized.includes("pizza")) {
    return imageMap.pizza;
  }

  if (normalized.includes("burger") || normalized.includes("hamburger")) {
    return imageMap.burger;
  }

  if (normalized.includes("gyors") || normalized.includes("fast")) {
    return imageMap.fast;
  }

  return imageMap.default;
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
    class="mt-5 flex w-full flex-wrap items-stretch justify-center gap-5 text-center"
  >
    <div
      v-for="tipus in etteremTipusok"
      :key="tipus.ID"
      @click="handleClick(tipus.ID)"
      class="relative h-52 w-full cursor-pointer overflow-hidden rounded-3xl border border-gray-500/30 bg-black/20 text-center font-semibold shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/30 sm:w-76"
    >
      <img
        :src="getImageForTipus(tipus.EtteremTipus)"
        :alt="tipus.EtteremTipus"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div
        class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/10"
      ></div>
      <div class="absolute inset-x-0 bottom-0 z-10 p-4">
        <h3 class="text-3xl leading-tight font-bold text-white wrap-break-word">
          {{ tipus.EtteremTipus }}
        </h3>
      </div>
    </div>
  </div>
  <div class="mt-10 font-semibold text-lg font-serif">
    <h1>
      Fedezd fel a számodra legjobb étkezési lehetőségeket és használd a szűrőt
      a pontos kereséshez!
    </h1>
  </div>
</template>
