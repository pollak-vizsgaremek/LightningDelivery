<template>
  <div class="flex items-center">
    <button
      @click="open"
      class="flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 transition-colors duration-200 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-amber-400 flex-shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M3 5a1 1 0 01.553-.894l5-2.5A1 1 0 009 1v6.382l2 1V1a1 1 0 01.447-.894l5-2.5A1 1 0 0118 0v2a1 1 0 01-1 1h-1v5.382l2 1V3a1 1 0 01.553-.894l1-0.5V15a1 1 0 01-.553.894l-5 2.5A1 1 0 0112 18v-6.382l-2-1V18a1 1 0 01-.447.894l-5 2.5A1 1 0 013 21V5z"
        />
      </svg>
      <span class="font-medium">Szűrők</span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        @click="close"
        class="fixed inset-0 bg-black/40 z-40"
      ></div>
    </transition>

    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 scale-95 translate-y-4"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 translate-y-4"
    >
      <div
        v-if="visible"
        class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        @click.stop
      >
        <div
          class="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-hidden flex flex-col pointer-events-auto"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-4 border-b border-gray-700"
          >
            <h3 class="font-semibold text-white">Szűrők</h3>
            <button
              @click="close"
              class="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="overflow-y-auto flex-1 p-4 space-y-4">
            <div>
              <p class="text-xs text-gray-400 font-medium mb-3">
                Szállítási idő
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="opt in timeOptions"
                  :key="opt"
                  @click="toggle('time', opt)"
                  :class="chipClass(selected.time, opt)"
                >
                  {{ opt }}
                </button>
              </div>
            </div>

            <div>
              <p class="text-xs text-gray-400 font-medium mb-3">Jellemzők</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="opt in featureOptions"
                  :key="opt"
                  @click="toggle('feature', opt)"
                  :class="chipClass(selected.feature, opt)"
                >
                  {{ opt }}
                </button>
              </div>
            </div>

            <div>
              <p class="text-xs text-gray-400 font-medium mb-3">Ár</p>
              <div class="flex items-center gap-4">
                <label
                  class="flex items-center gap-2 cursor-pointer text-white"
                >
                  <input
                    type="radio"
                    name="price"
                    value="all"
                    v-model="price"
                    class="cursor-pointer"
                  />
                  <span class="text-sm">Összes</span>
                </label>
                <label
                  class="flex items-center gap-2 cursor-pointer text-white"
                >
                  <input
                    type="radio"
                    name="price"
                    value="cheap"
                    v-model="price"
                    class="cursor-pointer"
                  />
                  <span class="text-sm">Olcsó</span>
                </label>
                <label
                  class="flex items-center gap-2 cursor-pointer text-white"
                >
                  <input
                    type="radio"
                    name="price"
                    value="expensive"
                    v-model="price"
                    class="cursor-pointer"
                  />
                  <span class="text-sm">Drága</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-between p-4 border-t border-gray-700"
          >
            <button
              @click="clear"
              class="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Törlés
            </button>
            <div class="flex gap-3">
              <button
                @click="close"
                class="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium cursor-pointer"
              >
                Mégse
              </button>
              <button
                @click="apply"
                class="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium cursor-pointer"
              >
                Alkalmaz
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const visible = ref(false);

const open = () => {
  visible.value = true;
};
const close = () => {
  visible.value = false;
};

const timeOptions = ["< 30 perc", "< 45 perc", "< 60 perc"];
const featureOptions = ["Gyors", "Kedvezmény", "Népszerű"];

const selected = reactive({ time: [] as string[], feature: [] as string[] });
const price = ref("all");

const toggle = (group: "time" | "feature", value: string) => {
  const arr = selected[group];
  const idx = arr.indexOf(value);
  if (idx === -1) arr.push(value);
  else arr.splice(idx, 1);
};

const chipClass = (arr: string[], value: string) => {
  return [
    "px-3 py-1.5 rounded-lg text-sm transition-colors duration-150 cursor-pointer",
    arr.includes(value)
      ? "bg-amber-600 text-white border border-amber-500"
      : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700",
  ];
};

const clear = () => {
  selected.time.splice(0);
  selected.feature.splice(0);
  price.value = "all";
};

const apply = () => {
  // TODO: emit selected filters to parent if needed
  console.log("Apply filters", {
    selected: { ...selected },
    price: price.value,
  });
  visible.value = false;
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
