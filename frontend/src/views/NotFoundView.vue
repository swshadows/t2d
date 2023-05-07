<template>
	<div class="app">
		<img class="notfound-img" src="@/assets/notfound-bee.svg" />
		<div class="wrapper">
			<h1>Página não encontrada</h1>
			<RouterLink to="/">Clique aqui para voltar a página inicial</RouterLink>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";
.app {
	color: #fff;
	width: 50%;
	max-height: 80vh;
	padding: 30px;
	background: $secondary;
	border-radius: 7px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	justify-content: center;
	gap: 30px;
}
.notfound-img {
	width: 160px;
	transition: 0.2s all;
	&:hover {
		transform: scale(1.1);
	}
}
.wrapper {
	display: flex;
	flex-direction: column;
	justify-content: center;
}
a {
	color: $highlight;
}
</style>
