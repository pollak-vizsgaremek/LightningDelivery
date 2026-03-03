<script setup lang="ts">
import { RouterView } from "vue-router";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { ref } from "vue";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import RegisterModal from "../components/LoginRegisterModal.vue";
import LocationModal from "../components/LocationModal.vue";
import FilterModal from "../components/FilterModal.vue";

const router = useRouter();

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];
const isModalVisible = ref(false);

const type = ref<"login" | "register">("login");

const closeModal = () => {
  isModalVisible.value = false;
  console.log(isModalVisible.value);
};

const openModal = (modalType: "login" | "register") => {
  type.value = modalType;
  isModalVisible.value = true;
  console.log(isModalVisible.value);
};

const navigateTo = (view: string) => {
  router.push({ name: view });
};
</script>
<template>
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
          class="relative flex h-16 items-center justify-center sm:justify-between"
        >
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button-->
            <DisclosureButton
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
            >
              <span class="absolute -inset-0.5"></span>
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
              <XMarkIcon v-else class="block size-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          <div
            class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
          >
            <div class="grid grid-rows-1 grid-cols-3 items-center w-full">
              <div class="flex flex-row gap-2">
                <img
                  class="h-8 mt-2 w-auto sm:h-16 place-self-start cursor-pointer"
                  src="/images/logo.png"
                  alt="Your Company"
                />
                <!-- Lokáció megadása -->
                <div class="place-self-center mt-5">
                  <LocationModal />
                  <span class="text-white text-sm ml-2">{{}}</span>
                </div>
              </div>

              <!--  Searchinput  -->
              <input
                type="text"
                placeholder="Keress éttermek között..."
                class="ml-4 w-2/4 rounded-3xl bg-gray-700 place-self-center px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-gray-800 focus:w-3/4 transition-all duration-200 ease-out"
              />
              <div
                class="mt-auto mb-auto px-3 py-2 text-sm w-auto flex flex-row gap-2 place-self-end"
              >
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
    <div class="bg-black text-white p-4 h-screen w-full">
      <div class="items-center justify-center flex bg-black w-full h-1/8">
        <div class="bg-black h-full w-2/5">
          <ul class="items-center justify-center flex">
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
            <li
              @click="navigateTo('stores')"
              class="bg-orange-900 hover:bg-orange-700 cursor-pointer text-white font-bold py-2 mr-2 px-4 rounded-4xl transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-400/50"
            >
              Üzletek
            </li>
          </ul>
        </div>
      </div>
      <div class="flex items-center justify-between mt-8 mb-4">
        <RouterView />
        <FilterModal />
      </div>
    </div>
  </div>
  <footer class="bg-gray-900 text-white p-8 grid grid-cols-6 gap-4">
    <div>
      <img src="/images/logo.png" alt="Logo" class="h-20 w-20" /><br />
      <p>Készítette: A MARADÉK</p>
    </div>
    <div>
      <h1 class="text-l font-bold mb-3">Legyél LightningDelivery partner</h1>
      <a href="" class="hover:underline">Kiszállítóként</a>
    </div>
    <div>
      <h1 class="text-l font-bold mb-3">Cég</h1>
      <a href="" class="hover:underline">Rólunk</a>
    </div>
    <div>
      <h1 class="text-l font-bold mb-3">Szolgáltatások</h1>
      <a href="" class="hover:underline">Kiszállítás</a>
    </div>
    <div>
      <h1 class="text-l font-bold mb-3">Hasznos linkek</h1>
      <a href="" class="hover:underline">Gyakori kérdések</a>
    </div>
    <div>
      <h1 class="text-l font-bold mb-3">Kövess minket</h1>
      <a href="" class="hover:underline">instagram</a><br />
      <a href="" class="hover:underline">facebook</a>
    </div>
  </footer>
  <RegisterModal
    v-model:visible="isModalVisible"
    @update:visible="isModalVisible = $event"
    v-model:type="type"
    :hide-login="type === 'register'"
  />
</template>
