<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  restaurantId?: number;
  name: string;
  avgDeliveryTime: number;
  Cityname: string;
  EtteremKep?: string;
}>();

const router = useRouter();

const imageUrl = computed(() => {
  if (!props.EtteremKep) return "";

  // Ha base64 string
  if (typeof props.EtteremKep === "string") {
    return `data:image/jpeg;base64,${props.EtteremKep}`;
  }

  return "";
});

const openDetails = () => {
  if (!props.restaurantId) {
    return;
  }

  router.push({
    name: "restaurant-details",
    params: { id: props.restaurantId },
  });
};
</script>
<template>
  <div
    @click="openDetails"
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
      class="absolute inset-0 bg-linear-to-b from-black/50 via-black/35 to-black/90"
    ></div>

    <!-- Text Content (Not blurred) -->
    <div class="absolute inset-0 flex items-end justify-start p-4 z-10">
      <div
        class="w-full max-w-full rounded-xl bg-black/35 px-3 py-2 text-white"
      >
        <h3 class="text-xl md:text-2xl leading-tight font-bold wrap-break-word">
          {{ name }}
        </h3>
        <p class="text-sm text-gray-300 mt-1">
          {{ Cityname }}
        </p>
        <p class="text-sm text-gray-300">~{{ avgDeliveryTime }} perc</p>
      </div>
    </div>
  </div>
</template>
