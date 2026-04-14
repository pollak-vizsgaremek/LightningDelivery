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
            alt="Kisz�ll�t�si terv koncepci�"
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
              Kisz�ll�t�si terv
            </p>
            <h1
              class="text-5xl font-extrabold text-white leading-tight sm:text-6xl lg:text-7xl"
            >
              Vill�mgyors �tvonalak, okos tervez�s, minden kisz�ll�t�sra.
            </h1>
            <p class="mt-6 text-gray-300 text-lg lg:text-xl leading-relaxed">
              Ez a t�rk�p a mi f� koncepci�nk: k�zponti logisztika, eddigi
              tapasztalat �s a v�ros leghat�konyabb �tvonalai egy helyen. N�zd
              meg, hogyan �p�tj�k fel a kisz�ll�t�sunkat l�p�sr�l l�p�sre.
            </p>
          </div>
          <div
            class="rounded-[2rem] border border-amber-400/30 bg-black/70 p-6 text-left shadow-2xl shadow-amber-500/10"
          >
            <h2 class="text-3xl font-bold text-amber-300 mb-4">
              A terv pill�rei
            </h2>
            <ul class="space-y-4 text-gray-200">
              <li class="rounded-3xl bg-white/5 p-4">
                <strong class="text-amber-300">Z�naalap� lefedetts�g</strong
                ><br />
                Budapest, P�cs, Debrecen �s a kiemelt �tvonalak igazi
                vill�mgyors kisz�ll�t�sokat adnak.
              </li>
              <li class="rounded-3xl bg-white/5 p-4">
                <strong class="text-amber-300">Val�s idej� optimaliz�l�s</strong
                ><br />
                T�bbf�le j�rm�vel �s rugalmas ter�leti megk�zel�t�ssel
                cs�kkentj�k a v�rakoz�st.
              </li>
              <li class="rounded-3xl bg-white/5 p-4">
                <strong class="text-amber-300">Utasbar�t �lm�ny</strong><br />
                Minden rendel�s egyszerre c�lzott �s gyors: a c�mk�kt�l a
                c�lvonalig k�zben tartjuk.
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
            1. �tvonal t�rk�p
          </h3>
          <p class="text-gray-300 leading-relaxed">
            A f� koncepci� k�z�ppontj�ban a t�rk�p �ll. J�l l�that�ak a f�
            v�rosok, a csatlakoz�sok �s a vill�mgyors �tmenetek az eg�sz
            h�l�zatban.
          </p>
        </div>
        <div
          class="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-amber-400/20"
        >
          <h3 class="text-2xl font-bold text-amber-300 mb-4">
            2. Kisz�ll�t�si strat�gia
          </h3>
          <p class="text-gray-300 leading-relaxed">
            Egyed�l�ll�an optimaliz�lt menet: a csomagok sorrendj�t, gyors
            �tvonalakat �s k�ztes �tv�teli pontokat egyar�nt figyelembe vessz�k.
          </p>
        </div>
        <div
          class="rounded-[2rem] bg-slate-900/90 p-8 ring-1 ring-amber-400/20"
        >
          <h3 class="text-2xl font-bold text-amber-300 mb-4">
            3. F� koncepci�
          </h3>
          <p class="text-gray-300 leading-relaxed">
            Gyors, biztons�gos �s vizu�lisan er�s. Az oldal grafikai vil�ga a
            felhaszn�l� sz�m�ra is egy�rtelm�v� teszi a kisz�ll�t�s ritmus�t.
          </p>
        </div>
      </section>

      <section
        class="mt-20 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center"
      >
        <div
          class="rounded-[2rem] border border-amber-400/30 bg-slate-950/90 p-10 shadow-2xl shadow-amber-500/10"
        >
          <h2 class="text-4xl font-extrabold text-amber-400 mb-6">
            Kisz�ll�t�si terv l�p�sei
          </h2>
          <div class="space-y-6 text-gray-300">
            <div>
              <h4 class="text-2xl font-bold text-white mb-2">
                1. Ter�letfelm�r�s
              </h4>
              <p>
                Elemzz�k a v�rosr�szek forgalm�t, a m�r megl�v� �tvonalakat �s a
                c�lpontokat.
              </p>
            </div>
            <div>
              <h4 class="text-2xl font-bold text-white mb-2">
                2. Z�n�k �s jelent�s pontok
              </h4>
              <p>
                Budapest k�zpontt�l a nagyv�rosokig meghat�rozzuk a leggyorsabb
                csatlakoz�sokat.
              </p>
            </div>
            <div>
              <h4 class="text-2xl font-bold text-white mb-2">
                3. Vill�mgyors k�zbes�t�s
              </h4>
              <p>
                Az �tvonalakat �lland�an finom�tjuk, hogy minden rendel�s a
                lehet� leghamarabb �rkezzen meg.
              </p>
            </div>
          </div>
        </div>
        <div
          class="relative rounded-[2rem] overflow-hidden border border-amber-400/20 bg-black/70"
        >
          <!-- <img
            src="/images/delivery-plan-concept.png"
            alt="Kisz�ll�t�si terv t�rk�pe"
            class="h-full w-full object-cover opacity-90"
          /> -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/0"
          ></div>
          <div class="absolute bottom-8 left-8 text-left text-white">
            <p class="text-sm uppercase tracking-[0.3em] text-amber-400 mb-2">
              F� koncepci�
            </p>
            <h3 class="text-3xl font-bold">
              A sz�ll�t�si h�l�zat k�zponti eleme
            </h3>
            <p class="mt-3 max-w-sm text-gray-200">
              Ez a grafika mutatja a LightningDelivery er�ss�g�t: egyszer�,
              l�tv�nyos �s azonnal �rthet�.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
