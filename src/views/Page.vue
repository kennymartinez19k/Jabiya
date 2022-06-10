<template>
  <div></div>
</template>

<script>

export default {
    async mounted(){
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        try{
            let login = {}
            login.email = JSON.parse(localStorage.getItem('rememberData'))
            login.password = JSON.parse(localStorage.getItem('rememberPassword'))
            if(userInfo){
              await this.$services.singInServices.getToken(login)
              this.$store.commit("setUserData")
              this.$router.push({name: 'home'})  
            }else{
              this.$router.push({name: 'sign-in'})
            }
        } catch(error){
          if(userInfo){
            this.$router.push({name: 'home'})
          }else{
            this.$router.push({name: 'sign-in'})
          }
        }
    }
}
</script>

<style>

</style>