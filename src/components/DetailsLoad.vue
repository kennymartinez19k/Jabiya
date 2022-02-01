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
            :class="{'load-delivered': detailsLoads.loadingStatus.text == 'Delivered'}" 
            class="uk-card uk-card-default uk-card-body load-default-status">
          <div
            @click="setLoad(detailsLoads)"
          >
            <p class="uk-flex status-load">
              <span class="uk-text-bold">{{ loadStatus(detailsLoads) }}</span>
            </p>
            <div class="uk-margin-top" style="margin-top: 25px !important">
              <div>
                  <p class="uk-flex">
                    <span>{{ detailsLoads.loadNumber }}</span>
                  </p>
              </div>
              
              <div v-if="userData?.userType == userType?.provider">
                <div class="uk-flex uk-flex-middle">
                  <p class="uk-text-bold">Ingreso:&nbsp;</p>
                  <span>{{detailsLoads?.plannedProfitability?.profitability?.revenue}}</span>
                </div>
                <div class="uk-flex uk-flex-middle">
                  <p class="uk-text-bold">Rentabilidad:&nbsp;</p>
                  <span>{{detailsLoads?.plannedProfitability?.profitability?.profitability}}</span>
                </div>
                <div class="uk-flex uk-flex-middle">
                  <p class="uk-text-bold">Costo de Transporte:&nbsp;</p>
                  <span>{{detailsLoads?.plannedProfitability?.profitability?.transportCost}}</span>
                </div>
              </div>

              <div
                class="uk-flex uk-flex-middle"
                style="font-size: 16px !important"
              >
                <p class="uk-text-bold">No de Orden:&nbsp;</p>
                <span v-for="order of detailsLoads.Orders" :key="order">{{
                  order.order_num
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
                    setLocaleDate(detailsLoads.loadingStatus.slotStartTime)
                  }}</span
                >
              </div>

              <div class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">Fecha de Entrega:&nbsp;</p>
                <span
                  >{{ detailsLoads?.dateTime?.date }}
                  {{
                    setLocaleDate(detailsLoads.loadingStatus.slotEndTime)
                  }}</span
                >
              </div>

              <div v-if="detailsLoads.loadingStatus.text !== 'Driver selection in progress'" 
                  class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">Chofer:&nbsp;</p>
                <span v-for="info of detailsLoads.Vehicles" :key="info">{{
                  info?.driver
                }}</span>
              </div>
              <div v-if="detailsLoads.loadingStatus.text !== 'Driver selection in progress'" 
                  class="uk-flex uk-flex-middle">
                <p class="uk-text-bold">Vehiculo:&nbsp;</p>
                <span v-for="info of detailsLoads.Vehicles" :key="info"
                  >{{ info?.brand }} {{ info?.model }} {{ info?.color }}, Placa:
                  {{ info?.license_no }}
                </span>
              </div>
              
            </div>
            <div class="uk-flex uk-flex-between">
              <div
                v-if="isReturnLoad(detailsLoads)"
                class="uk-text-left info-user"
              >
                <div>
                  <p class="uk-text-bold">Recoger en:</p>
                  <p>{{ detailsLoads?.firstOrdenSector?.client_name }}</p>
                  <p>{{ detailsLoads?.firstOrdenSector?.address }}</p>
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
              <div v-else class="uk-text-left info-user">
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
                  <p>{{ detailsLoads?.firstOrdenSector?.client_name }}</p>
                  <p>{{ detailsLoads?.firstOrdenSector?.address }}</p>
                </div>
              </div>
              <div class="start-load">
                <font-awesome-icon icon="arrow-right" style="font-size: 20px" />
              </div>
            </div>
           
          </div>
           <div class="uk-text-left" v-if="userData?.userType == userType?.transporter && userData?.position == userPosition?.transporter">
              <p class="uk-text-bold " style="font-size: 16px !important">Información Adicional:</p>
              <ul>
                <li><a style="color: red;" href="https://drive.google.com/file/d/1V9uVm0928RLKDPrl8Y6WevKmDIx_cQkV/view?usp=sharing">Archivo PDF</a></li>
                <li><a style="color: red;" href="https://drive.google.com/file/d/1V9uVm0928RLKDPrl8Y6WevKmDIx_cQkV/view?usp=sharing">Archivo PDF</a></li>
                <li><a style="color: red;" href="https://drive.google.com/file/d/1V9uVm0928RLKDPrl8Y6WevKmDIx_cQkV/view?usp=sharing">Archivo PDF</a></li>
              </ul>
            </div>
            <div v-if="userData?.userType == userType?.transporter && userData?.position == userPosition?.transporter && detailsLoads.loadingStatus.text === 'Driver selection in progress'">
                <driver-truck></driver-truck>
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
import { userType, userPosition } from '../types'
import DriverTruck from '../components/AddDriverAndTruck.vue'

export default {
  name: "DetailsLoad",
  alias: "Detalles del Viaje",

  components: {
    IonLoading,
    DriverTruck
  },
  props: {
    timeout: { type: Number, default: 1000 },
  },
  mixins: [Mixins],
  data() {
    return {
      userType,
      userPosition,

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
      this.detailsLoads = this.detailsLoadsStore;
    // } else {
      // this.detailsLoads =  JSON.parse(localStorage.getItem('DeliveryCharges'));
      console.log( JSON.parse(localStorage.getItem('DeliveryCharges')))
    }
  },

  computed: {
    ...mapGetters(["detailsLoadsStore", "userData"]),
  },
  mounted () {
     JSON.parse(localStorage.getItem('DeliveryCharges'));
  },

  methods: {
    setOpe(val) {
      this.loaded = val;
      setTimeout(() => {
        this.loaded = false;
      }, 2000);
    },

    async setLoad(val) {
      console.log(val);
      for (var i = 0; i < val.Orders.length; i++) {
        let order = await this.$services.loadsScanServices.getProduct(
          val.Orders[i]._id
        );
        Object.assign(val.Orders[i], order[0]);
      }
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
      if (val?.loadingStatus?.text == "Driver selection in progress") return "Esperando Asignación del Chofer"
      if (val?.loadingStatus?.text == "Expecting Approval" && !val?.approvers[0].status) return "Esperando Aprobación $ Flai";
      if (val?.loadingStatus?.text == "Expecting Approval" && val?.approvers[0].status) return "Esperando Aprobación del Chofer";
      if (val?.loadingStatus?.text == "Approved") return "Viaje Aprobado";
      if (val?.loadingStatus?.text == "Driver Arrival") return "Chofer Llegó a Recoger";
      if (val?.loadingStatus?.text == "Dispatched") return "Listo Para Entregar";
      if (val?.loadingStatus?.text == "Loading truck") return "Cargando Vehiculo";
      if (val?.loadingStatus?.text == "Delivered") return "Viaje Entregado";
    },

    setLocaleDate(val) {
      return moment(val).format("LT");
    },
    ordenIsReturn(val) {
      let res = val?.Orders?.find((x) => x);
      if (res?.isReturn) return "Devolver Contenedor";
      return "Entregar Contenedor";
    },
    isReturnLoad(val) {
      return val.Orders.find((x) => x.isReturn);
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
</style>
