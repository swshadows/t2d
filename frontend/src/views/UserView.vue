<script setup lang="ts">
import Input from "@/components/Input.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import ShowPassword from "@/components/ShowPassword.vue";
import SpinnerLoad from "@/components/SpinnerLoad.vue";

import { loggedUserStore } from "@/stores/User.store";
import UserUtils from "@/utils/User.utils";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const emit = defineEmits(["messageEmitter"]);

let sessionStatus: any;
const userStore = loggedUserStore();
onMounted(async () => {
	sessionStatus = await UserUtils.updateSessionStatus();
	if (sessionStatus && sessionStatus.data) {
		emit("messageEmitter", { message: sessionStatus.data.error, code: "error" });
		router.push({ path: "/" });
	}
});

async function validateForms(formType: "email" | "username" | "password" | "delete") {
	let result: any;
	if (formType == "email") {
		result = await UserUtils.updateEmail(email);
	} else if (formType == "username") {
		result = await UserUtils.updateUsername(username);
	} else if (formType == "password") {
		result = await UserUtils.updatePassword(passwords);
	} else {
		result = await UserUtils.deleteUser();
		if (result.code != "error") {
			userStore.removeLogin();
			return router.push({ path: "/" });
		}
	}
	await UserUtils.updateSessionStatus();
	emit("messageEmitter", result);
}

let email = "";
let username = "";
const passwords = {
	password: "",
	newPassword: "",
	newPasswordRepeat: ""
};

const passwordInput = ref("password");
function togglePasswords(e: any) {
	const { check } = e;
	if (check) passwordInput.value = "text";
	else passwordInput.value = "password";
}

const deleteVis = ref(false);
function toggleDelete() {
	deleteVis.value = !deleteVis.value;
}
</script>

<template>
	<div class="app">
		<SpinnerLoad v-if="!userStore.getUserStore.email" />
		<div v-else>
			<form @submit.prevent="validateForms('email')">
				<Input
					@emit-values="email = $event"
					:id="'email'"
					:label-text="`Seu email atual: ${userStore.getUserStore.email}`"
					:placeholder="'Digite o novo email'"
					:name="'email'"
					:type="'email'"
				/>
				<SubmitButton :text="'Atualizar email'" />
			</form>
			<form @submit.prevent="validateForms('username')">
				<Input
					@emit-values="username = $event"
					:id="'username'"
					:label-text="`Seu nome de usuário atual: ${userStore.getUserStore.username}`"
					:placeholder="'Digite o novo nome de usuário'"
					:name="'username'"
					:type="'text'"
				/>
				<SubmitButton :text="'Atualizar nome de usuário'" />
			</form>
			<form @submit.prevent="validateForms('password')">
				<Input
					@emit-values="passwords.password = $event"
					:id="'password'"
					:label-text="'Atualize sua senha'"
					:placeholder="'Digite sua senha atual'"
					:name="'password'"
					:type="passwordInput"
				/>
				<Input
					@emit-values="passwords.newPassword = $event"
					:id="'newPassword'"
					:placeholder="'Digite a nova senha'"
					:name="'newPassword'"
					:type="passwordInput"
				/>
				<Input
					@emit-values="passwords.newPasswordRepeat = $event"
					:id="'newPasswordRepeat'"
					:placeholder="'Repita a sua nova senha'"
					:name="'newPasswordRepeat'"
					:type="passwordInput"
				/>
				<ShowPassword @change-input-type="togglePasswords($event)" />

				<SubmitButton :text="'Atualizar senha'" />
			</form>
			<div class="wrapper">
				<SubmitButton @clicked="toggleDelete()" :text="'Apagar conta'" />
				<Transition name="move">
					<form @submit.prevent="validateForms('delete')" class="deleteConfirm" v-if="deleteVis">
						<p class="deleteConfirm">Tem certeza que deseja apagar a conta? Essa ação é irreversível</p>
						<SubmitButton :class="'delete'" :text="'Confirmar deleção da conta'" />
					</form>
				</Transition>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";

.app {
	color: #fff;
	width: 1000px;
	padding: 20px 10px;
	background: $secondary;
	border-radius: 7px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 20px;
}
form,
.wrapper {
	margin: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	width: 90%;
}
// .deleteConfirm {
// 	&.hidden {
// 		opacity: 0;
// 	}
// }

.move-enter-active,
.move-leave-active {
	transition: all 0.2s ease-out;
}

.move-enter-from {
	transform: translateY(10%);
	opacity: 0;
}

.move-leave-to {
	transform: translateY(-10%);
	opacity: 0;
}
</style>
