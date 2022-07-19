<template>
  <div>
    <ion-loading :is-open="isOpenRef" cssClass="my-custom-class" message="Por favor Espere..." :duration="timeout"
      @didDismiss="setOpen(false)">
    </ion-loading>
    <div class="md-6">
      <h5 class="uk-text-bold uk-text-left text-bold">Asignar Chofer y Vehículo:qqq</h5>
    </div>

    <div>
      <h6 class="uk-text-left web-font-small font">Transportista: <span
          class="web-font-small">{{transporterName}}</span></h6>
    </div>
    <form action="" class="table-border uk-margin-medium-bottom">
      <div class="table">
        <h5 class="uk-text-left web-font-small select-padding">1. Elija un Conductor</h5>
        <table class="uk-table uk-table-striped uk-table-hover uk-table-divider">
          <thead>
            <tr>
              <th scope="col" class="driverName web-font-small">Nombre del Conductor</th>
            </tr>
          </thead>
          <tbody v-for="driver in drivers" :key="driver">
            <tr>
              <label class="list-name uk-flex uk-flex-center " :for="driver.driverId"
                :class="{active: carrierSelection.driverId !== null && driver.isSelectedDriver === true}"
                @click="selectDriver(driver.driverId)">
                <td class="web-font-small">{{driver.driverName}}</td>
              </label>
            </tr>

          </tbody>
        </table>
      </div>
      <div class="table">
        <h5 class="uk-text-left web-font-small select-padding">2. Elija un Vehículo</h5>

        <table class="uk-table uk-table-striped uk-table-hover uk-table-divider">
          <thead>
            <tr>
              <label class=" list uk-flex uk-flex-around">
                <th class="web-font-small" scope="col">Marca</th>
                <th class="web-font-small" scope="col">Placa</th>
                <th class="web-font-small" scope="col">Costo</th>
                <th class="web-font-small" scope="col">Chofer Habitual</th>
              </label>
            </tr>
          </thead>
          <tbody v-for="details in vehicles" :key="details">
            <tr>
              <label class="web-font-small uk-flex uk-flex-around list"
                :class="{active: carrierSelection.vehicleId !== null && details.isSelectedVehicles === true}"
                @click="selectVehicle(details.vehicleId)">
                <td class="web-font-small">{{details.brand}}</td>
                <td class="web-font-small">{{details.vehicleNo}}</td>
                <td class="web-font-small">{{ formatCurrency(details.cost *
                detailsLoads?.currencyExchange?.atTheTimeOfAssigning)}}</td>
                <td class="web-font-small">{{details?.driverName}}</td>
              </label>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  </div>
  <div class=" button-opt">
    <button type="button" :disabled="disabledButton" class="uk-button uk-button-primary web-font-small"
      @click="selectDriverAndVehicle()">Seleccionar Conductor y Vehículo </button>
  </div>
</template>

<script>
import { IonLoading } from "@ionic/vue";
import { ref } from "vue";
import { Mixins } from '../mixins/mixins'

export default {
  name: "AddDriverAndTruck",
   components: {
    IonLoading,
  },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  mixins: [Mixins],

  props: {
    detailsLoads: Object
  },
  data() {
    return {
      carrierSelection: {
        vehicleId: null,
        driverId: null,
      },
      drivers: [],
      vehicles: [],
      transporterName: null,
      disabledButton: true,
      timeOut: 10000
    };
  },
  watch: {
    carrierSelection: {
      handler: function () {
        if (this.carrierSelection.vehicleId !== null && this.carrierSelection.driverId !== null) {
         this.disabledButton = false;
        }
      },
      deep: true
    },
  },
  async mounted () {
    this.setOpen(true)
    let data = null
    try {
     data = await this.$services.driverVehicleAssignment.getDriverAndVehicle(this.detailsLoads.loadMapId);
    } catch (error) {
    this.setOpen(false)
    }
    this.setOpen(false)
    this.drivers = [...data.drivers]
    this.vehicles = [...data.vehicles]
    this.transporterName = data.transporterName
  },
  methods: {
    selectVehicle(id) {
      this.carrierSelection.vehicleId = id
      this.vehicles.forEach(x => {
        x.isSelectedVehicles = x.vehicleId === id
      }) 
    },
     selectDriver(id) {
      this.carrierSelection.driverId = id
      this.drivers.forEach(x => {
        x.isSelectedDriver = x.driverId === id
      }) 
    },
    async selectDriverAndVehicle () {
      this.disabledButton = true
      this.setOpen(true)
        localStorage.setItem('loadInProgress', JSON.stringify(this.detailsLoads.loadMapId));
      if (this.carrierSelection.vehicleId !== null && this.carrierSelection.driverId !== null) {
        localStorage.removeItem('dateCheck');
        localStorage.setItem('dateCheck', this.detailsLoads?.dateTime?.date);
        try{
          await this.$services.driverVehicleAssignment.postDriverVehicleAssignment(this.detailsLoads.loadMapId, this.carrierSelection);
        }catch(error){
          console.log(error)
        }
        this.setOpen(false)
        this.$router.push({ name: "home" }).catch(() => {});
      }
    
    },
     
  },
};
</script>

<style scoped>

.uk-table-hover tbody tr:hover {
  background-color: #efefef;
}
.table-border {
  border: 1px solid #000;
}
.table{
  padding: 20px 0px;
  border-bottom: 1px solid;
}
span {
  font-size: 13px;
  color: #6666668c;
}
h5 {
  font-size: 16px;
  font-weight: bold;
  color: #212529;
}
th {
  font-size: 10px; 
  font-weight: 600;
  color: #666;
}
td {
  font-size: 1.9vh;
}
@media screen and (max-width: 321px) {
  table .vehicle {
    padding: 0px 0px 8px 2px;
  }
}
.uk-table{
  padding: 20px 0px;
  margin: 0px !important;
}
.uk-table td { 
  padding: 10px 5px;
}
.list-name{
  width: 100%;
  padding: 5px 0px;
}
.list{
  width: 100%;
  padding: 5px 0px;
}
.list th{
  width: 25%;
  padding: 10px 0px;
  text-align: center;
}
.list td{
width: 20%;
font-size: 10px;
padding: 10px 0px;
}
.text {
  padding-left: 0px
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
  left: 14px;
}
.active {
  background-color: #1e87f0;
  color: #fff;
}
.driverName {
  padding: 10px;
  text-align: center;
}
.font {
  color: #666 !important;
  font-size: 13px
}
.select-padding {
  padding: 0px 15px
}
</style>
