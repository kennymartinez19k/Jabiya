<template>
  <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeout"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>
  <div class="uk-flex uk-flex-column cnt">
    <div class="stiky">
      <p class="web-font-small" style="font-size: 13px; font-weight: 500">
        {{ load?.loadNumber }}
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
            <span class="font-weight-medium">Shipper: </span
            ><span>&nbsp; {{ shipperName(load) }}</span>
          </p>
          <div></div>
          <p class="web-font-small">
            <span style="font-weight: 500">Destino:</span
            ><span>&nbsp; {{ load?.firstOrdenInfo?.sector }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="uk-card uk-card-default uk-width-1-2@m container-main">
      
        <div >
          <div
            class="uk-card uk-card-default uk-card-body container-info"
            style=""
          >
            <h6 class="uk-text-center web-font-medium" style="width: 100%">Detalles del Viaje</h6>
           
            <div class="uk-margin-top uk-text-left info-user-client">
                <div>
                <div  v-if="userData?.userType == userType?.provider" class="uk-flex uk-flex-middle web-font-small">
                  <p class="uk-text-bold">Ingreso:&nbsp;</p>
                  <span> RD ${{setRound(load?.plannedProfitability?.profitability?.revenue * load?.currencyExchange?.atTheTimeOfAssigning)}}</span>
                </div>
                <div  v-if="userData?.userType !== userType?.driver" class="uk-flex uk-flex-middle web-font-small">
                  <p class="uk-text-bold">{{costText}}:&nbsp;</p>
                  <span> RD ${{setRound(load?.plannedProfitability?.profitability?.transportCost * load?.currencyExchange?.atTheTimeOfAssigning)}}</span>
                </div>
                <div  v-if="userData?.userType == userType?.provider" class="uk-flex uk-flex-middle web-font-small">
                  <p class="uk-text-bold">Rentabilidad:&nbsp;</p>
                  <span> RD ${{setRound(load?.plannedProfitability?.profitability?.profitability * load?.currencyExchange?.atTheTimeOfAssigning)}}</span>
                </div>
                
              </div>
        
              <div class="uk-flex uk-flex-middle web-font-small">
                <p class="uk-text-bold">Estado del Viaje:&nbsp;</p>
                <span>{{loadStatus(load)}}</span>
              </div>

              <div v-if="load?.loadType == profile.container">
                <div class="uk-flex uk-flex-middle web-font-small">
                  <p class="uk-text-bold">Cliente:&nbsp;</p>
                  <span>{{ load.Orders[0].client_name }}</span>
                </div>
                <div class="uk-flex uk-flex-middle web-font-small">
                  <p class="uk-text-bold">Orden:&nbsp;</p>
                  <span>{{ load?.Orders[0]?.order_num }}</span>
                </div>

              </div>
              <div class="uk-flex uk-flex-middle web-font-small">
                <p class="uk-text-bold">Fecha de Recogida:&nbsp;</p>
                <span>{{load?.dateTime?.date}} {{setLocaleDate(detailsLoads?.loadingStatus?.slotStartTime)}}</span>
              </div>

              <div v-if="load?.loadType == profile?.container" class="uk-flex uk-flex-middle web-font-small">
                <p class="uk-text-bold">Fecha de Entrega:&nbsp;</p>
                <span>{{setDateFormat(load?.Orders[0]?.expected_date)}}  {{setLocaleHour(load?.Orders[0]?.expected_date)}}</span>
              </div>
              
              <div class="uk-flex uk-flex-middle web-font-small">
                <p class="uk-text-bold">Chofer:&nbsp;</p>
                <span v-for="info of load?.Vehicles" :key="info">{{info?.driver}}</span>
              </div> 
              <div class="uk-flex uk-flex-middle info-driver web-font-small">
                <p class="uk-text-bold position-text">Vehiculo:&nbsp;</p>
                <span v-for="info of load?.Vehicles" :key="info">{{info?.brand}} {{info?.model}} {{info?.color}}, Placa: {{info?.license_no}} </span>
              </div>
              
            </div>
            <div class="uk-flex uk-flex-between info-user-address">
              <div class="uk-text-left uk-flex uk-flex-between info-user" v-if="load?.loadType == profile?.container">
                <div class="web-font-small">
                  <p class="uk-text-bold">Recoger en:</p>
                  <p>
                    <span v-for="info in load?.shipper" :key="info">
                      {{ info?.name }}
                    </span>
                  </p>
                  <p>{{load?.warehouse?.location?.address}}</p>

                </div>
                <div class="web-font-small">
                  <p class="uk-text-bold">Entregar en:</p>
                  <p>{{load?.firstOrdenInfo?.client_name}}</p>
                  <p>{{load?.firstOrdenInfo?.address}}</p>
                </div>
              
              </div>
              
            </div>
            <div>
      </div>
      <div v-if="load?.loadType == profile?.b2b" class="address-container">
        <h6 class="font-weight-medium uk-margin-top web-font-small" style="font-size: 14px; margin: 15px 0px; width: 100%">Número de Ordenes: {{orders?.length}}</h6>
        <div
          v-for="(order, i) in orders"
          :key="order"  v-show="i < quantityShow"
          class="uk-card order-item uk-card-default uk-card-body uk-flex uk-flex-between"
          :class="{ ordenCompleted: order?.completed }"
        >
          <div class="uk-text-left uk-flex uk-flex-wrap web-font-small">
            <p class="uk-width-1-1" style="margin-right: 10px !important">
                  <span class="font-weight-medium">Cliente: </span>
                  <span>{{ order.client_name }}</span>
                </p>
            <div class="uk-flex uk-flex-middle uk-width-1-1 web-font-small">
                <p class="uk-text-bold">Fecha de Entrega:&nbsp;</p>
                <span>{{setDateFormat(order.expected_date)}} &nbsp;</span>
                <span> {{setLocaleHour(order.expected_date)}}</span>
              </div>
            <p style="margin-right: 10px !important" class="web-font-small">
              <span class="font-weight-medium uk-wi">Orden: </span
              ><span>{{ order.order_num }}</span>
            </p>
            <p class="web-font-small">
              <span class="font-weight-medium">Cajas / Pallets: </span
              >{{ order.products?.length }}<span></span>
            </p>
            
            <div class="uk-text-left info-user">
                  <div class="web-font-small">
                    <p class="uk-text-bold">Warehouse:</p>
                    <p>
                      <span v-for="info in load?.shipper" :key="info">
                        {{ info?.name }}
                      </span>
                    </p>
                    <p>{{load?.warehouse?.location?.address}}</p>

                  </div>
                  <div class="web-font-small">
                    <p class="uk-text-bold">Entregar en:</p>
                    <p>{{load?.firstOrdenInfo?.client_name}}</p>
                    <p>{{load?.firstOrdenInfo?.address}}</p>
                  </div>
                
                </div>
          </div>
        </div>
      </div>
          <span v-if="orders?.length > quantityShow && load?.loadType == profile?.b2b && showOrders" style="font-size:16px; font-weight: 900" @click="setShowOrders(false, orders.length)">.....Ver Más</span>
          <span v-if="orders?.length >= quantityShow && load?.loadType == profile?.b2b && showOrders === false" style="font-size:16px; font-weight: 900" @click="setShowOrders(true, 3)">.....Ver Menos</span>

          </div>
        </div>
      </div>
    <div id="modal-center" class="uk-flex-top" uk-modal>
      <div
        class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
        style="padding: 40px 10px 5px !important"
      >
        <button class="uk-modal-close-default" type="button" uk-close></button>

        <h5 class="uk-text-center" style="padding: 20px 0px">
          Esta Seguro Que Deseea Rechazar Este Viaje?
        </h5>
        <div
          class="uk-modal-footer uk-flex uk-flex-around uk-padding-remove"
          style="padding: 10px 0px !important"
        >
          <button
            class="uk-button uk-button-transparent uk-modal-close web-font-small"
            type="button"
          >
            Cancelar
          </button>
          <button
            :class="{disabled: disabled}"
            href="#modal-group-1"
            @click="acceptOrRejectLoad(load.loadMapId, load.__v, 'REJECTED', load.loadForeignkeys.vehicleId)"
            class="uk-button button-reject uk-modal-close web-font-small"
            uk-toggle
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
    <div class="button-opt">
      <a href="#modal-center uk-button" uk-toggle class="uk-button uk-button-red web-font-small"
        >Rechazar Viaje&nbsp;
      </a>
      <button
        @click="acceptOrRejectLoad(load?.loadMapId, load?.__v, 'ACCEPTED', load.loadForeignkeys.vehicleId)"
        class="uk-button uk-button-blue web-font-small"
        :class="{disabled: disabled}"
      >
        Aceptar Viaje &nbsp;
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Mixins } from '../mixins/mixins'
import { ref } from "vue";
import moment from "moment";
import { IonLoading } from "@ionic/vue";
import { userType, userPosition, profile } from '../types'


