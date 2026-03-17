<script setup lang="ts">
// Simple static intro page — no state needed yet
</script>
<template>
  <div
    class="min-h-screen items-center justify-center text-center bg-black text-white"
  >
    <RouterLink to="/" class="mx-auto mb-8 w-auto h-auto">
      <img src="/images/logo.png" class="h-20 w-20" />
    </RouterLink>

    <!-- Hero -->
    <section
      class="container relative mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-8"
    >
      <img
        src="/images/recommmendPageMatrica.png"
        alt="About Us Image"
        class="w-1/2 left-[50%] translate-x-[-50%] mx-auto absolute z-0 blur-sm flex justify-center"
      />
      <div class="lg:w-1/2 z-1 flex flex-col items-center">
        <h1
          class="text-4xl text-shadow-yellow-800 text-shadow-md lg:text-5xl font-extrabold text-amber-400 mb-4"
        >
          Ismerd meg a csapatunkat!
        </h1>
        <p
          class="text-gray-300 lg:w-2/3 text-shadow-black text-shadow-md mb-6 font-bold text-xl text-center mx-auto"
        >
          Hé, Te! Aki szereted a gyors és megbízható szolgáltatásokat, itt vagy
          jó helyen. Mi vagyunk a LightningDelivery – a csapat, aki a
          rendeléseket villámgyorsan szállítja, hogy az életed egyszerűbb
          legyen. Csatlakozz hozzánk, és tapasztald meg, hogyan változtatjuk meg
          a város ritmusát!
        </p>
        <div class="flex gap-4 items-center justify-center text-center">
          <a
            href="#about"
            class="border border-amber-400 text-amber-400 px-6 py-3 rounded-full hover:bg-amber-400 hover:text-black hover:font-bold transition-colors duration-300"
            >Tudj meg többet rólunk</a
          >
        </div>
      </div>
      <div class="lg:w-3/8 flex z-1 justify-center">
        <img
          src="/images/AboutZeus.png"
          alt="About Us Image"
          class="w-4/5 h-auto rounded-3xl drop-shadow-lg drop-shadow-blue-300 object-cover"
        />
      </div>
    </section>

    <!-- About Us -->
    <section id="about" class="bg-gray-900 py-16 mt-12 flex flex-col">
      <div
        class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
      >
        <div class="p-6 bg-gray-800 rounded-xl">
          <h3 class="text-amber-400 font-bold text-xl mb-2">Küldetésünk</h3>
          <p class="text-gray-300">
            <strong>Miért vagyunk itt?</strong> Mert hiszünk abban, hogy
            mindenki megérdemli a gyors és stresszmentes kiszállítást! 🚀 A
            LightningDelivery csapata olyan emberekből áll, akik szeretik a
            kihívásokat, és minden rendelést úgy kezelnek, mintha a sajátjuk
            lenne. Mi nem csak szállítunk, hanem kapcsolatokat építünk – veled
            együtt!
          </p>
        </div>
        <div class="p-6 bg-gray-800 rounded-xl">
          <h3 class="text-amber-400 font-bold text-xl mb-2">Csapatunk</h3>
          <p class="text-gray-300">
            <strong>Az arcok mögött!</strong> 👥 Mi vagyunk azok a srácok és
            lányok, akik reggelente felpattannak a bringára vagy beülnek az
            autóba, hogy a város minden sarkába eljuttassuk az ételt vagy a
            csomagokat. Együtt dolgozunk, nevetünk, és minden nap új kalandot
            hoz. Csatlakozz hozzánk, és légy részese ennek a dinamikus
            csapatnak!
          </p>
        </div>
        <div class="p-6 bg-gray-800 rounded-xl">
          <h3 class="text-amber-400 font-bold text-xl mb-2">Értékeink</h3>
          <p class="text-gray-300">
            <strong>Miben hiszünk?</strong> Az őszinteségben, a gyorsaságban és
            a közösség erejében! 💪 Nálunk nincs helye a kompromisszumoknak –
            minden ügyfélünk VIP, és minden partnerünk értékes. Mi építjük a
            jövőt, ahol a kiszállítás nem csak szolgáltatás, hanem élmény!
          </p>
        </div>
      </div>
    </section>
    <section
      class="container relative mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-8"
    >
      <img src="/images/Baszos-Zeusz.png" alt="" />
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
        <RouterLink to="/recommend" class="hover:underline"
          >Kiszállítóként</RouterLink
        >
      </div>
      <div>
        <h1 class="text-l font-bold mb-3">Cég</h1>
        <RouterLink to="/about" class="hover:underline">Rólunk</RouterLink>
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
  </div>
</template>
