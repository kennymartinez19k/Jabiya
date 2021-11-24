<template>
  <div>
    <div class="uk-card uk-card-default uk-card-body uk-padding-remove firm">
      <VueSignaturePad
        width="100%"
        height="150px"
        ref="signaturePad"
        :options="{ onBegin, onEnd }"
      />
    </div>

    <div class="uk-flex uk-flex-between uk-margin-small-top">
      <button class="uk-button uk-button-primary" @click="save">Guardar</button>
      <button class="uk-button uk-button-secondary" @click="undo">
        Deshacer
      </button>
    </div>
  </div>
</template>
<script>
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
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log(isEmpty);
      console.log(data);
      this.firm = data;
    },
    onBegin() {
      console.log("=== Begin ===");
    },
    onEnd() {
      console.log("=== End ===");
    },
  },
};
</script>
<style scoped>
.firm {
  border: 2.5px solid #000;
  margin: 15px 0px !important;
}
</style>
