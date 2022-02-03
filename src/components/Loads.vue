<template>
  <div class="">
    <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeOut"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>
<ul class="uk-pagination" uk-margin>
    <li @click="currentDate(-1)"><span href="#"><span uk-pagination-previous></span><span uk-pagination-previous></span></span></li>
    <li><span>
      <p class="uk-text-meta uk-margin-remove-top date">
        <time
          class="uk-text-bold uk-text-uppercase"
          style="font-size: 14px"
          >{{dateMoment}}</time
        >
      </p>      
    </span></li>
    <li @click="currentDate(+1)"><span href="#"><span uk-pagination-next></span><span uk-pagination-next></span></span></li>
    <font-awesome-icon @click="reloadData()" icon="redo-alt" class="reload"/>
</ul>

    <div v-if="assignedLoads == 0" style="height: 50px">
      <span>No Tiene Viajes Asignados Para Este Día</span>
    </div>
    <div
      v-show="assignedLoads > 0"
      v-for="(load, i) in loads"
      :key="i"
    >
      <div class="uk-card uk-card-default uk-width-1-2@m container">
        <div 
          class="load-default-status" 
          :class="{'load-delivered': load.loadingStatus.text == 'Delivered', 'load-assigned': load.loadingStatus.text == 'Driver selection in progress'}">
          <div
          :class="{ 'load-edges': load.loadMapId === loadingProgress }"
            class="uk-card uk-card-body"
            @click="setLoad(load)"
          >
           <p class="uk-flex status-load">
                <span class="uk-text-bold">{{ loadStatus(load) }}</span>
            </p>
          <div class="uk-flex uk-flex-between uk-flex-middle">

            <div style="margin-top: 32px !important">
              <div>
                  <p class="uk-flex">
                    <span>{{ load?.loadNumber }}</span>
                  </p>
              </div>
              <div class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">No de Orden:&nbsp;</p>
                <span v-for="order of load.Orders" :key="order">{{order.order_num}}</span>
              </div>
              <div class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">Tipo:&nbsp;</p>
                <span>{{ordenIsReturn(load)}}</span>
              </div>
              <div class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">Fecha de Recogida:&nbsp;</p>
                <span>{{load?.dateTime?.date}} {{setLocaleDate(load.loadingStatus.slotStartTime)}}</span>
              </div>

              <div class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">Fecha de Entrega:&nbsp;</p>
                <span>{{load?.dateTime?.date}} {{setLocaleDate(load.loadingStatus.slotEndTime)}}</span>
              </div>

              <div v-if="userInfo?.userType != userType?.driver">
                <div class="uk-flex uk-flex-middle">
                  <p class="uk-text-bold">Chofer:&nbsp;</p>
                   <span v-for="info of load?.Vehicles" :key="info">
                     {{info?.driver}}
                    </span>
                </div>
                <div class="uk-flex uk-flex-middle">
                  <p class="uk-text-bold">Vehiculo:&nbsp;</p>
                    <span v-for="info of load?.Vehicles" :key="info">
                      {{ info?.brand }} {{ info?.model }} {{ info?.color }}, Placa:
                      {{ info?.license_no }}
                   </span>
                </div>
              </div>

               </div>
              <div class="start-load">
                <font-awesome-icon icon="arrow-right" style="font-size: 20px" />
              </div>

            </div>
            <div class="uk-flex uk-flex-between">
            </div>
          </div>
          <div v-show="load.length <= 1" style="height: 50px">
            <span>No Tiene Viajes Asignados Para Este Día</span>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";
import moment from "moment";
import "moment/locale/es";
import { mapGetters } from "vuex";
import { Mixins } from "../mixins/mixins";
import { Profile } from "../mixins/Profile"
import { userType, userPosition } from '../types'

