<template>
  <div>
    <div class="stiky">
      <p style="font-size: 13px !important; font-weight: 500">
        {{ loadStore?.loadNumber }}
      </p>
      <div
        class="
          uk-flex
          uk-flex
          uk-flex-center
          uk-flex-left
          uk-margin-remove
          uk-padding-remove
        "
        style="align-items: center"
      >
        <div class="uk-flex uk-flex-wrap">
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Shipper: </span
            ><span>&nbsp; {{ shipperName(loadStore) }}</span>
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span
            ><span>&nbsp; {{ loadStore?.firstOrdenSector.sector }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="container">
      <h6>Seleccione el Siguiente Paso</h6>
      <ul class="progressbar">
        <li 
          :class="{active: loadStatus.step == step.expectingApproval, 'completed-status': loadStatus.step > step.expectingApproval}"
        >
          <div  
            class="info"><span>1</span>
          </div>

          <div
            @click="changeRoute('Expecting Approval')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus.expectingApproval}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('Expecting Approval')" v-if="loadStatus.step == step.expectingApproval" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.expectingApproval" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.expectingApproval" src="../assets/checklist-checked-box.png" />
          </div>
          <div class="disabled-container"></div>
        </li>
        <li
          :class="{active: loadStatus.step == step.approved, 'completed-status': loadStatus.step > step.approved}"
        >
           <div  
            class="info"><span>2</span>
          </div>
          <div
            @click="changeRoute('Approved')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus.approved}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('Approved')" v-if="loadStatus.step == step.approved" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.approved" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.approved" src="../assets/checklist-checked-box.png" />
          </div>
          <div class="disabled-container"></div>

        </li>
        <li :class="{active: loadStatus.step == step.truckLoaded, 'completed-status': loadStatus.step > step.truckLoaded}">
          <div  
            class="info"><span>3</span>
          </div>
          <div
            @click="changeRoute('Dispatched')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus.dispatch}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('Dispatched')" v-if="loadStatus.step == step.truckLoaded" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.truckLoaded" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.truckLoaded" src="../assets/checklist-checked-box.png" />
          </div>
          <div class="disabled-container"></div>
        </li>
        <li 
          :class="{active: loadStatus.step == step.delivered, 'completed-status': loadStatus.step > step.delivered}">
          
          <div class="info"><span>4</span></div>
          <div   
            @click="changeRoute('Deliver-Load')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus.delivered}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('Deliver-Load')" v-if="loadStatus.step == step.delivered" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.delivered" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.delivered" src="../assets/checklist-checked-box.png" />
          </div>
          <div class="disabled-container"></div>
        </li>
        <li 
          v-if="isReturn"
          :class="{active: loadStatus.step == step.returnContainer, 'completed-status': loadStatus.step > step.returnContainer}">
          <div class="info"><span>5</span></div>
          <div   
            @click="changeRoute('Delivered')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus.returnContainer}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('Delivered')" v-if="loadStatus.step == step.returnContainer" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.returnContainer" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.returnContainer" src="../assets/checklist-checked-box.png" />
          </div>
        </li>

     
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Mixins } from "../mixins/mixins";



