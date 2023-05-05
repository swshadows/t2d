<template>
	<div class="spinner"></div>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";
.spinner {
	width: 100px;
	height: 100px;
	border: 2px solid;
	border-radius: 50%;
	border-color: $highlight $highlight $highlight transparent;
	animation: rotate 0.5s linear infinite;
}

@keyframes rotate {
	0% {
		transform: rotate(0deg) scale(1);
	}
	50% {
		transform: rotate(180deg) scale(1.1);
	}
	100% {
		transform: rotate(360deg) scale(1);
	}
}
</style>
