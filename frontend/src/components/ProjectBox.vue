<script setup lang="ts">
import { ref } from "vue";
import Input from "./Input.vue";
import SubmitButton from "./SubmitButton.vue";
import ProjectAPI from "@/api/Project.API";
import DeletePopover from "./DeletePopover.vue";

const props = defineProps<{ project: { name: string; desc: string; id: number } }>();

const emit = defineEmits(["messageEmitter"]);

// Edita o nome ou descrição do projeto
let name = "";
let desc = "";
async function editProject(data: "name" | "desc") {
	let response: any;
	if (data == "name") {
		response = await ProjectAPI.updateName(name, props.project.id);
	} else {
		response = await ProjectAPI.updateDescription(desc, props.project.id);
	}
	if (response.code != "error") switchEdit();
	emit("messageEmitter", response);
}

// Deleta o projeto
async function deleteProject() {
	let response = await ProjectAPI.deleteProject(props.project.id);
	if (response.code != "error") deleteOn.value = !deleteOn.value;
	emit("messageEmitter", response);
}

// Modifica o estado de edição
const editOn = ref(false);
function switchEdit() {
	editOn.value = !editOn.value;
	name = "";
	desc = "";
}

// Modifica o estado de deleção
const deleteOn = ref(false);
</script>

<template>
	<div class="project">
		<img src="@/assets/folder.svg" />
		<form @submit.prevent="" v-if="editOn">
			<Input @emit-values="name = $event" :id="'name'" :name="'name'" :type="'text'" :placeholder="'Digite o novo nome do projeto, max 20 caracteres'" />
			<SubmitButton @clicked="editProject('name')" :text="'Editar nome'" />
			<Input @emit-values="desc = $event" :id="'desc'" :name="'desc'" :type="'text'" :placeholder="'Digite uma nova descrição do projeto, max 20 caracteres'" />
			<SubmitButton @clicked="editProject('desc')" :text="'Editar descrição'" />
		</form>
		<div v-else>
			<h2>{{ project?.name }}</h2>
			<p>{{ project?.desc }}</p>
		</div>
		<div class="buttons">
			<button @click="switchEdit()"><img src="@/assets/edit.svg" alt="" /></button>
			<button @click="deleteOn = !deleteOn"><img src="@/assets/trash.svg" alt="" /></button>
			<Transition name="fade">
				<DeletePopover v-if="deleteOn" @cancel-delete="deleteOn = !deleteOn" @delete="deleteProject()" />
			</Transition>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";

.project {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	background-color: #616161;
	padding: 20px;
	border: 1px solid transparent;
	border-radius: 8px;
	transition: 0.2s all;
	&:hover {
		cursor: pointer;
		border-color: $highlight;
	}
	h2 {
		font-size: 22px;
	}
	p {
		font-size: 17px;
	}
	img {
		width: 120px;
	}
}
form {
	width: 90%;
	display: flex;
	flex-direction: column;
	gap: 4px;
}
.buttons {
	display: flex;
	gap: 10px;
	button {
		padding: 5px;
		border-radius: 5px;
		background-color: transparent;
		border: 0;
		transition: 0.2s all;
		&:hover {
			cursor: pointer;
			background-color: $secondary;
		}
	}
	img {
		width: 32px;
	}
}
</style>
