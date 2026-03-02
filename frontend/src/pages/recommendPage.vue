<script setup lang="ts">
// Simple static intro page — no state needed yet
</script>
<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Hero -->
    <section
      class="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-8"
    >
      <div class="lg:w-1/2">
        <h1 class="text-4xl lg:text-5xl font-extrabold text-amber-400 mb-4">
          Legyél részese a LightningDelivery-nek
        </h1>
        <p class="text-gray-300 mb-6">
          Gyors, megbízható és egyszerű. Csatlakozz partnerként vagy ügyfélként,
          és tapasztald meg, hogyan dolgozunk együtt hogy a rendelésed mindig
          időben érkezzen.
        </p>
        <div class="flex gap-4">
          <a
            href="#"
            class="bg-amber-400 text-black font-semibold px-6 py-3 rounded-full hover:scale-105 transition"
            >Csatlakozás</a
          >
          <a
            href="#features"
            class="border border-amber-400 text-amber-400 px-6 py-3 rounded-full hover:underline"
            >Tudj meg többet</a
          >
        </div>
      </div>
      <div class="lg:w-1/2 flex justify-center">
        <div
          class="w-80 h-80 bg-gradient-to-br from-orange-800 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg"
        >
          <img src="/images/logo.png" alt="Logo" class="w-36 h-36" />
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="bg-gray-900 py-16 mt-12">
      <div
        class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
      >
        <div class="p-6 bg-gray-800 rounded-xl">
          <h3 class="text-amber-400 font-bold text-xl mb-2">
            Gyors kiszállítás
          </h3>
          <p class="text-gray-300">
            Optimalizált útvonalak és tapasztalt futárok biztosítják a gyors
            házhozszállítást.
          </p>
        </div>
        <div class="p-6 bg-gray-800 rounded-xl">
          <h3 class="text-amber-400 font-bold text-xl mb-2">
            Átlátható jutalékok
          </h3>
          <p class="text-gray-300">
            Tisztességes és versenyképes díjszabás, amely a partneri
            együttműködést támogatja.
          </p>
        </div>
        <div class="p-6 bg-gray-800 rounded-xl">
          <h3 class="text-amber-400 font-bold text-xl mb-2">
            Valós idejű követés
          </h3>
          <p class="text-gray-300">
            Valós idejű nyomon követés mind a futártól, mind a rendelés
            állapotától.
          </p>
        </div>
      </div>
    </section>

    <!-- Partner CTA -->
  </div>
</template>
