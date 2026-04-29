import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // Always scroll to top on navigation
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
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
      path: "/restaurants/:id",
      component: () => import("../pages/RestaurantDetailsPage.vue"),
      name: "restaurant-details",
    },
    {
      path: "/admin",
      component: () => import("../pages/AdminPage.vue"),
      name: "admin",
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
