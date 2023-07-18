import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import initRouter from "../src/router"
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createPinia } from 'pinia'
import { createHead } from "@vueuse/head"

const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
})

export const app = createApp(App);
const head = createHead()

app.use(vuetify)
app.use(initRouter)
app.use(pinia)
app.use(head)
// eslint-disable-next-line vue/multi-word-component-names
app.mount("#app");