<script setup lang="ts">
import type { MessageType } from "@/utils/Response.utils";
import { onMounted } from "vue";

defineProps<{ result: MessageType }>();
const emit = defineEmits(["hideMessage"]);
onMounted(() => {
	setTimeout(() => {
		emit("hideMessage");
	}, 1500);
});
</script>

<template>
	<div class="msg" :class="result.code">{{ result.message }}</div>
</template>

<style scoped lang="scss">
.msg {
	position: absolute;
	padding: 10px;
	width: 500px;
	color: white;
	top: 10%;
	left: 50%;
	transform: translate(-50%);
	z-index: 99;
	display: grid;
	place-items: center;
}

.error {
	background-color: #ff4444;
}
.success {
	background-color: #6aa86a;
}
</style>
