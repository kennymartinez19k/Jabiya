<template>
  <Loading class="loading-position" :active="loaded" color="rgb(86, 76, 175)" loader="spinner" :width="100"
    background-color="rgba(252, 252, 252, 0.7)"></Loading>

  <div class="uk-flex uk-flex-center uk-flex-column uk-flex-wrap cnt">
    <form class="
        form-container
        uk-card
        uk-card-default
        uk-padding-remove
        uk-card-large
        uk-card-body
        uk-width-1-3@s
      ">
      <div class="uk-margin uk-width-1-3 setting">
        <div class="uk-form-controls">
          <select v-model="settings.url" class="uk-select" id="form-stacked-select">
            <option :value="urlEnum.preprod" selected>Preprod Flai</option>
            <option :value="urlEnum.production">Production Flai</option>
          </select>
        </div>
      </div>
      <img class="logo" src="../assets/logo.png" alt="" />
      <h4 class="uk-text-light">Entrar a su cuenta</h4>
      <span class="uk-text-muted" style="margin-bottom: 30px; display: block">Ingrese su número de móvil y contraseña y
        presione iniciar sesión para
        ingresar a su cuenta</span>

      <div class="uk-margin uk-text-left input-item">
        <label class="uk-text-emphasis" for="email">No. de Identificación / Teléfono / Email </label>
        <div class="uk-input uk-flex form-login" style="align-items: center">
          <input class="uk-form-width-medium formLogin" v-model="login.email" type="text" placeholder="" required />
          <font-awesome-icon icon="envelope" style="font-size: 15px" />
        </div>
      </div>
      <div class="uk-margin uk-text-left input-item">
        <label class="uk-text-emphasis" for="companyData">Contraseña</label>
        <div class="uk-input uk-flex form-login" style="align-items: center">
          <input class="uk-form-width-medium" v-model="login.password" :type="type" style="width: 100%"
            placeholder="Contraseña" required />
          <font-awesome-icon :icon="iconType" @click="showPassword" style="font-size: 15px" />
        </div>
      </div>
      <div class="uk-margin uk-flex uk-flex-between input-item">
        <label class="terms uk-text-light"><input v-model="rememberPassword" style="margin-right: 5px"
            class="uk-checkbox" type="checkbox" checked />Recordar contraseña</label>
        <!-- <router-link to="/recover" class="show-link"
          >¿Olvidaste tu contraseña?</router-link
        > -->
      </div>
      <div v-if="showError" class="uk-alert-warning" uk-alert>
        <a class="uk-alert-close" @click="showError = false" uk-close></a>
        <p>{{ showErrorText }}</p>
      </div>
      <button type="button" :class="{ disabled: disabled }"
        class="uk-button uk-button-purple uk-width-1-1 uk-margin-small-bottom input-item-btn"
        @click="changeRoute('home')" style="margin-top: 15px">
        Iniciar sesión
      </button>
    </form>
  </div>

</template>

<script>
import Loading from "vue-loading-overlay";
import { mapGetters } from 'vuex';
import { LocalStorage } from "../mixins/LocalStorage";
import {Mixins} from "../mixins/mixins"
import { role, userType, urlEnum } from '../types'
import { Browser} from '@capacitor/browser'

