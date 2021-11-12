import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue';
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'
import Orders from '../components/Orders.vue'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: SignIn 
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: SignUp 
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/orders',
    name: 'orders',
    component: Orders
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router