export default {
  components: {
    IonLoading,
  },
  
  mixins: [Mixins, Profile],
  alias: "Cargas Disponibles",
  data() {
    return {
      userType,
      userPosition,

      loaded: false,
      loads: [],
      dateAvalaible: [],
      date: new Date(),
      dateMoment: null,
      assignedLoads: -1,
      timeOut: 20000,
      userInfo: {}
    };
  },

  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  async beforeMount() {
    this.setOpen(true);

  },
  
  async mounted() {
      this.$store.commit('setUserData')
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      moment.locale('en');
      window.location.href = "#Hoy";
      this.setProfile()
      await this.currentDate();
      
      this.sortLoads()
      localStorage.removeItem('DeliveryCharges');
      if(!localStorage.getItem('setting')){
        this.$store.commit("setSettings", null);
      }
  },
  computed: {
    ...mapGetters(["allLoadsStore", "settings", "userData"]),

    loadingProgress: function () {
     
      return JSON.parse(localStorage.getItem('loadingProgress'));
    },
  },

  methods: {
    setOpe(val) {
      this.loaded = val;
      setTimeout(() => {
        this.loaded = false;
      }, 2000);
    },
    async currentDate(val = null) {
      this.assignedLoads = -1
      let contDate
      if (JSON.parse(localStorage.getItem('dateCheck')) && typeof val !== 'number') {
        contDate = JSON.parse(localStorage.getItem('dateCheck'));
        this.date = new Date(contDate);
      }else if(val) contDate = this.date.setDate(this.date.getDate() + val);   
      else contDate = this.date
      var date = moment(contDate).format("MM/DD/YYYY");

       if (date === moment(new Date()).format('MM/DD/YYYY')) this.dateMoment = 'Hoy'
      else this.dateMoment = date
      this.setOpen(true);
      
      let loads = await this.$services.loadsServices.getLoadsbyDate(date);

      for (let i = 0; i < loads.length; i++) {
        const load = {...loads[i]}
        const loadDetails =  await this.$services.loadsServices.getLoadDetails(load?.loadMapId);

        Object.assign(load, loadDetails)

        if(!((loadDetails.loadingStatus.text == "Driver selection in progress" && this.userInfo.userType === this.userType.driver) || ( !loadDetails?.approvers[0]?.status && loadDetails.loadingStatus.text == "Expecting Approval" && this.userInfo.userType !== this.userType.provider ))){
          this.loads.push(loadDetails)
        }
      }
      this.setOpen(false);

      this.assignedLoads = this.loads.length

      console.log(this.loads);
      this.$store.commit("setAllLoadStore", this.loads);
      localStorage.setItem('AllLoadS', JSON.stringify(this.loads));

    },
    async setLoad(val) {
      console.log(val);
        for(var i = 0; i < val.Orders.length; i++){
          let order =  await this.$services.loadsScanServices.getProduct(val.Orders[i]._id);
          val.firstOrdenInfo = val.Orders[i]
          Object.assign(val.Orders[i], order[0])
        }
      this.$store.commit("setloadStore", val);
      this.$store.commit("setDetailsLoadsStore", val);
      localStorage.setItem('DeliveryCharges', JSON.stringify(val));
      
      if(val.loadingStatus.text == 'Expecting Approval' && !val.approvers[0].status){
        this.$router.push({ name: "confirm-trip" }).catch(() => {});
      }else{
        this.$router.push({ name: "details-load" }).catch(() => {});
      }
    },
    changeRoute(path) {
      this.$router.push({ name: path }).catch(() => {});
    },

    loadIsReject(val) {
      if (
        val?.loadingStatus?.text == "Approved" &&
        val?.approvers?.some((x) => x.status != "ACCEPTED")
      )
        return false;
      else return true;
    },
    loadIsAccepted(val) {
      if (
        val?.loadingStatus?.text == "Approved" &&
        val?.approvers?.every((x) => x.status == "ACCEPTED")
      )
        return true;
      else return false;
    },

    shipperName(val) {
      var shipper = val?.shipper?.find((x) => x.name);
      return shipper?.name;
    },
    loadStatus(val) {
      if (val?.loadingStatus?.text == "Defining Load") return "Definiendo Carga"
      if (val?.loadingStatus?.text == "Driver selection in progress") return "Esperando Asignación del Chofer"
      if (val?.loadingStatus?.text == "Expecting Approval" && !val?.approvers[0].status) return "Esperando Aprobación $Profit Flai";
      if (val?.loadingStatus?.text == "Expecting Approval" && val?.approvers[0].status) return "Esperando Chofer Apruebe Viaje";

      if (val?.loadingStatus?.text == "Approved") return "Viaje Aprobado";
      if (val?.loadingStatus?.text == "Driver Arrival") return "Chofer Llegó a Recoger";
      if (val?.loadingStatus?.text == "Dispatched") return "Listo Para Entregar";
      if (val?.loadingStatus?.text == "Loading truck") return "Cargando Vehiculo";
      if (val?.loadingStatus?.text == "Delivered") return "Viaje Entregado";
    },
   
    setLocaleDate(val){
      return moment(val).format('LT')
    },
    ordenIsReturn(val){
      let res = val?.Orders?.find(x => x)
      if(res?.isReturn) return 'Devolver Contenedor'
      return 'Entregar Contenedor'
    },
    isReturnLoad(val){
      return val.Orders.find(x => x.isReturn)
    },
    IsDelivered(load){
      let val = 'Delivered'
      if(load.loadingStatus.text == val){
        this.changeRouteLoads(val, load)
      }
    },
    reloadData(){
      this.loads = []
      this.currentDate()
    },
    sortLoads() {
      this.loads?.sort((load) => {
        if (load?.loadMapId !== this.loadingProgress) {
          return 1;
        } else {
          return -1;
        }
      });
    },
  },
};
</script>

