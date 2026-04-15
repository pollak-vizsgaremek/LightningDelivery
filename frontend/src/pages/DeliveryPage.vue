<script setup lang="ts">
// Delivery plan page built from the About Us layout
</script>
<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-6 py-10">
      <RouterLink to="/" class="inline-flex items-center gap-3 mb-10">
        <!-- <img src="/images/logo.png" alt="LightningDelivery" class="h-16 w-16" /> -->
        <span class="text-2xl font-extrabold text-amber-400"
          >LightningDelivery</span
        >
      </RouterLink>

      <section
        class="relative overflow-hidden rounded-[2rem] bg-slate-950/80 p-8 shadow-2xl shadow-amber-500/20"
      >
        <div class="absolute inset-0 opacity-40">
          <!-- <img
            "
            alt="Kiszállítási terv koncepció"
            class="h-full w-full object-cover"
          /> -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/80"
          ></div>
        </div>
        <div
          class="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center"
        >
          <div class="max-w-2xl">
            <p class="text-amber-400 uppercase tracking-[0.35em] mb-4 text-sm">
              Kiszállítási terv
            </p>
            <h1
              class="text-5xl font-extrabold text-white leading-tight sm:text-6xl lg:text-7xl"
            >
              Villámgyors útvonalak, okos tervezés, minden kiszállításra.
            </h1>
            <p class="mt-6 text-gray-300 text-lg lg:text-xl leading-relaxed">
              Ez a térkép a mi fő koncepciónk: központi logisztika, eddigi
              tapasztalat és a város leghatékonyabb útvonalai egy helyen. Nézd
              meg, hogyan építjük fel a kiszállításunkat lépésről lépésre.
            </p>
          </div>
          <div
            class="rounded-[2rem] border border-amber-400/30 bg-black/70 p-6 text-left shadow-2xl shadow-amber-500/10"
          >
            <h2 class="text-3xl font-bold text-amber-300 mb-4">
              A terv pillérei
            </h2>
            <ul class="space-y-4 text-gray-200">
              <li class="rounded-3xl bg-white/5 p-4">
                <strong class="text-amber-300">Zónaalapú lefedettség</strong
                ><br />
                Budapest, Pécs, Debrecen és a kiemelt útvonalak igazi
                villámgyors kiszállításokat adnak.
              </li>
              <li class="rounded-3xl bg-white/5 p-4">
                <strong class="text-amber-300">Valós idejű optimalizálás</strong
                ><br />
                Többféle járművel és rugalmas területi megközelítéssel
                csökkentjük a várakozást.
              </li>
              <li class="rounded-3xl bg-white/5 p-4">
                <strong class="text-amber-300">Utasbarát élmény</strong><br />
                Minden rendelés egyszerre célzott és gyors: a címkéktől a
                célvonalig közben tartjuk.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="mt-16 grid gap-12 lg:grid-cols-3">
        <div
          class="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-amber-400/20"
        >
          <h3 class="text-2xl font-bold text-amber-300 mb-4">
            1. Útvonal térkép
          </h3>
          <p class="text-gray-300 leading-relaxed">
            A fő koncepció középpontjában a térkép áll. Jól láthatóak a fő
            városok, a csatlakozások és a villámgyors átmenetek az egész
            hálózatban.
          </p>
        </div>
        <div
          class="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-amber-400/20"
        >
          <h3 class="text-2xl font-bold text-amber-300 mb-4">
            2. Kiszállítási stratégia
          </h3>
          <p class="text-gray-300 leading-relaxed">
            Egyedülállóan optimalizált menet: a csomagok sorrendjét, gyors
            útvonalakat és köztes átvételi pontokat egyaránt figyelembe vesszük.
          </p>
        </div>
        <div
          class="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-amber-400/20"
        >
          <h3 class="text-2xl font-bold text-amber-300 mb-4">
            3. Fő koncepció
          </h3>
          <p class="text-gray-300 leading-relaxed">
            Gyors, biztonságos és vizuálisan erős. Az oldal grafikai világa a
            felhasználó számára is egyértelművé teszi a kiszállítás ritmusát.
          </p>
        </div>
      </section>

      <section
        class="mt-20 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center justify-center"
      >
        <div
          class="rounded-[2rem] border border-amber-400/30 bg-slate-950/90 p-10 shadow-2xl shadow-amber-500/10"
        >
          <h2 class="text-4xl font-extrabold text-amber-400 mb-6">
            Kiszállítási terv lépései
          </h2>
          <div class="space-y-6 text-gray-300">
            <div>
              <h4 class="text-2xl font-bold text-white mb-2">
                1. Területfelmérés
              </h4>
              <p>
                Elemezzük a városrészek forgalmát, a már meglévő útvonalakat és
                a célpontokat.
              </p>
            </div>
            <div>
              <h4 class="text-2xl font-bold text-white mb-2">
                2. Zónák és jelentős pontok
              </h4>
              <p>
                Budapest központtól a nagyvárosokig meghatározzuk a leggyorsabb
                csatlakozásokat.
              </p>
            </div>
            <div>
              <h4 class="text-2xl font-bold text-white mb-2">
                3. Villámgyors közbesítés
              </h4>
              <p>
                Az útvonalakat állandóan finomítjuk, hogy minden rendelés a
                lehető leghamarabb érkezzen meg.
              </p>
            </div>
          </div>
        </div>
        <div
          class="relative rounded-[2rem] overflow-hidden border border-amber-400/20 bg-black/70"
        >
          <!-- <img
            src="/images/delivery-plan-concept.png"
            alt="Kiszállítási terv térképe"
            class="h-full w-full object-cover opacity-90"
          /> -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/0"
          ></div>
          <div class="absolute bottom-8 left-8 text-left text-white">
            <p class="text-sm uppercase tracking-[0.3em] text-amber-400 mb-2">
              Fő koncepció
            </p>
            <h3 class="text-3xl font-bold">
              A szállítási hálózat központi eleme
            </h3>
            <p class="mt-3 max-w-sm text-gray-200">
              Ez a grafika mutatja a LightningDelivery erősségét: egyszerű,
              látványos és azonnal érthető.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
  <footer
    class="bg-black border-t-2 border-t-amber-400 text-white p-8 grid grid-cols-6 gap-4"
  >
    <RouterLink to="/" class="mx-auto mb-8 w-auto h-auto">
      <div>
        <img src="/images/logo.png" alt="Logo" class="h-20 w-20" /><br />
        <p>Készítette: A MARADÉK</p>
      </div>
    </RouterLink>
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
      <RouterLink to="/delivery" class="hover:underline"
        >Kiszállítás</RouterLink
      >
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
</template>
