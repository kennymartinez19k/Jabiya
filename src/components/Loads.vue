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
    <load-date :userOrden="loads" :date="date"/>
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
import { mapGetters } from 'vuex';
export default {
  
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  mounted(){
    window.location.href = '#Hoy'
    moment.locale('es')
    console.log(this.loads)
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
    ...mapGetters([
      'loads'
    ]),
    dateLoad: function () {
      var yesterday = new Date().setDate(new Date().getDate() -1 )
      yesterday = moment(new Date(yesterday)).format('ll')

      var today = 'Hoy'

      var tomorrow = new Date().setDate(new Date().getDate() +1 )
      tomorrow = moment(new Date(tomorrow)).format('ll') 

      return [yesterday, today, tomorrow]

    },
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
