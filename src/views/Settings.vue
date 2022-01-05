<template>
  <div class="uk-flex uk-flex-column uk-flex-between uk-padding-small">
    <div>
      <label class="item" for="check">
        <h6>Escaneo Automatico</h6>
        <input type="checkbox" id="check" v-model="settings.AutoScan" class="checkBox">
        
      </label>
      <label class="item uk-margin" for="check">
            <h6>Seleccione un Idioma:</h6>
        <div class="uk-form-controls" style="width: 40%">
            <select class="uk-select" id="form-horizontal-select">
                <option>Español</option>
                <option>English</option>
            </select>
        </div>
      </label>
      <label class="item uk-margin" for="check">
            <h6>Perfil:</h6>
        <div class="uk-form-controls" style="width: 40%">
            <select v-model="profile" class="uk-select" id="form-horizontal-select">
                <option>Ninguno</option>
                <option value="drayage">Contenedor</option>
            </select>
        </div>
      </label>
    </div>
    <div class="btn">
        <button class="uk-button uk-button-transparent" @click="saveSettings">Guardar Cambios</button>
    </div>
  </div>
</template>

<script>
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
  mounted() {
    this.$store.commit("setSettings", this.settings);
  },
  methods: {
    saveSettings() {
      this.$store.commit("setSettings", this.settings);
      this.$store.commit("changeRol", this.profile );

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
button {
  padding: 0px 7.5px;
}
.btn{
    display: flex;
    justify-content: end;
}
</style>
