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
    <header>
      <div uk-margin class="sub-header">
        <ul class="uk-pagination" >
          <li @click="reloadNewDate(-1)"><span href="#"><span uk-pagination-previous></span><span uk-pagination-previous></span></span></li>
          <li @click="setCalendar()" ><label style="padding: 0px">
            <Datepicker :clearable="false" ref="calendar" showNowButton="true" nowButtonLabel="AHORA" autoApply="true" locale="es-419" id="calendar" v-model="dateSelected"></Datepicker>
            <p class="uk-text-meta uk-margin-remove-top date ">
                <label
                  for="date"
                  class="uk-text-bold uk-text-uppercase web-font-small"
                  style="font-size: 14px"
                  >{{dateMoment}}</label
                >
              </p>    
          </label>
            
          
          </li>
          <li @click="reloadNewDate(+1)"><span href="#"><span uk-pagination-next></span><span uk-pagination-next></span></span></li>
        </ul>
        <span @click="reloadData()" class="refresh-reload web-font-small">
          <font-awesome-icon  icon="redo-alt" class="reload" :class="{'reload-event': reloadEvent}"/>
          <span>&nbsp;Refrescar</span>
        </span>
      </div>
    </header>
  
    <div class="section">
      <div v-if="assignedLoads == 0" style="height: 50px; width: 100%">
        <span>No Tiene Viajes Asignados Para Este Día</span>
      </div>
      <div
        class="item-section"
        v-show="assignedLoads > 0"
        v-for="(load, i) in loadsToDisplay"
        :key="i"
      >
        <div class="uk-card uk-card-default uk-width-1-2@m container">
          <div 
            class="load-default-status" 
            :class="{'load-delivered': load?.loadingStatus?.text == 'Delivered',
                    'load-assigned': load?.loadingStatus?.text == 'Driver selection in progress' || 
                    (load?.loadingStatus?.text == 'Expecting Approval' && !load?.approvers[0]?.status),
                    'load-rejected': load?.loadingStatus?.text == 'Denied Approval'
                    }"
            >
            <div
            :class="{ 'load-edges': load?.loadMapId === loadInProgress }"
              class="uk-card uk-card-body item-body"
              @click="setLoad(load)"
            >
            <span class="uk-badge">{{i + 1}}</span>
            <p class="uk-flex status-load ">
              <span class="uk-text-bold web-font-small">{{ loadStatus(load) }}</span>
            </p>
            <div class="uk-flex uk-flex-between uk-flex-middle">

              <div style="margin-top: 32px !important">
                <div>
                    <p class="uk-flex web-font-small">
                      <span>{{ load?.loadNumber }}</span>
                    </p>
                </div>
                <div class="uk-flex uk-flex-middle info-Order blue-text web-font-small">
                  <p class="uk-text-bold position-text ">No de Orden:&nbsp;</p>
                  <span v-for="(order, index) of load?.Orders" v-show="index < 3" :key="order">{{order?.order_num}}<span v-if="load?.Orders?.length > 1">, </span> </span>
                  <span v-if="load?.Orders?.length > 3">...</span>
                </div>
                <div v-if="userInfo?.userType != userType?.driver">
                  <div class="uk-flex uk-flex-middle info-Order blue-text web-font-small">
                    <p class="uk-text-bold position-text">Chofer:&nbsp;</p>
                    <span v-for="info of load?.Vehicles" :key="info">
                      {{info?.driver}}
                      </span>
                  </div>
                  <div class="uk-flex uk-flex-middle info-Order blue-text web-font-small">
                    <p class="uk-text-bold  position-text">Vehiculo:&nbsp;</p>
                      <span v-for="info of load?.Vehicles" :key="info">
                        {{ info?.brand }} {{ info?.model }} {{ info?.color }}, Placa:
                        {{ info?.license_no }}
                    </span>
                  </div>
                </div>
                 <div class="uk-flex uk-flex-middle web-font-small">
                  <p class="uk-text-bold">Cantidad de Productos:&nbsp;</p>
                  <span>{{productQuantity(load)}}</span>
                </div>
                <div class="uk-flex uk-flex-middle web-font-small">
                  <p class="uk-text-bold">Tipo:&nbsp;</p>
                  <span>{{ordenIsReturn(load)}}</span>
                </div>
                <div class="uk-flex uk-flex-middle web-font-small">
                  <p class="uk-text-bold">Fecha de Recogida:&nbsp;</p>
                  <span>{{load?.dateTime?.date}} {{setLocaleDate(load?.loadingStatus?.slotStartTime)}}</span>
                </div>

                <div v-if="load?.loadingStatus?.text !== 'Driver selection in progress'" class="uk-flex uk-flex-middle web-font-small">
                  <p class="uk-text-bold">Fecha de Entrega:&nbsp;</p>
                  <span>{{load?.dateTime?.date}} {{setLocaleDate(load?.loadingStatus?.slotEndTime)}}</span>
                </div>

                

                </div>
                <div class="start-load">
                  <font-awesome-icon icon="arrow-right" style="font-size: 20px" />
                </div>

              </div>
              <div class="uk-flex uk-flex-between">
              </div>
            </div>
            <div v-show="load?.length <= 1" style="height: 50px">
              <span>No Tiene Viajes Asignados Para Este Día</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup">
  <span class="popuptext" :class="{show: showPopUp}" id="myPopup">Hubo un Error al Enviar, Reintete de Nuevo!</span> 
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
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'

