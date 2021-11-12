<template>
    <span @click="goBack()" uk-icon="icon: reply"></span><strong></strong>
</template>

<script>
export default {
  name: 'BackButton',
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
span{
  position: absolute;
  top: 21px;
  left: 23px;
  transform: scale(1.2);
  z-index: 1;
}
</style>
