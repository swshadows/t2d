<script setup lang="ts">
import SubmitButton from "./SubmitButton.vue";

const emit = defineEmits(["cancelDelete", "delete"]);
</script>

<template>
	<div @click.self="emit('cancelDelete')" class="popover">
		<p>Confirme a deleção do item:</p>
		<SubmitButton @clicked="emit('cancelDelete')" :text="'Cancelar a deleção'" />
		<SubmitButton @clicked="emit('delete')" :class="'delete'" :text="'Deletar'" />
	</div>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";

.popover {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 10px;
	background-color: rgba($secondary, 0.8);
	border-radius: 6px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
}
</style>
