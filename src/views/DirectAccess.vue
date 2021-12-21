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
      <a  class="uk-navbar-toggle uk-flex uk-flex-right" style="min-height: 55px !important; padding: 0px 15px !important" uk-navbar-toggle-icon  @click="openMenu" href="#"></a>
      <div id="offcanvas-overlay" uk-offcanvas="overlay: true">
    <div class="uk-offcanvas-bar uk-padding-remove">
            <img src="../assets/close.png" class="close-navbar uk-offcanvas-close" alt="" @click="hideMenu" srcset="">
        <div class="info-user">
            <img src="https://cdn-icons-png.flaticon.com/512/236/236831.png" style="width: 35% !important" alt="" srcset="">
            <h4 class="uk-text-light uk-margin-remove" style="margin: 5px 0px !important">Chofer 11</h4>
            <h6 class="uk-tect-light uk-margin-remove">Chofer11@gmail.com</h6>
        </div>
        <ul class="uk-list nav-opt uk-list-divider">
            <li @click="setCurrentPage('home')">Tus Cargas</li>
            <li @click="setCurrentPage('settings')">Configuracion</li>
            <li @click="setCurrentPage('sign-in')">Cerrar sesión</li>
            <li @click="setCurrentPage('about')">Version app</li>
        </ul>
    </div>
</div>
      <ul class="uk-flex uk-flex-wrap uk-margin-remove" style="padding: 10px 0px; list-style: none">
          <h5 class="title uk-width-1-1 uk-text-center">Seleccione la Acción que Desea Realizar</h5>
          <li class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/box-truck.png" alt="">
                <p class="name-action"><strong>Ver Tus Cargas</strong></p>
          </li>
          <li class="action uk-width-1-2" @click="changeRoute('orders-auto-scan')">
               <img src="../assets/container.png" alt="">
                <p class="name-action"><strong>Montar Viaje e Iniciar Ruta</strong> </p>
          </li>
          
          <li class="action uk-width-1-2" @click="changeRoute('deliveryActions')">
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
import { mapGetters } from 'vuex';
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
     
      Loads: null,
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
    await this.call()
  },

  methods: {
    async call(){
      var data = JSON.stringify({
        "email": "admin@flai.com.do",
        "password": "1"
      });
        this.loaded = true;
       const resultLogin = await this.$services.loadsServices.getLoads(data);
       console.log(resultLogin)
       this.loaded = false;
    },
    openMenu(){
      this.positionSticky = true
      Uikit.offcanvas('#offcanvas-overlay').show();  
    },
    hideMenu(){
        this.positionSticky = false
        Uikit.offcanvas('#offcanvas-overlay').hide();
    },
    
    changeRoute(val){
      this.$store.commit('setAllLoads', this.Loads)
      this.$router.push({name: val})
    },
    setCurrentPage(val) {
        this.$router.push({ name: val}).catch(() => {})
        this.hideMenu()
    },
  },

}
</script>

<style scoped>
.container{
  background: #fff;
  height: 100vh;
}

.action{
    margin: 15px 0px 30px;
    padding: 10px;
}
.title{
  margin: 0px 10px 10px;
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