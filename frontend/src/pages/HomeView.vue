<script setup lang="ts">
import SearchCard from "../components/SearchCard.vue";
import Card from "../components/Card.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const restaurants = ref<any[]>([]);
const showRestaurants = ref(false);
const route = useRoute();

const parseList = (value: unknown) => {
  if (typeof value !== "string" || value.trim() === "") {
    return [] as string[];
  }

  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

const getMenuPrices = (restaurant: any) => {
  const menus = Array.isArray(restaurant?.menuk) ? restaurant.menuk : [];
  return menus
    .map((menu: any) => {
      if (menu?.AkciosE) {
        return Number(menu?.AkciosAr);
      }

      return Number(menu?.MenuAr);
    })
    .filter((value: number) => Number.isFinite(value) && value > 0);
};

const filteredRestaurants = computed(() => {
  const selectedDeliveryMax = parseList(route.query.deliveryMax).map(Number);
  const selectedFeatures = parseList(route.query.features);
  const searchQuery =
    typeof route.query.search === "string"
      ? route.query.search.trim().toLocaleLowerCase("hu-HU")
      : "";
  const selectedPrice =
    route.query.price === "cheap" || route.query.price === "expensive"
      ? route.query.price
      : "all";

  const maxDeliveryLimit =
    selectedDeliveryMax.length > 0 ? Math.max(...selectedDeliveryMax) : null;

  return restaurants.value.filter((restaurant: any) => {
    if (searchQuery.length > 0) {
      const restaurantName = String(
        restaurant?.EtteremNev ?? "",
      ).toLocaleLowerCase("hu-HU");
      const cityName = String(
        restaurant?.varosok?.VarosNev ?? "",
      ).toLocaleLowerCase("hu-HU");

      if (
        !restaurantName.includes(searchQuery) &&
        !cityName.includes(searchQuery)
      ) {
        return false;
      }
    }

    const deliveryTime = Number(restaurant?.AtlagosSzallitasiIdo);

    if (maxDeliveryLimit !== null && deliveryTime > maxDeliveryLimit) {
      return false;
    }

    const menuPrices = getMenuPrices(restaurant);
    const averageMenuPrice =
      menuPrices.length > 0
        ? menuPrices.reduce((sum, value) => sum + value, 0) / menuPrices.length
        : null;

    if (
      selectedPrice === "cheap" &&
      averageMenuPrice !== null &&
      averageMenuPrice > 8000
    ) {
      return false;
    }

    if (
      selectedPrice === "expensive" &&
      averageMenuPrice !== null &&
      averageMenuPrice <= 8000
    ) {
      return false;
    }

    if (selectedFeatures.length > 0) {
      const isFast = Number.isFinite(deliveryTime) && deliveryTime <= 30;
      const hasDiscount = Array.isArray(restaurant?.menuk)
        ? restaurant.menuk.some((menu: any) => Boolean(menu?.AkciosE))
        : false;
      const isPopular = Array.isArray(restaurant?.menuk)
        ? restaurant.menuk.length >= 3
        : false;

      const featureMap: Record<string, boolean> = {
        Gyors: isFast,
        Kedvezmény: hasDiscount,
        Népszerű: isPopular,
      };

      const matchesAtLeastOneFeature = selectedFeatures.some(
        (feature) => featureMap[feature],
      );

      if (!matchesAtLeastOneFeature) {
        return false;
      }
    }

    return true;
  });
});

const loadRestaurants = async (tipusId: number) => {
  const res = await fetch(
    `http://localhost:3300/api/v1/ettermek/tipus/${tipusId}`,
  );
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
      v-for="value in filteredRestaurants"
      :key="value.ID ?? value.id"
      :restaurantId="value.ID ?? value.id"
      :name="value.EtteremNev"
      :avgDeliveryTime="value.AtlagosSzallitasiIdo"
      :Cityname="value.varosok?.VarosNev ?? 'Ismeretlen város'"
      :EtteremKep="value.EtteremKep"
    />
  </section>
</template>
