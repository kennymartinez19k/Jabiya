<template>
  <div>
    <div class="md-6" style="text-align: center">
      <h5 class="uk-text-bold uk-text-left">Asignar Chofer y Vehículo:</h5>
    </div>

    <div>
      <h6 style="color: #666 !important">Transportista: <span>{{transporterName}}</span></h6>
    </div>
    <form action="" class="table-border uk-margin-medium-bottom">
      <h5>Elija un Conductor</h5>

      <table class="uk-table uk-table-striped uk-table-hover uk-table-divider">
        <thead>
          <tr class="">
            <th scope="col" style="width: 5px"></th>
            <th scope="col" style="display: inline">Nombre del Conductor</th>
          </tr>
        </thead>
        <tbody v-for="driver in drivers" :key="driver">
          <tr>
            <td scope="row">
              <input
                class="uk-radio"
                type="radio"
                name="driverId"
                :id="driver.driverId"
                :value="driver.driverId"
                v-model="carrierSelection.driverId"
                required
              />
            </td>
            <label :for="driver.driverId">
              <td>{{driver.driverName}}</td>
            </label>
          </tr>
         
        </tbody>
      </table>
      <h5>Elija un Vehículo</h5>

      <table class="uk-table uk-table-striped uk-table-hover uk-table-divider">
        <thead>
          <tr>
            <th scope="col" style="width: 0.3%"></th>
            <label class="uk-margin-remove uk-padding-remove list uk-flex uk-flex-around">
              <th scope="col">Marca</th>
              <th scope="col">Color</th>
              <th class="text" scope="col">Matrícula</th>
            </label>
          </tr>
        </thead>
        <tbody  v-for="details in vehicles" :key="details">
          <tr>
            <td scope="row">
              <input
                class="uk-radio"
                type="radio"
                name="vehicleId"
                :id="details.vehicleId"
                :value="details.vehicleId"
                v-model="carrierSelection.vehicleId"
                required
              />
            </td>
            <label class="uk-margin-remove uk-padding-remove uk-flex uk-flex-around list" :for="details.vehicleId">
              <td>{{details.brand}}</td>
              <td>{{details.color}}</td>
              <td>{{details.vehicleNo}}</td>
              </label>
          </tr>       
        </tbody>
      </table>
      <div class=" button-opt">
      <button type="button" :disabled="showButton" class="uk-button uk-button-primary" @click="selectDriverVehicle()">Seleccionar conductor y Vehículo </button>
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
    console.log(data)
    this.drivers = [...data.drivers]
    this.vehicles = [...data.vehicles]
    this.transporterName = data.transporterName
  },
  methods: {
    async selectDriverVehicle () {
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
.list th{
  width: 15%;
  min-width: 76px
}
.list td{
  width: 15%;
  min-width: 70px;
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
</style>
