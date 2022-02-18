<template>
  <div class="">
    <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Cargando Viajes..."
      :duration="timeOut"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>
    <div uk-margin style="position: relative">
      <ul class="uk-pagination" >
        <li @click="reloadNewDate(-1)"><span href="#"><span uk-pagination-previous></span><span uk-pagination-previous></span></span></li>
        <li><span>
          <p class="uk-text-meta uk-margin-remove-top date ">
              <label
                for="date"
                class="uk-text-bold uk-text-uppercase"
                style="font-size: 14px"
                >{{dateMoment}}</label
              >
            </p>    
        </span></li>
        <li @click="reloadNewDate(+1)"><span href="#"><span uk-pagination-next></span><span uk-pagination-next></span></span></li>
      </ul>
      <span class="refresh-reload">
        <font-awesome-icon @click="reloadData()" icon="redo-alt" class="reload" :class="{'reload-event': reloadEvent}"/>
        <span>&nbsp;Refrescar</span>
      </span>
    </div>

    
    <div v-if="assignedLoads == 0" style="height: 50px">
      <span>No Tiene Viajes Asignados Para Este Día</span>
    </div>
    <div
      v-show="assignedLoads > 0"
      v-for="(load, i) in loadsToDisplay"
      :key="i"
    >
      <div class="uk-card uk-card-default uk-width-1-2@m container">
        <div 
          class="load-default-status" 
          :class="{'load-delivered': load.loadingStatus.text == 'Delivered',
                  'load-assigned': load.loadingStatus.text == 'Driver selection in progress' || 
                  (load.loadingStatus.text == 'Expecting Approval' && !load.approvers[0].status),
                  'load-rejected': load.loadingStatus.text == 'Denied Approval'
                  }"
          >
          <div
          :class="{ 'load-edges': load.loadMapId === loadingProgress }"
            class="uk-card uk-card-body"
            @click="setLoad(load)"
          >
          <span class="uk-badge">{{i + 1}}</span>
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
import {LocalStorage} from '../mixins/LocalStorage'


