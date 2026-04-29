<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "../stores/cart";

type FoodItem = {
  ID: number;
  Nev: string;
  Ar: number;
  Kaloria: number;
};

type DrinkItem = {
  ID: number;
  Nev: string;
  Ar: number;
  Kaloria: number;
};

type MenuFoodLink = {
  etelek?: FoodItem;
};

type MenuDrinkLink = {
  italok?: DrinkItem;
};

type MenuItem = {
  ID: number;
  MenuNev: string;
  MenuAr: number;
  AkciosE: boolean;
  AkciosAr: number;
  menu_etelek?: MenuFoodLink[];
  menu_italok?: MenuDrinkLink[];
};

type RestaurantDetails = {
  ID: number;
  EtteremNev: string;
  AtlagosSzallitasiIdo: number;
  EtteremKep?: string | null;
  varosok?: {
    VarosNev?: string;
  };
  etteremtipus?: {
    EtteremTipus?: string;
  };
  etelek?: FoodItem[];
  italok?: DrinkItem[];
  menuk?: MenuItem[];
};

const route = useRoute();
const loading = ref(true);
const errorMessage = ref("");
const details = ref<RestaurantDetails | null>(null);
const { addItem } = useCartStore();

const restaurantId = computed(() => Number(route.params.id));

const imageUrl = computed(() => {
  if (!details.value?.EtteremKep) {
    return "";
  }

  return `data:image/jpeg;base64,${details.value.EtteremKep}`;
});

