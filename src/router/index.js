import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'
import scanView from '../views/scanView.vue'
import Orders from '../components/Orders.vue'
import DeliveryActions from '../components/DeliveryActions.vue'
import DeliveryRoutes from "../components/DeliveryRoutes.vue";
const routes = [
  {
    path: '/',
    name: 'sign-in',
    component: SignIn 
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUp,
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
    component: scanView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
