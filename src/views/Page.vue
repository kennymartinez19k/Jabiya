<template>
  <div></div>
</template>

<script>
export default {
    async mounted(){
       let user = await JSON.parse(localStorage.getItem('userInfo'))
       if(user){
           this.$router.push({name: 'home'})
       }else{
           this.$router.push({name: 'sign-in'})
       }
    }
}
</script>

<style>

</style>