<template>
  <div class="container">
    <div v-if="showSingnature === 'firm'" class="uk-padding-small">
      <img src="../assets/rejected.png" class="icon-close" @click="closeSingnature()">
      <signature-action @digitalSignature="digitalFirm= $event"></signature-action>
    </div>

    <div v-if="showException && exception" class="uk-padding-small">
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
    </div>
    <ul class="progressbar">
      <li
        class="stepTwo"
        :class="{
         
          active: imagiElement.length !== 0 && imagiElement.length >= 1,
        }"
        @click="getShow('camera')"
      >
        <div class="info active"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/cam.png" alt="" srcset="" /></div>
        <span style="color: #000">Camara</span>
        <div :class="{ disabled: step < 1 }"></div>
      </li>
      <li
      v-if="showSignaturform === false"
        class="stepThree"
        :class="{ 'uk-disabled': step !== 2, active: digitalFirm !== null }"
        @click="getShow('firm')"
      >
        <div class="info"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/firma.png" alt="" srcset="" /></div>
        <span style="color: #000">Firma</span>
        <div :class="{ disabled: step < 2 }"></div>
      </li>
       <li
      v-if="showSignaturform === true"
        class="stepFour"
        :class="{ 'uk-disabled': step !== 2, active: digitalFirm !== null }"
        @click="getShow('save')"
      >
        <div class="info"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/check.png" alt="" srcset="" /></div>
        <span>Guardar</span>
        <div :class="{ disabled: step < 2 }"></div>
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
  computed:{
    ...mapGetters([
      'loadStore',
    ])
  },
  watch: {
    digitalFirm: {
      handler: async function (newVal) {
        if (newVal !== null) {
          this.showSingnature = null;
          this.$store.commit("setDigitalFirm", this.digitalFirm);

        }
      },
      deep: true
    },

    exception: {
      handler: function (newVal) {
        if (newVal === false) {
          this.textException = null;
        }
      },
    },
  },
  props: {
    step: Number,
    exception: Boolean,
    imagiElement: Array,
    showSignaturform: Boolean
  },
  data() {
    return {
      textException: null,
      showException: null,
      showSingnature: null,
      digitalFirm: null

    };
  },

  methods: {
    getShow(value) {
      this.$emit("action", value);

      if (value === "exception") {
        this.showException = true;
      }
      if (value === "firm") {
        this.showSingnature = value;
        
      }
     if (value === 'save' ) {
          this.digitalFirm = true;
          this.$store.commit("setDigitalFirm", this.digitalFirm);
     }
    },
    resetTextException() {
      UIkit.modal("#modal-sections").hide();
      this.textException = null;
    },
    setException() {
      this.showException = false;
      this.$store.commit("setTextException", this.textException);
    },
    closeSingnature () {
        this.showSingnature = null;
        this.$emit("resetSign", false);
        this.digitalFirm = null;
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
  width: 100%;
  height: 70%;
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
  max-width: 105px;
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
  top: 35px;
  width: 25px;
  right: 10px;
  border-radius: 10px;
  margin: 2px 0px 0px -23px;
}

@media (min-width: 900px){
 .progressbar li {
  max-width: 180px !important;

 }
}
</style>
