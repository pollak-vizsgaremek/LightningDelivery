<script setup lang="ts">
import Card from "../components/Card.vue";
import { ref, onMounted } from "vue";

const restaurants = ref([]);

const getRestaurants = async () => {
  const res = await fetch("http://localhost:3300/api/v1/ettermek");
  console.log(res);
  restaurants.value = await res.json();
};
onMounted(() => {
  getRestaurants();
});
</script>
<template>
  <div class="flex flex-col w-full">
    <div class="mb-10">
      <h1 class="text-center font-bold text-5xl">Éttermek</h1>
    </div>
    <section
      class="flex flex-row flex-wrap gap-20 max-w-full px-4 items-start justify-center mb-10"
    >
      <Card
        v-for="value in restaurants"
        :key="value.id"
        :name="value.EtteremNev"
        :avgDeliveryTime="value.AtlagosSzallitasiIdo"
        :Cityname="value.varosok.VarosNev"
      />
    </section>
  </div>
</template>
