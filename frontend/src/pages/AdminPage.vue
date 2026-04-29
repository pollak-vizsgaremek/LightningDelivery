<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

type User = {
  ID: number;
  Felhasznalonev: string;
  Email: string;
  Jogosultsag: string;
};

type Restaurant = {
  ID: number;
  EtteremNev: string;
  AtlagosSzallitasiIdo?: number;
  VarosID?: number;
  EtteremTipusID?: number;
  varosok?: {
    ID: number;
    VarosNev: string;
  };
  etteremtipus?: {
    ID: number;
    EtteremTipus: string;
  };
};

type City = {
  ID: number;
  VarosNev: string;
};

type RestaurantType = {
  ID: number;
  EtteremTipus: string;
};

type Menu = {
  ID: number;
  MenuNev: string;
  MenuAr: number;
  AkciosE: boolean;
  AkciosAr: number;
  EttermekID: number;
  ettermek?: {
    ID: number;
    EtteremNev: string;
  };
};

type Food = {
  ID: number;
  Nev: string;
  EtteremID: number | null;
};

type Drink = {
  ID: number;
  Nev: string;
  EtteremID: number | null;
};

type OrderItem = {
  ID: number;
  Mennyiseg: number;
  etelek?: { Nev?: string };
  italok?: { Nev?: string };
  menuk?: { MenuNev?: string };
};

type Order = {
  ID: number;
  FelhasznaloID: number;
  Elkeszult: string;
  Modositott: string;
  Allapot: string;
  kosar_tetelek: OrderItem[];
};

const activeTab = ref<
  "orders" | "orders-manage" | "menus" | "restaurants" | "users"
>("orders");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const currentUserRole = ref("USER");

const users = ref<User[]>([]);
const restaurants = ref<Restaurant[]>([]);
const menus = ref<Menu[]>([]);
const foods = ref<Food[]>([]);
const drinks = ref<Drink[]>([]);
const orders = ref<Order[]>([]);
const cities = ref<City[]>([]);
const restaurantTypes = ref<RestaurantType[]>([]);
const orderStatusEdit = ref<Record<number, string>>({});
const orderStatuses = [
  "UJ",
  "ELFOGADVA",
  "ELKESZITES",
  "KISZALLITAS_ALATT",
  "TELJESITVE",
  "SIKERTELEN",
];

const orderForm = ref({
  EtteremID: 0,
  FelhasznaloID: 0,
  MenuID: 0,
  EtelekID: 0,
  ItalokID: 0,
  Mennyiseg: 1,
});

const menuEditForm = ref({
  ID: 0,
  MenuNev: "",
  MenuAr: 0,
  AkciosE: false,
  AkciosAr: 0,
});

const restaurantEditForm = ref({
  ID: 0,
  EtteremNev: "",
  AtlagosSzallitasiIdo: 0,
  VarosID: 0,
  EtteremTipusID: 0,
});

const roleEdit = ref<Record<number, string>>({});

const token = () => localStorage.getItem("accessToken");
const isAdmin = computed(() => currentUserRole.value === "ADMIN");
const isCashier = computed(() => currentUserRole.value === "PENZTAROS");
const canManageOrders = computed(() => isAdmin.value || isCashier.value);

const selectedRestaurantId = computed(() => Number(orderForm.value.EtteremID));

const filteredMenusForRestaurant = computed(() =>
  menus.value.filter((menu) => menu.EttermekID === selectedRestaurantId.value),
);

const filteredFoodsForRestaurant = computed(() =>
  foods.value.filter(
    (food) => Number(food.EtteremID) === selectedRestaurantId.value,
  ),
);

const filteredDrinksForRestaurant = computed(() =>
  drinks.value.filter(
    (drink) => Number(drink.EtteremID) === selectedRestaurantId.value,
  ),
);

