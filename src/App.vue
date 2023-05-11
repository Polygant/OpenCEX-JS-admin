<template>
  <v-card>
    <v-layout>
      <metainfo>
        <template #title="data">{{ data.content.replace(/%7C/g, "|") }}</template>
      </metainfo>
      <SideBar v-if="pageName !=='Login'" />
      <v-main style="min-height: 100vh">
        <router-view/>
      </v-main>
    </v-layout>
  </v-card>
</template>
<script>
import { onBeforeMount, ref, watch } from 'vue';
import SideBar from './components/layout/SideBar.vue'
import { useRoute } from 'vue-router'
import { useMeta } from 'vue-meta'
import localConfig from "./local_config"

export default {
  components: {
    SideBar
  },
  metaInfo() {
    console.log(localConfig)
    return {
      title: localConfig.title ? `${localConfig.title} admin panel` : "OpenCex",
    };
  },
  setup() {
    const route = useRoute()
    const param = ref(route.params.page)
    const pageName = ref("")

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

</style>
