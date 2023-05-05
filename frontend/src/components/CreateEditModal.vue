<script setup lang="ts">
import Input from "./Input.vue";
import SubmitButton from "./SubmitButton.vue";

const prop = defineProps<{ text: String; type: "edit" | "create"; id?: Number }>();

const emit = defineEmits(["modalToggle"]);
</script>

<template>
	<div @click.self="emit('modalToggle')" class="backdrop">
		<div class="modal">
			<Input
				:name="'title'"
				:label-text="prop.type == 'edit' ? `Dê um novo nome para o ${prop.text}` : `Dê um nome para o ${prop.text}`"
				:id="'title'"
				:type="'text'"
				:placeholder="'Máximo de 20 caracteres'"
			/>
			<Input
				:name="'desc'"
				:label-text="prop.type == 'edit' ? `Dê uma nova descrição para o ${prop.text}` : `Dê uma descrição para o ${prop.text}`"
				:id="'desc'"
				:type="'text'"
				:placeholder="'Máximo de 20 caracteres'"
			/>
			<SubmitButton :text="`Criar novo ${prop.text}`" />
			<SubmitButton
				:class="'delete'"
				@clicked="emit('modalToggle')"
				:text="prop.type == 'edit' ? `Cancelar edição de ${prop.text}` : `Cancelar criação de ${prop.text}`"
			/>
			<input v-if="prop.id" type="hidden" name="id" :value="prop.id" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.backdrop {
	background: rgba(0, 0, 0, 0.397);
	position: fixed;
	z-index: 9;
	width: 100%;
	height: 100vh;
	display: grid;
	place-items: center;
}
.modal {
	width: 40%;
	background: #fff;
	border-radius: 5px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>