const groupedMenusByRestaurant = computed(() => {
  const groups = restaurants.value
    .map((restaurant) => ({
      restaurant,
      menus: menus.value.filter((menu) => menu.EttermekID === restaurant.ID),
    }))
    .filter((group) => group.menus.length > 0);

  return groups;
});

const apiCall = async (path: string, options: RequestInit = {}) => {
  const accessToken = token();

  const res = await fetch(`http://localhost:3300/api/v1/admin${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken ?? ""}`,
      ...(options.headers ?? {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error || data?.message || "API hiba történt";
    throw new Error(message);
  }

  return data;
};

const loadAdminData = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    if (isCashier.value) {
      const ordersData = await apiCall("/orders");
      orders.value = ordersData ?? [];
      orderStatusEdit.value = Object.fromEntries(
        (ordersData ?? []).map((order: Order) => [
          order.ID,
          order.Allapot ?? "UJ",
        ]),
      );
      return;
    }

    const data = await apiCall("/bootstrap");
    users.value = data.users ?? [];
    menus.value = data.menus ?? [];
    restaurants.value = data.restaurants ?? [];
    foods.value = data.foods ?? [];
    drinks.value = data.drinks ?? [];
    orders.value = data.orders ?? [];
    cities.value = data.cities ?? [];
    restaurantTypes.value = data.restaurantTypes ?? [];

    roleEdit.value = Object.fromEntries(
      (data.users ?? []).map((user: User) => [user.ID, user.Jogosultsag]),
    );
    orderStatusEdit.value = Object.fromEntries(
      (data.orders ?? []).map((order: Order) => [
        order.ID,
        order.Allapot ?? "UJ",
      ]),
    );
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Nem sikerült admin adatot betölteni.";
  } finally {
    loading.value = false;
  }
};

const setSuccess = (message: string) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = "";
  }, 2200);
};

const createOrder = async () => {
  if (!orderForm.value.EtteremID) {
    errorMessage.value = "Rendelés felvételhez válassz éttermet.";
    return;
  }

  try {
    await apiCall("/orders", {
      method: "POST",
      body: JSON.stringify(orderForm.value),
    });

    setSuccess("Rendelés sikeresen felvéve.");
    orderForm.value = {
      EtteremID: 0,
      FelhasznaloID: 0,
      MenuID: 0,
      EtelekID: 0,
      ItalokID: 0,
      Mennyiseg: 1,
    };
    await loadAdminData();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Rendelés mentési hiba.";
  }
};

const saveOrderStatus = async (orderId: number) => {
  const status = orderStatusEdit.value[orderId];

  try {
    await apiCall(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ Allapot: status }),
    });

    setSuccess("Rendelés állapota mentve.");
    await loadAdminData();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Rendelés állapot mentési hiba.";
  }
};

const formatOrderDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const selectMenuForEdit = (menu: Menu) => {
  menuEditForm.value = {
    ID: menu.ID,
    MenuNev: menu.MenuNev,
    MenuAr: menu.MenuAr,
    AkciosE: menu.AkciosE,
    AkciosAr: menu.AkciosAr,
  };
  activeTab.value = "menus";
};

const saveMenuEdit = async () => {
  if (!menuEditForm.value.ID) {
    errorMessage.value = "Válassz menüt a listából módosításhoz.";
    return;
  }

  try {
    await apiCall(`/menus/${menuEditForm.value.ID}`, {
      method: "PATCH",
      body: JSON.stringify(menuEditForm.value),
    });
    setSuccess("Menü sikeresen módosítva.");
    await loadAdminData();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Menü módosítási hiba.";
  }
};

const selectRestaurantForEdit = (restaurant: Restaurant) => {
  restaurantEditForm.value = {
    ID: restaurant.ID,
    EtteremNev: restaurant.EtteremNev,
    AtlagosSzallitasiIdo: Number(restaurant.AtlagosSzallitasiIdo ?? 0),
    VarosID: Number(restaurant.VarosID ?? restaurant.varosok?.ID ?? 0),
    EtteremTipusID: Number(
      restaurant.EtteremTipusID ?? restaurant.etteremtipus?.ID ?? 0,
    ),
  };
  activeTab.value = "restaurants";
};

