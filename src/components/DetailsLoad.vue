<template>
  <div class="">
    <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeout"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>
    <div>
      <div class="uk-card uk-card-default uk-width-1-2@m container">
        <div
            :class="{'load-delivered': detailsLoads?.loadingStatus?.text == 'Delivered', 'load-assigned': detailsLoads?.loadingStatus?.text == 'Driver selection in progress'}" 
            class="uk-card uk-card-default uk-card-body load-default-status">
          <div
            :class="{'disabled-event': detailsLoads?.loadingStatus?.text === 'Driver selection in progress'}"
            @click="setLoad(detailsLoads)"
          >
            <p class="uk-flex status-load">
              <span class="uk-text-bold">{{ loadStatus(detailsLoads) }} </span>
            </p>
            <div class="uk-margin-top" style="margin-top: 25px !important">
              <div>
                  <p class="uk-flex">
                    <span>{{ detailsLoads?.loadNumber }}</span>
                  </p>
              </div>
              
                 <div>
                <div  v-if="userData?.userType == userType?.provider" class="uk-flex uk-flex-middle">
                  <p class="uk-text-bold">Ingreso:&nbsp;</p>
                  <span> RD ${{getRevenue(detailsLoads)}}</span>
                </div>
                <div  v-if="detailsLoads?.loadingStatus?.text !== 'Driver selection in progress' && (userData?.userType == userType?.provider || userData?.userType == userType?.transporter)" class="uk-flex uk-flex-middle">
                  <p class="uk-text-bold">{{costText}}:&nbsp;</p>
                  <span> RD ${{setRound(detailsLoads?.plannedProfitability?.profitability?.transportCost * detailsLoads?.currencyExchange?.atTheTimeOfAssigning)}}</span>
                </div>
                <div  v-if="detailsLoads?.loadingStatus?.text !== 'Driver selection in progress' && (userData?.userType == userType?.provider)" class="uk-flex uk-flex-middle">
                  <p class="uk-text-bold">Rentabilidad:&nbsp;</p>
                  <span> RD ${{setRound(detailsLoads?.plannedProfitability?.profitability?.profitability * detailsLoads?.currencyExchange?.atTheTimeOfAssigning)}}</span>
                </div>
                
              </div>

              <div
                v-if="detailsLoads.loadType == profile?.container"
                class="uk-flex uk-flex-middle"
              >
                <p class="uk-text-bold">No de Orden:&nbsp;</p>
                <span >{{
                  detailsLoads?.Orders[0]?.order_num
                }}</span>
              </div>
              <div class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">Tipo:&nbsp;</p>
                <span>{{ ordenIsReturn(detailsLoads) }}</span>
              </div>
              <div class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">Fecha de Recogida:&nbsp;</p>
                <span
                  >{{ detailsLoads?.dateTime?.date }}
                  {{
                    setLocaleDate(detailsLoads?.loadingStatus?.slotStartTime)
                  }}</span
                >
              </div>
               <div v-if="detailsLoads.loadType == profile?.container" class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">Fecha de Entrega:&nbsp;</p>
                <span
                  >{{ detailsLoads?.Orders[0]?.expected_date }}
                  {{
                    setLocaleHour(detailsLoads?.Orders[0]?.expected_date)
                  }}</span
                >
              </div>

              <div v-if="detailsLoads?.loadingStatus?.text !== 'Driver selection in progress'" 
                  class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">Chofer:&nbsp;</p>
                <span v-for="info of detailsLoads.Vehicles" :key="info">{{
                  info?.driver
                }}</span>
              </div>
              <div v-if="detailsLoads?.loadingStatus?.text !== 'Driver selection in progress'" 
                  class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">Vehiculo:&nbsp;</p>
                <span v-for="info of detailsLoads.Vehicles" :key="info"
                  >{{ info?.brand }} {{ info?.model }} {{ info?.color }}, Placa:
                  {{ info?.license_no }}
                </span>
              </div>
              
            </div>
            <div class="uk-flex uk-flex-between">
                <div style="width: 100%">
                  <div
                    v-if="isReturnLoad(detailsLoads) && detailsLoads?.loadType == profile?.container"
                    class="uk-text-left info-user"
                  >
                    <div>
                      <p class="uk-text-bold">Recoger en:</p>
                      <p>{{ detailsLoads?.firstOrdenInfo?.client_name }}</p>
                      <p>{{ detailsLoads?.firstOrdenInfo?.address }}</p>
                    </div>
                    <div>
                      <p class="uk-text-bold">Entregar en:</p>
                      <p>
                        <span v-for="info in detailsLoads.shipper" :key="info">
                          {{ info?.name }}
                        </span>
                      </p>
                      <p>{{ detailsLoads?.warehouse?.location?.address }}</p>
                    </div>
                  </div>
                  <div v-else-if="detailsLoads.loadType == profile.container" class="uk-text-left info-user">
                    <div>
                      <p class="uk-text-bold">Recoger en:</p>
                      <p>
                        <span v-for="info in detailsLoads.shipper" :key="info">
                          {{ info?.name }}
                        </span>
                      </p>
                      <p>{{ detailsLoads?.warehouse?.location?.address }}</p>
                    </div>
                    <div>
                      <p class="uk-text-bold">Entregar en:</p>
                      <p>{{ detailsLoads?.firstOrdenInfo?.client_name }}</p>
                      <p>{{ detailsLoads?.firstOrdenInfo?.address }}</p>
                    </div>
                  </div>
                </div>
              <div  v-if="detailsLoads?.loadingStatus?.text !== 'Driver selection in progress'" class="start-load uk-flex-middle">
                <font-awesome-icon icon="arrow-right" style="font-size: 20px" />
              </div>
            </div>
           
          </div>
          
        <div v-if="detailsLoads?.loadType == profile?.b2b && detailsLoads.loadingStatus.text !== 'Driver selection in progress'">
        <h6  class="font-weight-medium uk-margin-top" style="font-size: 14px; margin-top: 5px">Ordenes: {{orders?.length}}</h6>
        <div
          v-for="order in orders"
          :key="order"
          class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
          :class="{ ordenCompleted: order?.completed }"
        >
          <div class="uk-text-left uk-flex uk-flex-wrap">
            <p class="uk-width-1-1" style="margin-right: 10px !important">
                  <span class="font-weight-medium uk-text-bold">Cliente: </span>
                  <span>{{ order?.client_name }}</span>
                </p>

              <div class="uk-flex uk-flex-middle">
                <p class="font-weight-medium">Fecha de Entrega:&nbsp;</p>
                <span
                  >{{ detailsLoads?.dateTime?.date }}
                  {{
                    setLocaleHour(order?.expected_date)
                  }}</span
                >
              </div>
            <p style="margin-right: 10px !important">
              <span class="font-weight-medium">Orden: </span
              ><span>{{ order?.order_num }}</span>
            </p>
            <p>
              <span class="font-weight-medium">Cajas / Pallets: </span
              >{{ order?.products?.length }}<span></span>
            </p>
            
            <div class="uk-text-left info-user">
                  <div>
                    <p class="uk-text-bold">Warehouse:</p>
                    <p>
                      <span v-for="info in load?.shipper" :key="info">
                        {{ info?.name }}
                      </span>
                    </p>
                    <p>{{detailsLoads?.warehouse?.location?.address}}</p>

                  </div>
                  <div>
                    <p class="uk-text-bold">Entregar en:</p>
                    <p>{{detailsLoads?.firstOrdenInfo?.client_name}}</p>
                    <p>{{detailsLoads?.firstOrdenInfo?.address}}</p>
                  </div>
                
                </div>
          </div>
        </div>
      </div>

           <div class="uk-text-left" v-if="userData?.userType !== userType?.driver && !hasAddAdditionalInfo">
              <p class="uk-text-bold text-bold">Información Adicional:</p>
              <ul class="file">
                <li v-for="order in orders" :key="order" v-show="order?.addAdditionalInfo?.length > 0">
                  <div v-for="file in order?.addAdditionalInfo" :key="file">
                    <a target="_blank" style="color: red;" :href="file">{{baseName(file)}}</a>
                    </div>
                </li>
              </ul>
            </div>
            <div v-if=" detailsLoads?.loadingStatus?.text === 'Driver selection in progress'">
                <driver-truck :detailsLoads="detailsLoads"></driver-truck>
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
import { Profile } from "../mixins/Profile";

