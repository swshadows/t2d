<script setup lang="ts">
import { ref } from "vue";
import Input from "./Input.vue";
import SubmitButton from "./SubmitButton.vue";
import ShareModal from "./ShareModal.vue";
import DeletePopover from "./DeletePopover.vue";

import DocumentAPI from "@/api/Document.API";

const props = defineProps<{
	document: { name: string; desc: string; id: number; pId: number; sharedUser: number };
	shared: boolean;
	projectInfo?: { name: string; desc: string; owner: string };
}>();

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

// Modifica o estado de compartilhamento
const shareOn = ref(false);
</script>

<template>
	<div class="document">
		<img src="@/assets/document.svg" />
		<div class="form-wrapper" v-if="editOn">
			<form @submit.prevent="editDocument('name')">
				<Input @emit-values="name = $event" :id="'name'" :name="'name'" :type="'text'" :placeholder="'Digite o novo nome do documento, max 20 caracteres'" />
				<SubmitButton :text="'Editar nome'" />
			</form>
			<form @submit.prevent="editDocument('desc')">
				<Input
					@emit-values="desc = $event"
					:id="'desc'"
					:name="'desc'"
					:type="'text'"
					:placeholder="'Digite uma nova descrição do documento, max 50 caracteres'"
				/>
				<SubmitButton :text="'Editar descrição'" />
			</form>
		</div>
		<div class="info" v-else>
			<h2>{{ document.name }}</h2>
			<p>{{ document.desc }}</p>
			<div v-if="props.projectInfo" class="projectInfo">
				<p>📁 {{ props.projectInfo.name }}, {{ props.projectInfo.desc.toLowerCase() }}</p>
				<p>
					Gerido por <span class="owner">@{{ props.projectInfo.owner }}</span>
				</p>
			</div>
		</div>
		<div class="buttons">
			<button v-if="!props.shared" @click="switchEdit()" :class="editOn ? 'button-active' : ''"><img src="@/assets/document-edit.svg" /></button>
			<button v-if="!props.shared" @click="deleteOn = !deleteOn" :class="deleteOn ? 'button-active' : ''"><img src="@/assets/document-trash.svg" /></button>
			<button v-if="!props.shared" @click="shareOn = !shareOn" :class="shareOn ? 'button-active' : ''"><img src="@/assets/document-share.svg" /></button>
			<Transition name="fade">
				<ShareModal
					@message-emitter="emit('messageEmitter', $event)"
					v-if="shareOn"
					@modal-toggle="shareOn = !shareOn"
					:d-id="props.document.id"
					:p-id="props.document.pId"
					:shared-user-id="props.document.sharedUser"
				/>
			</Transition>
			<RouterLink class="project-link" :to="`/app/${props.document.pId}/${props.document.id}`">
				<button><img src="@/assets/document-enter.svg" /></button>
			</RouterLink>
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
.info {
	display: flex;
	flex-direction: column;
	align-items: center;
	.projectInfo {
		color: $highlight;
		padding: 10px;
		border-radius: 8px;
		background-color: $secondary;
	}
	.owner {
		text-decoration: underline;
		color: #fff;
	}
}
.form-wrapper {
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
.document-link {
	color: inherit;
	text-decoration: none;
}
</style>
