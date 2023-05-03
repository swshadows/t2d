
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
      <router-view />
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
import { ref, onMounted, watch } from "vue";

const drawer = ref(false);

const active = ref(true);

function onItemClick() {
  // console.log('Clicked on an Item')
}

onMounted(() => {});
</script>


