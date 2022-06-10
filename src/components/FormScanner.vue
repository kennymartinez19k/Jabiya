<template>
  <div class="uk-flex uk-flex-center" style="margin-top: 10px">
    <input type="text" v-model="webQrCode" class="uk-input uk-width-1-4 web-font-small">
    <button :disabled="webQrCode.length == 0" @click="uploadProducts(webQrCode)" class="uk-button uk-button-primary web-font-small" style="margin-left: 5px">Enviar</button>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>