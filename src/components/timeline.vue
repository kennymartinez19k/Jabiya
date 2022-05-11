<template>
  <div class="container container-medium">
    <div v-if="showSingnature === 'Singnature'" class="uk-padding-small">
      <img
        src="../assets/rejected.png"
        class="icon-close"
        @click="closeSingnature()"
      />
      <signature-action
        @digitalSignature="singnature = $event"
      ></signature-action>
    </div>

    <transition name="modal">
      <div v-if="isOpen">
        <div class="overlay" @click.self="isOpen = false;">
          <div class="modal">
             <div class="uk-margin ">
                <label class="uk-text-bolder text" for="typeExp">Tipos de Excepción <span class="uk-text-danger">*</span></label>
                <select id="typeExp" class="uk-select sub-text" v-model="causeExceptions.type">
                  <option disabled>Elija una Excepción</option>
                  <option
                    v-for="exception in detailsException"
                    :key="exception"
                    :value="exception"
                  >
                  {{exception}}
                  </option>
                </select>
              </div>
              <div>
                <label class="uk-text-bolder text" for="note"
                  >Notas <span class="uk-text-danger">*</span></label
                >
                <textarea
                  id="note"
                  class="uk-textarea sub-text"
                  rows="3"
                  placeholder="Notas:"
                  v-model="causeExceptions.note"
                  required
                >
                </textarea>
              </div>
              <p class="uk-flex uk-flex-around">
                <button
                  class="uk-button uk-button-default uk-modal-close cancel"
                  type="button"
                  @click="cancelResetException()"
                >
                  Cancelar
                </button>
                <button
                  :disabled="showException"
                  class="uk-button uk-button-primary uk-modal-close"
                  type="button"
                  @click="setException()"
                >
                  Guardar
                </button>
              </p>

          </div>
        </div>
      </div>
    </transition>
    <ul class="progressbar">
       <li
       v-if="loadStore.allowOrderChangesAtDelivery"
        class="stepOne"
        :class="{ active: invoiceDownloadStore?.status && invoiceDownloadStore?.order == orderInformation?.order_num }"
        @click="getShow('invoices')"
      >
        <div class="info active"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/invoice.png" alt="" srcset="" /></div>

        <span>Facturas</span>
      </li>
      <li
       v-if="loadStore.scanningRequired"
        class="stepOne"
        :class="{ active: resultScan !== false }"
        @click="getShow('scan')"
      >
        <div class="info active"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/qr.png" alt="" srcset="" /></div>

        <span>Escanear</span>
      </li>
      <li
        class="stepTwo"
        :class="{
          'uk-disabled': step == 0,
          active: imagiElement.length > 0,
        }"
        @click="getShow('camera')"
      >
        <div class="info active"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/cam.png" alt="" srcset="" /></div>
        <span>Camara</span>
        <div :class="{ disabled: step < 1 }"></div>
      </li>
      <li
        v-if="exception"
        :class="{
          'uk-disabled': step == 0,
          active:
            causeExceptions.note !== null &&
            causeExceptions.type !== null &&
            showException === false,
        }"
        @click="getShow('exception')"
      >
        <div class="info active"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/warning.png" alt="" srcset="" /></div>
        <span>Excepción</span>
        <div
          :class="{
            disabled: step == 0,
          }"
        ></div>
      </li>
      <li
        class="stepThree"
        :class="{
          'uk-disabled': !activeSignature,
          active: singnature !== null
        }"
        @click="getShow('Singnature')"
      >
        <div class="info"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/firma.png" alt="" srcset="" /></div>
        <span>Firma </span>
        <!-- <div :class="{ disabled: (exception || emptyImage ) && (!causeExceptions.type || emptyImage) && (showInvoice || ) }"></div> -->
        <div :class="{ disabled:!activeSignature}"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import SignatureAction from "../components/actions/SignatureAction.vue";
// import UIkit from "uikit";
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
      showSingnatureAndException: true,
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

    }
  },
  async mounted() {
    this.detailsException = await JSON.parse(localStorage.getItem('detailsException'));
    this.order = this.orderScan
    this.orderInformation = await this.loadStore.Orders.find(x => x.order_num)
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
        if (newVal.length === 0) {
          this.showSingnatureAndException = true;
        } else if (newVal.length > 0 && this.causeExceptions.note !== null && this.causeExceptions.type !== null) {
          this.$emit("action", 'exception');
          this.showSingnatureAndException = false;
        }
      }, deep: true
    }, 
    exception: {
      handler: function (newVal) {
        if(newVal) this.closeSingnature()
        if (newVal === false && this.step >= 2) {
          this.showSingnatureAndException = false;
          this.causeExceptions.note = null;
          this.causeExceptions.type = null;
          this.showException = true;
        } else if (
          newVal === true &&
          this.causeExceptions.note !== null &&
          this.causeExceptions.type !== null &&
          this.step >= 2
        ) {
          this.showSingnatureAndException = false;
        } else if(newVal == true) {
          this.showSingnatureAndException = true;
        }
        if(newVal == false){
           this.causeExceptions.note = null;
          this.causeExceptions.type = null;
        }
      },
      deep: true,
    },
    // causeExceptions: {
    //   handler: function (newVal) {
    //     if (
    //       newVal.note !== null &&
    //       newVal.note.length > 10 &&
    //       newVal.type !== null
    //     ) {
    //       this.showException = false;
    //     }
    //   },
    //   deep: true,
    // },
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

    step: {
      handler: function (newVal) {
        if (
          newVal >= 2 &&
          this.exception === true &&
          this.causeExceptions.note !== null &&
          this.causeExceptions.type !== null
        ) {
          this.showSingnatureAndException = false;
        } else if (newVal >= 2 && this.exception === false) {
          this.showSingnatureAndException = false;
        }
      },
      deep: true,
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
        // UIkit.modal("#exception").show();
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
      this.showSingnatureAndException = true;
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
        if (
          this.exception === true &&
          this.causeExceptions.note !== null &&
          this.causeExceptions.type !== null &&
          this.step >= 2 && 
          this.imagiElement.length > 0
        ) {
          this.showSingnatureAndException = false;
        }
        this.showException = false
      }
    },
    closeSingnature() {
      this.showSingnature = null;
      this.singnature = null;
      this.showSingnatureAndException = true;
        this.$emit("resetSign", false);
    },
    changeImage(){
      if (this.imageTimeline?.length === 0) {
          this.showSingnatureAndException = true;
        } else if (this.imageTimeline?.length > 0 && (this.exception == false || (this.causeExceptions.note !== null && this.causeExceptions.type !== null))) {
          this.$emit("action", 'exception');
          this.showSingnatureAndException = false;
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
  height: 100%;
  top: 40px;
  left: 10px;
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
  right: -2px;
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
@media (min-width: 900px){
  .constainer{
    width: 100%;
  }
}

@media (min-width: 900px){
  .progressbar li {
    max-width: 180px !important;
  }
}
</style>
