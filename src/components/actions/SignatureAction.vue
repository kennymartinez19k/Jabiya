<template>
  <div>
    <VueSignaturePad
      class="firm"
      width="100%"
      height="150px"
      ref="signaturePad"
      :options="{ onBegin, onEnd }"
    />

    <div class="uk-flex uk-flex-between uk-margin-small-top">
      <button class="uk-button uk-button-secondary btn" @click="undo">
        Deshacer
      </button>
      <button class="uk-button uk-button-primary btn" @click="save">
        Guardar
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
      firm: null,
    };
  },
  methods: {
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    save() {
      const { data } = this.$refs.signaturePad.saveSignature();
      this.firm = data;
      this.$emit("digitalSignature", this.firm);
    },

  },
};
</script>
<style scoped>
.firm {
  border: 2.5px solid #000;
}
.btn {
  padding: 0 5px;
}
</style>
