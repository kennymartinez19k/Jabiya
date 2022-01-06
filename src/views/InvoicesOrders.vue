<template>
  <div class="uk-container  uk-text-center">
    <div>
      <h4 class=" uk-text-left">Ordenes</h4>
      <div class="uk-card uk-card-default uk-card-body" style="padding: 0 8px">
        <table class="uk-table uk-table-hover uk-table-divider uk-text-center">
          <thead>
            <tr>
              <th class=" uk-text-center">orden</th>
              <th class=" uk-text-center">Cliente</th>
              <th class=" uk-text-center">Total</th>
            </tr>
          </thead>
          <tbody v-for="order in userShipper" :key="order">
            <tr @click="orderDetail(order.id)">
              <td>{{order.name}} </td>
              <td>juan Perez</td>
              <td>RD$500.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
   
  </div>
</template>

<script>
import axios from 'axios'
export default {
  alias: "Crear Facturas",
  data() {
    return {
      userShipper: null,
    }
  },
  async mounted () {
    await this.longIn()
  },

  methods: {
      orderDetail (val) {
        this.$store.commit("getOrdersToInvoicesId", val);
        this.$router.push({ name: 'details-invoices'}).catch(() => {})
       
      },
    async  longIn(){
       const signIn = {"jsonrpc": "2.0", "params": {"login": "809123121","password":"admin"}}

      const resultLogin = await axios.post('https://jabiyaerp.flai.com.do/api/auth/sign_in', signIn, {withCredentials: true })
      console.log(resultLogin.data.result, 'loguin')
        //      const resultLogin = await this.$services.invoicesSevices.getLoginInvoices()
        // console.log(resultLogin)
        // this.userShipper = resultLogin.data.result.data
        await this.products()
      },

      async products () {
        const result = await axios.get('https://jabiyaerp.flai.com.do/api/order?id=23123123', {withCredentials: true })
        console.log(result.data.result.data.orders, 'result')
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
</style>
