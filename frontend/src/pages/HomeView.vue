<script setup lang="ts">
import SearchCard from "../components/SearchCard.vue";
import Card from "../components/Card.vue";
import { ref } from "vue";

const restaurants = ref<any[]>([]);
const showRestaurants = ref(false);

const loadRestaurants = async (tipusId: number) => {
  const res = await fetch(`http://localhost:3300/api/v1/ettermek/tipus/${tipusId}`);
  restaurants.value = await res.json();
  showRestaurants.value = true;
};
</script>

<template>
  <h1 class="text-left font-bold text-5xl">Felfedezés</h1>
  <SearchCard @navigate="loadRestaurants" />
  
  <section
    v-if="showRestaurants"
    class="flex flex-row flex-wrap gap-20 max-w-full px-4 items-start justify-center mb-10 mt-10"
  >
    <Card
      v-for="value in restaurants"
      :key="value.id"
      :name="value.EtteremNev"
      :avgDeliveryTime="value.AtlagosSzallitasiIdo"
      :Cityname="value.varosok.VarosNev"
      :EtteremKep="value.EtteremKep"
    />
  </section>
</template>