import { userType, userPosition, profile } from '../types'
import DriverTruck from '../components/AddDriverAndTruck.vue'

export default {
  name: "DetailsLoad",
  alias: "Detalles del Viaje",

  components: {
    IonLoading,
    DriverTruck
  },
  props: {
    timeout: {  default: 1000 },
  },
  mixins: [Mixins, Profile],
  data() {
    return {
      userType,
      userPosition,
      costText: null,
      profile,
      orders: [],
      userInfo: {},
      loaded: false,
      detailsLoads: [],
      dateAvalaible: [],
    };
  },

  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  async beforeMount() {
    this.setOpen(true);
    if (this.detailsLoadsStore) {
      try{
        this.detailsLoads = await this.$services.loadsServices.getLoadDetails(this.detailsLoads.loadMapId);
      }catch(error){
        this.detailsLoads = this.detailsLoadsStore;
      }
      this.orders = this.detailsLoads?.Orders
      console.log(this.detailsLoads)
      this.detailsLoads.firstOrdenInfo = this.orders?.find(x => x)
    }

  },

  computed: {
    ...mapGetters(["detailsLoadsStore", "userData"]),

    hasAddAdditionalInfo(){
      if(this.orders?.some(order => order?.addAdditionalInfo))
        return this.orders.every(order => order?.addAdditionalInfo <= 0)
      else
      return true
    }
  },
 async mounted () {
       this.userInfo = await JSON.parse(localStorage.getItem('userInfo'))
    this.$store.commit("setSettings", null);
     if (this.userInfo.userType  === "Transporter") {
      this.costText = 'Ingreso por el Viaje'
    } else if (this.userInfo.userType  === "Provider") {
      this.costText = 'Costo de Transporte'
    }
  },

  methods: {
    setOpe(val) {
      this.loaded = val;
      setTimeout(() => {
        this.loaded = false;
      }, 2000);
    },

    async setLoad(val) {
      this.$store.commit("setloadStore", val);
      localStorage.setItem("DeliveryCharges", JSON.stringify(val));

      this.$router.push({ name: "load-status" }).catch(() => {});
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

    setLocaleDate(val) {
      console.log(val)
      return moment(val).format("LT");
    },
    ordenIsReturn(val) {
      let res = val?.Orders?.find((x) => x);
      if (val.loadType === this.profile.b2b) return 'B2B'
      if (res?.isReturn) return "Devolver Contenedor";
      return "Entregar Contenedor";
    },
    isReturnLoad(val) {
      return val?.Orders?.find((x) => x.isReturn);
    },
  
    baseName(file){
      return file.split('/').reverse()[0];
    },
    getRevenue(load){
      let revenue = load?.plannedProfitability?.allVariable?.revenueMatrix?.find(info => info?.id == load?.loadForeignkeys?.transporterId)
      return Math.round(revenue?.totalRevenue * load?.currencyExchange?.atTheTimeOfAssigning)
    },
    setRound (val) {
        return Math.round(val)
    },
    setLocaleHour(val){
      let date = moment(val).utc().format("YYYY-MM-DD HH:mm")
     return moment(date).format('hh:mm A')
    }
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
  border: 0.1px solid #e5e5e5;
  align-items: center;
  padding: 16px 10px;
}
.container {
  padding: 5px 14px 5px;
  box-shadow: 0px 0px;
}

.info-user {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.info-user div {
  width: 45%;
}
.info-user p {
  margin-right: 10px !important;
}
.info-user strong {
  font-size: 12px !important;
}

a {
  text-decoration: none;
  color: #fff;
}

.status-load {
  justify-content: flex-end;
  position: absolute;
  top: 5px;
  right: 10px;
}
.status-load span {
  font-size: 16px !important;
}
.start-load {
  padding-right: 5px;
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
.disabled-event {
  pointer-events: none;
}
.load-assigned .status-load{
  color: red;
}

.file{
  margin: 15px 0px ;
  padding-left: 15px;
}

</style>
