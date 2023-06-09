<script setup lang="ts">
import ProjectBox from "@/components/ProjectBox.vue";
import DocumentBox from "@/components/DocumentBox.vue";
import CreateModal from "@/components/CreateModal.vue";
import SpinnerLoad from "@/components/SpinnerLoad.vue";
import IconButton from "@/components/IconButton.vue";

import { onMounted, onUpdated, ref } from "vue";
import { useRouter } from "vue-router";

import { loggedUserStore } from "@/stores/User.store";
import ProjectAPI from "@/api/Project.API";
import DocumentAPI from "@/api/Document.API";
import UserAPI from "@/api/User.API";

const emit = defineEmits(["messageEmitter"]);
const userStore = loggedUserStore();
const router = useRouter();

const awaitingApi = ref(true);
onMounted(async () => {
	await fetchProjects();
	await fetchSharedDocs();
	awaitingApi.value = false;
});

// Pega projetos caso existam e mostra. Caso não, mostra mensagens ou redireciona
const projects = ref();
async function fetchProjects() {
	userStore.storeLogin(await UserAPI.getSessionStatus());
	const res = await ProjectAPI.getProjects();
	if (res.code == "error") {
		if (res.apiCode == "notLoggedYet") {
			router.push({ path: "/" });
		}
		if (res.status != 404) emit("messageEmitter", res);
		projects.value = 0;
	} else {
		projects.value = res;
	}
}

// Pega documentos compartilhados caso existam e mostra. Caso não, mostra mensagens ou redireciona
const sharedDocs = ref();
async function fetchSharedDocs() {
	const res = await DocumentAPI.getSharedDocs();
	if (res.code == "error") {
		if (res.apiCode == "notLoggedYet") router.push({ path: "/" });
		if (res.status != 404) emit("messageEmitter", res);
		sharedDocs.value = 0;
	} else {
		sharedDocs.value = res;
	}
}

// Passa a mensagem do componente Modal para o listener de mensagens externo na App
async function messageEmitListener(e: any) {
	emit("messageEmitter", e);
	if (e.code != "error") await fetchProjects();
}

// Alterna visibilidade do modal de criação de projetos
const modalOn = ref(false);

// Alterna a visão de projetos próprios e docs compartilhados
const sharedOn = ref(false);
</script>

<template>
	<SpinnerLoad v-if="awaitingApi" />
	<div v-else class="app">
		<div class="info-header">
			<IconButton @click="sharedOn = false" :text="'Meus projetos'" :class="!sharedOn ? 'on' : ''">
				<img src="@/assets/projects-button-icon.svg" />
			</IconButton>
			<IconButton @click="sharedOn = true" :class="sharedOn ? 'on' : ''" :text="'Compartilhados comigo'">
				<img src="@/assets/shared-button-icon.svg" />
			</IconButton>
		</div>
		<div v-if="!sharedOn" class="projects">
			<p v-if="!projects">Não há projetos registrados</p>
			<ProjectBox @message-emitter="messageEmitListener($event)" v-for="p in projects" :project="{ name: p.name, desc: p.desc, id: p.id }" />
		</div>
		<div v-else class="sharedDocs">
			<p v-if="!sharedDocs">Não há documentos compartilhados registrados</p>
			<DocumentBox
				v-for="d in sharedDocs"
				:document="{ name: d.docName, desc: d.docDesc, id: d.docId, pId: d.projectId, sharedUser: -1 }"
				:shared="true"
				:project-info="{ name: d.projectName, desc: d.projectDesc, owner: d.projectOwner }"
			/>
		</div>
		<div @click="modalOn = !modalOn" class="create">
			<img src="@/assets/project-create.svg" />
			<p>Clique aqui para criar um novo projeto</p>
		</div>
	</div>
	<Transition name="fade">
		<CreateModal @message-emitter="messageEmitListener($event)" v-if="modalOn" @modal-toggle="modalOn = !modalOn" :text="'projeto'" :type="'create'" />
	</Transition>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";
@import "@/scss/responsive.scss";

.app {
	color: #fff;
	width: 90%;
	max-height: 75vh;
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

.info-header {
	display: flex;
	padding: 10px;
	gap: 10px;
	background-color: #616161;
	border-radius: 8px;
}

.projects,
.sharedDocs {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	overflow: auto;
	gap: 50px;
	@include mobile {
		grid-template-columns: 1fr;
	}
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