<style scoped>
p {
  margin: 3px 0px !important;
}
.uk-card {
  padding: 20px 10px;
}
.uk-card-body {
  border-radius: 2px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  align-items: center;
  padding: 16px 10px;
}
.container {
  padding: 5px 14px 5px;
  box-shadow: 0px 0px;
}
.date {
  background: #2535ff21;
  color: #000;
  border-radius: 5px;
  padding: 1px 10px;
}
.icon-load {
  width: 60px;
  margin-bottom: 10px;
}
.info-user {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.info-user div{
  width: 45%;
}
.info-user p {
  margin-right: 10px !important;
}
.info-user strong {
  font-size: 12px !important;
}
.check-load {
  position: absolute;
  z-index: 1;
  right: 69px;
  width: 24px;
  top: 34px;
  color: #00b200;
  font-size: 22.5px;
}
.btn {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-left: 10px;
  min-width: 125px;
}
button {
  font-size: 9px !important;
  line-height: 15px;
}
.assigned {
  color: rgb(73 73 73);
}
.assigned button {
  color: green;
  border: 1px solid #009b08;
  font-weight: 700;
  box-shadow: 0px 0.5px 2px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  display: inline-block;
  padding: 5px 10px;
  -webkit-animation: glowing 800ms infinite;
}
body {
  background: black;
}

@-webkit-keyframes glowing {
  0% {
    background-color: transparent;
    -webkit-box-shadow: 0 0 1px #146d02;
  }
  50% {
    background-color: transparent;
    -webkit-box-shadow: 0 0 5px #025a11;
  }
  100% {
    background-color: transparent;
    -webkit-box-shadow: 0 0 0px #02691c;
  }
}

.only-black,
.delivered,
.driver-arrival,
.approved {
  color: rgb(130, 127, 127) !important;
}
.delivered button,
.driver-arrival button,
.approved button,
.expectingApprove button {
  background: #ffffff;
  color: rgb(73, 73, 73);
  border: 1px solid rgb(136, 136, 136);
  /* color: #252525; */
  font-weight: 700;
}
.onWay {
  color: rgb(73 73 73);
}

.onWay button {
  color: green;
  background: #fff;
  font-weight: 700;
  border: 1px solid #3c6e3c;
}

.orange-flashing {
  color: rgb(199, 194, 194);
}
.orange-flashing button {
  box-shadow: 0px 0.5px 3px #c58002;
  color: #af7202;
  background: #ffffff;
  border: 1px solid #ccc;
  font-weight: 700;
  -webkit-animation: onWays 800ms infinite;
}
@-webkit-keyframes onWays {
  0% {
    -webkit-box-shadow: 0 0 1px #c58002;
  }
  50% {
    -webkit-box-shadow: 0 0 5px #a06800;
  }
  100% {
    -webkit-box-shadow: 0 0 0px #d38a02;
  }
}
a {
  text-decoration: none;
  color: #fff;
}
.rainbow-button {
  width: calc(20vw + 6px);
  height: calc(8vw + 6px);
  background-image: linear-gradient(
    90deg,
    #00c0ff 0%,
    #ffcf00 49%,
    #fc4f4f 80%,
    #00c0ff 100%
  );
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-size: 3vw;
  font-weight: bold;
}
.rainbow-button:after {
  content: attr(alt);
  width: 20vw;
  height: 8vw;
  background-color: #191919;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rainbow-button:hover {
  animation: slidebg 2s linear infinite;
}

@keyframes slidebg {
  to {
    background-position: 20vw;
  }
}
footer {
  position: relative;
  width: 400px;
  height: 100px;
}

footer .circle-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top: 5px solid #fff;
  animation: animate 1.5s infinite linear;
}
footer #scroll-trigger {
  height: 50px;
}
.reject-img {
  width: 80px;
}

.show-date{
  color: red;
}
footer .circle-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top: 5px solid #fff;
  animation: animate 1.5s infinite linear;
}
footer #scroll-trigger {
  height: 50px;
}
.uk-pagination{
  justify-content: center;
      align-items: center;
}
.status-load{
  justify-content: flex-end;
  position: absolute;
  top: 5px;
  right: 10px;
}
.status-load span{
    font-size: 16px !important;

}
.start-load{
  padding-right: 5px ;
}
.load-edges{
  border: 4.1px solid #f92b2b;
}
.load-delivered{
  background: #fafffa
}
.load-default-status .status-load{
  color: #286dd9;
}
.load-delivered .status-load{
  color: green !important;
}
.reload{
  position: absolute;
    right: 10%;
    margin-top: 5px;
    font-size: 17px;
    color: #000 !important;
}
.load-assigned .status-load{
  color: red
}
</style>