// import {App} from '@capacitor/app'


export default {
  components: {
    IonLoading,
    Datepicker
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
      waitingMessage: true,
      calendar: null,
      dateSelected: new Date(),
      showPopUp: false
    };
  },

  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);
    return { isOpenRef, setOpen };
  },

  async mounted() {
      this.calendar = this.$refs.calendar;
      this.$store.commit('setUserData')
      this.$store.commit("setSettings", false);
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      moment.locale('en');
      window.location.href = "#Hoy";
      await this.currentDate();

      setInterval(() => {
        if(!this.reloadEvent){
          this.reloadEvent = true
          this.currentDate()
        }
      }, 10000)
  },
  computed: {
    ...mapGetters(["allLoadsStore", "settings", "userData", "loadStore", "isQueueEmpty", "isRequestError"]),

    loadInProgress: function () {
      return JSON.parse(localStorage.getItem('loadInProgress'));
    },
  },
  watch:{
    dateSelected: function(newVal){
      this.currentDate({calendar: true, dateCalendar: newVal})
    },
    allLoadsStore: function(newVal){
      this.loadsToDisplay = newVal
    },
    isQueueEmpty: function(newVal){
      if(newVal){
        this.loadsToDisplay?.forEach(load => {
          if (load?.loadingStatus?.text === "Delivered") {
            localStorage.removeItem(`sendInfo${load.loadMapId}`);
          }
        })
      }
    },
    isRequestError: async function(newVal){
      if(newVal){
        this.showPopUp = true
        let delay = (ms) => new Promise((res) => setTimeout(res, ms));
        await delay(5000);
        this.showPopUp = false
      }
    }
    
  },
  
   methods: {
    setOpe(val) {
      this.loaded = val;
      setTimeout(() => {
        this.loaded = false;
      }, 2000);
    },
    async currentDate(val = null) {
      this.loads = []
      let contDate
      let date
      let loads
      if(val?.calendar){
        contDate = val?.dateCalendar
        this.date = contDate
      }
      else if (localStorage.getItem('dateCheck') && typeof val !== 'number') {
        contDate = localStorage.getItem('dateCheck');
        this.date = new Date(contDate);
      }else if(val){
        contDate = this.date.setDate(this.date.getDate() + val);
        this.date = new Date(contDate)
      }    
      else {
        contDate = this.date
      }

      date = moment(contDate).format("MM/DD/YYYY")
      let currentLoads = JSON.parse(localStorage.getItem('allLoads'))
  
      try{
        loads = await this.$services.loadsServices.getLoadsbyDate(date);
        if(val){
         this.waitingMessage = true
        }
        this.setOpen(this.waitingMessage);
        if (date === moment(new Date()).format('MM/DD/YYYY')) this.dateMoment = 'Hoy'
        else this.dateMoment = date

      }catch(error){
        console.log(error, 'no actualizo')
      this.setOpen(false)
        if(error.message == 'Network Error'){
          this.reloadEvent = false
          this.waitingMessage = false
          this.loadsToDisplay = JSON.parse(localStorage.getItem('allLoads'))
          this.assignedLoads = this.loadsToDisplay?.length
          
          let contDate = localStorage.getItem('dateCheck')
          let date = new Date(contDate);
          date = moment(contDate).format("MM/DD/YYYY");
           if (date === moment(new Date()).format('MM/DD/YYYY')) this.dateMoment = 'Hoy'
           else this.dateMoment = date
        }
        if(error.message == 'Request failed with status code 401'){
          console.log('unautorizo')
          //  this.$router.push({name: 'sign-in'})
        }
        return ;
      }   
      localStorage.setItem('dateCheck', date)

      let loadsAcummulated = []
      for (let i = 0; i < loads?.length; i++) {
        const load = {...loads[i]}
        
        let productScan = localStorage.getItem(JSON.stringify(load))
        if(productScan && (load?.loadingStatus?.text !== 'Approved' && load?.loadingStatus?.text !== 'Loading Truck')){
          localStorage.removeItem(JSON.stringify(load?.loadMapId))
        }
        let loadDetails;
        try{
          loadDetails =  await this.$services.loadsServices.getLoadDetails(load?.loadMapId);
        }catch(error){
          console.log(error)
        }
        Object.assign(load, loadDetails)

        if(!((loadDetails?.loadingStatus?.text === "Driver selection in progress" && this.userInfo?.userType === this.userType?.driver)
           || ( !loadDetails?.approvers[0]?.status && loadDetails?.loadingStatus?.text === "Expecting Approval" && this.userInfo?.userType !== this.userType?.provider )
             || (loadDetails?.loadingStatus?.text === 'Denied Approval' && loadDetails?.approvers[0]?.status == 'REJECTED' && this.userInfo?.userType !== this.userType?.provider)
             || (loadDetails?.loadingStatus?.text === 'Denied Approval' && loadDetails?.approvers[1]?.status == 'REJECTED' && this.userInfo?.userType === this.userType?.driver)
           )
        ){
          loadsAcummulated.push(loadDetails)
        }
      }
      this.setOpen(false)
      
      let dateInDisplay = localStorage.getItem('dateCheck');
      let date2 = moment(new Date(dateInDisplay)).format("MM/DD/YYYY");
      if (date2 == date && (JSON.stringify(loadsAcummulated) != JSON.stringify(currentLoads) || this.loadsToDisplay?.length === 0)){
        this.waitingMessage = false
        this.loadsToDisplay = [...loadsAcummulated]
        this.assignedLoads = this.loadsToDisplay?.length
        this.$store.commit("setAllLoadStore", this.loadsToDisplay);
        localStorage.setItem('allLoads', JSON.stringify(this.loadsToDisplay));
      }

      for (let i = 0; i < this.loadsToDisplay?.length; i++) {
        const load = this.loadsToDisplay[i];
        if(load?.loadingStatus?.text === "Delivered"){
          await this.IsDelivered(load)
          if (this.isQueueEmpty) {
            localStorage.removeItem(`sendInfo${load?.loadMapId}`);
          }
        }
      }
      this.sortLoads()
      this.reloadEvent = false

    },
    
    reset(){
      this.gets = null
      this.posts = null
    },
    async setLoad(val) {
      this.setProfile(val)
      this.$store.commit("setloadStore", val);
      val.firstOrdenInfo = val.Orders[0]
      localStorage.setItem('currentLoad', JSON.stringify(val))
      this.$store.commit("setDetailsLoadsStore", val);
      
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
      if (val?.loadType === this.profile?.b2b) return 'B2B'
      else{
        let res = val?.Orders?.find(x => x)
        if(res?.isReturn) return 'Devolver Contenedor'
        return 'Entregar Contenedor'
      }
    },
    isReturnLoad(val){
      return val.Orders.find(x => x.isReturn)
    },
    async IsDelivered(load){
      let val = 'Delivered'
     await this.changeRouteLoads(val, load)
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


    productQuantity(val){
      let totalProduct = 0
      val?.Orders?.forEach(order => {
        totalProduct += order.no_of_boxes
      });
      return totalProduct
    },
    setCalendar(){
      this.calendar.openMenu()
    },
  },
};
</script>

