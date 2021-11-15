<template>
  <div class="cnt">
    <div class="uk-card uk-card-default uk-width-1-2@m container">
      <div class="uk-card-header" style="padding-top: 5px !important">
        <div class="uk-width-expand uk-flex uk-flex-center">
          <p class="uk-text-meta uk-margin-remove-top date">
            <time datetime="2016-04-01T19:00">Hoy</time>
          </p>
        </div>
      </div>
  <ion-loading
    :is-open="isOpenRef"
    cssClass="my-custom-class"
    message="Por favor Espere..."
    :duration="timeout"
    @didDismiss="setOpen(false)"
  >
  </ion-loading>
  <Loading :active="loaded" color="rgb(86, 76, 175)" loader="spinner" :width="65" background-color="rgba(252, 252, 252, 0.7)"></Loading>
      <div>
        <div
          v-for="orden in userOrden"
          :key="orden"
          class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        >
          <div class="uk-text-left info-user">
            <p><strong> Estado: </strong><span>{{orden.status}}</span></p>
            <p><strong>Cliente: </strong> <span>{{orden.client}}</span></p>
            <p><strong>No. de Orden(es): </strong>{{orden.numberOfOrden}}<span>2</span></p>
            <p><strong>Zona: </strong><span>{{orden.zone}}</span></p>
          </div>
          <div class="btn">
            <div >
            <span>{{orden.hour}}</span>
            <div style="margin-top: 1px">
              <font-awesome-icon class="icon-load" icon="truck-moving" />
            </div>
          </div>
            <button class="uk-button uk-button-purple" @click="setOpen(true)">{{orden.btnAction}}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="uk-card uk-card-default uk-width-1-2@m container">
      <div class="uk-card-header" style="padding: 5px 0px 10px !important">
        <div class="uk-width-expand uk-flex uk-flex-center">
          <p class="uk-text-meta uk-margin-remove-top date">
            <time datetime="2016-04-01T19:00">Ayer</time>
          </p>
        </div>
      </div>
      <div>
        <div
          class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        >
          <div class="uk-text-left info-user">
            <p><strong> Estado: </strong><span>Asignada</span></p>
            <p><strong>Cliente: </strong> <span>Juan Perez</span></p>
            <p><strong>No. de Orden(es): </strong><span>2</span></p>
            <p><strong>Zona: </strong><span>Rep. de Colombia</span></p>
          </div>
          <div class="btn">
            <div >
            <span>10:00 AM</span>
            <div style="margin-top: 1px">
              <font-awesome-icon class="icon-load" icon="truck-moving" />
            </div>
          </div>
            <button class="uk-button uk-button-purple" @click="setOpe(true)">Cargar Vehiculo</button>
          </div>
        </div>
        <div
          class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        >
          <div class="uk-text-left info-user">
            <p><strong> Estado: </strong><span>Despacho aprobado</span></p>
            <p><strong>Cliente: </strong> <span>Juan Perez</span></p>
            <p><strong>No. de Orden(es): </strong><span>2</span></p>
            <p><strong>Zona: </strong><span>Rep. de Colombia</span></p>
          </div>
          <div class="btn">
            <div>
            <span>10:00 AM</span>
            <div style="margin-top: 1px">
              <font-awesome-icon class="icon-load" icon="truck-moving" />
            </div>
          </div>
            <button class="uk-button uk-button-purple">Comenzar Entrega(s)</button>
          </div>
        </div>
        <div
          class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        >
          <div class="uk-text-left info-user">
            <p><strong> Estado: </strong><span>En Ruta</span></p>
            <p><strong>Cliente: </strong> <span>Juan Perez</span></p>
            <p><strong>No. de Orden(es): </strong><span>2</span></p>
            <p><strong>Zona: </strong><span>Rep. de Colombia</span></p>
          </div>
          <div class="btn">
            <div>
            <span>10:00 AM</span>
            <div style="margin-top: 1px">
              <font-awesome-icon class="icon-load" icon="truck-moving" />
            </div>
          </div>
            <button class="uk-button uk-button-purple">Continuar Entrega(s)</button>
          </div>
        </div>
        <div
          class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        >
          <div class="uk-text-left info-user">
            <p><strong> Estado: </strong><span>Entregada</span></p>
            <p><strong>Cliente: </strong> <span>Juan Perez</span></p>
            <p><strong>No. de Orden(es): </strong><span>2</span></p>
            <p><strong>Zona: </strong><span>Rep. de Colombia</span></p>
          </div>
          <div class="btn">
            <div>
            <span>10:00 AM</span>
            <div style="margin-top: 1px">
              <font-awesome-icon class="icon-load" icon="truck-moving" />
            </div>
          </div>
            <button class="uk-button uk-button-purple">Ver Orden(es)</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { IonLoading } from '@ionic/vue'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
  components:{
    IonLoading,
    Loading
  },
  props: {
    timeout: { type: Number, default: 1000 },
  },
  methods:{
    setOpe (val) {
      this.loaded = val
    }
  },
  mounted() {
    this.$store.commit("setCurrent", {
      menuName: "Carga de ordenes",
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
      loaded: false,
      userOrden: [
        {
          hour: '10:00 Am',
          status: 'Asignada',
          client: 'Juan Perez',
          numberOfOrden: 2,
          zone: 'Rep. de colombia',
          btnAction: 'Cargar Vehiculo'
        },
        // {
        //   hour: '12:00 PM',
        //   status: 'Entregada',
        //   client: 'Maria Hernandez',
        //   numberOfOrden: 1,
        //   zone: 'Respaldo Rodeo',
        //   btnAction: 'Ver Orden(es)'
        // },{
        //   hour: '10:00 AM',
        //   status: 'En Ruta',
        //   client: 'Juan Perez',
        //   numberOfOrden: 2,
        //   zone: 'Rep. de colombia',
        //   btnAction: 'Continuar Entrega(s)'
        // },{
        //   hour: '10:00 AM',
        //   status: 'Despacho Aprobado',
        //   client: 'Juan Perez',
        //   numberOfOrden: 2,
        //   zone: 'Rep. de colombia',
        //   btnAction: 'Comenzar Entrega(s)'
        // },{
        //   hour: '10:00 AM',
        //   status: 'Asignada',
        //   client: 'Juan Perez',
        //   numberOfOrden: 2,
        //   zone: 'Rep. de colombia',
        //   btnAction: 'Cargar Vehiculo'
        // },
      ],
      loads: [
        { hours: "10:00 - 10:30", status: "Delivered" },
        { hours: "12:00 - 01:30", status: "Dispatched Approved" },
        { hours: "03:00 - 03:30", status: "Dispatched" },
        { hours: "04:00 - 04:30", status: "Assigned to Driver" },
        { hours: "05:00 - 05:30", status: "Delivered" },
        { hours: "10:00 - 10:30", status: "Delivered" },
        { hours: "12:00 - 01:30", status: "Dispatched Approved" },
        { hours: "03:00 - 03:30", status: "Dispatched" },
        { hours: "04:00 - 04:30", status: "Assigned to Driver" },
        { hours: "05:00 - 05:30", status: "Delivered" },
        { hours: "10:00 - 10:30", status: "Delivered" },
        { hours: "12:00 - 01:30", status: "Dispatched Approved" },
        { hours: "03:00 - 03:30", status: "Dispatched" },
        { hours: "04:00 - 04:30", status: "Assigned to Driver" },
        { hours: "05:00 - 05:30", status: "Delivered" },
        { hours: "10:00 - 10:30", status: "Delivered" },
        { hours: "12:00 - 01:30", status: "Dispatched Approved" },
        { hours: "03:00 - 03:30", status: "Dispatched" },
        { hours: "04:00 - 04:30", status: "Assigned to Driver" },
        { hours: "05:00 - 05:30", status: "Delivered" },
        { hours: "10:00 - 10:30", status: "Delivered" },
        { hours: "12:00 - 01:30", status: "Dispatched Approved" },
        { hours: "03:00 - 03:30", status: "Dispatched" },
        { hours: "04:00 - 04:30", status: "Assigned to Driver" },
        { hours: "05:00 - 05:30", status: "Delivered" },
        { hours: "10:00 - 10:30", status: "Delivered" },
        { hours: "12:00 - 01:30", status: "Dispatched Approved" },
        { hours: "03:00 - 03:30", status: "Dispatched" },
        { hours: "04:00 - 04:30", status: "Assigned to Driver" },
        { hours: "05:00 - 05:30", status: "Delivered" },
      ],
    };
  },
};
</script>

<style scoped>
.cnt {
  height: 100%;
  overflow: scroll;
}
.uk-card{
  padding: 20px 10px;
}
.uk-card-body{
  box-shadow: 0px 0.5px 1.2px;
  margin-bottom: 10px;
  align-items: center;
  padding: 16px 10px;
}
.container {
  padding: 10px 14px 5px;
  box-shadow: 0px 0px;
}
.uk-button {
  padding: 0px 5px !important;
  font-size: 12px;
}
p {
  margin: 4px 0px;
}
.date {
  background: #2535ff21;
  color: #000;
  border-radius: 5px;
  padding: 1px 8px;
}
.icon-load {
  font-size: 20px;
  margin-bottom: 10px;
}
.btn{
  display: flex;
  flex-direction: column;
  justify-content: end;
  margin-left: 10px;
  min-width: 125px;

}
button{
  font-size: 9px !important;
}

</style>

