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
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  mounted() {
    this.$store.commit("setCurrent", {
      menuName: "Tus Cargas",
      componentName: "home",
    });
    window.location.href = '#Hoy'
  },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  data() {
    return {
      dateLoad: ["Ayer", "Hoy", "Mañana"],
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
body {
  background: black;
}
.button {
  background-color: #004a7f;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  border: none;
  color: #ffffff;
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
  0% {
    background-color: #b20000;
    -webkit-box-shadow: 0 0 3px #b20000;
  }
  50% {
    background-color: #ff0000;
    -webkit-box-shadow: 0 0 40px #ff0000;
  }
  100% {
    background-color: #b20000;
    -webkit-box-shadow: 0 0 3px #b20000;
  }
}

@-moz-keyframes glowing {
  0% {
    background-color: #b20000;
    -moz-box-shadow: 0 0 3px #b20000;
  }
  50% {
    background-color: #ff0000;
    -moz-box-shadow: 0 0 40px #ff0000;
  }
  100% {
    background-color: #b20000;
    -moz-box-shadow: 0 0 3px #b20000;
  }
}

@-o-keyframes glowing {
  0% {
    background-color: #b20000;
    box-shadow: 0 0 3px #b20000;
  }
  50% {
    background-color: #ff0000;
    box-shadow: 0 0 40px #ff0000;
  }
  100% {
    background-color: #b20000;
    box-shadow: 0 0 3px #b20000;
  }
}

@keyframes glowing {
  0% {
    background-color: #b20000;
    box-shadow: 0 0 3px #b20000;
  }
  50% {
    background-color: #ff0000;
    box-shadow: 0 0 40px #ff0000;
  }
  100% {
    background-color: #b20000;
    box-shadow: 0 0 3px #b20000;
  }
}
</style>
