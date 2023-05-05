import { defineStore } from "pinia";
import type { UserLogged } from "@/types/User.types";

export const loggedUserStore = defineStore("user", {
	state: () => ({ id: -1, username: "", email: "" }),
	getters: {
		getUserStore: (state) => state
	},
	actions: {
		storeLogin(user: UserLogged) {
			this.id = user.id;
			this.username = user.username;
			this.email = user.email;
		},
		removeLogin() {
			this.id = -1;
			this.username = "";
			this.email = "";
		}
	}
});
