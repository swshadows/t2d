<script setup lang="ts">
import IconButton from "./IconButton.vue";
import { loggedUserStore } from "@/stores/User.store";
import { useRouter } from "vue-router";
import UserAPI from "@/api/User.API";

const userStore = loggedUserStore();
const router = useRouter();

const emit = defineEmits(["messageEmitter"]);
async function doLogout() {
	const res = await UserAPI.logoutUser();
	emit("messageEmitter", res);
	userStore.removeLogin();
	router.push({ path: "/" });
}
</script>

<template>
	<header>
		<div class="brand">
			<img src="/favicon.svg" alt="" />
			<p><router-link class="router-link" to="/">Task 2 Do</router-link></p>
		</div>
		<div v-if="userStore.email" class="buttons">
			<router-link class="router-link null" to="/app">
				<icon-button :text="'App'">
					<img src="@/assets/app-button-icon.svg" />
				</icon-button>
			</router-link>
			<router-link class="router-link null" to="/user">
				<icon-button :text="'Conta'">
					<img src="@/assets/account-button-icon.svg" />
				</icon-button>
			</router-link>
			<icon-button @click="doLogout()" :text="'Sair'">
				<img src="@/assets/logout-button-icon.svg" />
			</icon-button>
		</div>
	</header>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";

header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 10px;
	width: 100%;
	height: 70px;
	background-color: $main;
	color: #fff;
	position: fixed;
	top: 0;
	z-index: 1;
}

.router-link {
	color: $highlight;
	&.null {
		color: transparent;
		text-decoration: none;
	}
}

.buttons {
	display: flex;
	gap: 10px;
}

.brand {
	display: flex;
	gap: 10px;
	align-items: center;
	img {
		max-width: 32px;
	}
}
</style>
