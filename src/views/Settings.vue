<template>
  <div class="uk-flex uk-flex-column uk-flex-between uk-padding-small container-main">
    <div class="uk-flex uk-flex-column uk-flex-between setting">
      <div class="config-container">
        <label class="item" for="maps">
          <h6 class="uk-margin-remove web-font-medium">Mostrar Ruta (Google Maps)</h6>
          <input type="checkbox" id="maps" v-model="settings.maps" class="checkBox">
        </label>
        <label  for="url" class="uk-flex uk-flex-between url-section" >
           <h6 class="uk-margin-remove web-font-medium">Seleccione Url</h6>
          <div class="select">
              <select id="url" class="uk-select web-font-small" v-model="settings.url">
                  <option :value="urlEnum.preprod" selected>Preprod Flai</option>
                  <option :value="urlEnum.production">Production Flai</option>
              </select>
          </div>
        </label>
        
        
      </div>
      <div class="btn">
          <button :disabled="showButton" class="uk-button uk-button-primary web-font-small" @click="saveSettings()">Guardar Cambios</button>
      </div>
    </div>

    <div class="auth-section">
      <h6 class="uk-text-center web-font-medium">Solo Personal Autorizado</h6>
      <div>
        <label class="item uk-flex uk-flex-center" for="maps">
          <button class="uk-button btn-red web-font-small" @click="clearLocalStorage()" >
            Borrar Informacion (Solo Personal Autorizado)
          </button>
        </label>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Profile } from '../mixins/Profile'
import { urlEnum } from '../types'
import { LocalStorage } from '../mixins/LocalStorage'
export default {
  alias: 'Configuraciòn',
  data() {
    return {
      urlEnum,
      settingsLocalStore: null,
      showButton: true,
      settings: {
        maps: false,
        url: 'https://production.flai.com.do/orchestrator'
      },
    };
  },
  mixins: [Profile, LocalStorage],
  computed: {
    ...mapGetters(['settingsStore'])
  },
  async mounted() {
    this.settingsLocalStore = await JSON.parse(localStorage.getItem('setting'))

    if(this.settingsLocalStore?.url){
        this.$store.commit("setSettings", JSON.parse(localStorage.getItem('setting')));
    }
    if(this.settingsStore){
      this.settings = this.settingsStore
    }
    this.showButton = true;
  },
  watch: {
    settings: {
      handler: function (newVal) {
        if (newVal?.url !== this.settingsLocalStore?.url || newVal?.maps !== this.settingsLocalStore?.maps) {
          this.showButton = false
        }else {
          this.showButton = true
        }
      },deep: true
    }
  },
  
  methods: {
    async saveSettings() {
      this.showButton = true
      if (this.settings?.url !== this.settingsLocalStore?.url) {
         await this.$store.commit("setSettings", this.settings);
         this.setUrl()
        localStorage.removeItem('auth');
        await this.resetLocalStorage()
        this.$router.push({ name: "sign-in" });
      } else {
        await this.$store.commit("setSettings", this.settings);
        this.$router.push({ name: "home" });
      }
    
    },
    clearLocalStorage(){
      this.clear()
      localStorage.clear()
      this.$router.push({ name: "sign-in" });

    },
    async setUrl(){
      let setting = await JSON.parse(localStorage.getItem('setting'))
      this.$services.singInServices.setURL(setting)
      this.$services.loadsServices.setURL(setting) 
      this.$services.loadsScanServices.setURL(setting)
      this.$services.invoicesSevices.setURL(setting)
      this.$services.deliverServices.setURL(setting)
      this.$services.gpsServices.setURL(setting)
      this.$services.driverVehicleAssignment.setURL(setting)
      this.$services.exceptionServices.setURL(setting)
  },
     resetLocalStorage () {
        localStorage.removeItem('auth');
      localStorage.removeItem('allLoads');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('loadType');
      localStorage.removeItem('AllLoadS');
      localStorage.removeItem('dateCheck');
      localStorage.removeItem('currentProfile');
      localStorage.removeItem('detailsException');
      localStorage.removeItem('DeliveryCharges');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('ordersDetails');
      localStorage.removeItem('loglevel:webpack-dev-server');
     }  
  },
};
</script>

<style scoped>
.setting .item{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 0px;
  align-items: baseline;
  cursor: pointer;
  margin-bottom: 10px
}
.header {
  box-shadow: 0px 0px 2px;
  display: flex;
  justify-content: space-between;
}
.checkBox {
  transform: scale(1.5);
}

input {
  margin-left: 0.5rem;
}

.btn{
    display: flex;
    justify-content: flex-end;;
    padding: 45px 0px 15px;
    border-bottom: 1px solid #ccc;
}
.btn-red{
  background: #de2828;
  color: white
}
.auth-section{
  padding: 20px 0px;
}
.url-section{
  width: 100%;
  align-items: baseline;
  cursor: pointer;
}
.textUrl {
 font-size: 16px;
 font-weight: 500;
 line-height: 1.2;
}
.select{
  width: 50%
}
.config-container{
  margin-top: 20px;
}
@media (min-width: 900px){
  .config-container{
    display: flex;
    justify-content: space-between;
  }
  .container-main{
    width: 90%;
    margin: 0px auto;
  }
  .url-section{
    width: 40%;
    border-bottom: 1px solid #ccc;
    padding: 10px
  }
  .setting .item{
    width: 40%;
    border-bottom: 1px solid #ccc;
    margin-bottom: 0px

  }

}
</style>
