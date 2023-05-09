<script setup lang="ts">
const prop = defineProps({
	icon: String,
	text: String
});
</script>

<template>
	<button>
		<slot></slot>
		<span>{{ prop.text }}</span>
	</button>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";

button {
	background-color: $highlight;
	border-radius: 8px;
	padding: 4px;
	border: 0;
	display: flex;
	gap: 5px;
	align-items: center;
	transition: 0.2s all;
	&:hover {
		cursor: pointer;
		background-color: $highlight_darker;
	}
	&.on {
		span {
			text-decoration: underline;
			color: $main;
		}
	}
}
</style>
