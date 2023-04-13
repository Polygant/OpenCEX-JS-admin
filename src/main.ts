import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import * as Vue from 'vue' // in Vue 3
import axios from 'axios'
import VueAxios from 'vue-axios'
import initRouter from "../src/router"
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

export const app = createApp(App);

app.use(vuetify)
app.use(initRouter);

// eslint-disable-next-line vue/multi-word-component-names
app.mount("#app");