const saveRestaurantEdit = async () => {
  if (!restaurantEditForm.value.ID) {
    errorMessage.value = "Válassz éttermet a listából módosításhoz.";
    return;
  }

  try {
    await apiCall(`/restaurants/${restaurantEditForm.value.ID}`, {
      method: "PATCH",
      body: JSON.stringify(restaurantEditForm.value),
    });
    setSuccess("Étterem sikeresen módosítva.");
    await loadAdminData();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Étterem módosítási hiba.";
  }
};

const deleteRestaurant = async (restaurantId: number) => {
  try {
    await apiCall(`/restaurants/${restaurantId}`, {
      method: "DELETE",
    });
    setSuccess("Étterem törölve.");
    await loadAdminData();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Étterem törlési hiba.";
  }
};

const saveUserRole = async (userId: number) => {
  try {
    await apiCall(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ Jogosultsag: roleEdit.value[userId] }),
    });
    setSuccess("Jogosultság mentve.");
    await loadAdminData();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Felhasználó módosítási hiba.";
  }
};

const deleteUser = async (userId: number) => {
  try {
    await apiCall(`/users/${userId}`, {
      method: "DELETE",
    });
    setSuccess("Felhasználó törölve.");
    await loadAdminData();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Felhasználó törlési hiba.";
  }
};

watch(
  () => orderForm.value.EtteremID,
  () => {
    orderForm.value.MenuID = 0;
    orderForm.value.EtelekID = 0;
    orderForm.value.ItalokID = 0;
  },
);

onMounted(async () => {
  if (!token()) {
    errorMessage.value = "Admin oldalhoz előbb jelentkezz be admin fiókkal.";
    return;
  }

  currentUserRole.value = String(
    localStorage.getItem("userRole") ?? "USER",
  ).toUpperCase();

  if (!canManageOrders.value) {
    errorMessage.value = "Ehhez az oldalhoz nincs jogosultságod.";
    return;
  }

  if (isCashier.value) {
    activeTab.value = "orders-manage";
  }

  await loadAdminData();
});
</script>

