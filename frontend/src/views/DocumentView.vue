<script setup lang="ts">
import CreateModal from "@/components/CreateModal.vue";
import SpinnerLoad from "@/components/SpinnerLoad.vue";
import DocumentBox from "@/components/DocumentBox.vue";

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DocumentAPI from "@/api/Document.API";

import { loggedUserStore } from "@/stores/User.store";
import UserAPI from "@/api/User.API";

const props = defineProps<{ id: string }>();
const emit = defineEmits(["messageEmitter"]);
const userStore = loggedUserStore();
const router = useRouter();

onMounted(async () => {
	await fetchDocuments();
});

// Pega documentos caso existam e mostra. Caso não, mostra mensagens ou redireciona
const documents = ref();
async function fetchDocuments() {
	userStore.storeLogin(await UserAPI.getSessionStatus());
	const res = await DocumentAPI.getDocuments(Number(props.id));
	if (res.code == "error") {
		if (res.apiCode == "notLoggedYet") router.push({ path: "/" });
		if (res.apiCode == "notOwner") router.push({ path: "/app" });
		documents.value = 0;
		emit("messageEmitter", res);
	} else {
		documents.value = res;
	}
}

// Passa a mensagem do componente Modal para o listener de mensagens externo na App
async function messageEmitListener(e: any) {
	emit("messageEmitter", e);
	if (e.code != "error") await fetchDocuments();
}

// Alterna visibilidade do modal de criação de documentos
const modalOn = ref(false);
</script>

<template>
	<SpinnerLoad v-if="!userStore.getUserStore.email" />
	<div v-else class="app">
		<div class="info-header">
			<p>Você está visualizando um projeto, <RouterLink to="/app">clique aqui</RouterLink> para voltar aos seus projetos</p>
		</div>
		<div class="documents">
			<DocumentBox
				@message-emitter="messageEmitListener($event)"
				v-for="d in documents"
				:document="{ name: d.name, desc: d.desc, id: d.id }"
				:project-id="Number(props.id)"
			/>
		</div>
		<div @click="modalOn = !modalOn" class="create">
			<img src="@/assets/document-create.svg" />
			<p>Clique aqui para criar um novo documento</p>
		</div>
	</div>
	<Transition name="fade">
		<CreateModal
			@message-emitter="messageEmitListener($event)"
			v-if="modalOn"
			@modal-toggle="modalOn = !modalOn"
			:text="'documento'"
			:project-id="Number(props.id)"
			:type="'create'"
		/>
	</Transition>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";

.info-header {
	display: flex;
	padding: 10px;
	background-color: #616161;
	border-radius: 8px;
	a {
		color: $highlight;
	}
}

.app {
	color: #fff;
	width: 90%;
	max-height: 80vh;
	padding: 10px;
	background: $secondary;
	border-radius: 7px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.documents {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	overflow: auto;
	gap: 50px;
}

.create {
	width: 100%;
	display: flex;
	padding: 10px;
	justify-content: space-around;
	align-items: center;
	gap: 10px;
	border: 1px solid transparent;
	background-color: #616161;
	border-radius: 8px;
	transition: 0.2s all;
	img {
		width: 64px;
	}
	&:hover {
		cursor: pointer;
		border-color: $highlight;
	}
}
</style>
