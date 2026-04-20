<script setup lang="ts">
const props = defineProps<{
  name: string;
  avgDeliveryTime: number;
  Cityname: string;
}>();
</script>
<template>
  <div
    class="lg:min-w-96 lg:w-1/4 h-60 w-full rounded-2xl border border-white/10 bg-black/20 font-semibold text-2xl text-center cursor-pointer relative overflow-hidden group shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/30"
  >
    {{ name }}
  </div>
</template>
