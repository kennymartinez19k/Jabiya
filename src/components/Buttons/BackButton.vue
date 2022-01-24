<template>
    <font-awesome-icon @click="goBack()" style="font-size: 20px; margin: 0px 15px" :icon="iconType" ></font-awesome-icon><strong></strong>
</template>


<script>
export default {
  name: 'BackButton',
  data() {
    return {
      iconType: "sign-out-alt",
      action: "sign-in",
    }
  },
   watch: {
    $route: function (newVal) {
      newVal.name == "home"
        ? ((this.iconType = "sign-out-alt"))
        : newVal.name == "home"
        ? ((this.iconType = "home"))
        : ((this.iconType = "arrow-left"));
    },
  },

  methods: {
    goBack () {
      if(this.$route.name == 'recover-password'){
        this.$router.push({ name: 'sign-in' })
      } else if(this.$route.name == 'home'){
       this.$router.push({ name: 'sign-in' })
      } else if(this.$route.name == 'load-status'){
        this.$router.push({ name: 'home' })

      }else{
        this.$router.push({ name: 'load-status' })
      }  
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