export default {
  components: {
    Loading,
  },
  mixins: [LocalStorage, Mixins],
  data() {
    return {
      role,
      userType,
      urlEnum,

      loaded: false,
      type: "password",
      iconType: "eye",
      showError: null,
      disabled: false,
      showErrorText: null,
      login: {
        email: "",
        password: "",
      },
      rememberPassword: true,

      AutoLogin: {
        email: "",
        password: "",
      },
      activeOrNot: null,
      geo: null,
      settings: {
        maps: false,
        url: 'https://production.flai.com.do/orchestrator'
      },
    };
  },
  watch: {
    settings: {
      handler: function () {
        this.$store.commit("setSettings", this.settings);
        this.setUrl()
      },deep: true
    },
    "login.email": function (newVal) {
      if (newVal) {
        this.showError = false;
      }
    },
    "login.password": function (newVal) {
      if (newVal) {
        this.showError = false;
      }
    },
  },
  async mounted() {
    if(localStorage.getItem('setting')){
      this.settings.url = JSON.parse(localStorage.getItem('setting')).url
    }
    await this.resetLocalStorage()
    this.$store.commit("setSettings", this.settings);
    this.setUrl()
    if (JSON.parse(localStorage.getItem("rememberData"))) {
      this.rememberPassword = true;
      this.login.email = JSON.parse(localStorage.getItem("rememberData"));
      this.login.password = JSON.parse(
        localStorage.getItem("rememberPassword")
      );
    }
    let detailsException = null;
    try {
      detailsException = await this.$services.exceptionServices.getExceptionsDetails();
    } catch (error) {
      console.log(error)
    }
    if (detailsException) {
      localStorage.setItem("detailsException", JSON.stringify(detailsException));
    }

    this.getInvoicesPrint()
  },
  computed:{
    ...mapGetters([
      'userData',
    ])
  },
  methods: {
    async changeRoute(path) {
      if(path == 'settings-out'){
        this.$router.push({ name: path }).catch(() => {}) 
        return;
      }

      if (path == "home") {
        if (this.login.email !== "" && this.login.password !== "") {
          this.loaded = true;
          this.AutoLogin.email = String(this.login.email);
          this.AutoLogin.password = String(this.login.password); 
        }
      }
      this.disabled = true;
      
      this.$services.singInServices.getToken(this.AutoLogin).then((res) => {
        this.loaded = true;
        this.$store.commit("setUserData");
        if(this.rememberPassword){
          localStorage.setItem("rememberData", JSON.stringify(this.login.email));
          localStorage.setItem("rememberPassword", JSON.stringify(this.login.password));
        }

        if(res?.role == this.role?.transporter && res?.userType == this.userType?.transporter && res?.position == this.positionSPN?.transporter){
          this.$router.push({ name: 'transporter-load' }).catch(() => {}) 
        
        }else if(res){
          this.$router.push({ name: path }).catch(() => {});
        }

      }) .catch((error) => {
        this.loaded = false;
        this.disabled = false;
        if (error.message === "Request failed with status code 401") {
          this.showErrorText = "Error al introducir los datos";
        } else if (error.message === "Network Error") {
          this.showErrorText = "Error de conexion, verifique que este conectado";
        } else {
          console.log(error.message)
          this.showErrorText = "Error";
        }
        this.showError = true;
      })

     
    },

    showPassword() {
      if (this.type === "password") {
        this.type = "text";
        this.iconType = "eye-slash";
      } else {
        this.type = "password";
        this.iconType = "eye";
      }
    },

    active(){
      this.activeOrNot = !!navigator.geolocation
    },
    async resetLocalStorage () {
      // this.$store.commit('resetData')
    },

    OpenPdf(){
        Browser.open({ url: 'https://jabiyaerp.flai.com.do/api/invoice/report?invoice_ids=270,271'});
    }
    
    
  },
 
};
</script>

<style scoped>
.place {
  /* background-image: url(/img/call.5b440c14.png); */
  background-position: 96%;
  background-size: 15px;
  background-repeat: no-repeat;
}
.show-link {
  color: #de871c;
}
.show-link:hover {
  color: #de871c;
  text-decoration-line: line;
  font-size: 14px;
}

.cnt {
  overflow: scroll;
  width: 100%;
  height: 13cm;
}

.form-login input {
  width: 100%;
  height: 30px;
  border: 0px;
}
.form-login input:focus-visible {
  border: 0px;
  outline: none;
}
.uk-input:focus {
  outline: 0 !important;
  background-color: #fff;
  color: #666;
  border: 1px solid red;
}
.form-login {
  border: 1px solid #b1b1b1;
}
.loading-position {
  position: absolute;
  z-index: 1;
  top: 278px;
  right: 11px;
  width: 92%;
}
.disabled {
  pointer-events: none;
}
.uk-card-body{
  padding: 65px 20px !important;
  min-width: 300px;
  position: relative;
  margin: 0px auto !important;
  box-shadow: none;
}
.setting{
  position: absolute;
  top: 0px;
  right: 15px;
}
.setting select{
  border-radius: 20px;
}
.logo{
  width: 20%;
}
@media (min-width: 600px) {
  .logo {
    max-width: 23%;
  }
  .uk-card-body {
    min-width: 400px !important;
    width: 60%;
    box-shadow: 0px 0px 0px #000 !important;
    margin: 0px auto
  }
  .input-item{
    max-width: 500px;
    margin: 0px auto;
  }
  .input-item-btn{
    max-width: 300px;
  }
  .setting{
    width: 150px;
  }
}
</style>
