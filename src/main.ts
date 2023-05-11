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
import vueClickOutsideElement from 'vue-click-outside-element'
import { createMetaManager, plugin as vueMetaPlugin } from "vue-meta"

const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
})

export const app = createApp(App);

app.use(vuetify)
app.use(vueClickOutsideElement)
app.use(initRouter)
app.use(pinia)
app.use(createMetaManager())
app.use(vueMetaPlugin)

// eslint-disable-next-line vue/multi-word-component-names
app.mount("#app");