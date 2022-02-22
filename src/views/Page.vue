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
            await this.$services.singInServices.getToken(login)
            this.$store.commit("setUserData")
            this.$router.push({name: 'home'})

        } catch(error){
           this.$router.push({name: 'sign-in'})
        }
    }
}
</script>

<style>

</style>