export default {
  alias: "Manejo de Viaje",
 
  data() {
    return {
      step:{
        expectingApproval: 1,
        approved: 2,
        truckLoaded: 3,
        delivered: 4,
        returnContainer: 5
      },
      isReturn: false,
      statusDelivered: false,
      load: [],
    };
  },
 
  mixins: [Mixins],
  computed: {
    ...mapGetters(["loadStore", "startRoute", "finishDelivered"]),
    loadStatus() {
      let statusLoad = {};
      
      if (this.load?.loadingStatus?.text == "Expecting Approval"){
        statusLoad.expectingApproval = true;
        statusLoad.step = 1;
      }
      if (this.load?.loadingStatus?.text == "Approved" || this.load?.loadingStatus?.text == "Driver Arrival" || this.load?.loadingStatus?.text == "Loading Truck" ){
        statusLoad.approved = true;
        statusLoad.step = 2;
      }
      if (this.load?.loadingStatus?.text == "Dispatched" && !this.startRoute){
        statusLoad.dispatch = true;
        statusLoad.step = 3;
      }
      if (this.load?.loadingStatus?.text == "Dispatched" && this.startRoute == 1){
        statusLoad.delivered = true;
        statusLoad.step = 4;
      }
      if ( this.load?.loadingStatus?.text == 'Delivered'){
        statusLoad.returnContainer = true;
        statusLoad.step = 5;
      }

      return statusLoad;
    },
    messageStatus(){
      let message = {
        expectingApproval: 'Aprobar Viaje',
        approved: 'Montar Viaje',
        dispatch: 'Iniciar Ruta',
        delivered: 'Entregar al Cliente',
        returnContainer: 'Devolver Contenedor'
      }
      if(this.loadStatus.step > 1) message.expectingApproval = 'Viaje Aprobado'
      if(this.loadStatus.step > 2) message.approved = 'Viaje Montado'
      if(this.loadStatus.step > 3) message.dispatch = 'Ruta Iniciada'
      if(this.loadStatus.step > 4) message.delivered = 'Contenedor Entregado'
      if(this.loadStatus.step > 5) message.returnContainer = 'Contenedor Retornado'
      return message
    }
  },
  async mounted() {
    this.load = await this.$services.loadsServices.getLoadDetails(this.loadStore?.loadMapId);
    this.isReturn = this.load.Orders[0].isReturn
  },
  methods: {
    async changeRoute(val) {
      
      this.changeRouteLoads(val, this.load);
    },
    setInvoice() {
      this.$router.push({ name: "invoices-orders" }).catch(() => {});
    },
    shipperName(val) {
      var shipper = val?.shipper?.find((x) => x.name);
      return shipper?.name;
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  padding: 0px 10px;
  display: flex;
  flex-direction: column;
  z-index: 1;
}
.progressbar {
  list-style: none;
  display: flex;
  padding: 0px;
  width: 100%;
  margin-top: 20px;
  flex-direction: column;
}
.progressbar li {
  float: left;
  width: 100%;
  display: flex;
  height: 80px;
  position: relative;
  text-align: center;
}
.progressbar h6 {
  margin: 0px;
}
.progressbar li .item {
  height: 40px;
  width: 73%;
  margin-right: 10px;
  padding: 10px 0px;
  box-shadow: none;
  border: 1px solid #c0bdbd;
}
.progressbar li .icon-item {
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.icon-item img {
  width: 30px;
  height: 30px;
}
.icon-item .icon{
  font-size: 25px;
}
p {
  margin: 2px 0px !important;
}

.disabled {
  position: absolute;
  width: 90px;
  height: 70px;
  top: 40px;
  left: 10px;
  background: #ffffffc4;
}
img {
  width: 45%;
}
.progressbar li {
  float: left;
  width: 100%;
  position: relative;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0px;
  margin: 0px auto;
  display: flex;
  justify-content: center;
}

.progressbar li .info {
  content: "";
  width: 30px;
  height: 30px;
  border: 2px solid #a1a1a1;;
  display: block;
  margin: 0 5px;
  border-radius: 50%;
  line-height: 27px;
  background: white;
  color: #a1a1a1;;
  text-align: center;
  font-weight: bold;
}

.progressbar li:after {
  content: "";
  position: absolute;
  width: 1%;
  height: 55px;
  background: #979797;
  top: -53px;
  left: 5%;
  z-index: -1;
}
.progressbar li:first-child:after {
  content: none;
}
.progressbar li .disabled-container{
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
}

.progressbar li.completed-status + li:after {
  background: #3aac5d;
}
.progressbar li .active,
.progressbar li .info .info {
  border-color: #017625 !important;
  background: #017625 !important;
  color: white !important;
}

.progressbar .completed-status .info{
  border-color: #017625 !important;
  background: #017625 !important;
  color: white !important;
}
.progressbar .active .action{
  background: #017625;

}
.progressbar .active .action h6{
  color: #fff;
}

.progressbar .active .disabled-container {
  display:none !important;
}
.progressbar .completed-status .disabled-container{
  display: none !important;

}
.progressbar .completed-status .action{
  pointer-events: none;
}
.progressbar .completed-status .action h6{
  color: green
}

.progressbar li .active h6{
  color: #fff !important
}

</style>