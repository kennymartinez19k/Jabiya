<template>
    <span @click="goBack()" uk-icon="icon: arrow-left"></span><strong></strong>
</template>

<script>
export default {
  name: 'BackButton',
  methods: {
    goBack () {
      if(this.$route.name == 'recover-password'){
        this.$router.push({ name: 'sign-in' })
      } else this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
span{
  position: absolute;
  top: 30px;
  left: 23px;
  transform: scale(1.2);
  z-index: 1;
}
</style>
