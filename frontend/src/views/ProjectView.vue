<script setup lang="ts">
import ProjectBox from "@/components/ProjectBox.vue";
import CreateModal from "@/components/CreateModal.vue";
import SpinnerLoad from "@/components/SpinnerLoad.vue";

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import UserUtils from "@/utils/User.utils";
import { loggedUserStore } from "@/stores/User.store";
import ProjectUtils from "@/utils/Project.utils";

const emit = defineEmits(["messageEmitter"]);

const modalOn = ref(false);

const userStore = loggedUserStore();

const router = useRouter();
let projects = ref();
let sessionStatus: any;
onMounted(async () => {
	sessionStatus = await UserUtils.updateSessionStatus();
	if (sessionStatus && sessionStatus.data) {
		emit("messageEmitter", { message: sessionStatus.data.error, code: "error" });
		router.push({ path: "/" });
	}
	await fetchProjects();
});

async function fetchProjects() {
	const res = await ProjectUtils.getProjects();
	if (res.code == "error") emit("messageEmitter", res);
	else projects.value = res;
}

async function modalListener(e: any) {
	emit("messageEmitter", e);
	await fetchProjects();
}
</script>

<template>
	<SpinnerLoad v-if="!userStore.getUserStore.email" />
	<div v-else class="app">
		<ProjectBox v-for="p in projects" :project="{ name: p.name, desc: p.desc, id: p.id }" />
		<div @click="modalOn = !modalOn" class="create">
			<img src="@/assets/folder-group.svg" />
			<p>Clique aqui para criar um novo projeto</p>
		</div>
	</div>
	<Transition name="fade">
		<CreateModal @message-emitter="modalListener($event)" v-if="modalOn" @modal-toggle="modalOn = !modalOn" :text="'projeto'" :type="'create'" />
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

.fade-enter-active,
.fade-leave-active {
	transition: all 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
