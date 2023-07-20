<template>
  <v-card>
    <v-layout align-start>
      <SideBar v-if="pageName !=='Login'" />
      <v-main style="min-height: 100vh; min-width: calc(100vw - 280px);" :class="{'login': pageName === 'Login'}">
        <router-view/>
      </v-main>
    </v-layout>
  </v-card>
</template>
<script>
import { onBeforeMount, ref, watch } from 'vue';
import SideBar from './components/layout/SideBar.vue'
import { useRoute } from 'vue-router'
import localConfig from "./local_config"
import { useHead } from 'unhead'

export default {
  components: {
    SideBar
  },
  
  setup() {
    const route = useRoute()
    const param = ref(route.params.page)
    const pageName = ref("")
    useHead({
      titleTemplate: `${localConfig.title} admin panel`,
    })
    watch(
      () => route.name,
      (newValue) => {
        pageName.value = newValue ? newValue.toString() : "";
      }
    );
    return {
      pageName
    }
  }
}



</script>

<style scoped>
.v-main {
  min-width: 100vw !important;
  padding-left: 258px !important;
  padding-right: 30px !important;  
 
}
.v-main.login {
  background: #3B485A;
}
</style>
