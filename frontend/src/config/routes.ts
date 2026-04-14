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
    {
      path: "/delivery",
      component: () => import("../pages/DeliveryPage.vue"),
      name: "delivery",
    },
    {
      path: "/recommend",
      component: () => import("../pages/recommendPage.vue"),
      name: "recommend",
    },
    {
      path: "/about",
      component: () => import("../pages/AboutUsPage.vue"),
      name: "about",
    },
    {
      path: "/delivery",
      component: () => import("../pages/DeliveryPage.vue"),
      name: "delivery",
    },
  ],
});
export default router;
