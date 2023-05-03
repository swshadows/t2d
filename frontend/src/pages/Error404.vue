
<template>
  <div class="Vh86 Black flex justify-center items-center">
    <div class="Card BlackGray items-center flex justify-center">
      <div class="row CardInter flex items-center justify-center">
        <div class="col CardCol1 flex justify-center items-center">
          Bem vindo a 🐝 Task 2 Do <br />
          Uma aplicação para o gerenciamento dos seus projetos Desenvolvida para
          a Inovatec 2023
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Api from "../core/api/api";
import { useRouter, useRoute } from "vue-router";

const Router = useRouter();

type loginProps = {
  email: string;
  senha: string;
};

const login = ref({} as loginProps);

const formLogin = ref(null);
const isPwd = ref(false);

const Register = () => {
  Router.push("/singout");
};

const password = ref("");
</script>

<style scoped>
.Vh86 {
  height: 86vh;
}
.Card {
  height: 70%;
  width: 90%;
}

.CardInter {
  height: 60%;
  width: 80%;
}

.Form {
  width: 80%;
}
</style>