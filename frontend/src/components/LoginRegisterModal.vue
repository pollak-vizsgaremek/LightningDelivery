<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router"; // 1. Router importálása
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

const props = defineProps<{
  visible: boolean;
  type: "login" | "register";
  hideLogin?: boolean;
}>();

const emit = defineEmits(["update:visible", "update:type"]);
const router = useRouter(); // 2. Router példányosítása

const isOpen = ref(props.visible);

const baseCategories = {
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

const categories = computed(() => {
  if (props.hideLogin) {
    return { Regisztráció: baseCategories.Regisztráció };
  }
  return baseCategories;
});

const getInitialTabIndex = () => {
  const keys = Object.keys(categories.value);
  const desired = props.type === "login" ? "Bejelentkezés" : "Regisztráció";
  const idx = keys.indexOf(desired);
  return idx >= 0 ? idx : 0;
};

const selectedTab = ref(getInitialTabIndex());

// Keep `selectedTab` in sync with incoming `type` prop
watch(
  () => props.type,
  (newType) => {
    const keys = Object.keys(categories.value);
    const desired = newType === "login" ? "Bejelentkezés" : "Regisztráció";
    const idx = keys.indexOf(desired);
    selectedTab.value = idx >= 0 ? idx : 0;
  },
);

watch(
  () => props.hideLogin,
  () => {
    // When hideLogin toggles, ensure selectedTab points to a valid index
    selectedTab.value = getInitialTabIndex();
  },
);

// Emit updates when the user switches tabs so parent `v-model:type` stays in sync
watch(selectedTab, (newIdx) => {
  const keys = Object.keys(categories.value);
  const key = keys[newIdx] || keys[0];
  const newType = key === "Bejelentkezés" ? "login" : "register";
  emit("update:type", newType as "login" | "register");
});

watch(
  () => props.visible,
  (newVal) => {
    isOpen.value = newVal;
  },
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
// Login form state
const loginEmail = ref("");
const loginPassword = ref("");

const login = () => {
  console.log("Login attempt:", {
    email: loginEmail.value,
    password: loginPassword.value,
  });

  //Login Fetch

  fetch("http://localhost:3300/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Email: loginEmail.value,
      Jelszo: loginPassword.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.userName);
        router.push("/recommend");
      } else {
        alert("Hibás email vagy jelszó!");
      }
    })
    .catch((error) => {
      console.error("Hiba a bejelentkezés során:", error);
      alert("Hiba történt a bejelentkezés során. Kérlek, próbáld újra!");
    });

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

  //Register Fetch

  fetch("http://localhost:3300/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Email: regEmail.value,
      Felhasznalonev: regName.value,
      Jelszo: regPassword.value,
      Jelszo2: regPasswordConfirm.value,
    }),
  });

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
      class="relative mx-auto w-full max-w-lg rounded-lg border-2 border-gray-300 bg-gray-900 shadow-2xl p-6 transform transition-all duration-300 ease-out"
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
        <TabGroup as="div" v-model="selectedTab">
          <TabList
            class="flex space-x-1 rounded-xl border-amber-400 bg-gray-800/30 p-1 border"
          >
            <Tab
              v-for="category in Object.keys(categories)"
              :key="category"
              as="button"
              class="tab-button w-full cursor-pointer rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-300 hover:bg-white/4 hover:text-white hover:scale-95"
            >
              {{ category }}
            </Tab>
          </TabList>

          <TabPanels class="mt-2">
            <TabPanel
              v-for="keyName in Object.keys(categories)"
              :key="keyName"
              :class="[
                'rounded-xl bg-gray-900 p-4 border border-amber  text-gray-300 animation-fadeIn',
                'focus:outline-none focus:ring-2',
              ]"
            >
              <div v-if="keyName === 'Bejelentkezés'">
                <!-- Login form -->
                <form @submit.prevent="login" class="space-y-4">
                  <div>
                    <label
                      class="block ml-3 text-sm font-medium text-gray-200 mb-1"
                      >E-mail</label
                    >
                    <input
                      v-model="loginEmail"
                      type="email"
                      required
                      placeholder="you@example.com"
                      class="w-7/8 ml-3 rounded-xl bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 hover:bg-gray-700 hover:scale-105 focus:scale-105 focus:shadow-lg focus:shadow-amber-400/50"
                    />
                  </div>

                  <div>
                    <label
                      class="block ml-3 text-sm font-medium text-gray-200 mb-1"
                      >Jelszó</label
                    >
                    <input
                      v-model="loginPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      class="w-7/8 ml-3 rounded-xl bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 hover:bg-gray-700 hover:scale-105 focus:scale-105 focus:shadow-lg focus:shadow-amber-400/50"
                    />
                  </div>

                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      @click="cancel"
                      class="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-gray-400/50"
                    >
                      Mégse
                    </button>
                    <button
                      @click="login"
                      type="submit"
                      class="bg-orange-900 cursor-pointer hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-amber-400/50"
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
                    <label
                      class="block ml-3 text-sm font-medium text-gray-200 mb-1"
                      >Teljes név</label
                    >
                    <input
                      v-model="regName"
                      type="text"
                      required
                      placeholder="Kovács János"
                      class="w-7/8 rounded-xl items-center ml-3 justify-center bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 hover:bg-gray-700 hover:scale-105 focus:scale-105 focus:shadow-lg focus:shadow-amber-400/50"
                    />
                  </div>

                  <div>
                    <label
                      class="block ml-3 text-sm font-medium text-gray-200 mb-1"
                      >E-mail</label
                    >
                    <input
                      v-model="regEmail"
                      type="email"
                      required
                      placeholder="you@example.com"
                      class="w-7/8 ml-3 rounded-xl bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 hover:bg-gray-700 hover:scale-105 focus:scale-105 focus:shadow-lg focus:shadow-amber-400/50"
                    />
                  </div>

                  <div>
                    <label
                      class="block ml-3 text-sm font-medium text-gray-200 mb-1"
                      >Jelszó</label
                    >
                    <input
                      v-model="regPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      class="w-7/8 ml-3 rounded-xl bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 hover:bg-gray-700 hover:scale-105 focus:scale-105 focus:shadow-lg focus:shadow-amber-400/50"
                    />
                  </div>

                  <div>
                    <label
                      class="block ml-3 text-sm font-medium text-gray-200 mb-1"
                      >Jelszó megerősítése</label
                    >
                    <input
                      v-model="regPasswordConfirm"
                      type="password"
                      required
                      placeholder="••••••••"
                      class="w-7/8 ml-3 rounded-xl bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 hover:bg-gray-700 hover:scale-105 focus:scale-105 focus:shadow-lg focus:shadow-amber-400/50"
                    />
                  </div>

                  <div v-if="regError" class="text-sm text-red-400">
                    {{ regError }}
                  </div>

                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      @click="cancel"
                      class="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-gray-400/50"
                    >
                      Mégse
                    </button>
                    <button
                      type="submit"
                      class="bg-orange-900 cursor-pointer hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-amber-400/50"
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

<style scoped>
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-enter-active {
  animation: slideInUp 0.3s ease-out;
}

.modal-leave-active {
  animation: slideOutDown 0.3s ease-in;
}

.animation-fadeIn {
  animation: fadeIn 0.3s ease-in;
}

button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.95);
}
</style>

/* Active tab styling using aria-selected attribute on the rendered button */
<style scoped>
.tab-button[aria-selected="true"] {
  background-color: #f59e0b; /* amber-400 */
  color: #000;
  transform: scale(1.03);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}
</style>
