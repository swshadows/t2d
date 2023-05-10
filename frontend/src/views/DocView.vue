<script setup lang="ts">
import SpinnerLoad from "@/components/SpinnerLoad.vue";

import { loggedUserStore } from "@/stores/User.store";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Markdown from "vue3-markdown-it";

import "highlight.js/styles/github-dark.css";

import DocumentAPI from "@/api/Document.API";
import UserAPI from "@/api/User.API";
import ProjectAPI from "@/api/Project.API";

const userStore = loggedUserStore();
const router = useRouter();
const props = defineProps<{ pId: string; dId: string }>();
const emit = defineEmits(["messageEmitter"]);

const awaitingApi = ref(true);
onMounted(async () => {
	await fetchDocContent();
	awaitingApi.value = false;
});

// Pega informações do documento. Em caso de erro, mostra mensagens ou redireciona
let doc = ref();
let project = ref();
async function fetchDocContent() {
	// Pega informações do documento
	userStore.storeLogin(await UserAPI.getSessionStatus());
	let res = await DocumentAPI.getDocContent(Number(props.dId), Number(props.pId));
	if (res.code == "error") {
		if (res.apiCode == "notLoggedYet") router.push({ path: "/" });
		if (res.apiCode == "docNotFound") router.push({ path: `/app/${props.pId}` });
		if (res.apiCode == "notAllowed") router.push({ path: "/app" });
		doc.value = 0;
		emit("messageEmitter", res);
	} else {
		doc.value = res;
		newContent.value = doc.value.content;
	}

	// Pega informações do projeto em si
	res = await ProjectAPI.getOneProject(Number(props.pId));
	project.value = res;
}

// Salva conteudo novo
let newContent = ref("");
async function saveContent() {
	let res = await DocumentAPI.saveDocContent(newContent.value, Number(props.dId), Number(props.pId));
	if (res.code == "error") {
		if (res.apiCode == "notLoggedYet") router.push({ path: "/" });
		if (res.apiCode == "docNotFound") router.push({ path: `/app/${props.pId}` });
		if (res.apiCode == "notAllowed") router.push({ path: "/app" });
		doc.value = 0;
	}
	emit("messageEmitter", res);
}
</script>

<template>
	<SpinnerLoad v-if="awaitingApi" />
	<div v-else class="app">
		<div class="info-header">
			<p>
				Você está visualizando o conteudo de um documento, <RouterLink :to="`/app/${props.pId}`">clique aqui</RouterLink> para ver todos os documentos desse
				projeto
			</p>
			<div v-if="doc && project" class="doc-details-wrapper">
				<span>📄 {{ doc.name }}</span>
				<span>, {{ doc.desc.toLowerCase() }}, do projeto {{ project.name }}</span>
			</div>
		</div>
		<div v-if="doc" class="editors-wrapper">
			<textarea v-model="newContent" class="editor">{{ doc.content }}</textarea>
			<button @click="saveContent()" class="save"><img src="@/assets/save.svg" /></button>
			<Markdown class="markdown-viewer" :source="newContent" />
		</div>
	</div>
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
	flex-direction: column;
	background-color: #616161;
	border-radius: 8px;
	a {
		color: $highlight;
	}
}

.doc-details-wrapper {
	color: $highlight;
}

.editors-wrapper {
	padding: 0 5px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	justify-items: center;
	gap: 10px;
	overflow: auto;
	@include mobile {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
}

.save {
	border: 0;
	background-color: transparent;
	position: absolute;
	bottom: 3%;
	left: 25%;
	transform: translateX(-50%);
	display: flex;
	padding: 4px;
	border-radius: 5px;
	transition: 0.2s all;
	&:hover {
		cursor: pointer;
		background-color: #616161;
	}
	@include mobile {
		bottom: 0%;
		left: 50%;
		transform: translateX(-50%);
	}
}

.editor,
.markdown-viewer {
	padding: 10px;
	border-radius: 8px;
	width: 100%;
	height: 70vh;
	max-height: inherit;
	overflow: auto;
	background-color: #fff;
	outline: 0;
}

.editor {
	resize: vertical;
}

.markdown-viewer {
	background-color: #616161;
	font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
	font-size: initial;
	font-weight: initial;
}
</style>
