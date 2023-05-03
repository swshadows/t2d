import { createRouter, createWebHistory } from "vue-router";

const base = import.meta.env.BASE_URL;

const routes = createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@pages/Login.vue"),
    },
    {
      path: "/singout",
      name: "SingOut",
      component: () => import("@pages/SingOut.vue"),
    },
    {
      path: "/",
      name: "MenuTemplate",
      component: () => import("../components/MenuTemplate.vue"),
      children: [
        {
          path: "/:catchAll(.*)*",
          name: "Error",
          component: () => import("../pages/Error404.vue"),
        },
      ],
    },
  ],
});

export default routes;
