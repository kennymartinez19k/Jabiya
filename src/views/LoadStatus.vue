<template>
  <div>
    <div class="stiky">
      <p style="font-size: 13px; font-weight: 500" class="web-font-small">
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
        <div class="uk-flex uk-flex-wrap web-font-small">
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Shipper: </span>
            <span>&nbsp; {{ shipperName(loadStore) }}</span>
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span>
            <span>&nbsp; {{ loadStore?.firstOrdenInfo ? loadStore?.firstOrdenInfo?.sector : loadStore?.Orders[0]?.sector  }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="container">
      <h6 class="web-font-medium">Seleccione el Siguiente Paso</h6>
      <ul class="progressbar">
        <li
          v-if="userInfo?.userType == userType?.provider" 
          :class="{active: loadStatus.step == step.expectingApprovalProvider, 'completed-status': loadStatus.step > step.expectingApprovalProvider}"
        >
         
            <div class="info web-font-small">
              <span>0</span>
            </div>

            <div
              @click="changeRoute('Expecting Approval')"
              class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item "
            >
              <h6 class="web-font-small">{{messageStatus?.expectingApprovalProvider?.message}}</h6>
            </div>
            <div class="icon-item">
              <font-awesome-icon class="icon" @click="changeRoute('Expecting Approval')" v-if="loadStatus.step == step.expectingApprovalProvider" icon="arrow-right"/>
              <img v-if="loadStatus.step < step.expectingApprovalProvider" src="../assets/checklist.png" />
              <img v-if="loadStatus.step > step.expectingApprovalProvider" src="../assets/check.png" />
            </div>
            <div class="disabled-container"></div>
        </li>
        <li 
          :class="{active: loadStatus.step == step.expectingApproval, 'completed-status': loadStatus.step > step.expectingApproval}"
        >
          <div class="info web-font-small">
            <span>1</span>
          </div>

          <div
            @click="changeRoute('Expecting Approval')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6 class="web-font-small">{{messageStatus?.expectingApproval?.message}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('Expecting Approval')" v-if="loadStatus.step == step.expectingApproval" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.expectingApproval" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.expectingApproval" src="../assets/check.png" />
          </div>
          <div class="disabled-container"></div>
        </li>
        <li 
          :class="{active: loadStatus.step == step.driverArrival, 'completed-status': loadStatus.step > step.driverArrival}"
        >
          <div class="info web-font-small">
            <span>2</span>
          </div>

          <div
            @click="changeRoute('Driver Arrival')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6 class="web-font-small">{{messageStatus?.driverArrival?.message}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('Driver Arrival')" v-if="loadStatus.step == step.driverArrival" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.driverArrival" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.driverArrival" src="../assets/check.png" />
          </div>
          <div class="disabled-container"></div>
        </li>
        <li
          :class="{active: loadStatus.step == step.approved, 'completed-status': loadStatus.step > step.approved}"
        >
           <div class="info web-font-small">
            <span>3</span>
          </div>
          <div
            @click="changeRoute('Approved')"
            :class="{'disabled-event': isMountProduct}"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6 class="web-font-small">{{messageStatus?.approved?.message}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('Approved')" v-if="loadStatus.step == step.approved" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.approved" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.approved" src="../assets/check.png" />
          </div>
          <div class="disabled-container"></div>

        </li>
        <li
        :class="{active: loadStatus.step == step.truckLoaded && !sendingInfo, 'completed-status': loadStatus.step > step.truckLoaded}">
          <div class="info web-font-small">
            <span>4</span>
          </div>
          <div
            @click="changeRoute('Dispatched')"
            class="uk-card action on-way  uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6 class="web-font-small">{{messageStatus?.startRoute?.message}}</h6>
          </div>

          <div class="icon-item">
            <span v-if="setting.maps" class="">
              <font-awesome-icon class="icon" @click="changeRoute('Dispatched')" v-if="loadStatus.step >= step.truckLoaded" icon="arrow-right"/>
              <img v-if="loadStatus.step < step.truckLoaded" src="../assets/checklist.png" />
            </span>

            <span v-if="!setting.maps" class="">
              <font-awesome-icon class="icon" @click="changeRoute('Dispatched')" v-if="loadStatus.step == step.truckLoaded" icon="arrow-right"/>
              <img v-if="loadStatus.step < step.truckLoaded" src="../assets/checklist.png" />
              <img v-if="!setting?.maps && loadStatus.step > step.truckLoaded" src="../assets/check.png" />
            </span>
          </div>

          <div class="disabled-container"></div>
        </li>
        <li
          v-if="!allOrderIsReturn"
          :class="{active: loadStatus.step == step.delivered && !sendingInfo, 'completed-status': loadStatus.step > step.delivered}">
          
          <div class="info web-font-small"><span>5</span></div>
          <div   
            @click="changeRoute('Deliver-Load')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6 class="web-font-small">{{messageStatus?.delivered?.message}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('Deliver-Load')" v-if="loadStatus.step == step.delivered" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.delivered" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.delivered" src="../assets/check.png" />
          </div>
          <div class="disabled-container"></div>
        </li>
        <!-- <li 
          v-if="isReturnOrder"
          :class="{active: loadStatus.step == step.returnContainer, 'completed-status': loadStatus.step > step.returnContainer}">
          <div class="info web-font-small"><span>6</span></div>
          <div   
            @click="changeRoute('return-container')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6 class="web-font-small">{{messageStatus?.returnContainer?.message}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('return-container')" v-if="loadStatus.step == step.returnContainer" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.returnContainer" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.returnContainer" src="../assets/check.png" />
          </div>
          <div class="disabled-container"></div>
        </li> -->
      </ul>
    </div>
    <ion-alert-controller></ion-alert-controller>
  </div>
</template>
<script>

import { mapGetters } from "vuex";
import { Mixins } from "../mixins/mixins";
import { Profile } from '../mixins/Profile'
import { alertController } from '@ionic/vue';
import { Geolocation} from '@capacitor/geolocation'
import { userType, userPosition, profile } from '../types'



export default {
  alias: "Manejo de Viaje",
 
  data() {
    return {
      userType,
      userPosition,
      profile,

      step:{
        expectingApprovalProvider: 0,
        expectingApproval: 1,
        driverArrival: 2,
        approved: 3,
        truckLoaded: 4,
        delivered: 5,
        returnContainer: 5
      },
      isReturnOrder: false,
      statusDelivered: false,
      load: [],
      loadStartRoute: null,
      LoadReturn: null,
      allOrderIsReturn: null,
      setting: {},
      userInfo: {},

      startRouteStorage: false,
      deliverStorage: false,
      uploadStorage: false,
      isMountProduct: false,
      sendingInfo: false
    };
  },
 
  mixins: [Mixins, Profile],
  computed: {
    ...mapGetters(["loadStore", "startRoute", "userData"]),

    loadStatus() {
      let step = 0;
      let status = this.load?.loadingStatus?.text
      let userType = this.userInfo.userType
      let adminApproval;
      let driverApproval;
      for (let i = 0; i < this.load?.approvers?.length; i++) {
        if(i == 0)
        adminApproval = this.load?.approvers[i]?.status
        else
        driverApproval = this.load?.approvers[i]?.status
        
      }

      if (status == "Expecting Approval" && !adminApproval && userType == this.userType.provider){
        step = 0;
      }

      if (status == "Expecting Approval" && adminApproval == 'REJECT' && userType == this.userType.provider){
        step = 0;
      }

      if (status == "Reject by Admin" && adminApproval == 'REJECT' && userType == this.userType.provider){
        step = 0;
      }

      if (status == "Expecting Approval" && adminApproval == 'ACCEPTED' && userType == this.userType.provider){
        step = 1;
      }

      if(adminApproval == 'ACCEPTED' && !driverApproval && status == 'Expecting Approval'){
        step = 1;
      }

       if(adminApproval == 'ACCEPTED' && driverApproval == 'REJECT' && status == 'Expecting Approval'){
        step = 1;
      }

      if(adminApproval == 'ACCEPTED' && driverApproval == 'REJECT' && status == 'Reject by Driver'){
        step = 1;
      }

      if(adminApproval == 'ACCEPTED' && driverApproval == 'ACCEPTED' && status == 'Expecting Approval'){
        step = 2;
      }

      if(status == 'Approved'){
        step = 2
      }

      if(status == 'Driver Arrival'){
        step = 3
      }

      if(status == 'Loading Truck'){
        step = 3
      }

      if(status == 'Dispatched'){
        step = 4
      }


      if(step == 4 && status == 'Dispatched' && !this.startRouteStorage){
        step = 4
      }

       if(step == 4 && status == 'Dispatched' && this.startRouteStorage){
        step = 5
      }

       if(step == 5 && status == 'Dispatched' && this.startRouteStorage && !this.deliverStorage){
        step = 5
      }

      if(step == 5 && status == 'Dispatched' && this.startRouteStorage && this.deliverStorage){
        step = 6
      }

      if(status == 'Delivered'){
        step = 6
      }

      let statusLoad = {
        step: step
      }
      return statusLoad;
    },

    messageStatus(){
      let message = (JSON.parse(localStorage.getItem('currentProfile')))?.LoadStatus

      if(this.loadStatus.step > 0)
        message.expectingApprovalProvider.message = message?.expectingApprovalProvider?.pastMessage

      if(this.loadStatus.step > 1)
        message.expectingApproval.message = message?.expectingApproval?.pastMessage

      if(this.loadStatus.step > 2) 
        message.driverArrival.message = message?.driverArrival?.pastMessage

      if(this.loadStatus.step > 3)
        message.approved.message = message?.approved?.pastMessage

      if(this.loadStatus.step > 4) {
        if(this.setting.maps) message.startRoute.message = message?.startRoute?.pastMessage 
        else message.startRoute.message = 'Comenzó la Ruta'
      } 
      if(this.loadStatus.step > 5)
        message.delivered.message = message?.delivered?.pastMessage

      if(this.loadStatus.step > 6) 
       message.returnContainer.message = message?.returnContainer?.pastMessage 

      return message
      }
  },

  async mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.setting = JSON.parse(localStorage.getItem('setting'))
    let loadsMounted = null
    let loadId = null
    if (this.loadStore) loadId = this.loadStore.loadMapId
    else {
      let loadStore = JSON.parse(localStorage.getItem('currentLoad'))
      this.$store.commit('setloadStore', loadStore)
      loadId = loadStore.loadMapId
    }
    try{
      this.load = await this.$services.loadsServices.getLoadDetails(loadId);
      this.load.firstOrdenInfo = this.loadStore?.Orders[0]
      this.$store.commit("setloadStore", this.load);

    } catch(error){
      if (this.loadStore) {
         loadsMounted = {...this.loadStore}
      } else {
        loadsMounted = JSON.parse(localStorage.getItem('currentLoad'))
      }
      this.load = loadsMounted
      this.$store.commit("setloadStore", loadsMounted);

    }
    this.sendingInfo = localStorage.getItem(`sendInfo${this.load.loadMapId}`)


    let allLoads = JSON.parse(localStorage.getItem('allLoads'))
    allLoads.forEach(x => {
      if(x?.loadMapId == this.load?.loadMapId){
        Object.assign(x , this.load)
      }
    })
    localStorage.setItem('allLoads', JSON.stringify(allLoads))

    this.startRouteStorage = localStorage.getItem(`startRoute${this.load.loadMapId}`)
    this.deliverStorage = localStorage.getItem(`deliverLoad${this.load.loadMapId}`)
    this.uploadStorage = localStorage.getItem(`uploadStorage${this.load.loadMapId}`)
    
    this.isReturnOrder = this.load.Orders.some(x => x.isReturn)
    this.allOrderIsReturn = this.load.Orders.every(x => x.isReturn)
    localStorage.setItem('dateCheck', this.load.dateTime.date);

  },

  methods: {
    async changeRoute(val) {
      localStorage.setItem('DeliveryCharges', JSON.stringify(this.load));
      this.$store.commit('setloadStore', this.load )

      try{
        if(val == "Approved" &&  this.profile?.container == this.load?.loadType){
          this.isMountProduct = true
          let delay = (ms) => new Promise((res) => setTimeout(res, ms));
          await delay(5000);
          this.isMountProduct = false
        }
        let ubication = await this.ubication(this.load)
          if(ubication){
            localStorage.setItem('ubication', JSON.stringify(ubication))
            localStorage.setItem('loadInProgress', JSON.stringify(this.load.loadMapId));
            await this.changeRouteLoads(val, this.load);
  
            this.startRouteStorage = localStorage.getItem(`startRoute${this.load.loadMapId}`)
            this.deliverStorage = localStorage.getItem(`deliverLoad${this.load.loadMapId}`)
            this.uploadStorage = localStorage.getItem(`uploadStorage${this.load.loadMapId}`)
            
            this.load = await this.$services.loadsServices.getLoadDetails(this.load?.loadMapId);
            let allLoads = JSON.parse(localStorage.getItem('allLoads'))
            allLoads.forEach(x => {
              if(x?.loadMapId == this.load?.loadMapId){
                Object.assign(x , this.load)
              }
            })
            localStorage.setItem('allLoads', JSON.stringify(allLoads))
          }

      
      }catch(error){
        console.log(error)
      }
    },
    shipperName(val) {
      var shipper = val?.shipper?.find((x) => x.name);
      return shipper?.name;
    },
    deliveredLoad(val){
      localStorage.removeItem(`loadStatus${val.loadMapId}`)
      this.changeRouteLoads('Delivered')
      
    },
    async alertUbication(header, msg){
        const alert = await alertController.create({
          header: header,
          message: msg,
          buttons: [ 'Ok'],
        });
        await alert.present();
    },
    async ubication(load){
      if(!load?.Vehicles[0]?.gpsProvider || load.Vehicles[0].gpsProvider == 'Flai Mobile App'){
        try{
          let res = await Geolocation.getCurrentPosition({timeout: 5000})
          return res
        }catch(error){
          console.log(error.message)
          if(error.message == 'location disabled'){
            this.alertUbication('Active la ubicacion', 'Porfavor debe encender la ubicacion, para continuar el siguiente paso' )
          }
          if(error.message == 'Location permission was denied'){
            this.alertUbication('Ubicacion denegada', 'Por favor permita que la aplicacion pueda acceder a permiso de ubicacion' )
          }
          if(error.message == 'User denied Geolocation'){
            this.alertUbication('Ubicacion denegada', 'Por favor permita que la aplicacion pueda acceder a permiso de ubicacion' )
          }
          return false
        }
      }else{
        // Request to Gps server
        return true
      }
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
  width: 90%;
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
  max-width: 800px;
  text-align: center;
  margin: 0px auto;
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
  height: 28px;
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
  width: 3px;
  height: 55px;
  background: #979797;
  top: -53px;
  left: 17px;
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
.progressbar .action{
  border-radius: 5px;
}
.progressbar .action h6{
  font-size: 14px;
}
.progressbar .completed-status .info{
  border-color: #017625 !important;
  background: #017625 !important;
  color: white !important;
}
.progressbar .active .action{
  background: #0f7ae5;
  text-transform: uppercase;

}

.progressbar .active .icon-item{
  color: #0f7ae5;
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
.progressbar .completed-status .on-way{
  pointer-events:initial !important;
}

.progressbar li .active h6{
  color: #fff !important
}
.disabled-event{
  pointer-events: none;
}
 li{
    display: flex;
    justify-content: center;
    cursor: pointer;
  }
.item-status{
  width: 100%;
  display: flex;
}

@media (min-width: 600px){
 
}
</style>