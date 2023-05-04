<script setup lang="ts">
const prop = defineProps({
	text: String
});
</script>

<template>
	<button>{{ prop.text }}</button>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";
button {
	width: 100%;
	color: #fff;
	background-color: $main;
	border: 1px solid transparent;
	padding: 4px;
	transition: 0.2s all;
	&:hover {
		border-color: $highlight;
		cursor: pointer;
		background: $main_darker;
	}
}
</style>
