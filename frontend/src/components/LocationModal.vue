<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";

interface Location {
  name: string;
  address: string;
  distance: string;
  latitude?: number;
  longitude?: number;
}

const isOpen = ref(false);
const selectedLocation = ref("Budapest");
const searchInput = ref("");
const customLocationInput = ref("");
const isLoadingLocation = ref(false);
const locationError = ref("");

// Felhasználó koordinátái
const userLatitude = ref<number | null>(null);
const userLongitude = ref<number | null>(null);

// Kiválasztott város koordinátái
const selectedLocationLat = ref<number | null>(null);
const selectedLocationLon = ref<number | null>(null);

// Városok betöltése az API-ból
const locations = ref<Location[]>([]);

const fetchCities = async () => {
  try {
    const response = await fetch("http://localhost:3300/api/v1/cities");
    if (response.ok) {
      const cities = await response.json();
      console.log("Városok az API-ból:", cities);
      locations.value = cities.map((city: any) => ({
        name: city.VarosNev,
        address: `${city.VarosNev}, Magyarország`,
        distance: "0 km",
        latitude: city.Latitude,
        longitude: city.Longitude,
      }));
      console.log("Feldolgozott városok:", locations.value);
    }
  } catch (error) {
    console.error("Hiba a városok betöltésekor:", error);
    locations.value = [];
  }
};

onMounted(() => {
  fetchCities();
});

// Haversine formula - távolságszámítás két koordináta között (km-ben) - távolságszámítás két koordináta között (km-ben)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Föld sugara km-ben
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Frissítsd a távolságokat az aktuális felhasználó pozíciója alapján
const updateDistances = () => {
  // Ha kiválasztott város van, abból számítjuk a távolságokat
  // Ha nem, akkor a felhasználó pozícióból
  let refLat = selectedLocationLat.value ?? userLatitude.value;
  let refLon = selectedLocationLon.value ?? userLongitude.value;

  if (refLat !== null && refLon !== null) {
    locations.value.forEach((location) => {
      if (location.latitude && location.longitude) {
        const distance = calculateDistance(
          refLat!,
          refLon!,
          location.latitude,
          location.longitude,
        );
        location.distance = `${distance} km`;
      }
    });
    console.log("Távolságok frissítve:", locations.value);
  }
};

const filteredLocations = computed(() => {
  if (!searchInput.value) return locations.value;
  return locations.value.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchInput.value.toLowerCase()),
  );
});

const selectLocation = (location: string) => {
  selectedLocation.value = location;

  // Megkeressük a kiválasztott város koordinátáit
  const selectedCity = locations.value.find((loc) => loc.name === location);
  if (selectedCity && selectedCity.latitude && selectedCity.longitude) {
    selectedLocationLat.value = selectedCity.latitude;
    selectedLocationLon.value = selectedCity.longitude;
    console.log(
      `Kiválasztott város: ${location}, koordináták:`,
      selectedCity.latitude,
      selectedCity.longitude,
    );
    // Frissítjük az összes város távolságát ebből a pontból
    updateDistances();
    // persist selected coords for other pages
    try {
      localStorage.setItem(
        "selected_location_lat",
        String(selectedCity.latitude),
      );
      localStorage.setItem(
        "selected_location_lon",
        String(selectedCity.longitude),
      );
      localStorage.setItem("selected_location_name", selectedCity.name);
    } catch (e) {
      // ignore storage errors
    }
    // broadcast event
    try {
      window.dispatchEvent(
        new CustomEvent("location:changed", {
          detail: {
            lat: selectedCity.latitude,
            lon: selectedCity.longitude,
            name: selectedCity.name,
          },
        }),
      );
    } catch (e) {
      // ignore
    }
  }

  isOpen.value = false;
  searchInput.value = "";
  customLocationInput.value = "";
  locationError.value = "";
};

const toggleModal = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchInput.value = "";
    locationError.value = "";
    // Automatikusan lekérjük a jelenlegi helyzetet a modal megnyitásakor
  }
};

const closeModal = () => {
  isOpen.value = false;

  searchInput.value = "";
  customLocationInput.value = "";
  locationError.value = "";
};

const addCustomLocation = () => {
  if (!customLocationInput.value.trim()) {
    locationError.value = "Kérjük add meg a lokációt!";
    return;
  }

  const locationName = customLocationInput.value.trim();
  let distance = "Ismeretlen távolság";

  // Ha már van felhasználó pozíciónk, próbáljunk meg távolságot számítani
  if (userLatitude.value !== null && userLongitude.value !== null) {
    // Geocoding az új helyre (OpenStreetMap Nominatim)
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          const calculatedDistance = calculateDistance(
            userLatitude.value!,
            userLongitude.value!,
            parseFloat(lat),
            parseFloat(lon),
          );
          distance = `${calculatedDistance} km`;

          const newLocation: Location = {
            name: locationName,
            address: locationName,
            distance,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          };

          if (!locations.value.some((loc) => loc.name === newLocation.name)) {
            locations.value.unshift(newLocation);
          }

          selectLocation(newLocation.name);
        }
      })
      .catch((error) => {
        console.error("Geocoding hiba:", error);
        const newLocation: Location = {
          name: locationName,
          address: locationName,
          distance: "Ismeretlen",
        };

        if (!locations.value.some((loc) => loc.name === newLocation.name)) {
          locations.value.unshift(newLocation);
        }

        selectLocation(newLocation.name);
      });
  } else {
    const newLocation: Location = {
      name: locationName,
      address: locationName,
      distance: "Ismeretlen",
    };

    if (!locations.value.some((loc) => loc.name === newLocation.name)) {
      locations.value.unshift(newLocation);
    }

    selectLocation(newLocation.name);
  }
};

