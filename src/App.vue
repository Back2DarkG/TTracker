<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref} from 'vue';
import  mainView from './views/MainView.vue'
import '../node_modules/v-calendar/dist/style.css'

const projects = ref(null);
const statistics = ref(null);

</script>

<template>
  <header class =' bg-cyan-200 fixed z-10 w-full h-10 min-h-min'>
        <!-- This is header element -->
      <nav class="h-10 flex justify-around w-56">
        <h1 class ="p-2 pl-6 bg-slate-50 h-36 select-none">TaskTrack</h1>
        <RouterLink ref="projects" class="pt-2 p-1   hover:bg-slate-100" to="/">Проекты</RouterLink>
        <RouterLink ref="statistics" class="pt-2 p-1 hover:bg-slate-100" to="/statistics">Проводки</RouterLink>
       
      </nav>
    
  <RouterView />
  </header>
</template>

<style>

</style>
