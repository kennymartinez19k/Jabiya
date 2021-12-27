<template>
  <div class="container">
         <div class="">
    <ion-loading
    :is-open="isOpenRef"
    cssClass="my-custom-class"
    message="Por favor Espere..."
    :duration="timeout"
    @didDismiss="setOpen(false)"
  >
  </ion-loading>
  <Loading :active="loaded" color="rgb(86, 76, 175)" loader="spinner" :width="65" background-color="rgba(252, 252, 252, 0.7)"></Loading>
  </div>
      <ul class="uk-flex uk-flex-wrap uk-margin-remove" style="padding: 10px 0px; list-style: none">
          <h5 class="title uk-width-1-1 uk-text-center">Seleccione la Acción que Desea Realizar</h5>
          <li class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/box-truck.png" alt="">
                <p class="name-action"><strong>Ver Tus Viajes</strong></p>
          </li>
          <li v-if="permiso()" class="action uk-width-1-2" @click="changeRoute('orders-auto-scan')">
               <img src="../assets/cargo.png" alt="">
                <p class="name-action"><strong>Montar Viaje e Iniciar Ruta</strong> </p>
          </li>
          <li v-else class="action uk-width-1-2" @click="changeRoute('orders')">
               <img src="../assets/cargo.png" alt="">
                <p class="name-action"><strong>Montar Viaje e Iniciar Rutaaa</strong> </p>
          </li>
          <li v-if="settings?.AutoScan" class="action uk-width-1-2" @click="changeRoute('delivery-actions-auto')">
              <img src="../assets/deliver-container.png" alt="">
            <p class="name-action"><strong>Procesar Entrega del Contenedor</strong> </p>
          </li>
          <li v-else class="action uk-width-1-2" @click="changeRoute('deliveryActions')">
            <img src="../assets/deliver-container.png" alt="">
            <p class="name-action"><strong>Procesar Entrega del Contenedor</strong> </p>
          </li>
          <li v-if="settings?.AutoScan === false" class="action uk-width-1-2" @click="changeRoute('')">
               <img src="../assets/invoice.png" alt="">
                <p class="name-action"><strong>Procesar Factura</strong> </p>
          </li>
          <li v-if="settings?.AutoScan === false" class="action uk-width-1-2" @click="changeRoute()">
              <img src="../assets/almacen.png" alt="">
                <p class="name-action"><strong>Reconciliación con Almacén</strong></p>
          </li>
          <li class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/reject-container.png" alt="">
                <p class="name-action"><strong>Procesar Rechazo del Contenedor</strong></p>
          </li>
           <li v-if="permiso()" class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/return-container.png" alt="">
                <p class="name-action"><strong>Devolver Contenedor</strong></p>
          </li>
      </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Loading from "vue-loading-overlay";
import { IonLoading } from "@ionic/vue";
import "vue-loading-overlay/dist/vue-loading.css";
import Uikit from 'uikit'

export default {
  components: {
    IonLoading,
    Loading,
  },
    data() {
    return {
      load: null,
      loaded: false,
      Loads: null,
      check: null,

      userLoads: [
        {
          date: new Date(),
          hour: "10:00 Am",
          status: "Asignada",
          shipper: "Juan Perez",
          loadNumber: 2177,
          shipperZone: "Rep. de colombia",
          btnAction: "Montar Viaje",
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
      'settings', "userData"
    ]),
  },
  async beforeMount(){
    this.$store.commit("setloadStore", null);
    this.$store.commit("scanOrder", null);
    
    this.$emit(
        "deliveryActions",
        ``
      );
    await this.call()
  
  },

  methods: {
    ...mapActions([
      'hasPermission'
    ]),
    async permiso(){
      let a = await this.hasPermission('sendInfo')
      console.log(a)
      return a
    },
    async call(){
       this.loaded = true;
       this.Loads = await this.$services.loadsServices.getLoads();
       this.loaded = false;
       console.log(this.Loads)
    },
    openMenu(){
      this.positionSticky = true
      Uikit.offcanvas('#offcanvas-overlay').show();  
    },
    hideMenu(){
        this.positionSticky = false
        Uikit.offcanvas('#offcanvas-overlay').hide();
    },
    
    async changeRoute(val){
      await this.getLoadsId(val.loadId)
      if (await this.Loads){
        this.$store.commit('setAllLoads', this.Loads)
        this.$router.push({name: val})
      }
    },
    setCurrentPage(val) {
        this.$router.push({ name: val}).catch(() => {})
        this.hideMenu()
    },
    async getLoadsId (val) {
      const result = await this.$services.loadsServices.getLoadsbyId(val)
      this.$store.commit("setloadProductStore", result);

    }
  },

}
</script>

<style scoped>
.container{
  background: #fff;
  height: 100vh;
  padding-top: 20px;
}

.action{
    margin: 17px 0px;
}
.title{
  margin: 0px 10px 10px;
}
.action img{
    width: 45%;
}
.action-element{
    font-size: 13px;
}
.name-action{
  padding: 0px 10px
}
.close-navbar{
    width: 25px;
    right: 5px;
    top: 10px;
}
.uk-list-divider>li:nth-child(n+2) {
    padding-top: 10px;
    border-top: 1px solid #e0e0e0
}
.info-user{
    box-sizing: border-box;
    background: #2a307c;
    padding: 20px;
    width: 100%;
    height: 30%;
}
.uk-offcanvas-bar{
    background: #fff;
    width: 250px
}
.nav-opt{
  color: #000;
  text-align: initial;
}
.nav-opt li{
  padding: 20px;
}
</style>