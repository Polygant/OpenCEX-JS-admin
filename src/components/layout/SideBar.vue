<template>
  <v-app-bar color="primary" elevation="1" height="47">
    <template v-slot:prepend>
      <div class="pl-8" style="font-size: 18px">Admin Panel</div>
    </template>
    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn size="small" icon="mdi-account-circle" v-bind="props"> </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title @click="logout()">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
  <v-navigation-drawer permanent>
    <v-list v-model:selected="selected">
      <template v-for="(item, i) in navigation">
        <v-list-item
          v-if="item.icon"
          :key="i"
          :to="`/page/${item.link === '/' ? 'dashboard' : item.link.name}`"
          :title="item.text"
          :prepend-icon="item.icon"
          :value="item.text"
        >
        </v-list-item>
        <v-list-subheader 
          v-else-if="item.heading"
          :key="i + '_'"
          :title="item.heading"
        />
        <v-divider v-if="!item.link && !item.heading" />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import axios from "../../plugins/axios";
import { onBeforeMount, ref } from "vue";
import { useNavStore } from "@/stores/nav";
import initRouter from "@/router/";
import localConfig from "@/local_config";
import { useRoute } from "vue-router";
const nav = useNavStore();

const apiKey = localConfig.api;

const navigation = ref([]);
const resources = ref([]);

const selected = ref([]);

const logout = () => {
  localStorage.setItem("jwt_token", "");
  initRouter.push({ name: "Login" });
};
const route = useRoute();
const param = ref(route.path);

const devs = ref({});

const getNavigation = async () => {
  if (!window.location.href.includes("/login"))
    try {
      const response = await axios.get(`${apiKey}navigation/`);
      navigation.value = response.data;
      nav.setNavigation(response.data);
      let dStr = "";
      navigation.value.map(($, k) => {
        if ($.heading) {
          devs.value[$.heading] = false;
          dStr = $.heading;
        }
        navigation.value[k]["head"] = dStr;
      });
      try {
        let menu = JSON.parse(localStorage.getItem("menu"));
        if (menu) devs.value = menu;
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      if (
        error?.response?.data?.type === "authentication_failed" ||
        error?.response?.data?.code?.code === "token_not_valid" ||
        error?.response?.data?.type === "not_authenticated"
      ) {
        initRouter.push({ name: "Login" });
      }
    }
};

const openMenu = ($) => {
  devs.value[$] = !devs.value[$];
  localStorage.setItem("menu", JSON.stringify(devs.value));
};

const getResources = async () => {
  try {
    const response = await axios.get(`${apiKey}resources/`);
    resources.value = response.data;
    nav.setResources(response.data);
  } catch (error) {
    console.log(error.type);
  }
};

onBeforeMount(() => {
  getNavigation();
  getResources();
});
</script>

<style>
.devd {
  font-weight: bold;
  padding: 10px 5px 10px;
  background: #deeeee;
  text-align: center;
}
</style>
