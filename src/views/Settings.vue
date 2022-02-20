<template>
  <div class="uk-flex uk-flex-column uk-flex-between uk-padding-small">
    <div>
       <label class="item" for="maps">
        <h6>Mostrar Mapa</h6>
        <input type="checkbox" id="maps" v-model="settings.maps" class="checkBox">
      </label>
      <label  for="url" class="uk-flex uk-flex-around uk-flex-middle " style="width: 100%" >
      <h6>Seleccione Url</h6>
        <div  style="width: 60%" class="uk-margin uk-widht-1">
            <select id="url" class="uk-select" v-model="settings.url">
                <option :value="urlEnum.preprop" selected>Preprod Flai</option>
                <option :value="urlEnum.production">Production Flai</option>
            </select>
        </div>
        </label>
    </div>

    <div class="btn">
        <button :disabled="showButton === true" class="uk-button uk-button-primary" @click="saveSettings()">Guardar Cambios</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Profile } from '../mixins/Profile'
import { urlEnum } from '../types'
export default {
  alias: 'Configuraciòn',
  data() {
    return {
      urlEnum,
      show: 0,
      settingsLocalStore: null,
      showButton: true,
      settings: {
        maps: false,
        url: null
      },
    };
  },
  mixins: [Profile],
  computed: {
    ...mapGetters(['settingsStore'])
  },
  async mounted() {
    this.settingsLocalStore = await JSON.parse(localStorage.getItem('setting'))

    if(this.settingsLocalStore?.url){
        this.$store.commit("setSettings", JSON.parse(localStorage.getItem('setting')));
      }
    this.settings = this.settingsStore
      this.showButton = true;
    // this.$store.commit("setSettings", this.settings);

  },
  watch: {
    settings: {
      handler: function (newVal) {
        if (newVal.url !== this.settingsLocalStore.url || newVal.maps !== this.settingsLocalStore.maps) {
          this.showButton = false
        }else {
          this.showButton = true
        }
      },deep: true
    }
  },
  
  methods: {
    async saveSettings() {
      if (this.settings.url !== this.settingsLocalStore.url) {
         await this.$store.commit("setSettings", this.settings);
        this.$router.push({ name: "sign-in" });
        localStorage.removeItem('auth');
      } else {
        await this.$store.commit("setSettings", this.settings);
        this.$router.push({ name: "home" });
      }
    
    }
  },
};
</script>

<style scoped>
.item{
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 10px 0px;
  align-items: baseline;
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
}
.textUrl {
 font-size: 16px;
 font-weight: 500;
 line-height: 1.2;
}
</style>