const fetchDetails = async () => {
  loading.value = true;
  errorMessage.value = "";

  if (Number.isNaN(restaurantId.value)) {
    errorMessage.value = "Hibás étterem azonosító.";
    loading.value = false;
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3300/api/v1/ettermek/${restaurantId.value}/reszletek`,
    );

    if (!res.ok) {
      throw new Error("Nem sikerült betölteni az étterem adatait.");
    }

    details.value = await res.json();
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Ismeretlen hiba történt a betöltés során.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDetails);

const addFoodToCart = (food: FoodItem) => {
  const fallbackDrinkId = details.value?.italok?.[0]?.ID;
  if (!fallbackDrinkId) {
    errorMessage.value = "Ehhez az ételhez nincs elérhető ital a rendeléshez.";
    return;
  }

  addItem({
    id: food.ID,
    type: "food",
    label: food.Nev,
    price: Number(food.Ar),
    foodId: food.ID,
    drinkId: fallbackDrinkId,
  });
};

const addDrinkToCart = (drink: DrinkItem) => {
  const fallbackFoodId = details.value?.etelek?.[0]?.ID;
  if (!fallbackFoodId) {
    errorMessage.value = "Ehhez az italhoz nincs elérhető étel a rendeléshez.";
    return;
  }

  addItem({
    id: drink.ID,
    type: "drink",
    label: drink.Nev,
    price: Number(drink.Ar),
    foodId: fallbackFoodId,
    drinkId: drink.ID,
  });
};

const addMenuToCart = (menu: MenuItem) => {
  const linkedFoodId = menu.menu_etelek?.find((x) => x.etelek?.ID)?.etelek?.ID;
  const linkedDrinkId = menu.menu_italok?.find((x) => x.italok?.ID)?.italok?.ID;

  if (!linkedFoodId || !linkedDrinkId) {
    errorMessage.value =
      "A menühöz nem található teljes étel + ital kapcsolat.";
    return;
  }

  addItem({
    id: menu.ID,
    type: "menu",
    label: menu.MenuNev,
    price: Number(menu.AkciosE ? menu.AkciosAr : menu.MenuAr),
    foodId: linkedFoodId,
    drinkId: linkedDrinkId,
  });
};
</script>

<template>
  <div class="w-full max-w-6xl mx-auto px-4 pb-12">
    <div v-if="loading" class="text-center text-gray-300 mt-10">
      Betöltés...
    </div>

    <div v-else-if="errorMessage" class="text-center text-red-400 mt-10">
      {{ errorMessage }}
    </div>

    <div v-else-if="details" class="space-y-10">
      <section
        class="relative overflow-hidden rounded-3xl border border-white/20 bg-slate-950/80"
      >
        <div
          v-if="imageUrl"
          class="absolute inset-0"
          :style="{
            backgroundImage: `url('${imageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
          }"
        ></div>
        <div class="absolute inset-0 bg-black/60"></div>

        <div class="relative z-10 p-8 md:p-10 text-white">
          <h1 class="text-4xl md:text-5xl font-extrabold mb-3">
            {{ details.EtteremNev }}
          </h1>
          <div class="flex flex-wrap gap-4 text-sm md:text-base text-gray-200">
            <p>
              Város:
              <span class="font-semibold text-white">{{
                details.varosok?.VarosNev ?? "Ismeretlen város"
              }}</span>
            </p>
            <p>
              Típus:
              <span class="font-semibold text-white">{{
                details.etteremtipus?.EtteremTipus ?? "Ismeretlen típus"
              }}</span>
            </p>
            <p>
              Átlagos szállítás:
              <span class="font-semibold text-white"
                >~{{ details.AtlagosSzallitasiIdo }} perc</span
              >
            </p>
          </div>
        </div>
      </section>

      <section class="grid gap-6 md:grid-cols-3">
        <article class="rounded-2xl border border-white/20 bg-black/30 p-5">
          <h2 class="text-2xl font-bold text-amber-300 mb-4">Ételek</h2>
          <ul v-if="details.etelek?.length" class="space-y-3 text-gray-200">
            <li
              v-for="etel in details.etelek"
              :key="etel.ID"
              class="flex items-center justify-between border-b border-white/10 pb-2"
            >
              <span>{{ etel.Nev }}</span>
              <div class="flex items-center gap-3">
                <span class="font-semibold text-white">{{ etel.Ar }} Ft</span>
                <button
                  @click="addFoodToCart(etel)"
                  class="rounded-lg bg-amber-700 hover:bg-amber-600 px-2 py-1 text-xs font-semibold"
                >
                  Kosárba
                </button>
              </div>
            </li>
          </ul>
          <p v-else class="text-gray-400">Nincs elérhető étel.</p>
        </article>

        <article class="rounded-2xl border border-white/20 bg-black/30 p-5">
          <h2 class="text-2xl font-bold text-amber-300 mb-4">Italok</h2>
          <ul v-if="details.italok?.length" class="space-y-3 text-gray-200">
            <li
              v-for="ital in details.italok"
              :key="ital.ID"
              class="flex items-center justify-between border-b border-white/10 pb-2"
            >
              <span>{{ ital.Nev }}</span>
              <div class="flex items-center gap-3">
                <span class="font-semibold text-white">{{ ital.Ar }} Ft</span>
                <button
                  @click="addDrinkToCart(ital)"
                  class="rounded-lg bg-amber-700 hover:bg-amber-600 px-2 py-1 text-xs font-semibold"
                >
                  Kosárba
                </button>
              </div>
            </li>
          </ul>
          <p v-else class="text-gray-400">Nincs elérhető ital.</p>
        </article>

        <article class="rounded-2xl border border-white/20 bg-black/30 p-5">
          <h2 class="text-2xl font-bold text-amber-300 mb-4">Menü</h2>
          <div v-if="details.menuk?.length" class="space-y-4">
            <div
              v-for="menu in details.menuk"
              :key="menu.ID"
              class="rounded-xl bg-white/5 p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-bold text-white">{{ menu.MenuNev }}</h3>
                <span class="font-semibold text-amber-200">
                  {{ menu.AkciosE ? menu.AkciosAr : menu.MenuAr }} Ft
                </span>
              </div>

              <p class="text-sm text-gray-300">
                Ételek:
                {{
                  menu.menu_etelek
                    ?.map((item) => item.etelek?.Nev)
                    .filter(Boolean)
                    .join(", ") || "Nincs megadva"
                }}
              </p>
              <p class="text-sm text-gray-300 mt-1">
                Italok:
                {{
                  menu.menu_italok
                    ?.map((item) => item.italok?.Nev)
                    .filter(Boolean)
                    .join(", ") || "Nincs megadva"
                }}
              </p>
              <button
                @click="addMenuToCart(menu)"
                class="mt-3 rounded-lg bg-amber-700 hover:bg-amber-600 px-3 py-1 text-sm font-semibold"
              >
                Kosárba
              </button>
            </div>
          </div>
          <p v-else class="text-gray-400">Nincs elérhető menü.</p>
        </article>
      </section>
    </div>
  </div>
</template>
