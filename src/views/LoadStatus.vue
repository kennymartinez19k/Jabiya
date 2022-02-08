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
            <span class="font-weight-medium">Shipper: </span>
            <span>&nbsp; {{ shipperName(loadStore) }}</span>
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span>
            <span>&nbsp; {{ loadStore?.firstOrdenInfo?.sector }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="container">
      <h6>Seleccione el Siguiente Paso</h6>
      <ul class="progressbar">
        <li
          v-if="userInfo?.userType == userType?.provider" 
          :class="{active: loadStatus.step == step.expectingApprovalProvider, 'completed-status': loadStatus.step > step.expectingApprovalProvider}"
        >
          <div class="info">
            <span>0</span>
          </div>

          <div
            @click="changeRoute('Expecting Approval')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus?.expectingApprovalProvider?.message}}</h6>
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
          <div class="info">
            <span>1</span>
          </div>

          <div
            @click="changeRoute('Expecting Approval')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus?.expectingApproval?.message}}</h6>
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
          <div class="info">
            <span>2</span>
          </div>

          <div
            @click="changeRoute('Driver Arrival')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus?.driverArrival?.message}}</h6>
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
           <div class="info">
            <span>3</span>
          </div>
          <div
            @click="changeRoute('Approved')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus?.approved?.message}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('Approved')" v-if="loadStatus.step == step.approved" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.approved" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.approved" src="../assets/check.png" />
          </div>
          <div class="disabled-container"></div>

        </li>
        <li
        :class="{active: loadStatus.step == step.truckLoaded, 'completed-status': loadStatus.step > step.truckLoaded}">
          <div class="info">
            <span>4</span>
          </div>
          <div
            @click="changeRoute('Dispatched')"
            class="uk-card action on-way  uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus?.startRoute?.message}}</h6>
          </div>

          <div class="icon-item">
            <span v-if="setting.maps" class="ddd">
              <font-awesome-icon class="icon" @click="changeRoute('Dispatched')" v-if="loadStatus.step >= step.truckLoaded" icon="arrow-right"/>
              <img v-if="loadStatus.step < step.truckLoaded" src="../assets/checklist.png" />
            </span>

            <span v-if="!setting.maps" class="ss">
              <font-awesome-icon class="icon" @click="changeRoute('Dispatched')" v-if="loadStatus.step == step.truckLoaded" icon="arrow-right"/>
              <img v-if="loadStatus.step < step.truckLoaded" src="../assets/checklist.png" />
              <img v-if="!setting?.maps && loadStatus.step > step.truckLoaded" src="../assets/check.png" />
            </span>
          </div>

          <div class="disabled-container"></div>
        </li>
        <li
          v-if="!allOrderIsReturn"
          :class="{active: loadStatus.step == step.delivered, 'completed-status': loadStatus.step > step.delivered}">
          
          <div class="info"><span>5</span></div>
          <div   
            @click="changeRoute('Deliver-Load')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus?.delivered?.message}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('Deliver-Load')" v-if="loadStatus.step == step.delivered" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.delivered" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.delivered" src="../assets/check.png" />
          </div>
          <div class="disabled-container"></div>
        </li>
        <li 
          v-if="isReturnOrder"
          :class="{active: loadStatus.step == step.returnContainer, 'completed-status': loadStatus.step > step.returnContainer}">
          <div class="info"><span>6</span></div>
          <div   
            @click="changeRoute('return-container')"
            class="uk-card action uk-card-default uk-card-body uk-width-1-2@m item"
          >
            <h6>{{messageStatus?.returnContainer?.message}}</h6>
          </div>
          <div class="icon-item">
            <font-awesome-icon class="icon" @click="changeRoute('return-container')" v-if="loadStatus.step == step.returnContainer" icon="arrow-right"/>
            <img v-if="loadStatus.step < step.returnContainer" src="../assets/checklist.png" />
            <img v-if="loadStatus.step > step.returnContainer" src="../assets/check.png" />
          </div>
          <div class="disabled-container"></div>
        </li>

     
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
import { userType, userPosition } from '../types'



export default {
  alias: "Manejo de Viaje",
 
  data() {
    return {
      userType,
      userPosition,
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
      currentStatusLoad: null,
      allOrderIsReturn: null,
      setting: {},
      userInfo: {},

      startRouteStorage: false,
      deliverStorage: false,
      uploadStorage: false
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

      console.log(message)
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
    console.log(this.loadStore)
    let loadsMounted = null
    if (this.loadStore) {
       loadsMounted = this.loadStore
    } else {
      loadsMounted = JSON.parse(localStorage.getItem('DeliveryCharges'))
    }
    this.$store.commit("setloadStore", loadsMounted);
    this.load = await this.$services.loadsServices.getLoadDetails(loadsMounted?.loadMapId);
    this.isReturnOrder = this.load.Orders.some(x => x.isReturn)
    this.allOrderIsReturn = this.load.Orders.every(x => x.isReturn)
    this.currentStatusLoad = localStorage.getItem(`loadStatus${this.load.loadMapId}`)
    console.log(this.load)  
    localStorage.removeItem('dateCheck');
    localStorage.setItem('dateCheck', JSON.stringify(this.load.dateTime.date));

    this.startRouteStorage = localStorage.getItem(`startRoute${this.load.loadMapId}`)
    this.deliverStorage = localStorage.getItem(`deliverLoad${this.load.loadMapId}`)
    this.uploadStorage = localStorage.getItem(`uploadStorage${this.load.loadMapId}`)
  },

  methods: {
    async changeRoute(val) {
      if(await this.ubication()){
        localStorage.setItem('loadingProgress', JSON.stringify(this.load.loadMapId));
        await this.changeRouteLoads(val, this.load);

        this.startRouteStorage = localStorage.getItem(`startRoute${this.load.loadMapId}`)
        this.deliverStorage = localStorage.getItem(`deliverLoad${this.load.loadMapId}`)
        this.uploadStorage = localStorage.getItem(`uploadStorage${this.load.loadMapId}`)
        this.load = await this.$services.loadsServices.getLoadDetails(this.load?.loadMapId);
      }
      else{
        alert('no hay')
      }
    },
    setInvoice() {
      this.$router.push({ name: "invoices-orders" }).catch(() => {});
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
    async ubication(){
      try{
        await Geolocation.getCurrentPosition()
        return true
      }catch(error){
        if(error.message == 'location disabled'){
          this.alertUbication('Active la ubicacion', 'Porfavor debe encender la ubicacion, para continuar el siguiente paso' )
        }
        if(error.message == 'Location permission was denied'){
          this.alertUbication('Ubicacion denegada', 'Por favor permita que la aplicacion acceda a la ubicacion' )
        }
        return false
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

</style>