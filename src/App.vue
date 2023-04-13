<template>
  <v-card>
    <v-layout>
      <SideBar v-if="pageName !=='Login'" />
      <v-main style="min-height: 100vh">
        <router-view/>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import SideBar from './components/layout/SideBar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const param = ref(route.params.page)
const pageName = ref("")

watch(
  () => route.name,
  (newValue) => {
    pageName.value = newValue ? newValue.toString() : "";
  }
);

</script>

<style scoped>

</style>
