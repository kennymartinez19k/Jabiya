<template>
  <div class="container">
    <div v-if="serieA === 'firm'" class="uk-padding-small">
      <signature-action @digitalSignature="digitalFirm= $event"></signature-action>
    </div>

    <div v-if="showException && exception" class="uk-padding-small">
      <textarea
        class="uk-textarea"
        rows="3"
        placeholder="Digite la exepción"
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
       <!-- 'uk-disabled': step !== 1, -->
      <li
        class="stepTwo"
        :class="{
         
          active: imagiElement.length !== 0 && imagiElement.length >= 3,
        }"
        @click="getShow('camera')"
      >
        <div class="info active"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/cam.png" alt="" srcset="" /></div>
        <span style="color: #000">Camara</span>
        <div :class="{ disabled: step < 1 }"></div>
      </li>
      <li
        v-if="exception"
        :class="{
          'uk-disabled': (imagiElement.length === 0) || (imagiElement.length !== 3),
          active:
            imagiElement.length >= 3 &&
            textException !== null && showException === false,
        }"
        @click="getShow('exception')"
      >
        <div class="info active"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/warning.png" alt="" srcset="" /></div>
        <span style="color: #000">Camara</span>
        <div
          :class="{
            disabled: (imagiElement.length === 0) || (imagiElement.length !== 3),
          }"
        ></div>
      </li>
      <li
        class="stepThree"
        :class="{ 'uk-disabled': step !== 2, active: digitalFirm !== null }"
        @click="getShow('firm')"
      >
        <div class="info"><font-awesome-icon icon="check" /></div>
        <div><img src="../assets/img/firma.png" alt="" srcset="" /></div>
        <span style="color: #000">Firma</span>
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
      'settingsStore'
    ])
  },
  watch: {
    digitalFirm: {
      handler: async function (newVal) {
        if (newVal !== null) {
          this.serieA = null;
          this.$store.commit("setDigitalFirm", this.digitalFirm);
          let load = await this.$services.loadsServices.getLoadDetails(this.loadStore?.loadMapId);
          
          setTimeout(()=> {
            let isReturn = load.Orders[0].isReturn
            this.$store.commit('finishDelivered', 5)

            if(isReturn){
              this.$router.push({ name: 'load-status'}).catch(() => {})
            }else{
              localStorage.removeItem(`startLoad${load.loadMapId}`)
              this.$router.push({ name: 'home'}).catch(() => {})
            }
          },1000)
        }
      },
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
    // digitalFirm: String,
  },
  data() {
    return {
      textException: null,
      showException: null,
      serieA: null,
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
        this.serieA = value;
        
      }
    },
    resetTextException() {
      // UIkit.toggle("#toggle-usage").hide();
      UIkit.modal("#modal-sections").hide();
      this.textException = null;
    },
    setException() {
      this.showException = false;
      this.$store.commit("setTextException", this.textException);
    },
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
</style>
