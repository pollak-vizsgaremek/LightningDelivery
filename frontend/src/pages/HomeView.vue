<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/vue/24/outline";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];
</script>
<template>
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
            <img
              class="h-8 w-auto sm:h-16 place-self-start cursor-pointer"
              src="/images/logo.png"
              alt="Your Company"
            />
            <!-- Lokáció megadása -->
            <!-- <div class="flex flex-row items-center justify-center">
              <img class="h-6 w-6" alt="Location Icon" />
              <span class="text-gray-300 text-sm ml-2">Budapest</span>
            </div> -->
            <!--  Searchinput  -->
            <input
              type="text"
              placeholder="Keressés éttermek között..."
              class="ml-4 rounded-3xl w-2/4 bg-gray-700 place-self-center px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <div
              class="mt-auto mb-auto px-3 py-2 text-sm w-auto flex flex-row gap-2 place-self-end"
            >
              <a
                href="/login"
                class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                >Bejelentkezés</a
              >
              <a
                href="/register"
                class="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                >Regisztráció</a
              >
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
    <div class="items-center justify-center flex bg-black w-full h-1/6">
      <div class="bg-black h-full w-2/5">
        <ul class="items-center justify-center flex">
          <li
            class="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-3xl"
          >
            Éttermek
          </li>
          <li
            class="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 ml-1.5 px-4 rounded-3xl"
          >
            Üzletek
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
