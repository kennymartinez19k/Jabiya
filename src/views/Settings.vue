<template>
  <div class="uk-flex uk-flex-column uk-flex-between uk-padding-small">
    <div>
      <label class="item" for="check">
        <h6>Escaneo Automatico</h6>
        <!-- <input type="checkbox" id="check" v-model="settings.AutoScan" class="checkBox"> -->
        <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
          <label
            >Si<input
              class="uk-radio"
              type="radio"
              :value="true"
              name="radio2"
              v-model="settings.AutoScan"
          /></label>
          <label
            >No<input
              class="uk-radio"
              type="radio"
              :value="false"
              name="radio2"
              v-model="settings.AutoScan"
          /></label>
        </div>
      </label>
      <label class="item" for="check">
          <h6>Seleccione un Idioma:</h6>
            <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
          <label
            >Español<input
              class="uk-radio"
              type="radio"
              :value="true"
              name="language"
              v-model="settings.language"
          /></label>
          <label
            >English<input
              class="uk-radio"
              type="radio"
              :value="false"
              name="language"
              v-model="settings.language"
          /></label>
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
        AutoScan: null,
        language: null
      },
    };
  },
  mounted() {
    this.$store.commit("setSettings", this.settings);
  },
  methods: {
    saveSettings() {
      this.$store.commit("setSettings", this.settings);
      this.$router.push({ name: "direct-access" });
    },
  },
};
</script>

<style scoped>
.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
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
