<script setup lang="ts">
const prop = defineProps({
	text: String,
});
const emit = defineEmits(["clicked"]);
</script>

<template>
	<button @click="emit('clicked')">{{ prop.text }}</button>
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
	&.confirm {
		$confirm_color: #0077e7;
		background-color: $confirm_color;
		&:hover {
			border-color: lighten($confirm_color, 20);
			background-color: darken($confirm_color, 20);
		}
	}
	&.warning {
		$warning_color: #c78800;
		background-color: $warning_color;
		&:hover {
			border-color: lighten($warning_color, 20);
			background-color: darken($warning_color, 20);
		}
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
