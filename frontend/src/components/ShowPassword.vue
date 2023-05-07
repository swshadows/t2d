<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["changeInputType"]);
const prop = defineProps(["formType"]);

// Modifica o estado das senhas de acordo com a checkbox, emitindo estado checado e tipo de formulário, para views multiformulário
function changeStatus(formType: string) {
	checked.value = !checked.value;
	const emitData = {
		check: checked.value,
		formType
	};
	emit("changeInputType", emitData);
}

let checked = ref(false);
</script>

<template>
	<div class="checkbox">
		<input @click="changeStatus(prop.formType)" type="checkbox" :checked="checked" />
		<span @click="changeStatus(prop.formType)">Mostrar senha</span>
	</div>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";
.checkbox {
	display: flex;
	gap: 5px;
	input {
		accent-color: $highlight;
	}
	span {
		cursor: pointer;
	}
}
</style>
