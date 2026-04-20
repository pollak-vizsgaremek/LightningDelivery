<script setup lang="ts">
import { on } from "events";
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
      <h1 class="text-left font-bold text-4xl">Éttermek</h1>
    </div>
    <section class="flex flex-row flex-wrap gap-20">
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