export default {
  alias: `Aprobar Viaje`,
   components: {
    IonLoading
  },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  data() {
    return {
      userType,
      userPosition,
      profile,
      costText: null,
      status: null,
      result: null,
      load: null,
      orders: null,
      userInfo: {},
      disabled: false,
      timeout: 10000,
      showOrders: true,
      quantityShow: 3,
    };
  },
  mixins: [Mixins],
  computed: {
    ...mapGetters(["loadStore", "orderScan", "loads", "products", "userData"]),

    productsBox: function () {
      if (this.products?.length !== 0) {
        return this.products[0]?.quantity;
      }
      return null;
    },
    messageStatusLoad: function () {
      var status = this.orders?.some((x) => x.completed);
      if (status) return "Desmontar Viaje";
      return "Montar Viaje";
    },
  },
 async mounted() {
    this.userInfo = await JSON.parse(localStorage.getItem('userInfo'))
    if (!this.loadStore) {
      this.$store.commit('setloadStore', JSON.parse(localStorage.getItem('currentLoad')))
    } 
    this.load = this.loadStore;
    this.orders = this.loadStore.Orders
    this.load.firstOrdenInfo = this.orders[0]

    if (this.orderScan) {
      this.completedOrden();
    }
    this.orderObj();
    if (this.userInfo.userType  === "Transporter") {
      this.costText = 'Ingreso por el Viaje'
    } else if (this.userInfo.userType  === "Provider") {
      this.costText = 'Costo de Transporte'
    }
  },
  methods: {
    orderObj() {
      this.orders?.sort((a) => {
        if (a?.completed == true) {
          return 1;
        } else {
          return -1;
        }
      });
    },
    uploadOrDownload() {
      this.orders.map((x) => (x.completed = !x.completed));
    },

    completedOrden() {
      this.orders.forEach((x) => {
        if (x.numberOfOrders == this.orderScan.numberOfOrders) {
          x.completed = this.orderScan?.completed;
        } else x.completed = false;
      });
    },
    async acceptOrRejectLoad(id, version, status,vehicleId) {
      this.setOpen(true)
      this.disabled = true

      let userId
      let load = await this.$services.loadsServices.getLoadDetails(this.load?.loadMapId);
      
      if(!load.approvers[0].status){
        userId = load?.approvers[0]?.approver_id?._id
      }
      else{
        userId = (load.Vehicles.find(x => x)).driver_id._id
      } 

      localStorage.setItem('loadInProgress', JSON.stringify(load.loadMapId));
      localStorage.setItem('dateCheck', load?.dateTime?.date);
      const result = await this.$services.loadsServices.acceptOrRejectLoad(
        id,
        version,
        userId,
        status,
        this.userInfo.userType,
        vehicleId
      );
      this.setOpen(false)
      if (result) {
        if(status == 'REJECTED') {
          this.$router.push({ name: "home" });
        } 
        else this.$router.push({ name: "load-status" });
      }
    },
    shipperName(val) {
      var shipper = val?.shipper[0]?.name;
      return shipper;
    },

    setRound (val) {
        return val.toFixed(2)
    },

    setLocaleDate(val) {
      return moment(val).format("LT");
    },
    setDateFormat(val){
     return moment(val).format('MM/DD/YYYY')
    },
      setLocaleHour(val){
      let date = moment(val).utc().format("YYYY-MM-DD HH:mm")
     return moment(date).format('hh:mm A')
    },
    setShowOrders (value, quantity) {
      this.showOrders = value;
      this.quantityShow = quantity
    }
    
  },
};
</script>

