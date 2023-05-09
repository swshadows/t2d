import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("@/views/HomeView.vue")
		},
		{
			path: "/app",
			name: "app",
			component: () => import("@/views/ProjectView.vue")
		},
		{
			path: "/app/:id",
			name: "docs",
			props: true,
			component: () => import("@/views/DocumentView.vue")
		},
		{
			path: "/app/:pId/:dId",
			name: "docview",
			props: true,
			component: () => import("@/views/DocView.vue")
		},
		{
			path: "/user",
			name: "user",
			component: () => import("@/views/UserView.vue")
		},
		{
			path: "/:catchAll(.*)",
			name: "404",
			component: () => import("@/views/NotFoundView.vue")
		}
	]
});

export default router;
