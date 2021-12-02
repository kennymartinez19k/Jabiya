<template>
  <div class="uk-container uk-flex uk-flex-column">
      <div
        class="cont uk-card uk-card-default uk-card-hover uk-card-body"
        style="z-index: 0; padding: 15px 0px !important"
      >
        <strong class="exception">
          Hubo Alguna Excepcion? No
          <div class="onoffswitch">
            <input
              type="checkbox"
              v-model="exception"
              name="onoffswitch"
              class="onoffswitch-checkbox"
              id="myonoffswitch"
              tabindex="0"
            />
            <label class="onoffswitch-label" for="myonoffswitch"></label>
          </div>
          Si
        </strong>
        <timeline
          :step="step"
          :exception="exception"
          :resultScan="resultScan"
          :imagiElement="imagiElement"
          :digitalFirm="firm"
          @action="getShow($event)"
        />
      </div>
    <div class="result-info">
      <div class="uk-text-left">
        <p>{{ resultScan }}</p>
      </div>
      <div class="uk-flex uk-flex-row">
        <div
          v-for="src in imagiElement"
          :key="src"
          class="uk-margin-small-right"
        >
          <img
            style="
              width: 100px;
              min-height: 100px;
              max-height: 100px;
              border: 1px solid #000;
            "
            :src="src"
            alt="Red dot"
          />
        </div>
      </div>
      <div class="uk-margin uk-flex">
        <img
          style="width: 47%; height: 100px; border: 1px solid #000"
          :src="firm"
          alt="Fima Digital"
        />
      </div>
      <div id="modal_button" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
          <span class="uk-modal-title uk-padding-remove">Firme Aqui</span>
          <signature-action
            @digitalSignature="firm = $event"
          ></signature-action>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { mapGetters } from "vuex";
import timeline from "../components/timeline.vue";
import { Camera, CameraResultType } from "@capacitor/camera";
import SignatureAction from "../components/actions/SignatureAction.vue";
import UIkit from "uikit";
export default {
  name: "DeliveryActions",
  components: {
    timeline,
    SignatureAction,
  },
  data() {
    return {
      show: null,
      orders: null,
      resultScan: null,
      cont: 0,
      imagiElement: [],
      step: 0,
      exception: false,
      firm: null,
    };
  },
  computed: {
    ...mapGetters(["orderScan", "loadStore"]),
  },
  mounted() {
    this.orders = this.orderScan;
    this.getShow('scan')
    this.$store.commit("setCurrent", {
      menuName: `Entrega de Orden No. ${ this.loadStore?.numberOfOrden }`,
      componentName: "deliveryActions",
    });
  },

  methods: {
    getShow(value) {
      this.show = value;

      if (value === "scan") {
        this.scanOrder(this.orders);
      } else if (value === "camera" && this.imagiElement.length <= 6) {
        this.getCam();
      } else if (value === "firm") {
        this.step++;
        UIkit.modal("#modal_button").show();
      }
    },
    async scanOrder() {
      if (await this.checkPermission()) {
        BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

        if (result.hasContent) {
          this.resultScan = result.content;
          await this.stopScan();
          this.step++;
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
      const permissions = Camera.checkPermissions("prompt-with-rationale");
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
.uk-container{
      flex-direction: column-reverse;
    justify-content: space-between;
    margin: 0px -16px;
}
.result-info{
  overflow: scroll;
  padding: 0px 10px;
}
</style>
