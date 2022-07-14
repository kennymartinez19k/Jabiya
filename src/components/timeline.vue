<template>
  <div class="container container-medium">
    <div v-if="showSingnature === 'Singnature'" class="uk-padding-small" :class="{ 'singnature-position': exception }">
      <img src="../assets/rejected.png" class="icon-close" @click="closeSingnature()" />
      <signature-action @digitalSignature="singnature = $event"></signature-action>
    </div>

    <transition name="modal">
      <div v-if="isOpen">
        <div class="overlay" @click.self="isOpen = false;">
          <div class="modal">
            <div class="uk-margin ">
              <label class="uk-text-bolder text web-font-small" for="typeExp">Tipos de Excepción <span
                  class="uk-text-danger">*</span></label>
              <select id="typeExp" class="uk-select sub-text web-font-small" v-model="causeExceptions.type">
                <option disabled>Elija una Excepción</option>
                <option v-for="exception in detailsException" :key="exception" :value="exception">
                  {{exception}}
                </option>
              </select>
            </div>
            <div>
              <label class="uk-text-bolder text web-font-small" for="note">Notas <span
                  class="uk-text-danger">*</span></label>
              <textarea id="note" class="uk-textarea sub-text" rows="3" placeholder="Notas:"
                v-model="causeExceptions.note" required>
                </textarea>
            </div>
            <p class="uk-flex uk-flex-around">
              <button class="uk-button uk-button-default uk-modal-close cancel web-font-small" type="button"
                @click="cancelResetException()">
                Cancelar
              </button>
              <button :disabled="showException" class="uk-button uk-button-primary uk-modal-close web-font-small"
                type="button" @click="setException()">
                Guardar
              </button>
            </p>

          </div>
        </div>
      </div>
    </transition>
    <ul class="progressbar">
      <li v-if="loadStore.allowOrderChangesAtDelivery"
        :class="{ active: invoiceDownloadStore?.status && invoiceDownloadStore?.order == orderInformation?.order_num }"
        @click="getShow('invoices')">
        <div class="info active">
          <font-awesome-icon icon="check" />
        </div>
        <div><img src="../assets/invoice.png" alt="" srcset="" /></div>

        <span class="web-font-small">Facturas</span>
      </li>
      <li v-if="loadStore.scanningRequired" :class="{ active: resultScan, 'uk-disabled': !activeScan }"
        @click="getShow('scan')">
        <div class="info active">
          <font-awesome-icon icon="check" />
        </div>
        <div><img src="../assets/img/qr.png" alt="" srcset="" /></div>

        <span class="web-font-small">Escanear</span>
        <div :class="{ disabled: !activeScan }"></div>
      </li>
      <li :class="{
  'uk-disabled': !activeCamare,
        active: imagiElement.length > 0,
      }" @click="getShow('camera')">
        <div class="info active">
          <font-awesome-icon icon="check" />
        </div>
        <div><img src="../assets/img/cam.png" alt="" srcset="" /></div>
        <span class="web-font-small">Camara</span>
        <div :class="{ disabled: !activeCamare }"></div>
      </li>
      <li v-if="exception" :class="{
        'uk-disabled': !activeException,
        active:
          causeExceptions.note !== null &&
          causeExceptions.type !== null &&
          showException === false,
      }" @click="getShow('exception')">
        <div class="info active">
          <font-awesome-icon icon="check" />
        </div>
        <div><img src="../assets/img/warning.png" alt="" srcset="" /></div>
        <span class="web-font-small">Excepción</span>
        <div :class="{
          disabled: !activeException,
        }"></div>
      </li>
      <li :class="{
        'uk-disabled': !activeSignature,
        active: singnature !== null
      }" @click="getShow('Singnature')">
        <div class="info">
          <font-awesome-icon icon="check" />
        </div>
        <div><img src="../assets/img/firma.png" alt="" srcset="" /></div>
        <span class="web-font-small">Firma</span>
        <div :class="{ disabled:!activeSignature}"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import SignatureAction from "../components/actions/SignatureAction.vue";
