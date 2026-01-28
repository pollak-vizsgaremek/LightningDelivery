import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../pages/HomeView.vue"),
      name: "home",
    },
    {
      path: "/restaurants",
      component: () => import("../pages/RestaurantsPage.vue"),
      name: "restaurants",
    },
    {
      path: "/stores",
      component: () => import("../pages/StoresPage.vue"),
      name: "stores",
    },
  ],
});
export default router;