<style scoped>
:root {
  --su-size-text: 12px;
}
.slideunlock .slideunlock-text {
  font-size: var(--su-size-text);
}
p {
  margin: 2px 0px !important;
}
.slide .slideunlock.is-complete .slideunlock-progressbar {
  background-color: #2a307c;
}
.button-opt {
  background: #ffffff !important;
  border-top: 1px solid #b1b1b1;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  padding: 10px;
  position: sticky;
  bottom: 0px;
}
.button-opt button {
  padding: 10px 5px !important;
  align-items: center;
  display: flex;
}
.button-reject{
  background: #930404;
    color: #fff;
}
.uk-card {
  padding: 5px 10px;
}
.uk-card-body {
  margin-bottom: 10px;
  align-items: center;
  padding: 10px 11px;
  border: 0.1px solid #e5e5e5;
}
.slide {
  position: fixed;
  width: 97% !important;
  bottom: 5px;
  height: 40px;
  --su-size-text: 18px;
}
.status {
  font-size: 12px;
}
.btn {
  display: flex;
  align-items: baseline;
  width: 100%;
  justify-content: flex-start;
}
.btn img {
  width: 30px;
  position: relative;
  top: -2px;
  margin-left: 5px;
}

.scan-code img {
  width: 28px;
  position: relative;
  top: -2px;
  left: 4px;
}

