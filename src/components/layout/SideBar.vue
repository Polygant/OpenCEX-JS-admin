<template>
  <v-navigation-drawer
    theme="dark"
    rail
    permanent
  >
    <v-list-item
      nav
      prepend-avatar="https://randomuser.me/api/portraits/women/75.jpg"
    ></v-list-item>

    <v-divider></v-divider>

    <v-list
      density="compact"
      nav
    >
      <v-list-item prepend-icon="mdi-view-dashboard" value="dashboard"></v-list-item>

      <v-list-item prepend-icon="mdi-forum" value="messages"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer permanent>
    <v-list>
      <template v-for="item in navigation">
        <template v-if="item.icon">
          <v-list-item :to="`/page/${ item.link === '/' ? 'dashboard' : item.link.name}`" :title="item.text" :prepend-icon="item.icon" :value="item.text">
          </v-list-item>
        </template>
        <template>
          <v-divider></v-divider>
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import axios from '../../plugins/axios';
import { onBeforeMount, ref } from 'vue'
import { useNavStore } from '@/stores/nav'
import initRouter from '@/router/'
import localConfig from "@/local_config"

const nav = useNavStore()

const apiKey = localConfig.api

const navigation = ref([])
const resources = ref([])

const getNavigation = async () => {
  try {
    const response = await axios.get(`${apiKey}navigation/`)
    navigation.value = response.data
    nav.setNavigation(response.data)
  } catch (error) {
    if(error?.response?.data?.type === "authentication_failed" || error?.response?.data?.code?.code === "token_not_valid") {
      initRouter.push({name: 'Login'})
    }
  }
} 

const getResources = async () => {
  try {
    const response = await axios.get(`${apiKey}resources/`);
    resources.value = response.data
    nav.setResources(response.data)
  } catch (error) {
    console.log(error.type);
  }
} 

onBeforeMount(() => {
  getNavigation()
  getResources()
})
</script>

<style>
.v-icon {
  opacity: 1 !important;
  visibility: visible !important;
}
</style>