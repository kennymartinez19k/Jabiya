<template>
  <div>
    <div class="md-6" style="text-align: center">
      <h5 class="uk-text-bold">Detalles del Transportista</h5>
    </div>

    <div>
      <h6 style="color: #666 !important">Transportista: <span>Kenny</span></h6>
    </div>
    <form action="" class="table-border">
      <h5>Elija un Conductor</h5>

      <table class="uk-table uk-table-striped uk-table-hover uk-table-divider">
        <thead>
          <tr class="">
            <th scope="col" style="width: 5px"></th>
            <th scope="col" style="display: inline">Nombre del Conductor</th>
          </tr>
        </thead>
        <tbody v-for="details in data" :key="details">
          <tr>
            <td scope="row">
              <input
                class="uk-radio"
                type="radio"
                name="driverId"
                :id="details.id"
                :value="details"
                v-model="carrierSelection.driver"
                required
              />
            </td>
            <label :for="details.id">
              <td>{{details.driver}}</td>
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
              <th scope="col" >No. del Vehículo</th>
              <th scope="col">Marca</th>
              <th scope="col">Costo</th>
            </label>
          </tr>
        </thead>
        <tbody v-for="details in dataVehicle" :key="details">
          <tr>
            <td scope="row">
              <input
                class="uk-radio"
                type="radio"
                name="vehicleId"
                :id="details.id"
                :value="details"
                v-model="carrierSelection.vehicle"
                required
              />
            </td>
            <label class="uk-margin-remove uk-padding-remove uk-flex uk-flex-around list" :for="details.id"
              ><td>{{details.vehicleNo}}</td>
              <td>{{details.brand}}</td>
              <td>{{details.costDetails.cost}}</td></label
            >
          </tr>       
        </tbody>
      </table>
    </form>
    
    <div class="uk-margin-small-top">
      <button type="button" class="uk-button uk-button-primary" @click="selectDriverVehicle()">Seleccionar conductor y Vehículo </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddDriverAndTruck",

  data() {
    return {
      carrierSelection: {
        driver: null,
        vehicle: null,
      },
      data: [
        {
         id: 1,
         driver: "Wilson Soto",
        },
        {
         id: 2,
         driver: "Marcos Andujar",
        },
        {
         id: 3,
        driver: "Migule Gonzales",
        },
        {
         id: 4,
         driver: "Kenny Martinez",
        }
      ],
        dataVehicle: [
       {
         id: 5,
         vehicleNo: 123654,
        brand: "toyota",
        costDetails: {
          cost: 10
        }
       },
        {
         id: 6,
         vehicleNo: 123654,
        brand: "mazda",
        costDetails: {
          cost: 10
        }
       },
        {
         id: 7,
         vehicleNo: 123654,
        brand: "Isuzu",
        costDetails: {
          cost: 10
        }
       },
        {
         id: 8,
         vehicleNo: 123654,
        brand: "toyota",
        costDetails: {
          cost: 10
        }
       }
      ]
    };
  },
  watch: {
    "carrierSelection.driver": function () {
      console.log(this.carrierSelection, "getCarrierSelection");
    },
    "carrierSelection.vehicle": function () {
      console.log(this.carrierSelection, "getCarrierSelection");
    },
  },
  methods: {
    getCarrierSelection(value) {
      console.log(value, "getCarrierSelection");
      console.log(this.carrierSelection, "getCarrierSelection");
    },
    selectDriverVehicle () {
      this.$router.push({ name: "home" }).catch(() => {});
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
  color: #666
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
</style>