const getCurrentLocation = () => {
  isLoadingLocation.value = true;
  locationError.value = "";

  if (!navigator.geolocation) {
    locationError.value = "A böngésző nem támogatja a helymeghatározást";
    isLoadingLocation.value = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Tároljuk a felhasználó pozícióját
      userLatitude.value = latitude;
      userLongitude.value = longitude;

      // Reseteljük a kiválasztott város koordinátáit
      selectedLocationLat.value = null;
      selectedLocationLon.value = null;

      // Frissítsd az összes távolságot
      updateDistances();

      // Reverse geocoding
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      )
        .then((response) => response.json())
        .then((data) => {
          const city =
            data.address?.city || data.address?.town || "Ismeretlen hely";
          const address = data.address?.road || data.address?.county || city;

          // Számítsd ki a távolságot a felhasználó helyétől
          const distance = calculateDistance(
            latitude,
            longitude,
            latitude,
            longitude,
          );

          const newLocation: Location = {
            name: city,
            address: `${address}, Magyarország`,
            distance: `${distance} km`,
            latitude,
            longitude,
          };

          // Ellenőrizzük, hogy már létezik-e
          if (!locations.value.some((loc) => loc.name === newLocation.name)) {
            locations.value.unshift(newLocation);
          }

          selectLocation(newLocation.name);
          isLoadingLocation.value = false;
          // persist and broadcast when using geolocation
          try {
            localStorage.setItem("selected_location_lat", String(latitude));
            localStorage.setItem("selected_location_lon", String(longitude));
            localStorage.setItem("selected_location_name", city);
          } catch (e) {}
          try {
            window.dispatchEvent(
              new CustomEvent("location:changed", {
                detail: { lat: latitude, lon: longitude, name: city },
              }),
            );
          } catch (e) {}
        })
        .catch((error) => {
          console.error("Geocoding hiba:", error);
          locationError.value = "Nem sikerült a hely megállapítása";
          isLoadingLocation.value = false;
        });
    },
    (error) => {
      console.error("Geolocation hiba:", error);
      locationError.value =
        "Nem tudjuk meghatározni a helyed. Kérjük engedélyezd a helymeghatározást!";
      isLoadingLocation.value = false;
    },
  );
};
</script>

<template>
  <div class="relative">
    <!-- Location Button -->
    <button
      @click="toggleModal"
      class="flex justify-center items-center gap-2 rounded-lg bg-black text-white px-4 py-2 transition-colors duration-200 cursor-pointer"
    >
      <MapPinIcon class="w-5 h-5 text-amber-400 flex-shrink-0" />
      <span class="font-medium">{{ selectedLocation }}</span>
      <ChevronDownIcon
        class="w-4 h-4 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Modal Overlay -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        @click="closeModal"
        class="fixed inset-0 bg-black/40 z-40"
      ></div>
    </transition>

    <!-- Modal Content - a weboldal közepén -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 scale-95 translate-y-4"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 translate-y-4"
    >
      <div
        v-if="isOpen"
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
            <h3 class="font-semibold text-white">Válassz egy lokációt</h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon class="w-5 h-5 cursor-pointr" />
            </button>
          </div>

          <!-- Saját lokáció megadása -->
          <div class="p-4 border-b border-gray-700 space-y-3">
            <div class="space-y-2">
              <p class="text-xs text-gray-400 font-medium">Saját lokáció:</p>
              <div class="flex gap-2">
                <!-- <input
                  v-model="customLocationInput"
                  type="text"
                  placeholder="Add meg a helyedet (pl. Kazincbarcika)"
                  class="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 text-sm"
                  @keyup.enter="addCustomLocation"
                />
                <button
                  @click="addCustomLocation"
                  class="bg-amber-600 cursor-pointer hover:bg-amber-500 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  Hozzáadás
                </button> -->
              </div>

              <!-- Jelenlegi hely gomb -->
              <button
                @click="getCurrentLocation"
                :disabled="isLoadingLocation"
                class="w-full bg-gray-800 cursor-pointer hover:bg-gray-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
              >
                <MapPinIcon class="w-4 h-4" />
                {{ isLoadingLocation ? "Meghatározás..." : "Jelenlegi helyem" }}
              </button>

              <!-- Hibauzenetek -->
              <div
                v-if="locationError"
                class="bg-red-900/20 border border-red-700 text-red-400 px-3 py-2 rounded-lg text-xs"
              >
                {{ locationError }}
              </div>
            </div>
          </div>

          <!-- Search Input for Locations -->
          <div class="px-4 py-3 border-b border-gray-700">
            <div class="relative flex items-center">
              <MagnifyingGlassIcon
                class="absolute left-3 w-5 h-5 text-gray-500"
              />
              <input
                v-model="searchInput"
                type="text"
                placeholder="Város keresése..."
                class="w-full bg-gray-800 text-white rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          <!-- Locations List -->
          <div class="overflow-y-auto flex-1">
            <button
              v-for="location in filteredLocations"
              :key="location.name"
              @click="selectLocation(location.name)"
              :class="[
                'w-full px-4 py-3 text-left hover:bg-gray-800 cursor-pointer transition-colors duration-150 border-b border-gray-800 last:border-b-0 flex items-start gap-3',
                selectedLocation === location.name
                  ? 'bg-gray-800 border-l-4 border-l-amber-400'
                  : '',
              ]"
            >
              <MapPinIcon class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div class="flex-1">
                <p class="font-medium text-white">{{ location.name }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ location.address }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ location.distance }}
                </p>
              </div>
            </button>

            <!-- Empty State -->
            <div
              v-if="filteredLocations.length === 0"
              class="px-4 py-8 text-center"
            >
              <MapPinIcon class="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p class="text-gray-400">Nincs találat</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

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
