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
		<img src="@/assets/project.svg" />
		<div class="form-wrapper" v-if="editOn">
			<form @submit.prevent="editProject('name')">
				<Input @emit-values="name = $event" :id="'name'" :name="'name'" :type="'text'" :placeholder="'Digite o novo nome do projeto, max 20 caracteres'" />
				<SubmitButton :text="'Editar nome'" />
			</form>
			<form @submit.prevent="editProject('desc')">
				<Input
					@emit-values="desc = $event"
					:id="'desc'"
					:name="'desc'"
					:type="'text'"
					:placeholder="'Digite uma nova descrição do projeto, max 50 caracteres'"
				/>
				<SubmitButton :text="'Editar descrição'" />
			</form>
		</div>
		<div class="info" v-else>
			<h2>{{ project.name }}</h2>
			<p>{{ project.desc }}</p>
		</div>
		<div class="buttons">
			<button @click.prevent="switchEdit()" :class="editOn ? 'button-active' : ''"><img src="@/assets/project-edit.svg" /></button>
			<button @click.prevent="deleteOn = !deleteOn" :class="deleteOn ? 'button-active' : ''"><img src="@/assets/project-trash.svg" /></button>
			<RouterLink class="project-link" :to="`/app/${props.project.id}`">
				<button><img src="@/assets/project-enter.svg" /></button>
			</RouterLink>
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
.form-wrapper {
	width: 90%;
	display: flex;
	flex-direction: column;
	gap: 4px;
}
.info {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.buttons {
	display: flex;
	gap: 10px;
	align-items: stretch;
	button {
		padding: 5px;
		border-radius: 5px;
		background-color: transparent;
		border: 0;
		display: grid;
		place-items: center;
		transition: 0.2s all;
		&:hover {
			cursor: pointer;
			background-color: $secondary;
		}
		&.button-active {
			border: 1px solid $highlight;
			background-color: $secondary;
		}
	}
	img {
		width: 32px;
	}
}

.project-link {
	color: inherit;
	text-decoration: none;
}
</style>
