<script setup lang="ts">
import ProjectBox from "@/components/ProjectBox.vue";
import CreateModal from "@/components/CreateModal.vue";
import SpinnerLoad from "@/components/SpinnerLoad.vue";

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { loggedUserStore } from "@/stores/User.store";
import ProjectAPI from "@/api/Project.API";
import UserAPI from "@/api/User.API";

const emit = defineEmits(["messageEmitter"]);
const userStore = loggedUserStore();
const router = useRouter();

onMounted(async () => {
	await fetchProjects();
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
		projects.value = 0;
		emit("messageEmitter", res);
	} else {
		projects.value = res;
	}
}

// Passa a mensagem do componente Modal para o listener de mensagens externo na App
async function messageEmitListener(e: any) {
	emit("messageEmitter", e);
	await fetchProjects();
}

// Alterna visibilidade do modal de criação de projetos
const modalOn = ref(false);
</script>

<template>
	<SpinnerLoad v-if="!userStore.getUserStore.email" />
	<div v-else class="app">
		<ProjectBox @message-emitter="messageEmitListener($event)" v-for="p in projects" :project="{ name: p.name, desc: p.desc, id: p.id }" />
		<div @click="modalOn = !modalOn" class="create">
			<img src="@/assets/folder-group.svg" />
			<p>Clique aqui para criar um novo projeto</p>
		</div>
	</div>
	<Transition name="fade">
		<CreateModal @message-emitter="messageEmitListener($event)" v-if="modalOn" @modal-toggle="modalOn = !modalOn" :text="'projeto'" :type="'create'" />
	</Transition>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";

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
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	overflow: auto;
	scrollbar-color: $highlight $secondary;
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
