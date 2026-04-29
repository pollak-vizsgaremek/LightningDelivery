<script setup lang="ts">
import { RouterView } from "vue-router";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useRoute, useRouter } from "vue-router";
import RegisterModal from "../components/LoginRegisterModal.vue";
import LocationModal from "../components/LocationModal.vue";
import FilterModal from "../components/FilterModal.vue";
import BasketModal from "../components/BasketModal.vue";

const router = useRouter();
const route = useRoute();

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];
const isModalVisible = ref(false);
const isLoggedIn = ref(false);
const userName = ref("");
const userRole = ref("USER");
const isProfileMenuOpen = ref(false);
const profileMenuRef = ref<HTMLElement | null>(null);
const searchValue = ref(
  typeof route.query.search === "string" ? route.query.search : "",
);
let searchDebounce: ReturnType<typeof setTimeout> | null = null;

const type = ref<"login" | "register">("login");

const openModal = (modalType: "login" | "register") => {
  type.value = modalType;
  isModalVisible.value = true;
  console.log(isModalVisible.value);
};

const isAdminUser = () =>
  userRole.value === "ADMIN" || userRole.value === "PENZTAROS";

const navigateTo = (view: string) => {
  router.push({ name: view });
};

const isRecommendPage = () => {
  return router.currentRoute.value.name === "recommend";
};

const isAboutPage = () => {
  return router.currentRoute.value.name === "about";
};
const isDeliveryPage = () => {
  return router.currentRoute.value.name === "delivery";
};

const updateSearchQuery = (value: string) => {
  const nextQuery = { ...route.query } as Record<string, string>;
  const normalized = value.trim();

  if (normalized.length > 0) {
    nextQuery.search = normalized;
  } else {
    delete nextQuery.search;
  }

  router.replace({ query: nextQuery });
};

const onSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchValue.value = target.value;

  if (searchDebounce) {
    clearTimeout(searchDebounce);
  }

  searchDebounce = setTimeout(() => {
    updateSearchQuery(searchValue.value);
  }, 220);
};

const onSearchEnter = () => {
  if (searchDebounce) {
    clearTimeout(searchDebounce);
  }

  updateSearchQuery(searchValue.value);
};

const refreshAuthState = () => {
  const token = localStorage.getItem("accessToken");
  isLoggedIn.value = Boolean(token);
  userName.value = localStorage.getItem("userName") ?? "Felhasználó";
  userRole.value = (localStorage.getItem("userRole") ?? "USER").toUpperCase();

  if (!isLoggedIn.value) {
    isProfileMenuOpen.value = false;
  }
};

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const closeProfileMenu = () => {
  isProfileMenuOpen.value = false;
};

const handleGlobalClick = (event: MouseEvent) => {
  if (!isProfileMenuOpen.value) {
    return;
  }

  const target = event.target as Node;
  if (profileMenuRef.value && !profileMenuRef.value.contains(target)) {
    closeProfileMenu();
  }
};

const goToAdmin = () => {
  closeProfileMenu();
  navigateTo("admin");
};

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  refreshAuthState();
  closeProfileMenu();
  router.push({ name: "home" });
};

onMounted(() => {
  refreshAuthState();
  window.addEventListener("click", handleGlobalClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleGlobalClick);
});

watch(
  () => route.query.search,
  (value) => {
    searchValue.value = typeof value === "string" ? value : "";
  },
);

