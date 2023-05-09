<script setup lang="ts">
import DocumentAPI from "@/api/Document.API";
import Input from "./Input.vue";
import SubmitButton from "./SubmitButton.vue";
import { onMounted, ref } from "vue";
import UserAPI from "@/api/User.API";

const prop = defineProps<{ pId: number; dId: number; sharedUserId: number }>();
const emit = defineEmits(["modalToggle", "messageEmitter"]);

// Compartilha documento
let username = "";
async function submitForm() {
	const result = await DocumentAPI.shareDocument(username, prop.pId, prop.dId);
	if (result.code != "error") emit("modalToggle");
	emit("messageEmitter", result);
}

// Pega o usuário compartilhado
const user = ref();
onMounted(async () => {
	if (prop.sharedUserId) {
		const result = await UserAPI.getUser(prop.sharedUserId);
		if (result.code != "error") user.value = result.username;
	}
});
</script>

<template>
	<div @click.self="emit('modalToggle')" class="backdrop">
		<div class="modal">
			<p v-if="prop.sharedUserId">
				Já compartilhado com <span class="sharedWith">{{ user }}</span>
			</p>
			<form @submit.prevent="submitForm()">
				<Input
					@emit-values="username = $event"
					:name="'username'"
					:label-text="'Digite o nome do usuário que deseja compartilhar o documento:'"
					:id="`share-${prop.dId}`"
					:type="'text'"
					:placeholder="'Digite o nome do usuário'"
				/>
				<SubmitButton :text="'Compartilhar documento'" />
				<SubmitButton :class="'delete'" @clicked="emit('modalToggle')" :text="'Cancelar compartilhamento'" />
			</form>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";
.backdrop {
	background: rgba(0, 0, 0, 0.397);
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 9;
	width: 100%;
	height: 100vh;
	display: grid;
	place-items: center;
}
.modal {
	width: 40%;
	background: #fff;
	border-radius: 5px;
	padding: 20px;
	color: #000;
	.sharedWith {
		color: $danger;
		font-weight: 500;
		text-decoration: underline;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
}
</style>