.truckSpan {
  max-width: 100%;
}
.truck {
  max-width: 100%;
  width: 70px;
  display: flex;
}


.img-scan {
  width: 39px;
}
.icon-load {
  width: 35%;
  margin-right: 20px;
}
.btn-scan {
  margin-top: 12px;
  box-shadow: 0px -0.5px 3px #000;
  border: 0px;
  color: #fff;
  padding: 3px;
  background: #2a307c;
}

.info-header {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.ordenCompleted {
  background: rgba(233, 255, 233, 0.6);
}
.box-slide {
  background-image: url("../assets/parcel.png");
  background-size: 25px 25px;
  background-repeat: no-repeat;
  background-position: 80%;
}
.uk-button{
  padding: 5px 10px !important;
    align-items: center;
    display: flex;
    border-radius: 5px;
}
.uk-button-green{
  background: green;
  color: #fff
}
.uk-button-red{
  background: #930404;
  color: #fff;
}
.info-user{
  width: 100% !important;
  display: flex;
  justify-content: space-between;
}
.info-user div{
  width: 45%;
}
.disabled {
  pointer-events: none;
}
.position-text{
  white-space: nowrap;
}
.info-driver {
  width: 100% !important;
  display: flex;
  align-items: stretch;

}
.container-main{
  width: 100%;
  box-shadow: none;
  overflow: auto;
}
.container-info{
  margin-bottom: 90px
}

@media (min-width: 600px){
  .container-info{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin: 0px auto 90px;
    padding: 20px;
  }
  .info-user{
    margin: 0px 5px
  }
  .info-user-address{
    width: 50%;
  }
  .info-user-client{
    width: 50%;
  }
  .button-opt{
    position: absolute;
    justify-content: center;
  }
  .button-opt .uk-button{
    margin: 0px 35px
  }
}
@media (min-width: 900px){
  .container-info{
    width: 90%;
  }
  .address-container{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0px auto;
    width: 100%
  }
  .order-item{
   width: 49%;
  }
}
</style>
