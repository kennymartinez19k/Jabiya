<template>
  <div class="cnt">
   
    <ion-loading
    :is-open="isOpenRef"
    cssClass="my-custom-class"
    message="Por favor Espere..."
    :duration="timeout"
    @didDismiss="setOpen(false)"
  >
  </ion-loading>
  <Loading :active="loaded" color="rgb(86, 76, 175)" loader="spinner" :width="65" background-color="rgba(252, 252, 252, 0.7)"></Loading>
  <div v-for="date in dateLoad" :id="date" :key="date">
    <load-date :userOrden="userOrden" :date="date"/>
  </div>    
  </div>
</template>

<script>
import LoadDate from "./loadDate.vue";
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";
import Loading from "vue-loading-overlay";
import moment from 'moment'
import 'moment/locale/es'
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  mounted() {
    window.location.href = '#Hoy'
    moment.locale('es')
  },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  data() {
    return {
      loaded: false,
      userOrden: [
        {
          hour: "10:00 Am",
          status: "Asignada",
          client: "Juan Perez",
          numberOfOrden: 2177,
          zone: "Rep. de colombia",
          btnAction: "Cargar Vehiculo",
          icon: "color: #1f7a18",
        },
        {
          hour: "12:00 PM",
          status: "Entregada",
          client: "Maria Hernandez",
          numberOfOrden: 1883,
          zone: "Respaldo Rodeo",
          btnAction: "Ver Orden(es)",
          icon: "color: #000000",
        },
        {
          hour: "10:00 AM",
          status: "En Ruta",
          client: "Juan Perez",
          numberOfOrden: 2238,
          zone: "Rep. de colombia",
          btnAction: "Continuar Entrega(s)",
          icon: "color: #a7a7a7",
        },
        {
          hour: "10:00 AM",
          status: "En Ruta",
          client: "Juan Perez",
          numberOfOrden: 2833,
          zone: "Rep. de colombia",
          btnAction: "Continuar Entrega(s)",
          icon: "color: #a7a7a7",
        },
        {
          hour: "10:00 AM",
          status: "Despacho Aprobado",
          client: "Juan Perez",
          numberOfOrden: 2993,
          zone: "Rep. de colombia",
          btnAction: "Comenzar Entrega(s)",
          icon: "color: #c39108",
        },
      ],
    };
  },
  computed:{
    dateLoad: function () {
      return [this.yesterdayLoad, this.todayLoad, this.tomorrowLoad]
    },
    yesterdayLoad: () => {
      var date = new Date().setDate(new Date().getDate() -1 )
      return moment(new Date(date)).format('ll')
    },
    todayLoad: () => {
      return 'Hoy'
    },
    tomorrowLoad: () => {
      var date = new Date().setDate(new Date().getDate() +1 )
      return moment(new Date(date)).format('ll') 
    }
  },
  components: {
    IonLoading,
    Loading,
    LoadDate,
  },
  props: {
    timeout: { type: Number, default: 1000 },
  },
  methods: {
    setOpe(val) {
      this.loaded = val;
      setTimeout(() => {
        this.loaded = false;
      }, 2000);
    },
  },
};
</script>

<style scoped>
.cnt {
  height: 100%;
  overflow: scroll;
}
</style>