<style scoped>
p {
  margin: 3px 0px !important;
  white-space: pre-wrap;
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
  text-align: initial;
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
      z-index: 1;
    position: relative;
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
.position-text{
  white-space: nowrap;
}
.info-Order {
  width: 100% !important;
  display: flex;
  align-items: baseline;

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
    font-size: 16px 

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
  color: #de2828;
}
.load-rejected .status-load{
  color: #de2828;
}

.refresh-reload{
  display: flex;
  align-items: center;
  position: absolute;
  top: 0px;
  right: 3%;
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

header {
  height: 60px;  /* 64 + 16px */
  position: sticky;
  -webkit-position: sticky;
  top: -16px; 
  z-index: 1;
  text-align: center;
  -webkit-backface-visibility: hidden;
}

header::before,
header::after {
  content: '';
  display: block;
  height: 16px;
  position: sticky;
  -webkit-position: sticky;
}

/* SHADOW */
header::before {
  top: 28px; /* shadow is at bottom of element, so at 48 + 16 = 64px */
  box-shadow: 0px 1px 2px rgba(0,0,0,0.5);
}

/* COVER */
header::after {
  background: linear-gradient(white 10%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.4) 70%, transparent);
  z-index: 2;
}

/* HEADER CONTENT */
header >div {
  background: rgb(255, 255, 255);
  height: 44px;
  position: sticky;
  -webkit-position: sticky;
  top: 0px;
  margin-top: -16px;
  /* content should fall over shadow and cover */
  z-index: 3;
}

#calendar{
  position: absolute;
  opacity: 0;
}


.popup {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: row;
  position: absolute;
  bottom: 72%;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* The actual popup */
.popup .popuptext {
  visibility: hidden;
  width: 94%;
  background-color: #b17401;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 0;
  z-index: 1;
}

/* Popup arrow */
.popup .popuptext::after {
  content: "";
  position: absolute;
  top: -15%;
  transform: rotate(180deg);
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #b17401 transparent transparent transparent;
}

/* Toggle this class - hide and show the popup */
.popup .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
  padding: 15px 0px;
  box-shadow: 0px 0px 5px #b17401;
}

/* Add animation (fade in the popup) */
@-webkit-keyframes fadeIn {
  from {opacity: 0;} 
  to {opacity: 1;}
}

@keyframes fadeIn {
  from {opacity: 0;}
  to {opacity:1 ;}
}

.blue-text{
  color: #1968e4;
}
@media (min-width: 650px){
  .section{
    display: flex;
    flex-wrap: wrap;
  }
  .item-section{
    width: 50%;
  }
  .container{
    width: 100%;
  }
   .item-body{
    min-height: 305px;
  }
}

@media (min-width: 1300px){
  .item-section{
    width: 33%;
  }
 
}
</style>