<template>
  <div class="uk-flex uk-flex-column uk-flex-between cnt">
    <div class="stiky">
      <h5
        class="uk-text-center uk-margin-remove"
        style="margin-bottom: 5px !important"
      >
        <strong>ILS 11/23/2021 1:30PM Gate 01</strong>
      </h5>
      <div
        class="
          uk-flex
          uk-flex
          uk-flex-between
          uk-flex-left
          uk-margin-remove
          uk-padding-remove
        "
        style="align-items: center"
      >
        <div style="font-size: 13px; font-weight: 500">
          <p class="uk-width-1-1 uk-flex">
            <strong>Shipper:</strong><span>&nbsp; {{ load?.client }}</span>
          </p>
          <p class="uk-width-1-1 uk-flex">
            <strong>Zona de Destino:</strong
            ><span>&nbsp; {{ load?.zone }}</span>
          </p>
        </div>
        <div class="info-header">
          <span class="status">Carga {{ load?.status }}</span>
          <img
            v-if="load?.status == 'Asignada'"
            src="../assets/truckGreen.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="load?.status == 'Entregada'"
            src="../assets/truckDefault.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="load?.status == 'En Ruta'"
            src="../assets/truckBlue.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="load?.status == 'Despacho Aprobado'"
            src="../assets/truckOrange.png"
            class="icon-load"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="uk-card uk-card-default uk-width-1-2@m uk-margin-medium-bottom">
      <div
        v-for="order in orders"
        :key="order"
        class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
      >
        <div class="uk-text-left info-user uk-flex uk-flex-wrap">
          <div class="btn uk-flex">
            <div class="uk-flex uk-flex-column uk-text-center">
              <p
                style="font-size: 16px !important; font-weight: 600"
                class="uk-width-1-1"
              >
                <span>{{ order.client }}</span>
              </p>
            </div>
            <span>
              <img src="../assets/box.png" alt="" />
            </span>
          </div>
          <p class="uk-width-1-1">
            <strong>Dirección: </strong><span>{{ order.address }}</span>
          </p>
          <p class="uk-width-1-2">
            <strong> No. de Orden: </strong
            ><span>{{ order.numberOfOrders }}</span>
          </p>
          <p class="uk-width-1-2">
            <strong>No. de Cajas: </strong>{{ order.numberOfBox }}<span></span>
          </p>
          <div
            class="uk-flex uk-width-1-1 uk-flex-between"
            style="margin-top: 10px"
          >
            <div class="uk-width-1-2">
              <div
                class="uk-flex-column"
                style="align-items: center; display: inline-flex"
              >
                <img src="../assets/map.png" class="img-scan" alt="" />
                <span>Ver Ruta</span>
              </div>
            </div>
            <div class="uk-width-1-2">
              <div
                class="uk-flex-column"
                @click="scan(order)"
                style="align-items: center; display: inline-flex"
              >
                <img src="../assets/parcel.png" class="img-scan" alt="" />
                <span>Entregar Orden</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <slide-unlock
      ref="vueslideunlock"
      :auto-width="true"
      :circle="true"
      :disabled="false"
      :noanimate="false"
      :width="400"
      :height="40"
      :completedBg="completed"
      class="slide"
      text="Escaneo Corrido"
      success-text="success"
      @completed="complete(orders)"
      textSize="10px"
    />
  </div>
</template>

<script>
import {} from "../assets/img/truk1.png";
import SlideUnlock from "vue-slide-unlock";
import { Geolocation } from "@capacitor/geolocation";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { mapGetters } from "vuex";
export default {
  alias: 'Entregar Ordenes',
  data() {
    return {
      status: null,
      result: null,
      load: null,
      completed: "background-color: #2a307c !important",
      orders: [
        {
          numberOfOrders: 1223,
          numberOfBox: 2,
          client: "Juan Martinez Soto",
          address: "Sto Dgo Este, Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
        },
        {
          numberOfOrders: 1223,
          numberOfBox: 2,
          client: "Maria Lisbeth Alcantara Rodriguez",
          address: "Sto Dgo Este, Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
        },
        {
          numberOfOrders: 1223,
          numberOfBox: 2,
          client: "Albert Perez",
          address: "Sto Dgo Este, Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
        },
        {
          numberOfOrders: 1223,
          numberOfBox: 2,
          client: "Jose Abreu Pichardo",
          address: "Sto Dgo Este, Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
        },
        {
          numberOfOrders: 1223,
          numberOfBox: 2,
          client: "Juan Jose Garcia",
          address: "Sto Dgo Este, Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
        },
      ],
    };
  },
  components: {
    SlideUnlock,
  },
  computed: {
    ...mapGetters(["loadStore"]),
  },
  mounted() {
    this.$store.commit("setCurrent", {
      menuName: "Entrega de ordenes",
      componentName: "orders",
    });
    this.load = this.loadStore;
  },
  methods: {
        async location () {
        try {
          const geo = await Geolocation.getCurrentPosition();
          this.location1.latitude = geo.coords.latitude
          this.location1.longitude = geo.coords.longitude
          // this.successCallback ( this.location1)
            console.log('Current position:', this.location1);
        } catch (e) {
          console.log('Current position:', this.location1);
        
        }
    },
    complete(val) {
      this.scan(val);
    },
    scan(val) {
      this.$store.commit("scanOrder", val);
      this.$router.push({ name: "deliveryActions" }).catch(() => {});
    },
    async scanOrder() {
      if (await this.checkPermission()) {
        BarcodeScanner.hideBackground();

        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

        if (result.hasContent) {
          this.result = result.content;
          this.stopScan();
        }
      }
    },
    async stopScan() {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    },
    async checkPermission() {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      this.status = status;

      if (status.granted) {
        // the user granted permission
        return true;
      }

      return false;
    },
  },
};
</script>

<style scoped>
.slide .slideunlock.is-complete .slideunlock-progressbar {
  background-color: #2a307c;
}
.slide:first-child {
  background-color: #2a307c;
}
.cnt {
  height: 100%;
  overflow: scroll;
}
.uk-card {
  padding: 20px 10px;
}
.uk-card-body {
  margin-bottom: 10px;
  align-items: center;
  padding: 16px 15px;
}
.slide {
  position: fixed;
  width: 97% !important;
  bottom: 5px;
  height: 40px;
}
.status {
  color: green;
  font-weight: 500;
  font-size: 14px;
}
.btn {
  display: flex;
  align-items: baseline;
  width: 100%;
}
.btn img {
  width: 20px;
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
  transform: scaleX(-1);
  width: 70px;
  display: flex;
}

.img-scan {
  width: 39px;
}
.icon-load {
  width: 35%;
  margin-right: 20px;
  transform: scaleX(-1);
}
.btn-scan {
  margin-top: 12px;
  box-shadow: 0px -0.5px 3px #000;
  border: 0px;
  color: #fff;
  padding: 3px;
  background: #2a307c;
}
.stiky {
  color: #000 !important;
  top: 0px;
  z-index: 2;
  padding: 5px 10px !important;
  background-color: rgb(248 248 248);
  box-shadow: 1px 0px 5px #898989;
}
.info-header {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.status {
  color: green;
  font-weight: 500;
  font-size: 12px;
}
</style>