<template>
  <div class="w-full max-w-6xl mx-auto px-4 pb-12">
    <h1 class="text-4xl font-extrabold text-center mb-8">Admin felület</h1>

    <div
      v-if="errorMessage"
      class="mb-4 rounded-lg bg-red-900/50 border border-red-600 px-4 py-2"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="successMessage"
      class="mb-4 rounded-lg bg-green-900/40 border border-green-500 px-4 py-2"
    >
      {{ successMessage }}
    </div>

    <div class="flex flex-wrap gap-3 mb-8">
      <button
        v-if="isAdmin"
        @click="activeTab = 'orders'"
        class="px-4 py-2 rounded-xl font-semibold"
        :class="activeTab === 'orders' ? 'bg-amber-700' : 'bg-gray-800'"
      >
        Rendelés felvétel
      </button>
      <button
        v-if="canManageOrders"
        @click="activeTab = 'orders-manage'"
        class="px-4 py-2 rounded-xl font-semibold"
        :class="activeTab === 'orders-manage' ? 'bg-amber-700' : 'bg-gray-800'"
      >
        Rendelések kezelése
      </button>
      <button
        v-if="isAdmin"
        @click="activeTab = 'menus'"
        class="px-4 py-2 rounded-xl font-semibold"
        :class="activeTab === 'menus' ? 'bg-amber-700' : 'bg-gray-800'"
      >
        Menük módosítása
      </button>
      <button
        v-if="isAdmin"
        @click="activeTab = 'restaurants'"
        class="px-4 py-2 rounded-xl font-semibold"
        :class="activeTab === 'restaurants' ? 'bg-amber-700' : 'bg-gray-800'"
      >
        Éttermek kezelése
      </button>
      <button
        v-if="isAdmin"
        @click="activeTab = 'users'"
        class="px-4 py-2 rounded-xl font-semibold"
        :class="activeTab === 'users' ? 'bg-amber-700' : 'bg-gray-800'"
      >
        Felhasználók kezelése
      </button>
    </div>

    <div v-if="loading" class="text-gray-300">Betöltés...</div>

    <section
      v-if="!loading && isAdmin && activeTab === 'orders'"
      class="grid gap-6 md:grid-cols-2"
    >
      <article
        class="rounded-2xl bg-slate-900/70 border border-white/10 p-5 space-y-3"
      >
        <h2 class="text-2xl font-bold">Új rendelés</h2>

        <label class="block text-sm">Étterem</label>
        <select
          v-model.number="orderForm.EtteremID"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
        >
          <option :value="0">Válassz éttermet</option>
          <option v-for="r in restaurants" :key="r.ID" :value="r.ID">
            {{ r.EtteremNev }}
          </option>
        </select>

        <label class="block text-sm">Felhasználó</label>
        <select
          v-model.number="orderForm.FelhasznaloID"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
        >
          <option :value="0">Válassz felhasználót</option>
          <option v-for="u in users" :key="u.ID" :value="u.ID">
            {{ u.Felhasznalonev }} ({{ u.Email }})
          </option>
        </select>

        <label class="block text-sm">Menü</label>
        <select
          v-model.number="orderForm.MenuID"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
          :disabled="!orderForm.EtteremID"
        >
          <option :value="0">Válassz menüt</option>
          <option
            v-for="m in filteredMenusForRestaurant"
            :key="m.ID"
            :value="m.ID"
          >
            {{ m.MenuNev }} - {{ m.ettermek?.EtteremNev }}
          </option>
        </select>

        <label class="block text-sm">Étel</label>
        <select
          v-model.number="orderForm.EtelekID"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
          :disabled="!orderForm.EtteremID"
        >
          <option :value="0">Válassz ételt</option>
          <option
            v-for="f in filteredFoodsForRestaurant"
            :key="f.ID"
            :value="f.ID"
          >
            {{ f.Nev }}
          </option>
        </select>

        <label class="block text-sm">Ital</label>
        <select
          v-model.number="orderForm.ItalokID"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
          :disabled="!orderForm.EtteremID"
        >
          <option :value="0">Válassz italt</option>
          <option
            v-for="d in filteredDrinksForRestaurant"
            :key="d.ID"
            :value="d.ID"
          >
            {{ d.Nev }}
          </option>
        </select>

        <label class="block text-sm">Mennyiség</label>
        <input
          v-model.number="orderForm.Mennyiseg"
          type="number"
          min="1"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
        />

        <button
          @click="createOrder"
          class="mt-2 rounded-lg bg-amber-700 hover:bg-amber-600 px-4 py-2 font-semibold"
        >
          Rendelés felvétele
        </button>
      </article>

      <article class="rounded-2xl bg-slate-900/70 border border-white/10 p-5">
        <h2 class="text-2xl font-bold mb-4">Menük éttermenként</h2>
        <div class="max-h-96 overflow-y-auto space-y-2">
          <div
            v-for="group in groupedMenusByRestaurant"
            :key="group.restaurant.ID"
            class="rounded-xl border border-white/10 p-3"
          >
            <h3 class="font-bold mb-2">{{ group.restaurant.EtteremNev }}</h3>
            <button
              v-for="menu in group.menus"
              :key="menu.ID"
              @click="selectMenuForEdit(menu)"
              class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10 mb-2 last:mb-0"
            >
              <p class="font-semibold">
                {{ menu.MenuNev }} ({{ menu.MenuAr }} Ft)
              </p>
            </button>
          </div>
          <p v-if="groupedMenusByRestaurant.length === 0" class="text-gray-400">
            Nincs elérhető menü.
          </p>
        </div>
      </article>
    </section>

    <section
      v-if="!loading && canManageOrders && activeTab === 'orders-manage'"
      class="rounded-2xl bg-slate-900/70 border border-white/10 p-5"
    >
      <h2 class="text-2xl font-bold mb-4">Rendelések állapotkövetése</h2>

      <div class="max-h-128 overflow-y-auto space-y-3">
        <div
          v-for="order in orders"
          :key="order.ID"
          class="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div>
              <p class="font-bold text-white">Rendelés #{{ order.ID }}</p>
              <p class="text-xs text-gray-300">
                Felhasználó ID: {{ order.FelhasznaloID }} | Létrehozva:
                {{ formatOrderDate(order.Modositott) }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <select
                v-model="orderStatusEdit[order.ID]"
                class="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
              >
                <option
                  v-for="status in orderStatuses"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </option>
              </select>
              <button
                @click="saveOrderStatus(order.ID)"
                class="rounded-lg bg-amber-700 hover:bg-amber-600 px-3 py-2 text-sm font-semibold"
              >
                Mentés
              </button>
            </div>
          </div>

          <div class="text-sm text-gray-200 space-y-1">
            <p
              v-for="item in order.kosar_tetelek"
              :key="item.ID"
              class="rounded-lg bg-black/30 px-3 py-2"
            >
              Menü: {{ item.menuk?.MenuNev ?? "-" }}, Étel:
              {{ item.etelek?.Nev ?? "-" }}, Ital:
              {{ item.italok?.Nev ?? "-" }}, Mennyiség: {{ item.Mennyiseg }}
            </p>
          </div>
        </div>

        <p v-if="orders.length === 0" class="text-gray-400">Nincs rendelés.</p>
      </div>
    </section>

    <section
      v-if="!loading && isAdmin && activeTab === 'menus'"
      class="grid gap-6 md:grid-cols-2"
    >
      <article
        class="rounded-2xl bg-slate-900/70 border border-white/10 p-5 space-y-3"
      >
        <h2 class="text-2xl font-bold">Menü szerkesztés</h2>
        <label class="block text-sm">Menü név</label>
        <input
          v-model="menuEditForm.MenuNev"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
        />

        <label class="block text-sm">Ár</label>
        <input
          v-model.number="menuEditForm.MenuAr"
          type="number"
          min="0"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
        />

        <label class="inline-flex items-center gap-2">
          <input v-model="menuEditForm.AkciosE" type="checkbox" />
          Akciós
        </label>

        <label class="block text-sm">Akciós ár</label>
        <input
          v-model.number="menuEditForm.AkciosAr"
          type="number"
          min="0"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
        />

        <button
          @click="saveMenuEdit"
          class="rounded-lg bg-amber-700 hover:bg-amber-600 px-4 py-2 font-semibold"
        >
          Menü mentése
        </button>
      </article>

      <article class="rounded-2xl bg-slate-900/70 border border-white/10 p-5">
        <h2 class="text-2xl font-bold mb-4">Menü lista</h2>
        <div class="max-h-96 overflow-y-auto space-y-2">
          <div
            v-for="group in groupedMenusByRestaurant"
            :key="group.restaurant.ID"
            class="rounded-xl border border-white/10 p-3"
          >
            <h3 class="font-bold mb-2">{{ group.restaurant.EtteremNev }}</h3>

            <button
              v-for="menu in group.menus"
              :key="menu.ID"
              @click="selectMenuForEdit(menu)"
              class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10 mb-2 last:mb-0"
            >
              <p class="font-semibold">{{ menu.MenuNev }}</p>
              <p class="text-xs text-gray-300">
                {{ menu.MenuAr }} Ft |
                {{
                  menu.AkciosE ? `Akciós: ${menu.AkciosAr} Ft` : "Nem akciós"
                }}
              </p>
            </button>
          </div>

          <p v-if="groupedMenusByRestaurant.length === 0" class="text-gray-400">
            Nincs elérhető menü.
          </p>
        </div>
      </article>
    </section>

    <section
      v-if="!loading && isAdmin && activeTab === 'users'"
      class="rounded-2xl bg-slate-900/70 border border-white/10 p-5"
    >
      <h2 class="text-2xl font-bold mb-4">Felhasználók kezelése</h2>
      <div class="space-y-3">
        <div
          v-for="user in users"
          :key="user.ID"
          class="rounded-xl border border-white/10 bg-white/5 p-3 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center"
        >
          <div>
            <p class="font-semibold">{{ user.Felhasznalonev }}</p>
            <p class="text-sm text-gray-300">{{ user.Email }}</p>
          </div>

          <select
            v-model="roleEdit[user.ID]"
            class="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
          >
            <option value="USER">USER</option>
            <option value="PENZTAROS">PENZTAROS</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <div class="flex gap-2">
            <button
              @click="saveUserRole(user.ID)"
              class="rounded-lg bg-amber-700 hover:bg-amber-600 px-3 py-2 text-sm font-semibold"
            >
              Mentés
            </button>
            <button
              @click="deleteUser(user.ID)"
              class="rounded-lg bg-red-800 hover:bg-red-700 px-3 py-2 text-sm font-semibold"
            >
              Törlés
            </button>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="!loading && isAdmin && activeTab === 'restaurants'"
      class="grid gap-6 md:grid-cols-2"
    >
      <article
        class="rounded-2xl bg-slate-900/70 border border-white/10 p-5 space-y-3"
      >
        <h2 class="text-2xl font-bold">Étterem szerkesztés</h2>

        <label class="block text-sm">Étterem név</label>
        <input
          v-model="restaurantEditForm.EtteremNev"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
        />

        <label class="block text-sm">Átlagos szállítási idő (perc)</label>
        <input
          v-model.number="restaurantEditForm.AtlagosSzallitasiIdo"
          type="number"
          min="0"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
        />

        <label class="block text-sm">Város</label>
        <select
          v-model.number="restaurantEditForm.VarosID"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
        >
          <option :value="0">Válassz várost</option>
          <option v-for="city in cities" :key="city.ID" :value="city.ID">
            {{ city.VarosNev }}
          </option>
        </select>

        <label class="block text-sm">Típus</label>
        <select
          v-model.number="restaurantEditForm.EtteremTipusID"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
        >
          <option :value="0">Válassz típust</option>
          <option
            v-for="type in restaurantTypes"
            :key="type.ID"
            :value="type.ID"
          >
            {{ type.EtteremTipus }}
          </option>
        </select>

        <button
          @click="saveRestaurantEdit"
          class="rounded-lg bg-amber-700 hover:bg-amber-600 px-4 py-2 font-semibold"
        >
          Étterem mentése
        </button>
      </article>

      <article class="rounded-2xl bg-slate-900/70 border border-white/10 p-5">
        <h2 class="text-2xl font-bold mb-4">Étterem lista</h2>
        <div class="max-h-96 overflow-y-auto space-y-2">
          <div
            v-for="restaurant in restaurants"
            :key="restaurant.ID"
            class="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
          >
            <p class="font-semibold">{{ restaurant.EtteremNev }}</p>
            <p class="text-xs text-gray-300">
              Város: {{ restaurant.varosok?.VarosNev ?? "-" }} | Típus:
              {{ restaurant.etteremtipus?.EtteremTipus ?? "-" }} | Szállítás:
              {{ restaurant.AtlagosSzallitasiIdo ?? "-" }} perc
            </p>
            <div class="mt-2 flex gap-2">
              <button
                @click="selectRestaurantForEdit(restaurant)"
                class="rounded-lg bg-amber-700 hover:bg-amber-600 px-3 py-2 text-sm font-semibold"
              >
                Szerkesztés
              </button>
              <button
                @click="deleteRestaurant(restaurant.ID)"
                class="rounded-lg bg-red-800 hover:bg-red-700 px-3 py-2 text-sm font-semibold"
              >
                Törlés
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>
