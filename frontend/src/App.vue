<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "./components/Footer.vue";
import Message from "@/components/Message.vue";
import { ref } from "vue";

let result = ref();
function showMessage(e: any) {
	result.value = e;
}
</script>

<template>
	<Header @message-emitter="showMessage($event)" />
	<Transition name="fade">
		<Message @hide-message="result = undefined" v-if="result != undefined" :result="result" />
	</Transition>
	<RouterView @message-emitter="showMessage($event)" />
	<Footer />
</template>

<style lang="scss">
// Transição de fadeout
.fade-enter-active,
.fade-leave-active {
	transition: all 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

// Transição de movimento
.move-enter-active,
.move-leave-active {
	transition: all 0.2s ease-out;
}

.move-enter-from {
	transform: translateY(10%);
	opacity: 0;
}

.move-leave-to {
	transform: translateY(-10%);
	opacity: 0;
}
</style>
