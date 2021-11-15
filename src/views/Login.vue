<template>
  <div class="login uk-flex uk-flex-column .uk-height-1-1">
    <ion-progress-bar type="indeterminate"></ion-progress-bar>
    <img src="../assets/logo.png" class="img" style="width: 100px" alt="">
    <div class="uk-margin-auto-top">
        <button @click="changeRoute('sign-in')" class="uk-button uk-button-orange uk-width-1-1*@s uk-margin-small-bottom" style="margin-top: 15px">Entrar a tu cuenta</button>
        <button @click="changeRoute('sign-up')" class="uk-button uk-button-purple uk-width-1-1 uk-margin-small-bottom" style="margin-top: 15px">Registrese</button>
    </div>
   </div>
</template>

<script>
import { IonProgressBar } from '@ionic/vue';

export default {
    components:{
        IonProgressBar
    },
    mounted(){
        this.$store.commit('setCurrent', false)
    },
    methods:{
        changeRoute (path) {
            this.$router.push({ name: path }).catch(() => {})
        }
    }
  


}
</script>

<style scoped>
.login{
    padding: 15px;
}
img{
  display: block;
  margin: 10px auto;
  width: 50%;
}


</style>