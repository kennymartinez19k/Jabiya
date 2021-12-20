<template>
  <div class="container">
      <ul class=" uk-flex uk-flex-wrap">
          <h5 class="title uk-margin-top uk-width-1-1 uk-text-center">Seleccione la Acción que Desea Realizar</h5>
          <li class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/box-truck.png" alt="">
                <p class="name-action"><strong>Ver Tus Cargas</strong></p>
          </li>
          <li class="action uk-width-1-2" @click="DeliveredOrders('orders-auto-scan')">
               <img src="../assets/container.png" alt="">
                <p class="name-action"><strong>Montar Viaje e Iniciar Ruta</strong> </p>
          </li>
          
          <li class="action uk-width-1-2" @click="DeliveredOrders('delivery-actions-auto')">
              <img src="../assets/boxes.png" alt="">
                <p class="name-action"><strong>Entregar Contenedor al Cliente</strong> </p>
          </li>
          <li v-if="settings.AutoScan === false" class="action uk-width-1-2" @click="changeRoute('')">
               <img src="../assets/invoice.png" alt="">
                <p class="name-action"><strong>Procesar Factura</strong> </p>
          </li>
          <li v-if="settings.AutoScan === false" class="action uk-width-1-2" @click="changeRoute()">
              <img src="../assets/almacen.png" alt="">
                <p class="name-action"><strong>Reconciliación con Almacén</strong></p>
          </li>
          <li class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/Reject-box.png" alt="">
                <p class="name-action"><strong>Procesar Rechazo del Contenedor</strong></p>
          </li>
           <li class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/refund.png" alt="">
                <p class="name-action"><strong>Devolver Contenedor</strong></p>
          </li>
      </ul>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex';
export default {
    data() {
    return {
      orders: [
        {
          numberOfOrders: 1234,
          numberOfBox: 2,
          shipper: "Juan Martinez Soto",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 08:22')
        },
        {
          numberOfOrders: 1223,
          numberOfBox: 2,
          shipper: "Maria Lisbeth Alcantara Rodriguez",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 10:22')
        },
        {
          numberOfOrders: 3321,
          numberOfBox: 2,
          shipper: "Albert Perez",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 12:22')
        },
        {
          numberOfOrders: 4324,
          numberOfBox: 2,
          shipper: "Jose Abreu Pichardo",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 14:22')
        },
        {
          numberOfOrders: 3753,
          numberOfBox: 2,
          shipper: "Albert Perez",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 16:22')
        },
        {
          numberOfOrders: 1027,
          numberOfBox: 2,
          shipper: "Jose Abreu Pichardo",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 18:22')
        },
        {
          numberOfOrders: 9120,
          numberOfBox: 2,
          shipper: "Juan Jose Garcia",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 20:22')
        },
      ],
      userLoads: [
        {
          date: new Date(),
          hour: "10:00 Am",
          status: "Asignada",
          shipper: "Juan Perez",
          loadNumber: 2177,
          shipperZone: "Rep. de colombia",
          btnAction: "Cargar Vehiculo",
          icon: "color: #1f7a18",
        },
        {
          hour: "12:00 PM",
          status: "Entregada",
          shipper: "Maria Hernandez",
          loadNumber: 1883,
          shipperZone: "Respaldo Rodeo",
          btnAction: "Ver Orden(es)",
          icon: "color: #000000",
        },
        {
          hour: "10:00 AM",
          status: "En Ruta",
          shipper: "Juan Perez",
          loadNumber: 2238,
          shipperZone: "Rep. de colombia",
          btnAction: "Continuar Entrega(s)",
          icon: "color: #a7a7a7",
        },
        {
          hour: "10:00 AM",
          status: "En Ruta",
          shipper: "Juan Perez",
          loadNumber: 2833,
          shipperZone: "Rep. de colombia",
          btnAction: "Continuar Entrega(s)",
          icon: "color: #a7a7a7",
        },
        {
          hour: "10:00 AM",
          status: "Despacho Aprobado",
          shipper: "Juan Perez",
          loadNumber: 2993,
          shipperZone: "Rep. de colombia",
          btnAction: "Comenzar Entrega(s)",
          icon: "color: #c39108",
        },
      ],
    };
  },
  computed:{
    ...mapGetters([
      'settings'
    ])
  },
  async mounted(){
    await this.$store.dispatch('changeDateLoads')

    let cookieinfo = "connect.sid=s%3ABR94OXNkBmkRIThnYWMc1H5PZ_2djah5.gFYxhod25z18n9Gte%2B4gj7XtNP8HDDcrr6ZWkWFWqRU; Path=/; Expires=Sat, 18 Dec 2021 03:06:07 GMT; HttpOnly"
    try{
      const result = await axios.get("http://preprod.flai.com.do:8756/exo/loads", {
        withCredentials: true,
        headers:{
           "Access-Control-Allow-Origin": "*",
           Cookie: cookieinfo
        }})
      console.log(result)
    }
    catch(err){
      console.log(err)
    }
  },

  
  methods: {
    changeRoute(val){
      
      this.$router.push({name: val})
    },
    DeliveredOrders(val){
      this.$store.commit('setAllOrders', this.orders)
      this.$store.commit('setAllLoads', this.userLoads)
      this.$router.push({name: val})
    }
  },

}
</script>

<style scoped>
.container{
  background: #fff;
  height: 100vh;
}
ul {
  list-style: none;
  padding: 10px 0px;
}
.action{
    margin: 15px 0px 30px;
    padding: 10px;
}
.title{
  margin: 20px 10px;
}
.action img{
    width: 40%;
}
.action-element{
    font-size: 13px;
}
.name-action{
  padding: 0px 10px
}
</style>