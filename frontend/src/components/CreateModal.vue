<script setup lang="ts">
import ProjectAPI from "@/api/Project.API";
import Input from "./Input.vue";
import SubmitButton from "./SubmitButton.vue";
import DocumentAPI from "@/api/Document.API";

const prop = defineProps<{ text: "documento" | "projeto"; projectId?: number }>();

const emit = defineEmits(["modalToggle", "messageEmitter"]);

// Criar projetos ou documentos, emitindo para a view principal
let name = "";
let desc = "";
async function submitForm(type: typeof prop.text) {
	let result: any;
	if (type == "projeto") {
		result = await ProjectAPI.createProject({ name, desc });
	} else {
		if (prop.projectId) result = await DocumentAPI.createDocument(prop.projectId, { name, desc });
	}
	if (result.code != "error") emit("modalToggle");
	emit("messageEmitter", result);
}
</script>

<template>
	<div class="backdrop">
		<div class="modal">
			<form @submit.prevent="submitForm(prop.text)">
				<Input
					@emit-values="name = $event"
					:name="'title'"
					:label-text="`Dê um nome para o ${prop.text}`"
					:id="'title'"
					:type="'text'"
					:placeholder="'Máximo de 20 caracteres'"
				/>
				<Input
					@emit-values="desc = $event"
					:name="'desc'"
					:label-text="`Dê uma descrição para o ${prop.text}`"
					:id="'desc'"
					:type="'text'"
					:placeholder="'Máximo de 50 caracteres'"
				/>
				<SubmitButton :text="`Criar novo ${prop.text}`" />
				<SubmitButton :class="'delete'" @clicked="emit('modalToggle')" :text="`Cancelar criação de ${prop.text}`" />
			</form>
		</div>
	</div>
</template>

<style scoped lang="scss">
.backdrop {
	background: rgba(0, 0, 0, 0.397);
	position: fixed;
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
	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
}
</style>
