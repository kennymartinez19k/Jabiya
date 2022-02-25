<template>
  <div class="uk-container  uk-text-center">
     <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeout"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>
    <div>
      <h4 class=" uk-text-left">Ordenes</h4>
      <div class="uk-card uk-card-default uk-card-body table-scroll" style="padding: 0 8px">
        <table class="uk-table uk-table-hover uk-table-divider uk-text-center">
          <thead>
            <tr>
              <th class=" uk-text-center">Orden</th>
              <th class=" uk-text-center">Cliente</th>
              <th class=" uk-text-center">Total</th>
            </tr>
          </thead>
          <tbody v-for="order in userShipper" :key="order">
            <tr @click="orderDetail(order.id)">
              <td>{{order.name}} </td>
              <td>{{order.client}}</td>
              <td>{{order.amount_total}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
   
  </div>
</template>

<script>
import axios from 'axios'
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";
export default {
  alias: "Crear Facturas",
  components: {
    IonLoading
  },
    props: {
    timeout: { type: Number, default: 1000 },
  },
  data() {
    return {
      userShipper: null,
    }
  },
  // async mounted () {
  //   await this.longIn()
  // },
   setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  async beforeMount() {
    this.setOpen(true);
    await this.longIn()
  },

  methods: {
      orderDetail (val) {
        this.$store.commit("getOrdersToInvoicesId", val);
        console.log(val, 'vall')
        console.log(this.userShipper, 'vathis.userShipperll')
        this.$router.push({ name: 'details-invoices'}).catch(() => {})
       
      },
    async  longIn(){
       const signIn = {"jsonrpc": "2.0", "params": {"login": "809123121","password":"admin"}}

      await axios.post('https://jabiyaerp.flai.com.do/api/auth/sign_in', signIn, {withCredentials: true })
  
        await this.products()
      },

      async products () {
        const result = await axios.get('https://jabiyaerp.flai.com.do/api/order', {withCredentials: true })
        this.userShipper = result.data.result.data.orders
      }
  }
};
</script>

<style scoped>
th{
  font-size: 10.5px;
  color: #000;
  font-weight: bold;
}
td{
  padding: 12px 12px !important;
}
.table-scroll {
  height: 489px;
  overflow-x: hidden;
  overflow-y: scroll;

}
</style>
