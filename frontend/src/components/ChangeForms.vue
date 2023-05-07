<script setup lang="ts">
const emit = defineEmits(["changeForms"]);
const props = defineProps<{ type: "login" | "register" }>();
</script>

<template>
	<div class="switcher">
		<span>{{ props.type == "login" ? "Já criou uma conta? " : "Ainda não tem uma conta? " }}</span>
		<span @click="emit('changeForms')" class="changer">{{ props.type == "login" ? "Faça login" : "Faça registro" }}</span>
	</div>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";

.changer {
	cursor: pointer;
	text-decoration: underline;
	color: $highlight;
}
</style>
