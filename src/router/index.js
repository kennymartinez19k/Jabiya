import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue';
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'
import About from '../views/About.vue'
import Orders from '../components/Orders.vue'
import DeliveryActions from '../components/DeliveryActions.vue'
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
  {
    path: '/delivery-actions',
    name: 'DeliveryActions',
    component: DeliveryActions
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
