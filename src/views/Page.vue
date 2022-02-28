<template>
  <div></div>
</template>

<script>

export default {
    async mounted(){
        try{
            let login = {}
            login.email = JSON.parse(localStorage.getItem('rememberData'))
            login.password = JSON.parse(localStorage.getItem('rememberPassword'))
            let userInfo = JSON.parse(localStorage.getItem('userInfo'))
            if(userInfo){
              await this.$services.singInServices.getToken(login)
              this.$store.commit("setUserData")
              this.$router.push({name: 'home'})  
            }else{
              this.$router.push({name: 'sign-in'})
            }
        } catch(error){
           this.$router.push({name: 'sign-in'})
        }
    }
}
</script>

<style>

</style>