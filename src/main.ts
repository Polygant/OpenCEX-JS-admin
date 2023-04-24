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

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
})

export const app = createApp(App);

app.use(vuetify)
app.use(initRouter)
app.component('VueDatePicker', VueDatePicker)
app.use(pinia)

// eslint-disable-next-line vue/multi-word-component-names
app.mount("#app");