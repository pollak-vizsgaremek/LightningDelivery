<script setup lang="ts"></script>
<template>
  <div class="flex items-center mt-5 justify-center w-full">
    <div
      class="lg:w-1/8 h-45 w-full rounded-3xl border border-gray-500/20 bg-black/20 font-semibold text-2xl text-center cursor-pointer relative overflow-hidden group shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/30"
    >
      <ul class="items-center justify-center">
        <li
          class="relative overflow-hidden border border-amber-400/20 bg-black/70"
        >
          <img
            src="/images/burger.jpg"
            alt="Kiszállítási terv térképe"
            class="h-full w-full object-cover opacity-90"
          />
          <div
            class="absolute inset-0 from-black/80 via-black/10 to-black/0"
          ></div>
          <div class="absolute bottom-8 left-8 text-left text-white">
            <h3 class="text-3xl font-bold">Burgerek</h3>
            <p class="mt-3 text-gray-200"></p>
          </div>
        </li>
      </ul>
    </div>

    <div
      class="lg:w-1/8 h-45 w-full ml-5 rounded-3xl border border-gray-500/20 bg-black/20 font-semibold text-2xl text-center cursor-pointer relative overflow-hidden group shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/30"
    >
      <ul class="items-center justify-center">
        <li
          class="relative h-45 overflow-hidden border border-amber-400/20 bg-black/70"
        >
          <img
            src="/images/gyros.webp"
            alt="Kiszállítási terv térképe"
            class="h-full w-full object-cover opacity-90"
          />
          <div
            class="absolute inset-0 from-black/80 via-black/10 to-black/0"
          ></div>
          <div class="absolute bottom-8 left-8 text-left text-white">
            <h3 class="text-3xl font-bold">Gyros</h3>
            <p class="mt-3 text-gray-200"></p>
          </div>
        </li>
      </ul>
    </div>

    <div
      class="lg:w-1/8 h-45 w-full ml-5 rounded-3xl border border-gray-500/20 bg-black/20 font-semibold text-2xl text-center cursor-pointer relative overflow-hidden group shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/30"
    >
      <ul class="items-center justify-center">
        <li
          class="relative h-45 overflow-hidden border border-amber-400/20 bg-black/70"
        >
          <img
            src="/images/pizza.jpg"
            alt="Kiszállítási terv térképe"
            class="h-full w-full object-cover opacity-90"
          />
          <div
            class="absolute inset-0 from-black/80 via-black/10 to-black/0"
          ></div>
          <div class="absolute bottom-8 left-8 text-left text-white">
            <h3 class="text-3xl font-bold">Pizza</h3>
            <p class="mt-3 text-gray-200"></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!-- <div class="items-center justify-center flex bg-black w-full h-1/8">
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
      </ul>
    </div>
  </div> -->
</template>
