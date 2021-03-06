import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from '../views/SignIn.vue'
import LoadScan from '../views/LoadScan.vue'
import Orders from '../views/Orders.vue'
import DeliveryActions from '../views/DeliveryActions.vue'
import DeliveryRoutes from "../views/DeliveryRoutes.vue";
import RecoverPassword from '../views/RecoverPassword.vue'
import Settings from '../views/Settings.vue'
import OrdersAutoScan from '../views/AutoScan/Orders.vue'
import DeliveryActionsAuto from '../views/AutoScan/DeliveryActions.vue'
import ConfirmTrip from '../views/ConfirmTrip.vue'
import LoadStatus from '../views/LoadStatus.vue'
import DetailsInvoices from '../components/DetailsInvoices.vue'
import ReconciliationWarehouse from '../components/ReconciliationWarehouse.vue'
import ReturnContainer from '../views/AutoScan/ReturnContainer.vue'
import DetailsLoad from "../components/DetailsLoad.vue";
import Version from "../components/Version.vue";
import Page from '../views/Page.vue'
import OrderRegistration from '../views/Orders/OrderRegistration.vue'
import ManageOrders from '../views/Orders/ManageOrders.vue'
import ListOrders from '../views/Orders/ListOrders.vue'
import InvoiceSummary from "../components/InvoiceSummary.vue";
import about from '../views/About.vue'


const routes = [
  {
    path: '/',
    name: 'redirect',
    component: Page 
  },
  {
    path: '/',
    name: 'sign-in',
    component: SignIn 
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings 
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
    path: "/details-load",
    name: "details-load",
    component: DetailsLoad,
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
    path: "/drayage-orden",
    name: "drayage-orden",
    component: OrdersAutoScan,
  },
  {
    path: "/delivery-actions-auto",
    name: "delivery-actions-auto",
    component: DeliveryActionsAuto,
  },
  {
    path: "/return-container",
    name: "return-container",
    component: ReturnContainer, 
  },
  {
    path: "/confirm-trip",
    name: "confirm-trip",
    component: ConfirmTrip,
  },

  {
    path: "/load-status",
    name: "load-status",
    component: LoadStatus,
  },
  {
    path: "/details-invoices",
    name: "details-invoices",
    component: DetailsInvoices,
  },
  {
    path: "/warehouse",
    name: "reconciliation-warehouse",
    component: ReconciliationWarehouse,
  },
  {
    path: "/about",
    name: "about",
    component: about,
  },
  {
    path: "/version",
    name: "version",
    component: Version,
  },
  {
    path: "/manage-orders",
    name: "manage-orders",
    component: ManageOrders,
  },
  
  {
    path: "/order-registration",
    name: "order-registration",
    component: OrderRegistration,
  },
  {
    path: "/list-orders",
    name: "list-orders",
    component: ListOrders,
  },
  {
    path: "/invoice-summary",
    name: "summary",
    component: InvoiceSummary,
  },
 
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