export default {
  components: {
    IonLoading,
  },
  
  mixins: [Mixins, Profile, LocalStorage],
  alias: "Cargas Disponibles",
  data() {
    return {
      userType,
      userPosition,

      loaded: false,
      dateAvalaible: [],
      date: new Date(),
      dateMoment: null,
      assignedLoads: -1,
      timeOut: 25000,
      userInfo: {},
      reloadEvent: true,
      gets: null,
      posts: null,
      counter: 0,
      loadsToDisplay: [],
      waitingMessage: true
    };
  },

  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);
    return { isOpenRef, setOpen };
  },
  // async beforeMount() {
  //   this.setOpen(true);
  // },
  
  async mounted() {
      this.$store.commit('setUserData')
      this.$store.commit("setSettings", false);
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      moment.locale('en');
      window.location.href = "#Hoy";
      await this.currentDate();
      this.sortLoads()
      localStorage.removeItem('DeliveryCharges');

      setInterval(() => {
        if(!this.reloadEvent){
          this.reloadEvent = true
          this.currentDate()
        }
      }, 10000)
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
      if(val){
        this.waitingMessage = true
      }
      this.loads = []
      let contDate
      let date

      if (localStorage.getItem('dateCheck') && typeof val !== 'number') {
        contDate = localStorage.getItem('dateCheck');
        this.date = new Date(contDate);
      }else if(val){
        contDate = this.date.setDate(this.date.getDate() + val);
      }    
      else contDate = this.date
      date = moment(contDate).format("MM/DD/YYYY");
      localStorage.setItem('dateCheck', date)

      if (date === moment(new Date()).format('MM/DD/YYYY')) this.dateMoment = 'Hoy'
      else this.dateMoment = date
      this.setOpen(this.waitingMessage);
      let loads
      let currentLoads = JSON.parse(localStorage.getItem('allLoads'))
      
      try{
        loads = await this.$services.loadsServices.getLoadsbyDate(date);
      }catch(error){
        alert(error)
      }

      let loadsAcummulated = []
      for (let i = 0; i < loads.length; i++) {
        const load = {...loads[i]}
        
        let productScan = localStorage.getItem(JSON.stringify(load))
        if(productScan && (load.loadingStatus.text !== 'Approved' && load.loadingStatus.text !== 'Loading Truck')){
          localStorage.removeItem(JSON.stringify(load.loadMapId))
        }
        let loadDetails;
        try{
          loadDetails =  await this.$services.loadsServices.getLoadDetails(load?.loadMapId);
        }catch(error){
          alert(error)
        }
        Object.assign(load, loadDetails)

        if(!((loadDetails.loadingStatus.text === "Driver selection in progress" && this.userInfo.userType === this.userType.driver)
           || ( !loadDetails?.approvers[0]?.status && loadDetails.loadingStatus.text === "Expecting Approval" && this.userInfo.userType !== this.userType.provider )
             || (loadDetails?.loadingStatus?.text === 'Denied Approval' && loadDetails?.approvers[0]?.status == 'REJECTED' && this.userInfo.userType !== this.userType.provider)
             || (loadDetails?.loadingStatus?.text === 'Denied Approval' && loadDetails?.approvers[1]?.status == 'REJECTED' && this.userInfo.userType === this.userType.driver)
           )
        ){
          loadsAcummulated.push(loadDetails)
        }
      }
      this.setOpen(false)
      this.sortLoads()
      
      let dateInDisplay = localStorage.getItem('dateCheck');
      let date2 = moment(new Date(dateInDisplay)).format("MM/DD/YYYY");
    
      if (date2 == date && (JSON.stringify(loadsAcummulated) != JSON.stringify(currentLoads) || this.loadsToDisplay.length === 0)){
        this.waitingMessage = false
        this.loadsToDisplay = [...loadsAcummulated]
        this.assignedLoads = this.loadsToDisplay.length
        this.$store.commit("setAllLoadStore", this.loadsToDisplay);
        localStorage.setItem('allLoads', JSON.stringify(this.loadsToDisplay));
      }
      this.reloadEvent = false
    },
    reset(){
      this.gets = null
      this.posts = null
    },
    async setLoad(val) {
      this.setProfile(val)

      for(var i = 0; i < val.Orders.length; i++){
        let order =  await this.$services.loadsScanServices.getProduct(val.Orders[i]._id);
        val.firstOrdenInfo = val.Orders[i]
        Object.assign(val.Orders[i], order[0])
      }
      this.$store.commit("setloadStore", val);
      this.$store.commit("setDetailsLoadsStore", val);
      localStorage.setItem('DeliveryCharges', JSON.stringify(val));
      
        if(val.loadingStatus.text == 'Expecting Approval'){
          this.$router.push({ name: "load-status" }).catch(() => {});
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
      return this.setStatus(val)
    },
   
    setLocaleDate(val){
      return moment(val).format('LT')
    },
    ordenIsReturn(val){
      if (val.loadType === this.profile.b2b) return 'B2B'
      else{
        let res = val?.Orders?.find(x => x)
        if(res?.isReturn) return 'Devolver Contenedor'
        return 'Entregar Contenedor'
      }
    },
    isReturnLoad(val){
      return val.Orders.find(x => x.isReturn)
    },
    IsDelivered(load){
      let val = 'Delivered'
      this.changeRouteLoads(val, load)
    },
    reloadData(val = null){
      if(!this.reloadEvent){
        this.reloadEvent = true
        this.currentDate(val)
      }
    },
    reloadNewDate(val){
        this.reloadEvent = true
        this.currentDate(val)
    },
    sortLoads() {
      this.loadsToDisplay?.sort((a, b) => {
        a = new Date(a?.loadingStatus?.slotStartTime).getHours()
        b = new Date(b?.loadingStatus?.slotStartTime).getHours()
       return a - b
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

a {
  text-decoration: none;
  color: #fff;
}

.reject-img {
  width: 80px;
}

.show-date{
  color: red;
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
.load-assigned .status-load{
  color: rgb(212, 129, 5);
  -webkit-animation: asigned 500ms infinite;
}
.load-rejected .status-load{
  color: red;
}

.load-assigned{
  background: #fff6f6;
}
@-webkit-keyframes asigned {
  from { opacity: 1.0; }
  to { opacity: 0.8; }
}
.refresh-reload{
  display: flex;
  align-items: end;
  position: absolute;
  top: 0px;
  right: 5%;
  margin-top: 10px;
  font-size: 10px;
}
.reload{
  font-size: 17px;
  color: #333 !important;
  transition: all 0.6s ease;

}
.reload:active{
  color: red
}

.uk-badge{
  width: 22px;
  height: 22px;
  position: absolute;
  font-weight: 600;
  font-size: 14px;
  left: 10px;
  top: 10px;
}
.reload-event{
  transform: rotate(360deg);
  animation: reload 500ms infinite;
}
@keyframes reload{
  from{ 
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}



  
</style>
