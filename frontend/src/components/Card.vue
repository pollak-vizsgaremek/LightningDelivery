<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  name: string;
  avgDeliveryTime: number;
  Cityname: string;
  EtteremKep?: string;
}>();

const imageUrl = computed(() => {
  if (!props.EtteremKep) return "";

  // Ha base64 string
  if (typeof props.EtteremKep === "string") {
    return `data:image/jpeg;base64,${props.EtteremKep}`;
  }

  return "";
});
</script>
<template>
  <div
    class="lg:min-w-96 lg:w-1/4 h-60 w-full rounded-2xl border-2 border-white/30 hover:border-0 bg-black/20 font-semibold text-2xl cursor-pointer relative overflow-hidden group shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/30"
  >
    <!-- Blurred Background -->
    <div
      v-if="imageUrl"
      :style="{
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(3px)',
      }"
      class="absolute inset-0"
    ></div>

    <!-- Gradient Overlay -->
    <div
      v-if="imageUrl"
      class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/30"
    ></div>

    <!-- Text Content (Not blurred) -->
    <div
      class="absolute inset-0 flex items-end justify-start p-4 relative z-10"
    >
      <div class="text-white text-shadow-lg text-shadow-gray-900/50">
        <h3 class="text-2xl font-bold">{{ name }}</h3>
        <p class="text-sm text-gray-300 mt-1">
          {{ Cityname }}
        </p>
        <p class="text-sm text-gray-300">~{{ avgDeliveryTime }} perc</p>
      </div>
    </div>
  </div>
</template>
