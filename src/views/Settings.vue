<template>
  <div class="uk-flex uk-flex-column uk-flex-between uk-padding-small">
    <div class="uk-flex uk-flex-column uk-flex-between setting">
      <div>
        <label class="item" for="maps">
          <h6>Mostrar Ruta (Google Maps)</h6>
          <input type="checkbox" id="maps" v-model="settings.maps" class="checkBox">
        </label>
        
        
      </div>
      <div class="btn">
          <button class="uk-button uk-button-transparent" @click="saveSettings()">Guardar Cambios</button>
      </div>
    </div>

    <div class="auth-section">
      <h6 class="uk-text-center">Solo Personal Autorizado</h6>
      <div>
        <label class="item uk-flex uk-flex-center" for="maps">
          <button class="uk-button btn-red" @click="clearLocalStorage()" >
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
import { LocalStorage } from '../mixins/LocalStorage'
export default {
  alias: 'Configuracion',
  data() {
    return {
      settings: {
        maps: false
      },
    };
  },
  mixins: [Profile, LocalStorage],
  computed: {
    ...mapGetters(['languageStore', 'settingsStore'])
  },
  mounted() {
    this.settings = this.settingsStore
    this.$store.commit("setSettings", this.settings);
  },

  methods: {
    async saveSettings() {
      await this.$store.commit("setSettings", this.settings);
      this.$router.push({ name: "home" });
    },
    clearLocalStorage(){
    this.clear()
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
</style>
