<template>
	<header>
		<div class="brand">
			<img src="/favicon.svg" alt="" />
			<p>Task 2 Do</p>
		</div>
	</header>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";

header {
	display: flex;
	align-items: center;
	padding-left: 10px;
	width: 100%;
	height: 70px;
	background-color: $main;
	color: #fff;
	position: fixed;
	top: 0;
}

.brand {
	display: flex;
	gap: 10px;
	align-items: center;
	img {
		max-width: 32px;
	}
}
</style>