import { mapGetters } from 'vuex';
export default {
  components: {
    SignatureAction,
  },

  props: {
    step: Number,
    exception: Boolean,
    resultScan: String,
    imagiElement: Array,
  },
  
  data() {
    return {
      causeExceptions: {
        note: null,
        type: null,
      },
      showException: true,
      showSingnature: null,
      singnature: null,
      detailsException: [],
      orderInformation: null,
      order: null,
      showInvoice: true,
      isOpen: false,

    };
  },
  computed: {
    ...mapGetters([
      'imagesStore','loadStore','invoiceDownloadStore', 'orderScan',
    ]),
    imageTimeline(){
      if(this.imagesStore){
        this.changeImage()

      }

      return this.imagesStore
    },
    emptyImage(){
      return this.imagesStore?.length <= 0
    },

    activeSignature(){
      let downloadInvoices = false
      let scanRequired = this.loadStore.scanningRequired
      let allowInvoices = this.loadStore.allowOrderChangesAtDelivery
      let loadsMounted = [];
      if (this.orderScan) {
        loadsMounted = this.orderScan
      } else {
        loadsMounted = JSON.parse(localStorage.getItem('DeliveryCharges')).Orders
      }
     
      if (allowInvoices && loadsMounted.find(order => order.order_num == this.invoiceDownloadStore?.order)) {
       downloadInvoices = this.invoiceDownloadStore.status
      } 
      let exception = this.exception
      let exceptionInfo = ( this.causeExceptions.type && this.causeExceptions.note != null)
      let img = !this.emptyImage
     
      if(scanRequired && allowInvoices && exception && this.resultScan &&  exceptionInfo && img && downloadInvoices){
        return true

      }else if (scanRequired && allowInvoices && !exception && this.resultScan && !exceptionInfo && img && downloadInvoices){
        return true

      }else if (scanRequired && !allowInvoices && exception && this.resultScan && exceptionInfo && img && !downloadInvoices){
        return true
      
      }else if (scanRequired && !allowInvoices && exception && !this.resultScan && exceptionInfo && img && !downloadInvoices){
        return true
      
      }else if (scanRequired && !allowInvoices && !exception && this.resultScan && !exceptionInfo && img && !downloadInvoices){
        return true
        
      }else if (!scanRequired && allowInvoices && exception && !this.resultScan && exceptionInfo && img && downloadInvoices){
        return true
        
      }else if (!scanRequired && allowInvoices && !exception && !this.resultScan && !exceptionInfo && img && downloadInvoices){
        return true
        
      }else if (!scanRequired && !allowInvoices && exception && !this.resultScan && exceptionInfo && img && !downloadInvoices){
        return true
        
      }else if (!scanRequired && !allowInvoices && !exception && !this.resultScan && !exceptionInfo && img && !downloadInvoices){
        return true
      }else{
        return false
      }

    },

     activeScan() {
      let downloadInvoices = false
      let scanRequired = this.loadStore.scanningRequired
      let allowInvoices = this.loadStore.allowOrderChangesAtDelivery
      let loadsMounted = [];
      if (this.orderScan) {
        loadsMounted = this.orderScan
      } else {
        loadsMounted = JSON.parse(localStorage.getItem('DeliveryCharges')).Orders
      }

      if (allowInvoices && loadsMounted.find(order => order.order_num == this.invoiceDownloadStore?.order)) {
        downloadInvoices = this.invoiceDownloadStore.status
      }
     
      if (scanRequired && allowInvoices && downloadInvoices) {
        return true

      } else if (scanRequired && !allowInvoices  && !downloadInvoices) {
        return true

      } else {
        return false
      }

    },

    activeCamare() {
      let downloadInvoices = false
      let scanRequired = this.loadStore.scanningRequired
      let allowInvoices = this.loadStore.allowOrderChangesAtDelivery
      let loadsMounted = [];
      let exception = this.exception

      if (this.orderScan) {
        loadsMounted = this.orderScan
      } else {
        loadsMounted = JSON.parse(localStorage.getItem('DeliveryCharges')).Orders
      }

      if (allowInvoices && loadsMounted.find(order => order.order_num == this.invoiceDownloadStore?.order)) {
        downloadInvoices = this.invoiceDownloadStore.status
      }

      if (allowInvoices && downloadInvoices && scanRequired && this.resultScan) {
        return true

      } else if (exception && !allowInvoices) {
        return true

      } else if (!scanRequired && !allowInvoices && !downloadInvoices) {
        return true

      } else if (!scanRequired && allowInvoices && downloadInvoices) {
        return true

      } else if (scanRequired && this.resultScan) {
        return true

      } else {
        return false
      }

    },

    activeException() {
      let downloadInvoices = false
      let scanRequired = this.loadStore.scanningRequired
      let allowInvoices = this.loadStore.allowOrderChangesAtDelivery
      let loadsMounted = [];
      if (this.orderScan) {
        loadsMounted = this.orderScan
      } else {
        loadsMounted = JSON.parse(localStorage.getItem('DeliveryCharges')).Orders
      }

      if (allowInvoices && loadsMounted.find(order => order.order_num == this.invoiceDownloadStore?.order)) {
        downloadInvoices = this.invoiceDownloadStore.status
      }
      
      let img = !this.emptyImage

      if (scanRequired && allowInvoices && this.resultScan && img && downloadInvoices) {
        return true

      } else if (scanRequired && !allowInvoices && this.resultScan && img && !downloadInvoices) {
        return true

      } else if (!scanRequired && !allowInvoices  && img && !downloadInvoices) {
        return true

      } else if (!scanRequired && allowInvoices && img && downloadInvoices) {
        return true

      } else {
        return false
      }

    },
  },
  async mounted() {
    this.detailsException = await JSON.parse(localStorage.getItem('detailsException'));
    if (this.orderScan ) {
      this.order = this.orderScan
    } else {
      this.order = JSON.parse(localStorage.getItem("scanOrder"));
      this.$store.commit("scanOrder", this.order);
    }

    this.orderInformation = await this.loadStore.Orders.find(x => x.order_num === this.order[0].order_num)

    if (!this.invoiceDownloadStore?.status && this.loadStore.allowOrderChangesAtDelivery) {
      let invoicesDwl = JSON.parse(localStorage.getItem(`getInvoiceDownload${this.orderInformation.order_num}`))
      this.$store.commit("getInvoiceDownload", invoicesDwl);
    }
  },

  watch: {
    singnature: {
      handler: function (newVal) {
        if (newVal !== null) {
          this.showSingnature = null;
          this.$store.commit("setDigitalFirm", this.singnature);
        }
      },
      deep: true,
    },
    imagiElement: {
      handler: function (newVal) {
        if (newVal.length > 0 && this.causeExceptions.note !== null && this.causeExceptions.type !== null) {
          this.$emit("action", 'exception');
        }
      }, deep: true
    }, 
    exception: {
      handler: function (newVal) {
        if(newVal) this.closeSingnature()
        if (newVal === false && this.step >= 2) {
          this.causeExceptions.note = null;
          this.causeExceptions.type = null;
          this.showException = true;
         } 
        if(newVal == false){
           this.causeExceptions.note = null;
          this.causeExceptions.type = null;
        }
      },
      deep: true,
    },
     'causeExceptions.type': function (newVal, oldVal) {
        if (
          newVal !== oldVal && this.causeExceptions?.note?.length > 10
        ) {
          this.showException = false;
        } else {
          this.showException = true;
        }
    },

     'causeExceptions.note': function (newVal) {
        if (
         newVal?.note !== null && this.causeExceptions?.type !== null
        ) {
          if ( this.causeExceptions?.note?.length > 10 ) {
             this.showException = false;
          } else {
          this.showException = true;
        }
        }
    },

  
  },
  methods: {
   async getShow(value) {
      this.$emit("action", value);
      if (value === "scan") {
        this.$emit("action", value);
      }
      if (value === "exception") {
        this.dataExteions(await JSON.parse(localStorage.getItem('detailsException')))
        this.isOpen = true

        if (this.imagiElement.length > 0) {
        this.$emit("action", value);
        }
      }
      if (value === "Singnature") {
        this.showSingnature = value;
      }
      if (value === "invoices") {
        this.$router.push({ name: "details-invoices" }).catch(() => {});
      }
    },
    cancelResetException() {
        this.isOpen = false

      this.causeExceptions.note = null;
      this.causeExceptions.type = null;
      this.$store.commit("setExceptions", this.causeExceptions);
      this.showException = false;
    },
    setException() {
      if (
        this.causeExceptions.note !== null &&
        this.causeExceptions.type !== null
      ) {
        this.isOpen = false
        this.showException = true
        this.$store.commit("setExceptions", this.causeExceptions);
     
        this.showException = false
      }
    },
    closeSingnature() {
      this.showSingnature = null;
      this.singnature = null;
        this.$emit("resetSign", false);
    },
    changeImage(){
      if (this.imageTimeline?.length > 0 && (this.exception == false || (this.causeExceptions.note !== null && this.causeExceptions.type !== null))) {
        this.$emit("action", 'exception');
      }
    },
    async dataExteions(value) {
    this.detailsException = value

    }
    
  },

};
</script>

