<template>
  <div class="uk-container uk-flex uk-flex-column uk-flex-between" :class="{backg: resultScan}">
    <div class="stiky">
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
        <div class="font-weight-medium uk-flex" style="width: 100%">
          <p style="margin-right: 10px !important">
            <strong>Shipper:</strong><span>&nbsp; {{ load?.client }}</span>
          </p>
          <p>
            <strong>Zona de Destino:</strong
            ><span>&nbsp; {{ load?.zone }}</span>
          </p>
        </div>
        <div class="info-header">
          <span class="status">Carga {{ load?.status }}</span>
          <img
            v-if="load?.status == 'Asignada'"
            src="../../assets/asigned.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="load?.status == 'Entregada'"
            src="../../assets/delivery.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="load?.status == 'En Ruta'"
            src="../../assets/road.png"
            class="icon-load"
            alt=""
          />
          <img
            v-if="load?.status == 'Despacho Aprobado'"
            src="../../assets/warehouse.png"
            class="icon-load"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="result-info">
      <ul
        class="uk-list uk-list-divider"
        style="list-style: none"
      >
        <li
          v-for="orden in orders"
          :key="orden"
          class="article uk-card uk-card-default uk-card-body"
        >
          <div>
            <p class="uk-width-1-1" style="font-weight: 600">
              <font-awesome-icon
                icon="map-marker-alt"
                style="font-size: 14px; color: green"
              />&nbsp;<strong>{{ orden.address }}</strong>
            </p>
            <strong>No. de Orden: &nbsp; {{ orden.numberOfOrders }}</strong>
          </div>
          <div class="uk-flex uk-flex-column" style="align-items: center">
            <font-awesome-icon
              icon="check-circle"
              style="font-size: 20px; color: green"
            />
            <span class="font-weight-medium" style="color: green">Entregada</span>
          </div>

          <div class="uk-flex" style="margin-top: 10px" >
              <img class="img-result" v-for="src in imagiElement" :key="src" :src="src" alt="Red dot" />
              <img class="img-result" :src="firm" alt="Fima Digital" />
          </div>
        </li>
      </ul>
    </div>
    <div
      class="cont uk-card uk-card-default uk-card-hover uk-card-body"
      style="z-index: 0; padding: 15px 0px  !important;"
    >
      <timeline
        :step="step"
        :exception="exception"
        :resultScan="resultScan"
        :imagiElement="imagiElement"
        @action="getShow($event)"
      />
    </div>
  </div>
</template>

