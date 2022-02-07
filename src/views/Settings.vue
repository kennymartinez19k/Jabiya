<template>
  <div class="uk-flex uk-flex-column uk-flex-between uk-padding-small">
    <div>
      <label class="item uk-margin" for="profile">
            <h6>Perfil</h6>
        <div class="uk-form-controls" style="width: 40%">
            <select v-model="settings.profile" class="uk-select" id="profile">
                <option :value="profile.container" selected>Contenedor</option>
                <option :value="profile.eCommerce">eCommerce</option>
            </select>
        </div>
      </label>
       <label class="item" for="maps">
        <h6>Mostrar Mapa</h6>
        <input type="checkbox" id="maps" v-model="settings.maps" class="checkBox">
      </label>
    </div>
    <div class="btn">
        <button class="uk-button uk-button-transparent" @click="saveSettings()">Guardar Cambios</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Profile } from '../mixins/Profile'
export default {
  alias: 'Configuracion',
  data() {
    return {
      settings: {
        profile: 'container',
        maps: false
      },
    };
  },
  mixins: [Profile],
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
      this.setProfile()
      this.$router.push({ name: "home" });
    },
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
</style>
