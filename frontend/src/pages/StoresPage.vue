<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];
const isModalVisible = ref(false);

const type = ref<"login" | "register">("login");

const closeModal = () => {
  isModalVisible.value = false;
  console.log(isModalVisible.value);
};

const openModal = (modalType: "login" | "register") => {
  type.value = modalType;
  isModalVisible.value = true;
  console.log(isModalVisible.value);
};

const navigateTo = (view: string) => {
  router.push({ name: view });
};
</script>
<template>
  <h1 class="text-left font-bold text-4xl">Üzletek</h1>
</template>