<script>
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { mapGetters } from "vuex";
import timeline from "../../components/timeline.vue";
import { Camera, CameraResultType } from "@capacitor/camera";
export default {
  name: "DeliveryActions",
  components: {
    timeline,
  },
  data() {
    return {
      show: null,
      orders: null,
      resultScan: null,
      cont: 0,
      load: null,
      imagiElement: [],
      step: 0,
      exception: false,
      firm: null,
    };
  },
  computed: {
    ...mapGetters([
      "orderScan",
      "loadStore",
      "exceptionStore",
      "digitalFirmStore",
      "allOrders"
    ]),
  },
  mounted() {
    if(this.allOrders){
      this.orders = this.allOrders;
    }else{
      this.orders = this.orderScan;
    }
    this.load = this.loadStore;
    this.step++
    if (this.orderScan?.length > 1) {
      this.$emit("deliveryActions", `Entrega de Ordenes`);
    } else if (this.orderScan?.length == 1) {
      this.$emit(
        "deliveryActions",
        `Entrega de Orden No. ${this.orderScan[0]?.numberOfOrders}`
      );
    }
  },
  watch: {
    digitalFirmStore: {
      handler: function (newVal) {
        if (newVal !== null) {
          this.firm = newVal;
        }
      },
    },
  },

  methods: {
    getShow(value) {
      console.log('hfewbvfewhfew')
      this.show = value;
      if (value === "scan") {
        this.scanOrder();
      } else if (value === "camera" && this.imagiElement.length <= 6) {
        console.log('camarasssssssssssssss')
        this.getCam();

      } else if (value === "firm") {
        this.serieA = value;
        this.step++;
      }
    },
    async scanOrder() {
              this.step++;
      },

      verificacion(orders, result) {
        for (let i = 0; i < orders.length; i++) {
          if (i?.numberOfOrders === result.content.numberOfOrders) {
            return true
          }
        }
    },
    async stopScan() {
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
    },
    async checkPermission() {
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (status.granted) {
        return true;
      }

      return false;
    },

    async getCam() {
      console.log('sss')
      this.getCheckPermissions();
      const ele = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        limit: 3,
        resultType: CameraResultType.Base64,
      });
      const image = `data:image/${ele.format};base64, ${ele.base64String}`;
      this.imagiElement.push(image);

      if (this.imagiElement.length === 3) {
        this.step++;
      }
      this.cont = this.cont + 1;
    },

    async getPickImages() {
      let imagi = [];
      imagi.push(
        await Camera.pickImages({
          quality: 90,
          allowEditing: true,
          correctOrientation: true,
          width: "25%",
          limit: null,
          resultType: CameraResultType.Uri,
        })
      );
    },

    async getCheckPermissions() {
      const permissions = Camera.checkPermissions(['prompt' | 'prompt-with-rationale' | 'granted' | 'denied']);
      console.log(permissions);
      this.getRequestPermissions();
    },

    async getRequestPermissions() {
      try {
        const permissions1 = Camera.requestPermissions({
          permissions: ["camera" | "photos"],
        });
        console.log(permissions1);
      } catch (error) {
        console.log(error, "error");
      }
    },
  },
};
</script>

<style scoped>
.qr {
  width: 60%;
}
.circle {
  background-color: rgb(25, 189, 33);
}
.onoffswitch {
  position: relative;
  width: 73px;
  display: inline-block;
  width: 45px;
  margin: 0px 5px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.onoffswitch-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.onoffswitch-label {
  position: relative;
  top: 3px;
  display: block;
  overflow: hidden;
  cursor: pointer;
  height: 22px;
  padding: 0;
  line-height: 36px;
  border: 2px solid #e3e3e3;
  border-radius: 36px;
  background-color: #ffffff;
  transition: background-color 0.3s ease-in;
}
.onoffswitch-label:before {
  content: "";
  display: block;
  width: 20px;
  margin: 0px;
  background: #ffffff;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 19px;
  border: 2px solid #e3e3e3;
  border-radius: 36px;
  transition: all 0.3s ease-in 0s;
}
.onoffswitch-checkbox:checked + .onoffswitch-label {
  background-color: #02cf13;
}
.onoffswitch-checkbox:checked + .onoffswitch-label,
.onoffswitch-checkbox:checked + .onoffswitch-label:before {
  border-color: #02cf13;
}
.onoffswitch-checkbox:checked + .onoffswitch-label:before {
  right: 0px;
}
.exception {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}
.uk-container {
  margin: 0px -16px;

}
.backg {
    background-color: rgb(255, 255, 255);

}
.result-info {
  overflow: scroll;
  padding: 0px 10px;
  height: 100vh;
}
.stiky {
  color: #000 !important;
  top: 0px;
  z-index: 2;
  padding: 7px 10px 5px !important;
  background-color: rgb(248 248 248);
  box-shadow: 1px 0px 5px #898989;
}
.info-header {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.icon-load {
  width: 40%;
  margin-right: 20px;
}
.article {
  text-align: initial;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  width: 100%;
  background: #fefffe;
  color: rgb(0, 0, 0);
  box-shadow: 0px 1.2px 1px #ccc;
  border-radius: 10px;
  border: 1px solid #efefef;
  margin: 10px 0px;
  z-index: 3;
}
li::before {
  content: none;
}
.img-result {
  width: 21%;
  height: 60px;
  margin-right: 5px;
  border: 1px solid #000;
}

</style>
