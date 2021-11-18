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
  <div v-for="date in dateLoad" :key="date">
    <load-date :userOrden="userOrden" :date="date"/>
  </div>
    
  </div>
</template>

<script>
import LoadDate from './loadDate.vue'
import { ref } from 'vue';
import { IonLoading } from '@ionic/vue'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
  mounted() {
    this.$store.commit("setCurrent", {
      menuName: "Carga de Ordenes",
      componentName: "home",
    });
    
  },
  setup(){
    const isOpenRef = ref(false);
    const setOpen = (state) => isOpenRef.value = state;

    return { isOpenRef, setOpen }
  },
  data() {
    
    return {
      dateLoad: [
      'Ayer',
      'Hoy',
      'Mañana'
    ],
      loaded: false,
      userOrden: [ 
        {
          hour: '10:00 Am',
          status: 'Asignada',
          client: 'Juan Perez',
          numberOfOrden: 2,
          zone: 'Rep. de colombia',
          btnAction: 'Cargar Vehiculo',
          icon: 'color: #1f7a18',
          action: () => {
            this.$router.push({ name: "orders" }).catch(() => {})
          }
        },
        {
          hour: '12:00 PM',
          status: 'Entregada',
          client: 'Maria Hernandez',
          numberOfOrden: 1,
          zone: 'Respaldo Rodeo',
          btnAction: 'Ver Orden(es)',
          icon: 'color: #000000',
          action: () => {
            this.$router.push({ name: "orders" }).catch(() => {})
          }
        },{
          hour: '10:00 AM',
          status: 'En Ruta',
          client: 'Juan Perez',
          numberOfOrden: 2,
          zone: 'Rep. de colombia',
          btnAction: 'Continuar Entrega(s)',
          icon: 'color: #a7a7a7',
          action: () => {
            this.setOpe(true)
            // this.$router.push({ name: "orders" }).catch(() => {})
          }
        },
        {
          hour: '10:00 AM',
          status: 'En Ruta',
          client: 'Juan Perez',
          numberOfOrden: 2,
          zone: 'Rep. de colombia',
          btnAction: 'Continuar Entrega(s)',
          icon: 'color: #a7a7a7',
          action: () => {
            this.setOpen(true)
            // this.$router.push({ name: "orders" }).catch(() => {})
          }
        },
        {
          hour: '10:00 AM',
          status: 'Despacho Aprobado',
          client: 'Juan Perez',
          numberOfOrden: 2,
          zone: 'Rep. de colombia',
          btnAction: 'Comenzar Entrega(s)',
          icon: 'color: #c39108',
          action: () => {
            this.$router.push({ name: "orders" }).catch(() => {})
          }
        },
      ],
    };
  },
  components:{
    IonLoading,
    Loading,
    LoadDate
  },
  props: {
    timeout: { type: Number, default: 1000 },
  },
  methods:{
    setOpe (val) {
      this.loaded = val
      setTimeout(()=>{
        this.loaded= false
      }, 2000)
    },
}
}
</script>

<style scoped>
.cnt {
  height: 100%;
  overflow: scroll;
}
body {
  background: black;
}
.button {
  background-color: #004A7F;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  border: none;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: Arial;
  font-size: 20px;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  -webkit-animation: glowing 1500ms infinite;
  -moz-animation: glowing 1500ms infinite;
  -o-animation: glowing 1500ms infinite;
  animation: glowing 1500ms infinite;
}
@-webkit-keyframes glowing {
  0% { background-color: #B20000; -webkit-box-shadow: 0 0 3px #B20000; }
  50% { background-color: #FF0000; -webkit-box-shadow: 0 0 40px #FF0000; }
  100% { background-color: #B20000; -webkit-box-shadow: 0 0 3px #B20000; }
}

@-moz-keyframes glowing {
  0% { background-color: #B20000; -moz-box-shadow: 0 0 3px #B20000; }
  50% { background-color: #FF0000; -moz-box-shadow: 0 0 40px #FF0000; }
  100% { background-color: #B20000; -moz-box-shadow: 0 0 3px #B20000; }
}

@-o-keyframes glowing {
  0% { background-color: #B20000; box-shadow: 0 0 3px #B20000; }
  50% { background-color: #FF0000; box-shadow: 0 0 40px #FF0000; }
  100% { background-color: #B20000; box-shadow: 0 0 3px #B20000; }
}

@keyframes glowing {
  0% { background-color: #B20000; box-shadow: 0 0 3px #B20000; }
  50% { background-color: #FF0000; box-shadow: 0 0 40px #FF0000; }
  100% { background-color: #B20000; box-shadow: 0 0 3px #B20000; }
}

</style>

