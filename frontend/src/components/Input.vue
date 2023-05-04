<script setup lang="ts">
const prop = defineProps({
	labelText: String,
	type: String,
	name: String,
	id: String,
	placeholder: String
});
const emit = defineEmits(["emitValues"]);
function emitValue() {
	emit("emitValues", iVal);
}
let iVal = "";
</script>

<template>
	<label :for="prop.id">{{ prop.labelText }}</label>
	<input :type="prop.type" :name="prop.name" :id="prop.id" :placeholder="prop.placeholder" v-model="iVal" @input="emitValue()" />
</template>

<style scoped lang="scss">
input {
	background: rgba(149, 149, 149, 0.795);
	border-bottom: 1px solid #8000ff;
	width: 250px;
	border: 0;
	outline: 0;
	padding: 2px 5px;
	transition: 0.2s all;
	&:focus {
		background-color: #fff;
		&::placeholder {
			color: #6d6d6d;
		}
	}
	&::placeholder {
		color: #d8d8d8;
	}
}
</style>
