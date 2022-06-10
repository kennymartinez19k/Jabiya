<template>
  <div>
    <VueSignaturePad
      class="singnature"
      width="100%"
      height="150px"
      ref="signaturePad"
      :options="{ onBegin, onEnd }"
    />

    <div class="uk-flex uk-flex-between uk-margin-small-top">
      <button class="uk-button uk-button-secondary btn" @click="undo()">
        Deshacer
      </button>
      <button class="uk-button uk-button-primary btn" :disabled="isDisabled" @click="save()">
        Guardar y Finalizar
      </button>
    </div>
  </div>
</template>
<script>
// import UIkit from "uikit";

export default {
  name: "SignatureAction",
  data() {
    return {
      singnature: null,
      isDisabled: false
    };
  },
  methods: {
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    save() {
      this.isDisabled = true
      const { data } = this.$refs.signaturePad.saveSignature();
      if(data){
        this.singnature = data;
        this.$emit("digitalSignature", this.singnature);
      }
     
    },

  },
};
</script>
<style scoped>
.singnature {
  border: 2.5px solid #000;
}
.btn {
  padding: 5px 5px;
}

</style>
