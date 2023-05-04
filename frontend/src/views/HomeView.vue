<script setup lang="ts">
import Input from "@/components/Input.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import ShowPassword from "@/components/ShowPassword.vue";
import ChangeForms from "@/components/ChangeForms.vue";
import Message from "@/components/Message.vue";
import { ref } from "vue";

import UserUtils from "@/utils/User.utils";

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

function changeForms() {
	showLoginForm.value = !showLoginForm.value;
	passwordL.value = "password";
	passwordR.value = "password";
}

let result = ref();
async function validateForms(formType: "login" | "register") {
	if (formType == "login") {
		console.log(loginForm);
	} else {
		result.value = await UserUtils.validateUserRegister(registerForm);
	}
}

const showLoginForm = ref(true);

const loginForm = { login: "", password: "" };
const registerForm = { email: "", password: "", passwordRepeat: "", username: "" };
</script>

<template>
	<Transition name="fade">
		<Message @hide-message="result = undefined" v-if="result != undefined" :result="result" />
	</Transition>
	<div class="app">
		<div class="message">
			<p>Bem vindo a 🐝 Task 2 Do</p>
			<p>Uma aplicação para o gerenciamento dos seus projetos</p>
			<p>Desenvolvida para a Inovatec 2023</p>
		</div>
		<div class="divider"></div>
		<div class="forms">
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
	</div>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";
.app {
	color: #fff;
	width: 1000px;
	height: 450px;
	background: $secondary;
	border-radius: 7px;
	position: absolute;
	top: 50%;
	left: 50%;
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
	position: relative;
	form {
		position: static;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
}

.move-enter-active,
.fade-enter-active,
.move-leave-active,
.fade-leave-active {
	transition: all 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
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