watch(
  () => [route.fullPath, isModalVisible.value],
  () => {
    refreshAuthState();
  },
);
</script>
<template>
  <div v-if="!isRecommendPage() && !isAboutPage() && !isDeliveryPage()">
    <div
      :class="
        isModalVisible ? 'filter blur-sm transition-filter duration-200' : ''
      "
    >
      <Disclosure
        as="nav"
        class="relative bg-black after:pointer-events-none border-b-amber-400 border-solid border-2 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
        v-slot="{ open }"
      >
        <div class="mx-auto px-2 sm:px-6 lg:px-8">
          <div
            class="relative flex min-h-16 items-center justify-center py-2 sm:justify-between"
          >
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <!-- Mobile menu button-->
              <DisclosureButton
                class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
              >
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open main menu</span>
                <Bars3Icon
                  v-if="!open"
                  class="block size-6"
                  aria-hidden="true"
                />
                <XMarkIcon v-else class="block size-6" aria-hidden="true" />
              </DisclosureButton>
            </div>
            <div
              class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
            >
              <div
                class="grid w-full grid-cols-1 items-center gap-2 pl-8 sm:grid-cols-2 sm:pl-0 lg:grid-cols-3"
              >
                <div class="flex min-w-0 items-center gap-2">
                  <RouterLink to="/" class="">
                    <img
                      class="h-9 w-auto cursor-pointer sm:h-14"
                      src="/images/logo.png"
                      alt="Your Company"
                    />
                  </RouterLink>
                  <!-- <RouterLink
                    to="/"
                    class="inline-flex items-center mt-10 gap-3 mb-10"
                  > -->
                  <!-- <img src="/images/logo.png" alt="LightningDelivery" class="h-16 w-16" /> -->
                  <!-- <span class="text-2xl font-extrabold text-amber-400"
                      >LightningDelivery</span
                    >
                  </RouterLink> -->
                  <!-- Lokáció megadása -->
                  <div class="min-w-0 flex items-center gap-1">
                    <LocationModal />
                    <span class="text-white text-sm ml-2">{{}}</span>
                  </div>
                </div>

                <!--  Searchinput  -->
                <input
                  type="text"
                  :value="searchValue"
                  @input="onSearchInput"
                  @keydown.enter="onSearchEnter"
                  placeholder="Keress éttermek között..."
                  class="w-full rounded-3xl bg-gray-700 px-3 py-2 text-sm text-gray-300 transition-all duration-200 ease-out focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:max-w-md sm:justify-self-center"
                />
                <div
                  class="flex w-full flex-wrap items-center justify-end gap-2 px-0 py-1 text-sm sm:col-span-2 sm:px-3 lg:col-span-1"
                >
                  <BasketModal />
                  <template v-if="!isLoggedIn">
                    <button
                      @click="openModal('login')"
                      class="bg-black hover:bg-gray-800 cursor-pointer text-white font-bold py-2 px-4 rounded transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-gray-400/50"
                    >
                      Bejelentkezés
                    </button>
                    <button
                      @click="openModal('register')"
                      class="bg-orange-900 hover:bg-orange-700 cursor-pointer text-white font-bold py-2 px-4 rounded transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-400/50"
                    >
                      Regisztráció
                    </button>
                  </template>

                  <div
                    v-else
                    ref="profileMenuRef"
                    class="relative flex flex-wrap items-center justify-end gap-2"
                  >
                    <span
                      class="hidden max-w-44 truncate text-emerald-300 font-semibold md:inline-block"
                    >
                      Bejelentkezve: {{ userName }}
                    </span>
                    <button
                      @click.stop="toggleProfileMenu"
                      class="bg-gray-800 hover:bg-gray-700 cursor-pointer text-white font-bold py-2 px-4 rounded transition-all duration-200"
                    >
                      Profil
                    </button>

                    <div
                      v-if="isProfileMenuOpen"
                      class="absolute right-0 top-12 min-w-48 rounded-xl border border-gray-700 bg-gray-900 p-2 shadow-xl z-50"
                    >
                      <p class="px-2 py-1 text-xs text-gray-400">
                        {{ userRole }}
                      </p>
                      <button
                        v-if="userRole === 'ADMIN' || userRole === 'PENZTAROS'"
                        @click="goToAdmin"
                        class="w-full text-left px-2 py-2 rounded-lg hover:bg-gray-800 text-amber-300 font-semibold transition-colors"
                      >
                        Admin / rendeléskezelés
                      </button>
                      <button
                        @click="logout"
                        class="w-full text-left px-2 py-2 rounded-lg text-red-400 font-bold hover:bg-gray-800 transition-colors"
                      >
                        Kijelentkezés
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4"></div>
              </div>
            </div>
          </div>
        </div>

        <DisclosurePanel class="sm:hidden">
          <div class="space-y-1 px-2 pt-2 pb-3">
            <DisclosureButton
              v-for="item in navigation"
              :key="item.name"
              as="a"
              :href="item.href"
              :class="[
                item.current
                  ? 'bg-gray-950/50 text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              ]"
              :aria-current="item.current ? 'page' : undefined"
              >{{ item.name }}</DisclosureButton
            >
          </div>
        </DisclosurePanel>
      </Disclosure>
      <div class="bg-black text-white p-4 min-h-screen w-full">
        <div class="flex w-full items-center justify-center bg-black">
          <div class="h-full w-full bg-black">
            <ul class="flex flex-wrap items-center justify-center gap-2">
              <li
                class="bg-orange-900 hover:bg-orange-700 cursor-pointer text-white font-bold py-2 mr-2 px-4 rounded-4xl transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-400/50"
                @click="navigateTo('home')"
              >
                Felfedezés
              </li>
              <li
                @click="navigateTo('restaurants')"
                class="bg-orange-900 hover:bg-orange-700 cursor-pointer text-white font-bold py-2 mr-2 px-4 rounded-4xl transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-400/50"
              >
                Éttermek
              </li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col items-center justify-between mt-8 mb-4">
          <div class="flex flex-col items-end gap-2 w-full">
            <FilterModal />
          </div>
          <RouterView />
        </div>
      </div>
    </div>
    <footer
      class="grid grid-cols-1 gap-6 border-t-2 border-t-amber-400 bg-black p-6 text-white sm:grid-cols-2 lg:grid-cols-5"
    >
      <RouterLink to="/" class="mx-auto w-auto h-auto lg:mx-0">
        <div>
          <img
            src="/images/logo.png"
            alt="Logo"
            class="mx-auto h-20 w-20 lg:mx-0"
          /><br />
          <p class="text-center lg:text-left">Készítették: A Feláldozhatók</p>
        </div>
      </RouterLink>
      <div class="text-center lg:text-left">
        <h1 class="text-l font-bold mb-3">Legyél LightningDelivery partner</h1>
        <RouterLink to="/recommend" class="hover:underline"
          >Kiszállítóként</RouterLink
        >
      </div>
      <div class="text-center lg:text-left">
        <h1 class="text-l font-bold mb-3">Cég</h1>
        <RouterLink to="/about" class="hover:underline">Rólunk</RouterLink>
      </div>
      <div class="text-center lg:text-left">
        <h1 class="text-l font-bold mb-3">Szolgáltatások</h1>
        <RouterLink to="/delivery" class="hover:underline"
          >Kiszállítás</RouterLink
        >
      </div>
      <!-- Removed 'Hasznos linkek' column as requested -->
      <div class="text-center lg:text-left">
        <h1 class="text-l font-bold mb-3">Kövess minket</h1>
        <!-- <RouterLink
          to="https://www.instagram.com/lightning_delivery67/"
          target="_blank"
          class="hover:underline"
          >Instagram</RouterLink
        ><br />
        <RouterLink
          to="https://www.facebook.com/profile.php?id=61567660715732&locale=hu_HU"
          target="_blank"
          class="hover:underline"
          >Facebook</RouterLink
        > -->
        <a
          href="https://www.instagram.com/lightning_delivery67/"
          target="_blank"
          class="hover:underline"
          >Instagram</a
        >
        <br />
        <a
          href="https://www.facebook.com/profile.php?id=61567660715732&locale=hu_HU"
          target="_blank"
          class="hover:underline"
          >Facebook</a
        >
      </div>
    </footer>
    <RegisterModal
      v-model:visible="isModalVisible"
      @update:visible="isModalVisible = $event"
      v-model:type="type"
      :hide-login="type === 'register'"
    />
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>

<style scoped>
@keyframes slideUpFooter {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer-anim {
  animation: slideUpFooter 0.8s ease-out forwards;
}
</style>
