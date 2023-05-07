<script setup lang="ts">
import Input from "@/components/Input.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import ShowPassword from "@/components/ShowPassword.vue";
import ChangeForms from "@/components/ChangeForms.vue";
import { onMounted, ref } from "vue";

import UserAPI from "@/api/User.API";
import { loggedUserStore } from "@/stores/User.store";
import { useRouter } from "vue-router";

const emit = defineEmits(["messageEmitter"]);
const userStore = loggedUserStore();
const router = useRouter();

onMounted(async () => {
	const res = await UserAPI.getSessionStatus();
	if (res.code != "error") userStore.storeLogin(res);
});

// Alternador de visibilidade de senhas
const passwordL = ref("password");
const passwordR = ref("password");
function showPass(show: { check: boolean; formType: string }) {
	const { check, formType } = show;
	if (formType == "login") {
		if (check) passwordL.value = "text";
		else passwordL.value = "password";
	} else {
		if (check) passwordR.value = "text";
		else passwordR.value = "password";
	}
}

// Função para alternar entre formulários de registro e login
const showLoginForm = ref(true);
function changeForms() {
	showLoginForm.value = !showLoginForm.value;
	passwordL.value = "password";
	passwordR.value = "password";
}

// Função de formulário e API
const loginForm = { login: "", password: "" };
const registerForm = { email: "", password: "", passwordRepeat: "", username: "" };
async function validateForms(formType: "login" | "register") {
	let result: any;
	if (formType == "login") {
		result = await UserAPI.validateUserLogin(loginForm);
		if (result.code != "error") {
			const res = await UserAPI.getSessionStatus();
			userStore.storeLogin(res);
			router.push({ path: "/app" });
		}
	} else {
		result = await UserAPI.validateUserRegister(registerForm);
		if (result.code != "error") showLoginForm.value = true;
	}
	emit("messageEmitter", result);
}
</script>

<template>
	<div class="app">
		<div class="message">
			<p>Bem vindo a 🐝 Task 2 Do</p>
			<p>Uma aplicação para o gerenciamento dos seus projetos</p>
			<p>Desenvolvida para a Inovatec 2023</p>
		</div>
		<div class="divider"></div>
		<div v-if="!userStore.getUserStore.email" class="forms">
			<Transition name="move" mode="out-in">
				<form @submit.prevent="validateForms('login')" v-if="showLoginForm">
					<Input
						@emit-values="loginForm.login = $event"
						:type="'text'"
						:id="'loginData'"
						:name="'login'"
						:label-text="'Digite seu email ou nome de usuário:'"
						:placeholder="'example@gmail.com'"
					/>
					<Input
						@emit-values="loginForm.password = $event"
						:type="passwordL"
						:id="'passwordLogin'"
						:name="'password'"
						:label-text="'Digite sua senha:'"
						:placeholder="'a-z, A-Z, 0-9, símbolos e >= 8'"
					/>
					<ShowPassword @change-input-type="showPass($event)" :form-type="'login'" />
					<SubmitButton :text="'Fazer login'" />
					<ChangeForms :type="'register'" @change-forms="changeForms()" />
				</form>
				<form @submit.prevent="validateForms('register')" v-else>
					<Input
						@emit-values="registerForm.email = $event"
						:type="'email'"
						:id="'emailRegister'"
						:name="'email'"
						:label-text="'Digite seu email:'"
						:placeholder="'example@gmail.com'"
					/>
					<Input
						@emit-values="registerForm.username = $event"
						:type="'text'"
						:id="'usernameRegister'"
						:name="'username'"
						:label-text="'Digite seu nome de usuário:'"
						:placeholder="'example'"
					/>
					<Input
						@emit-values="registerForm.password = $event"
						:type="passwordR"
						:id="'passwordRegister'"
						:name="'password'"
						:label-text="'Digite sua senha:'"
						:placeholder="'a-z, A-Z, 0-9, símbolos e >= 8'"
					/>
					<Input
						@emit-values="registerForm.passwordRepeat = $event"
						:type="passwordR"
						:id="'passwordRegisterRepeat'"
						:name="'passwordRepeat'"
						:label-text="'Repita sua senha:'"
						:placeholder="'a-z, A-Z, 0-9, símbolos e >= 8'"
					/>
					<ShowPassword @change-input-type="showPass($event)" :form-type="'register'" />
					<SubmitButton :text="'Realizar registro'" />
					<ChangeForms :type="'login'" @change-forms="changeForms()" />
				</form>
			</Transition>
		</div>
		<div v-else>
			<p>Você já fez login anteriormente</p>
			<p>
				<RouterLink class="router-link" to="/app">Acesse a aplicação</RouterLink> ou
				<RouterLink class="router-link" to="/user">reveja suas informações</RouterLink>
			</p>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";

.app {
	color: #fff;
	width: 80%;
	background: $secondary;
	border-radius: 7px;
	position: absolute;
	top: 50%;
	left: 50%;
	padding: 10px;
	transform: translate(-50%, -50%);
	display: flex;
	justify-content: center;
	gap: 50px;
	place-items: center;
}
.divider {
	width: 1px;
	height: 400px;
	background-color: $secondary_darker;
}
.forms {
	width: 30%;
	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
}

.router-link {
	color: $highlight;
}
</style>
