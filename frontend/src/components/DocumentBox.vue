<script setup lang="ts">
import { ref } from "vue";
import Input from "./Input.vue";
import SubmitButton from "./SubmitButton.vue";
import DocumentAPI from "@/api/Document.API";
import DeletePopover from "./DeletePopover.vue";

const props = defineProps<{ document: { name: string; desc: string; id: number; pId: number } }>();

const emit = defineEmits(["messageEmitter"]);

// Edita o nome ou descrição do documento
let name = "";
let desc = "";
async function editDocument(data: "name" | "desc") {
	let response: any;
	if (data == "name") {
		response = await DocumentAPI.updateName(name, props.document.pId, props.document.id);
	} else {
		response = await DocumentAPI.updateDescription(desc, props.document.pId, props.document.id);
	}
	if (response.code != "error") switchEdit();
	emit("messageEmitter", response);
}

// Deleta o documento
async function deleteDocument() {
	let response = await DocumentAPI.deleteDocument(props.document.pId, props.document.id);
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
	<div class="document">
		<img src="@/assets/document.svg" />
		<form @submit.prevent="" v-if="editOn">
			<Input @emit-values="name = $event" :id="'name'" :name="'name'" :type="'text'" :placeholder="'Digite o novo nome do documento, max 20 caracteres'" />
			<SubmitButton @clicked="editDocument('name')" :text="'Editar nome'" />
			<Input
				@emit-values="desc = $event"
				:id="'desc'"
				:name="'desc'"
				:type="'text'"
				:placeholder="'Digite uma nova descrição do documento, max 50 caracteres'"
			/>
			<SubmitButton @clicked="editDocument('desc')" :text="'Editar descrição'" />
		</form>
		<div v-else>
			<h2>{{ document.name }}</h2>
			<p>{{ document.desc }}</p>
		</div>
		<div class="buttons">
			<button @click="switchEdit()"><img src="@/assets/document-edit.svg" alt="" /></button>
			<button @click="deleteOn = !deleteOn"><img src="@/assets/document-trash.svg" alt="" /></button>
			<!-- TODO: Create doc share function
				<button @click=""><img src="@/assets/document-share.svg" alt="" /></button>
			 -->
			<!-- TODO: Create doc content view
				 <RouterLink class="project-link" :to="`/app/${props.document.pId}/??`">
				<button><img src="@/assets/document-enter.svg" alt="" /></button>
			</RouterLink> -->
			<Transition name="fade">
				<DeletePopover v-if="deleteOn" @cancel-delete="deleteOn = !deleteOn" @delete="deleteDocument()" />
			</Transition>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";

.document {
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
.document-link {
	color: inherit;
	text-decoration: none;
}
</style>
