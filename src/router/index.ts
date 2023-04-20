import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Index.vue'
import LoginPageVue from '../pages/LoginPage.vue'
import ContentPage from '../pages/ContentPage.vue'
const baseUrl = import.meta.env.VITE_BASE_URL
const routes = [
  {
    path: `/${baseUrl}/`,
    name: 'Home',
    component: Home
  },
  {
    path: `/login`,
    name: 'Login',
    component: LoginPageVue
  },
  {
    path: `/page/:page`,
    name: 'Admin',
    component: ContentPage
  },
]
const initRouter = createRouter({
  history: createWebHistory(`/${baseUrl}/`),
  routes
})
export default initRouter