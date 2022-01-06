<template>
  <div class="uk-flex uk-flex-column uk-flex-between uk-padding-small">
    <div>
      <label class="item" for="check">
        <h6>Escaneo Automatico</h6>
        <input type="checkbox" id="check" v-model="settings.AutoScan" class="checkBox">
        
      </label>
      <label class="item uk-margin" for="language">
            <h6>Seleccione un Idioma:</h6>
        <div class="uk-form-controls" style="width: 40%">
            <select class="uk-select" id="language" v-model="settings.language">
                <option  value="es" selected>English</option>
                <option value="en">Español</option>
            </select>
        </div>
      </label>
      <label class="item uk-margin" for="profile">
            <h6>Perfil</h6>
        <div class="uk-form-controls" style="width: 40%">
            <select v-model="settings.profile" class="uk-select" id="profile">
                <option value="container" selected>Contenedor</option>
                <option value="eCommerce">eCommerce</option>
            </select>
        </div>
      </label>
    </div>
    <div class="btn">
        <button class="uk-button uk-button-transparent" @click="saveSettings()">Guardar Cambios</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      settings: {
        AutoScan: true,
        language: null,
        profile: null
      },
    };
  },
  computed: {
    ...mapGetters(['languageStore', 'rolStore', 'settingsStore'])
  },
  mounted() {
    this.settings = this.settingsStore
    this.$store.commit("setSettings", this.settings);
    this.setLanguage()
    this.setProfile()

  },

  methods: {
    saveSettings() {
      this.$store.commit("setSettings", this.settings);
      this.$store.commit("changeRol", this.settings.profile );
      this.$store.commit("setLanguageStore", this.settings.language );

      this.$router.push({ name: "home" });
    },
    setLanguage() {
        if (this.languageStore !== null) {
         this.settings.language = this.languageStore
        this.$i18n.locale = this.languageStore

       } else {
         this.settings.language = 'es'
        this.$i18n.locale = 'es'
       }
    },
     setProfile() {
        if (this.rolStore !== null) {
         this.settings.profile = this.rolStore

       } else {
         this.settings.profile = 'container'
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
button {
  padding: 0px 7.5px;
}
.btn{
    display: flex;
    justify-content: flex-end;;
}
</style>
