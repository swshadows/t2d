<script setup lang="ts">
const prop = defineProps({
	text: String
});
const emit = defineEmits(["clicked"]);
</script>

<template>
	<button @click="emit('clicked')">{{ prop.text }}</button>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";
button {
	width: 350px;
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
	&.delete {
		background-color: $danger;
		&:hover {
			border-color: lighten($danger, 20);
			background-color: $danger_darker;
		}
	}
}
</style>
