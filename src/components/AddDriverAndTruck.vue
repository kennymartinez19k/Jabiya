<template>
  <div>
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
              <label class=" uk-flex uk-flex-center" :for="driver.driverId" :class="{active: carrierSelection.driverId !== null && driver.isSelectedDriver === true}"  @click="selectDriver(driver.driverId)">
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
                <th scope="col">Color</th>
                <th  scope="col">Placa</th>
                <th  scope="col">Costo</th>
              </label>
            </tr>
          </thead>
          <tbody  v-for="details in vehicles" :key="details">
            <tr>
              <label class=" uk-flex uk-flex-around list"  :class="{active: carrierSelection.vehicleId !== null && details.isSelectedVehicles === true}"  @click="selectVehicle(details.vehicleId)">
                <td>{{details.brand}}</td>
                <td>{{details.color}}</td>
                <td>{{details.vehicleNo}}</td>
                <td>${{details.cost * detailsLoads?.currencyExchange?.atTheTimeOfAssigning}}</td>
                </label>
            </tr>       
          </tbody>
        </table>
      </div>
      <div class=" button-opt">
      <button type="button" :disabled="showButton" class="uk-button uk-button-primary" @click="selectDriverAndVehicle()">Seleccionar conductor y Vehículo </button>
    </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddDriverAndTruck",

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
      showButton: true
    };
  },
  watch: {
    carrierSelection: {
      handler: function () {
        if (this.carrierSelection.vehicleId !== null && this.carrierSelection.driverId !== null) {
         this.showButton = false;
        }
      },
      deep: true
    },
  },
  async mounted () {
    const data = await this.$services.driverVehicleAssignment.getDriverAndVehicle(this.detailsLoads.loadMapId);
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
      if (this.carrierSelection.vehicleId !== null && this.carrierSelection.driverId !== null) {
        localStorage.removeItem('dateCheck');
        localStorage.setItem('dateCheck', JSON.stringify(this.detailsLoads?.dateTime?.date));
        await this.$services.driverVehicleAssignment.postDriverVehicleAssignment(this.detailsLoads.loadMapId, this.carrierSelection);
        this.$router.push({ name: "home" }).catch(() => {});
      }
    
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
  font-size: 11px; 
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
  padding: 10px 12px;
}
.list th{
  width: 10%;
  min-width: 51px;
  padding: 10px 0px;
  text-align: center;
}
.list td{
width: 10%;
    min-width: 51px;
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
