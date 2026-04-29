<script setup lang="ts">
import { computed, ref } from "vue";
import { useCartStore } from "../stores/cart";

const { items, itemCount, totalPrice, setQuantity, removeItem, clear } =
  useCartStore();

const visible = ref(false);
const address = ref("");
const paymentMethod = ref("cash");
const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const confirmRemoveVisible = ref(false);
const pendingRemoveKey = ref("");
const pendingRemoveLabel = ref("");

const hasItems = computed(() => items.value.length > 0);

const open = () => {
  visible.value = true;
  errorMessage.value = "";
  successMessage.value = "";
};

const close = () => {
  visible.value = false;
};

const requestRemove = (key: string, label: string) => {
  pendingRemoveKey.value = key;
  pendingRemoveLabel.value = label;
  confirmRemoveVisible.value = true;
};

const cancelRemove = () => {
  confirmRemoveVisible.value = false;
  pendingRemoveKey.value = "";
  pendingRemoveLabel.value = "";
};

const confirmRemove = () => {
  if (pendingRemoveKey.value) {
    removeItem(pendingRemoveKey.value);
  }
  cancelRemove();
};

const onQuantityInput = (itemKey: string, label: string, rawValue: string) => {
  const normalized = rawValue.trim();

  if (normalized === "") {
    return;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    setQuantity(itemKey, 1);
    return;
  }

  if (parsed <= 0) {
    requestRemove(itemKey, label);
    return;
  }

  setQuantity(itemKey, Math.min(10, Math.max(1, Math.floor(parsed))));
};

const submitOrder = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!hasItems.value) {
    errorMessage.value = "A kosár üres.";
    return;
  }

  if (!address.value.trim()) {
    errorMessage.value = "Adj meg szállítási címet.";
    return;
  }

  const token = localStorage.getItem("accessToken");
  const userId = Number(localStorage.getItem("userId"));

  if (!token || !userId) {
    errorMessage.value = "Rendelés leadásához be kell jelentkezni.";
    return;
  }

  isSubmitting.value = true;

  try {
    const payloadItems = items.value.map((item) => {
      const menuId =
        item.type === "menu" ? Number(item.key.split("-")[1] ?? 0) : undefined;

      return {
        type: item.type,
        label: item.label,
        quantity: item.quantity,
        price: item.price,
        foodId: item.foodId,
        drinkId: item.drinkId,
        menuId: menuId && Number.isInteger(menuId) ? menuId : undefined,
      };
    });

    const res = await fetch(
      "http://localhost:3300/api/v1/rendelesek/rendelesleadas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          FelhasznalokID: userId,
          Cime: address.value,
          FizetesiMod: paymentMethod.value,
          items: payloadItems,
        }),
      },
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(
        data?.message || data?.error || "Nem sikerült leadni a rendelést.",
      );
    }

    successMessage.value = "Rendelés sikeresen leadva.";
    clear();
    address.value = "";
    paymentMethod.value = "cash";
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Ismeretlen hiba történt.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="relative">
    <button
      @click="open"
      class="relative bg-black hover:bg-gray-800 cursor-pointer text-white font-bold py-2 px-4 rounded transition-all duration-200"
    >
      Kosár
      <span
        class="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-amber-500 text-black text-xs font-extrabold flex items-center justify-center"
      >
        {{ itemCount }}
      </span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-40 bg-black/50"
        @click="close"
      ></div>
    </transition>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="visible"
        class="fixed z-50 inset-0 flex items-center justify-center p-4"
      >
        <div
          class="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-950 p-5"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-white">Kosár</h2>
            <button
              @click="close"
              aria-label="Bezár kosár"
              class="ml-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div
            v-if="errorMessage"
            class="mb-3 rounded-lg border border-red-500 bg-red-900/30 px-3 py-2 text-red-200"
          >
            {{ errorMessage }}
          </div>
          <div
            v-if="successMessage"
            class="mb-3 rounded-lg border border-emerald-500 bg-emerald-900/30 px-3 py-2 text-emerald-200"
          >
            {{ successMessage }}
          </div>

          <div class="max-h-64 overflow-y-auto space-y-3 mb-4">
            <div
              v-for="item in items"
              :key="item.key"
              class="rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="font-semibold text-white">{{ item.label }}</p>
                  <p class="text-sm text-gray-300">{{ item.price }} Ft / db</p>
                </div>

                <div class="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="1"
                    :value="item.quantity"
                    @input="
                      onQuantityInput(
                        item.key,
                        item.label,
                        ($event.target as HTMLInputElement).value,
                      )
                    "
                    class="w-16 rounded-lg bg-gray-800 border border-gray-700 px-2 py-1 text-white"
                  />
                  <button
                    @click="requestRemove(item.key, item.label)"
                    class="rounded-lg bg-red-800 hover:bg-red-700 px-3 py-1 text-sm text-white"
                  >
                    Törlés
                  </button>
                </div>
              </div>
            </div>

            <p v-if="!hasItems" class="text-gray-400">A kosár üres.</p>
          </div>

          <div class="grid gap-4 md:grid-cols-2 mb-4">
            <div>
              <label class="block text-sm text-gray-300 font-semibold mb-1"
                >Szállítási cím</label
              >
              <input
                v-model="address"
                placeholder="Pl. Szeged, Kossuth L. sgt. 12."
                class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-300 font-semibold mb-1"
                >Fizetési mód</label
              >
              <select
                v-model="paymentMethod"
                class="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              >
                <option value="cash">Készpénz</option>
                <option value="card">Bankkártya</option>
                <option value="transfer">Átutalás</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-lg font-bold text-amber-300">
              Összesen: {{ totalPrice }} Ft
            </p>
            <button
              :disabled="isSubmitting || !hasItems"
              @click="submitOrder"
              class="rounded-lg bg-amber-700 hover:bg-amber-600 disabled:opacity-50 px-4 py-2 font-bold text-white"
            >
              {{ isSubmitting ? "Leadás..." : "Rendelés leadása" }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="confirmRemoveVisible"
        class="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4"
      >
        <div
          class="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-5"
        >
          <h3 class="text-xl font-bold text-white mb-2">Tétel törlése</h3>
          <p class="text-gray-200 mb-5">
            Biztosan törölni szeretnéd ezt a tételt a kosárból?
            <span class="font-semibold text-white">{{
              pendingRemoveLabel
            }}</span>
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="cancelRemove"
              class="rounded-lg bg-gray-700 hover:bg-gray-600 px-4 py-2 text-white"
            >
              Mégse
            </button>
            <button
              @click="confirmRemove"
              class="rounded-lg bg-red-700 hover:bg-red-600 px-4 py-2 text-white font-semibold"
            >
              Igen, törlöm
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
