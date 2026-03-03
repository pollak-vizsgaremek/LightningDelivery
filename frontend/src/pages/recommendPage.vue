<script setup lang="ts">
// Simple static intro page — no state needed yet
</script>
<template>
  <div
    class="min-h-screen items-center justify-center text-center bg-black text-white"
  >
    <RouterLink to="/" class="h-20 w-20 mx-auto mb-8">
      <img src="/images/logo.png" class="h-20 w-20" />
    </RouterLink>
    <!-- Hero -->
    <section
      class="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-8"
    >
      <div class="lg:w-1/2">
        <h1 class="text-4xl lg:text-5xl font-extrabold text-amber-400 mb-4">
          Legyél részese a LightningDelivery-nek!
        </h1>
        <p class="text-gray-300 mb-6">
          Gyors, megbízható és egyszerű. Csatlakozz partnerként vagy ügyfélként,
          és tapasztald meg, hogyan dolgozunk együtt hogy a rendelésed mindig
          időben érkezzen.
        </p>
        <div class="flex gap-4">
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
    <section id="features" class="bg-gray-900 py-16 mt-12 flex flex-col">
      <div
        class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
      >
        <div class="p-6 bg-gray-800 rounded-xl">
          <h3 class="text-amber-400 font-bold text-xl mb-2">
            Gyors kiszállítás
          </h3>
          <p class="text-gray-300">
            <strong>Hé, Te!</strong> Szeretsz pörögni? Akkor köztünk a helyed!
            🚀 A Woltnál nem csak ételt szállítunk, hanem a szabadság élményét –
            és ebben a gyorsaság a legfőbb fegyverünk. Nálunk te vagy az utcák
            királya: akkor indulsz, amikor akarsz, és úgy tekered a bringát vagy
            nyomod a gázt, ahogy a lendületed diktálja.
          </p>
        </div>
        <div class="p-6 bg-gray-800 rounded-xl">
          <h3 class="text-amber-400 font-bold text-xl mb-2">
            Átlátható jutalékok
          </h3>
          <p class="text-gray-300">
            <strong>Pénz beszél, kutya ugat!</strong> 💸 Unod a rejtett
            költségeket és a követhetetlen kifizetéseket? Nálunk nincs sötétben
            tapogatózás: a Woltnál az átláthatóság éppolyan alapvető, mint a
            gyorsaság. Pontosan tudni fogod, miért dolgozol, és minden fillért
            nyomon követhetsz a saját kijelződön.
          </p>
        </div>
        <div class="p-6 bg-gray-800 rounded-xl">
          <h3 class="text-amber-400 font-bold text-xl mb-2">
            Valós idejű követés
          </h3>
          <p class="text-gray-300">
            <strong>Páholyülés a város felett </strong>– nálunk te vagy a térkép
            ura! 📍 Felejtsd el a „merre járhat a futár?” típusú ideges
            telefonokat! A Woltnál a valós idejű GPS-követés nem csak egy
            kényelmi funkció, hanem a te legfőbb szövetségesed a zökkenőmentes
            munkában. Itt mindenki pontosan látja a célt, te pedig fókuszálhatsz
            arra, amiben a legjobb vagy: a vezetésre.
          </p>
        </div>
      </div>
    </section>
    <footer
      class="bg-black border-t-2 border-t-amber-400 text-white p-8 grid grid-cols-6 gap-4"
    >
      <div>
        <img src="/images/logo.png" alt="Logo" class="h-20 w-20" /><br />
        <p>Készítette: A MARADÉK</p>
      </div>
      <div>
        <h1 class="text-l font-bold mb-3">Legyél LightningDelivery partner</h1>
        <a href="/recommend" class="hover:underline">Kiszállítóként</a>
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
    <!-- Partner CTA -->
  </div>
</template>
