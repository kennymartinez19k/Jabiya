<template>
  <div class="container">
    <div v-if="showSingnature === 'Singnature'" class="uk-padding-small">
      <span class="icon-close" uk-icon="close" @click="closeSingnature()"></span>
      <signature-action @digitalSignature="singnature= $event"></signature-action>
    </div>
    <!-- <div v-if="showException && exception" class="uk-padding-small">
      <textarea
        class="uk-textarea"
        rows="3"
        placeholder="Notas:"
        v-model="textException"
      ></textarea>
      <div class="uk-margin-small-top uk-flex uk-flex-right">
        <button
          type="button"
          class="uk-button uk-button-primary"
          @click="setException()"
        >
          Guardar
        </button>
      </div>
    </div> -->



<!-- This is the modal -->
<div id="exeption" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <h2 class="uk-modal-title">Headline</h2>
         <div class="uk-margin">
        <label for="">Tipos de Exepción</label>
            <select class="uk-select" v-model="causeExceptions.type">
                <option value="Option 01">Option 01</option>
                <option value="Option 02">Option 02</option>
            </select>
        </div>
        <div>
        <label for="">Notas <span >*</span></label>
          <textarea
            class="uk-textarea"
            rows="3"
            placeholder="Notas:"
            v-model="causeExceptions.note"
            required
          >
          </textarea>
        </div>
         <p class="uk-flex uk-flex-around">
            <button class="uk-button uk-button-default uk-modal-close cancel" type="button" @click="cancelResetException()">Cancelar</button>
            <button :disabled="showException === true" class="uk-button uk-button-primary uk-modal-close" type="button" @click="setException()">Guardar</button>
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
        <span>Escaner</span>
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
            resultScan !== null &&
            imagiElement.length === 1 &&
             causeExceptions.note !== null &&  causeExceptions.type !== null && showException === false,
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
        :class="{ 'uk-disabled': showSingnatureAndException, active: singnature !== null }"
        @click="getShow('Singnature')"
      >
        <div class="info"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/firma.png" alt="" srcset="" /></div>
        <span>Firma</span>
        <div :class="{ disabled: showSingnatureAndException }"></div>
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
        type: null
      },
      showException: true,
      showSingnatureAndException: true,
      showSingnature: null,
      singnature: null

    };
  },
  computed: {
    ...mapGetters([
      'settingsStore'
    ])
  },
 watch: {
    singnature: {
      handler: function (newVal) {
        if (newVal !== null) {
          this.showSingnature = null;
          this.$store.commit("setDigitalFirm", this.singnature);
          setTimeout(()=> {
            this.$router.push({ name: 'direct-access'}).catch(() => {})
          },1000)
        }
      }, deep: true
    },

    
      exception: {
      handler: function (newVal) {
        if (newVal === false && this.step >= 2) {
          this.showSingnatureAndException = false;
           this.causeExceptions.note = null;
          this.causeExceptions.type = null
          this.showException = true
        } else if (newVal === true && this.causeExceptions.note !== null && this.causeExceptions.type !== null && this.step >= 2) {
              this.showSingnatureAndException = false ;
        } else {
          this.showSingnatureAndException = true;
        }

      }, deep: true
    },
    causeExceptions: {
      handler: function (newVal) { 
        if (newVal.note !== null && newVal.note.length > 10  && newVal.type !== null ) {
          this.showException = false;
        }
      },  deep: true
    },
     step: {
      handler: function (newVal) { 
        if (newVal >= 2 &&  this.exception === true && this.causeExceptions.note !== null && this.causeExceptions.type !== null) {
          this.showSingnatureAndException = false;
        } else if (newVal >= 2 &&  this.exception === false) {
          this.showSingnatureAndException = false;
        }
      },  deep: true
    },
  },
  methods: {
    getShow(value) {
      this.$emit("action", value);
      if (value === 'scan') {
      this.$emit("action", value);

      }
      if (value === "exception") {
        UIkit.modal('#exeption').show()
      }
      if (value === "Singnature") {
        this.showSingnature = value;
        
      }
    },
    cancelResetException (){
      this.causeExceptions.note = null;
       this.causeExceptions.type = null
        this.showSingnatureAndException = true ;
    },
    setException() {
      if (this.causeExceptions.note !== null && this.causeExceptions.type !== null ) {
         this.$store.commit("setExceptions", this.causeExceptions);
         if (this.exception === true && this.causeExceptions.note !== null && this.causeExceptions.type !== null && this.step >= 2) {
              this.showSingnatureAndException = false ;
        }
      }
    },
    closeSingnature () {
        this.showSingnature = null;
        this.singnature = null;
        this.showSingnatureAndException = true ;
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
  width: 45%;
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
.icon-close{
  background-color: #f04c3b40;;
  position: absolute;
  top: 57px;
  right: 20px;
  margin: 2px 0px 0px -23px;
}
.cancel {
  background-color:  rgb(119, 5, 5);
  color: #fff;
}
</style>
