
<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="bg-deep-purple-5 text-white flex items-center"
      style="height: 67px"
    >
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="../assets/logo.svg" />
          </q-avatar>
          Task 2 Do
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="Vh86 Black flex justify-center items-center">
        <div class="Card BlackGray items-center flex justify-center">
          <div class="row CardInter flex items-center justify-center">
            <div class="col CardCol1 flex justify-center items-center">
              Bem vindo a 🐝 Task 2 Do <br />
              Aqui voÇe irá fazer seu cadastro em nossa aplicação
            </div>
            <div class="col CardCol2 flex justify-center items-center">
              <q-form ref="formLogin" class="Form">
                <div>
                  <div>
                    <span>Digite seu nome:</span>
                  </div>
                  <q-input
                    filled
                    square
                    color="deep-purple-5"
                    class="BgInput"
                    v-model="login.username"
                    dense
                  />
                </div>
                <div class="q-mt-md">
                  <div>
                    <span>Digite de email:</span>
                  </div>
                  <q-input
                    filled
                    square
                    color="deep-purple-5"
                    class="BgInput"
                    v-model="login.email"
                    dense
                  />
                </div>
                <div class="q-mt-md">
                  <div>
                    <span>Digite sua senha:</span>
                  </div>
                  <q-input
                    v-model="login.password"
                    filled
                    square
                    color="deep-purple-5"
                    class="BgInput"
                    dense
                    :type="!isPwd ? 'password' : 'text'"
                  >
                  </q-input>
                </div>
                <div class="q-mt-md">
                  <div>
                    <span>Confirme sua senha:</span>
                  </div>
                  <q-input
                    v-model="login.confirmPassword"
                    filled
                    square
                    color="deep-purple-5"
                    class="BgInput"
                    dense
                    :type="!isPwd ? 'password' : 'text'"
                  >
                  </q-input>
                  <q-checkbox
                    v-model="isPwd"
                    color="positive"
                    label="Mostrar senha"
                  />
                </div>
                <div>
                  <q-btn
                    class="btn no-border-radius"
                    unelevated
                    square
                    color="deep-purple-5"
                    label="Cadastrar"
                    no-caps
                  />
                </div>
              </q-form>
            </div>
          </div>
        </div>
      </div>
    </q-page-container>

    <q-footer
      elevated
      class="bg-deep-purple-5 text-white flex items-center"
      style="height: 67px"
    >
      <q-toolbar>
        <q-toolbar-title class="flex justify-between">
          <div>Todos os direitos reservados</div>
          <div>Equipe T2D, 2022</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
  
  <script setup lang="ts">
import { ref, onMounted } from "vue";
import Api from "../core/api/api";
import { useRouter, useRoute } from "vue-router";

type loginProps = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const login = ref({} as loginProps);

const formLogin = ref(null);
const isPwd = ref(false);

async function register() {
  let result: any = await Api.getResult("/user/register");

  if (result) {
  }
}
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
  height: 70%;
  width: 80%;
}

.CardCol1 {
  border-right: 2px solid #231f20;
  height: 100%;
  color: white;
}
.CardCol2 {
  height: 100%;
  color: white;
}

.Form {
  width: 80%;
}
</style>