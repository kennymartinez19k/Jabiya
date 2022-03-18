<template>
  <div>
    <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeout"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>
    <div class="md-6" style="text-align: center">
      <h5 class="uk-text-bold uk-text-left text-bold">Asignar Chofer y Vehículo:</h5>
    </div>

    <div>
      <h6 class="uk-text-left" style="color: #666 !important; font-size: 13px">Transportista: <span>{{transporterName}}</span></h6>
    </div>
    <form action="" class="table-border uk-margin-medium-bottom">
      <div class="table">
        <h5 class="uk-text-left" style="padding: 0px 15px" >1. Elija un Conductor</h5>
        <table class="uk-table uk-table-striped uk-table-hover uk-table-divider">
          <thead>
            <tr class="">
              <th scope="col" class="driverName">Nombre del Conductor</th>
            </tr>
          </thead>
          <tbody v-for="driver in drivers" :key="driver">
            <tr>
              <label class="list-name uk-flex uk-flex-center" :for="driver.driverId" :class="{active: carrierSelection.driverId !== null && driver.isSelectedDriver === true}"  @click="selectDriver(driver.driverId)">
                <td>{{driver.driverName}}</td>
              </label>
            </tr>
          
          </tbody>
        </table>
      </div>
      <div class="table">
        <h5 class="uk-text-left" style="padding: 0px 15px">2. Elija un Vehículo</h5>

        <table class="uk-table uk-table-striped uk-table-hover uk-table-divider">
          <thead>
            <tr>
              <label class=" list uk-flex uk-flex-around">
                <th scope="col">Marca</th>
                <th  scope="col">Placa</th>
                <th  scope="col">Costo</th>
              <th scope="col">Chofer Habitual</th>
              </label>
            </tr>
          </thead>
          <tbody  v-for="details in vehicles" :key="details">
            <tr>
              <label class=" uk-flex uk-flex-around list"  :class="{active: carrierSelection.vehicleId !== null && details.isSelectedVehicles === true}"  @click="selectVehicle(details.vehicleId)">
                <td>{{details.brand}}</td>
                <td>{{details.vehicleNo}}</td>
                <td>RD${{setRound(details.cost * detailsLoads?.currencyExchange?.atTheTimeOfAssigning)}}</td>
                <td>{{details?.driverName}}</td>
                </label>
            </tr>       
          </tbody>
        </table>
      </div>
      <div class=" button-opt">
      <button type="button" :disabled="disabledButton" class="uk-button uk-button-primary" @click="selectDriverAndVehicle()">Seleccionar Conductor y Vehículo </button>
    </div>
    </form>
  </div>
</template>

<script>
import { IonLoading } from "@ionic/vue";
import { ref } from "vue";


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
    const data = await this.$services.driverVehicleAssignment.getDriverAndVehicle(this.detailsLoads.loadMapId);
    this.setOpen(false)
    this.drivers = [...data.drivers]
    this.vehicles = [...data.vehicles]
    this.transporterName = data.transporterName
    console.log(data,'fffffffff')
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
      this.setOpen(true)
      this.disabledButton = true
      if (this.carrierSelection.vehicleId !== null && this.carrierSelection.driverId !== null) {
        localStorage.removeItem('dateCheck');
        localStorage.setItem('dateCheck', JSON.stringify(this.detailsLoads?.dateTime?.date));
        try{
          await this.$services.driverVehicleAssignment.postDriverVehicleAssignment(this.detailsLoads.loadMapId, this.carrierSelection);
        }catch(error){
          console.log(error)
        }
        this.setOpen(false)
        this.$router.push({ name: "home" }).catch(() => {});
      }
    
    },
      setRound (val) {
        return JSON.parse(Number.parseFloat(val).toFixed(3));
    }
  },
};
</script>

<style scoped>
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
  width: 91%;
  padding: 10px;
  position: fixed;
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
</style>
