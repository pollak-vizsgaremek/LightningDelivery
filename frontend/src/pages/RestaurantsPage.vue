<script setup lang="ts">
import Card from "../components/Card.vue";
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const restaurants = ref<any[]>([]);
const route = useRoute();

const safeRestaurants = computed(() => {
  if (!Array.isArray(restaurants.value)) {
    return [];
  }

  return restaurants.value.filter((item) => item && typeof item === "object");
});

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

  const list = safeRestaurants.value.filter((restaurant: any) => {
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
        ? menuPrices.reduce((sum: number, value: number) => sum + value, 0) /
          menuPrices.length
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

  // If a selected location is stored, sort by distance ascending
  try {
    const latRaw = localStorage.getItem("selected_location_lat");
    const lonRaw = localStorage.getItem("selected_location_lon");
    const refLat = latRaw ? Number(latRaw) : null;
    const refLon = lonRaw ? Number(lonRaw) : null;

    if (
      refLat !== null &&
      refLon !== null &&
      Number.isFinite(refLat) &&
      Number.isFinite(refLon)
    ) {
      // compute distance for restaurants that have coords
      const withDist = list.map((r: any) => {
        const lat = Number(r?.Latitude ?? r?.latitude ?? NaN);
        const lon = Number(r?.Longitude ?? r?.longitude ?? NaN);
        let dist = Number.POSITIVE_INFINITY;
        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          // haversine
          const R = 6371;
          const dLat = (lat - refLat) * (Math.PI / 180);
          const dLon = (lon - refLon) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(refLat * (Math.PI / 180)) *
              Math.cos(lat * (Math.PI / 180)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          dist = R * c;
        }
        return { r, dist };
      });

      withDist.sort((a: any, b: any) => a.dist - b.dist);
      return withDist.map((x: any) => x.r);
    }
  } catch (e) {
    // ignore and return unsorted
  }

  return list;
});

const getRestaurants = async () => {
  try {
    const res = await fetch("http://localhost:3300/api/v1/ettermek");
    const data = await res.json();
    restaurants.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Nem sikerült lekérni az éttermeket:", error);
    restaurants.value = [];
  }
};
onMounted(() => {
  getRestaurants();
  // listen for location changes to re-evaluate ordering
  const onLocationChanged = (e: any) => {
    // trigger recompute by touching restaurants ref (no-op)
    restaurants.value = [...restaurants.value];
  };
  window.addEventListener(
    "location:changed",
    onLocationChanged as EventListener,
  );
  onUnmounted(() => {
    window.removeEventListener(
      "location:changed",
      onLocationChanged as EventListener,
    );
  });
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
        v-for="value in filteredRestaurants"
        :key="value.ID ?? value.id"
        :restaurantId="value.ID ?? value.id"
        :name="value.EtteremNev"
        :avgDeliveryTime="value.AtlagosSzallitasiIdo"
        :Cityname="value.varosok?.VarosNev ?? 'Ismeretlen város'"
        :EtteremKep="value.EtteremKep"
      />
    </section>
  </div>
</template>
