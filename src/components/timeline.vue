<template>
  <div class="container">
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
    <!-- This is the modal -->
    <div id="exception" uk-modal>
      <div class="uk-modal-dialog uk-modal-body">
        <div class="uk-margin">
          <label class="uk-text-bolder" for="typeExp">Tipos de Excepción <span class="uk-text-danger">*</span></label>
          <select id="typeExp" class="uk-select" v-model="causeExceptions.type">
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
          <label class="uk-text-bolder" for="note"
            >Notas <span class="uk-text-danger">*</span></label
          >
          <textarea
            id="note"
            class="uk-textarea"
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
    <ul class="progressbar">
      <li
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
          'uk-disabled': (exception || emptyImage)  && (!causeExceptions.type || emptyImage),
          active: singnature !== null
        }"
        @click="getShow('Singnature')"
      >
        <div class="info"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/firma.png" alt="" srcset="" /></div>
        <span>Firma </span>
        <div :class="{ disabled: (exception || emptyImage ) && (!causeExceptions.type || emptyImage)}"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import SignatureAction from "../components/actions/SignatureAction.vue";
import UIkit from "uikit";
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
      detailsException: []
    };
  },

  async mounted() {
    this.detailsException = await JSON.parse(localStorage.getItem('detailsException'));
  },
  computed: {
    ...mapGetters([
      'imagesStore'
    ]),
    imageTimeline(){
      if(this.imagesStore){
        this.changeImage()

      }

      return this.imagesStore
    },
    emptyImage(){
      return this.imagesStore?.length <= 0
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
        }else if(newVal == false){
          this.showSingnatureAndException = true
        }
      },
      deep: true,
    },
    causeExceptions: {
      handler: function (newVal) {
        if (
          newVal.note !== null &&
          newVal.note.length > 10 &&
          newVal.type !== null
        ) {
          this.showException = false;
        }
      },
      deep: true,
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
        UIkit.modal("#exception").show();
        if (this.imagiElement.length > 0) {
        this.$emit("action", value);
        }
      }
      if (value === "Singnature") {
        this.showSingnature = value;
      }
    },
    cancelResetException() {
      this.causeExceptions.note = null;
      this.causeExceptions.type = null;
      this.showSingnatureAndException = true;
      this.showException = true;
    },
    setException() {
      if (
        this.causeExceptions.note !== null &&
        this.causeExceptions.type !== null
      ) {
        this.showException = false
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
}
.disabled {
  position: absolute;
  width: 90px;
  height: 70px;
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
  top: 60px;
  width: 25px;
  right: 10px;
  border-radius: 10px;
  margin: 2px 0px 0px -23px;
}
.cancel {
  background-color: rgb(119, 5, 5);
  color: #fff;
}
</style>
