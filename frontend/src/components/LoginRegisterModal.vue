<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { ref, watch } from "vue";
import { useRouter } from "vue-router"; // 1. Router importálása
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

const props = defineProps<{
  visible: boolean;
  type: "login" | "register";
}>();

const emit = defineEmits(["update:visible"]);
const router = useRouter(); // 2. Router példányosítása

const isOpen = ref(props.visible);
const selectedTab = ref(props.type === "login" ? 0 : 1);

watch(
  () => props.visible,
  (newVal) => {
    isOpen.value = newVal;
  }
);

watch(isOpen, (newVal) => {
  emit("update:visible", newVal);
});

const close = () => {
  isOpen.value = false;
  emit("update:visible", false);
};

const cancel = () => {
  isOpen.value = false;
  emit("update:visible", false);
  router.push("/");
};

const categories = {
  Bejelentkezés: [
    {
      id: 1,
      title: "E-mail bejelentkezés",
      date: "2025-12-18",
      commentCount: 0,
      shareCount: 0,
    },
  ],
  Regisztráció: [
    {
      id: 2,
      title: "Fiók létrehozása",
      date: "2025-12-18",
      commentCount: 0,
      shareCount: 0,
    },
  ],
};

// Login form state
const loginEmail = ref("");
const loginPassword = ref("");

const login = () => {
  console.log("Login attempt:", {
    email: loginEmail.value,
    password: loginPassword.value,
  });
  // TODO: replace with real authentication flow
  isOpen.value = false;
  emit("update:visible", false);
};

// Registration form state
const regName = ref("");
const regEmail = ref("");
const regPassword = ref("");
const regPasswordConfirm = ref("");
const regError = ref("");

const register = () => {
  regError.value = "";
  if (regPassword.value !== regPasswordConfirm.value) {
    regError.value = "A jelszavak nem egyeznek";
    return;
  }
  console.log("Register attempt:", {
    name: regName.value,
    email: regEmail.value,
  });
  // TODO: replace with real registration flow
  isOpen.value = false;
  emit("update:visible", false);
};
</script>

<template>
  <!-- Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300"
  >
    <!-- Modal Konténer -->
    <div
      class="relative mx-auto w-full max-w-lg rounded-lg border-2 border-amber-400 bg-gray-900 shadow-2xl p-6 transform transition-all duration-300 ease-out"
      :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
    >
      <!-- Modal Fejléc -->
      <div
        class="flex items-center justify-between mb-4 pb-2 border-b border-gray-700"
      >
        <h3
          class="text-xl font-semibold text-white items-center justify-center"
        >
          <slot name="title">Jelentkezz be vagy regisztrálj!</slot>
        </h3>
        <!-- Bezárás gomb (X ikon) -->
        <button
          @click="close"
          class="text-gray-400 hover:text-white transition duration-150 p-1 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <XMarkIcon class="h-6 w-6 cursor-pointer" />
        </button>
      </div>

      <!-- Modal Tartalom -->
      <!-- <div class="text-gray-300 mb-6">
        <slot name="content"
          >Jelentkezz be a fiókodba vagy regisztrálj új fiókot!</slot
        >
      </div> -->

      <!-- Modal Lábléc -->
      <div class="w-full max-w-md px-2 py-4 sm:px-0 mx-auto">
        <TabGroup>
          <TabList
            class="flex space-x-1 rounded-xl bg-gray-800/30 p-1 border border-gray-700"
          >
            <Tab
              v-for="category in Object.keys(categories)"
              as="template"
              :key="category"
              v-slot="{ selected }"
              class="cursor-pointer"
            >
              <button
                :class="[
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'focus:outline-none focus:ring-2 focus:ring-amber-400',
                  selected
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-gray-300 hover:bg-white/4 hover:text-white',
                ]"
              >
                {{ category }}
              </button>
            </Tab>
          </TabList>

          <TabPanels class="mt-2">
            <TabPanel
              v-for="(posts, idx) in Object.values(categories)"
              :key="idx"
              :class="[
                'rounded-xl bg-gray-900 p-4 border border-gray-700 text-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-amber-400',
              ]"
            >
              <div v-if="idx === 0 && selectedTab === 0">
                <!-- Login form -->
                <form @submit.prevent="login" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-1"
                      >E-mail</label
                    >
                    <input
                      v-model="loginEmail"
                      type="email"
                      required
                      placeholder="you@example.com"
                      class="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-1"
                      >Jelszó</label
                    >
                    <input
                      v-model="loginPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      class="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      @click="cancel"
                      class="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Mégse
                    </button>
                    <button
                      type="submit"
                      class="bg-orange-900 cursor-pointer hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Bejelentkezés
                    </button>
                  </div>
                </form>
              </div>

              <div v-else>
                <!-- Registration form -->
                <form @submit.prevent="register" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-1"
                      >Teljes név</label
                    >
                    <input
                      v-model="regName"
                      type="text"
                      required
                      placeholder="Kovács János"
                      class="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-1"
                      >E-mail</label
                    >
                    <input
                      v-model="regEmail"
                      type="email"
                      required
                      placeholder="you@example.com"
                      class="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-1"
                      >Jelszó</label
                    >
                    <input
                      v-model="regPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      class="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-200 mb-1"
                      >Jelszó megerősítése</label
                    >
                    <input
                      v-model="regPasswordConfirm"
                      type="password"
                      required
                      placeholder="••••••••"
                      class="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div v-if="regError" class="text-sm text-red-400">
                    {{ regError }}
                  </div>

                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      @click="cancel"
                      class="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Mégse
                    </button>
                    <button
                      type="submit"
                      class="bg-orange-900 cursor-pointer hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Regisztráció
                    </button>
                  </div>
                </form>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  </div>
</template>
