import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from '../views/SignIn.vue'
import LoadScan from '../views/LoadScan.vue'
import Orders from '../views/Orders.vue'
import DeliveryActions from '../views/DeliveryActions.vue'
import DeliveryRoutes from "../views/DeliveryRoutes.vue";
import DirectAccess from '../views/DirectAccess.vue'
import RecoverPassword from '../views/RecoverPassword.vue'
const routes = [
  {
    path: '/',
    name: 'sign-in',
    component: SignIn 
  },
  {
    path: "/recover",
    name: "recover-password",
    component: RecoverPassword,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
  },
  {
    path: "/orders",
    name: "orders",
    component: Orders,
  },
  {
    path: "/delivery-actions",
    name: "deliveryActions",
    component: DeliveryActions,
  },
  {
    path: "/delivery-routes",
    name: "delivery-routes",
    component: DeliveryRoutes,
  },
  {
    path: "/scan-order",
    name: "scan-order",
    component: LoadScan,
  },
  {
    path: "/direct",
    name: "direct-access",
    component: DirectAccess,
  },
 
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
