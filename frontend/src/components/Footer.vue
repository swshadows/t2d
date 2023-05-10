<template>
	<footer>
		<p>Todos os direitos reservados ©</p>
		<p>Equipe T2D, 2022</p>
	</footer>
</template>

<style scoped lang="scss">
@import "@/scss/colors.scss";
@import "@/scss/responsive.scss";

footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 10px;
	width: 100%;
	height: 70px;
	background-color: $main;
	color: #fff;
	position: fixed;
	bottom: 0;
	z-index: 1;
	@include mobile {
		height: 40px;
	}
}
</style>