<style scoped>

.container {
  width: 100%;
  max-width: 700px;
  margin: 0px auto;
  position: relative;
}
.disabled {
  position: absolute;
  width: 100%;
  height: 70%;
  top: 40px;
  left: 6px;
  background: #ffffffc4;
}
img {
  width: 35%;
}
.progressbar li {
  float: left;
  width: 30%;
  position: relative;
  text-align: center;
  max-width: 105px;
}

ul {
  list-style: none;
  padding: 0px;
  margin: 0px auto;
  display: flex;
  justify-content: center;
}
.progressbar li:before {
  content: "";
  width: 30px;
  height: 30px;
}
.progressbar li .info {
  content: "";
  width: 30px;
  height: 30px;
  border: 2px solid #bebebe;
  display: block;
  margin: 0 auto 10px auto;
  border-radius: 50%;
  line-height: 27px;
  background: white;
  color: #bebebe;
  text-align: center;
  font-weight: bold;
}

.progressbar li:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 3px;
  background: #979797;
  top: 15px;
  left: -50%;
  z-index: -1;
}
.progressbar li:first-child:after {
  content: none;
}
.progressbar li.active + li:after {
  background: #3aac5d;
}
.active .info {
  border-color: #3aac5d !important;
  background: #3aac5d !important;
  color: white !important;
}
.icon-close {
  background-color: #f04c3b40;
  position: absolute;
  top: -6px;
  width: 25px;
  right: 5px;
  border-radius: 10px;
  margin: 2px 0px 0px -23px;
}
.cancel {
  background-color: rgb(119, 5, 5);
  color: #fff;
}

.modal {
  width: 500px;
  margin: 0px auto;
  padding: 20px;
  margin: 0px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 3px;
  transition: all 0.2s ease-in;
  font-family: Helvetica, Arial, sans-serif;
  text-align: left;

}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  background: #00000094;
  z-index: 999;
  transition: opacity 0.2s ease;
  padding-top: 50px;
}
.fadeIn-enter {
  opacity: 0;
}

.fadeIn-leave-active {
  opacity: 0;
  transition: all 0.2s step-end;
}

.fadeIn-enter .modal,
.fadeIn-leave-active.modal {
  transform: scale(1.1);
}
.text {
  font-size: 18px;
  font-weight: 600;
}
.sub-text {
  font-size: 15px;
  font-weight: 300;
}
.singnature-position {
  padding: 15px 15px 60px;
  
}
@media (min-width: 900px){
  .constainer{
    width: 100%;
  }
}

@media (min-width: 900px){
  .progressbar li {
    max-width: 140px !important;
  }
}
</style>
