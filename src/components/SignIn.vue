<template>
        <BackButton/>
    <div class="uk-flex uk-flex-center uk-flex-wrap container">
        <form class="uk-card uk-card-default uk-padding-remove uk-card-large uk-card-body uk-width-1-3@s" style="padding: 40px 20px !important; min-width: 400px">
            <img class="logo" src="../assets/logo.png" alt="">
            <h4 class="uk-text-light">Entrar a su cuenta</h4>
            <span class="uk-text-muted" style="margin-bottom: 30px; display: block">ingrese su correo electronico y contraseña y presione iniciar seción para ingresar a su cuenta</span>

            <div class="uk-margin">
                <input class="uk-input uk-form-width-medium" v-model="signInLogin.email" type="email" style="width: 100%" placeholder="Email" required>
            </div>
            <div class="uk-margin">
                <input class="uk-input uk-form-width-medium" v-model="signInLogin.password" type="password" style="width: 100%" placeholder="Contraseña" required>
            </div>
            <div class="uk-margin uk-flex uk-flex-between">
                <label class="terms uk-text-light"><input v-model="signInLogin.rememberPassword" style="margin-right: 5px" class="uk-checkbox" type="checkbox" checked>Guardar contraseña</label>
                <a href="">Olvide mi contraseña</a>
            </div>
            <button class="uk-button uk-button-purple uk-width-1-1 uk-margin-small-bottom" @click="changeRoute('home')" style="margin-top: 15px">Iniciar sesión</button>
            <span style="display: block; margin-top: 10px">Aun No tiene cuenta? <a @click="changeRoute('sign-up')">Registrese</a></span>
        </form>
    </div>
</template>

<script>
import BackButton from '../components/Buttons/BackButton.vue'

export default {
components:{
    BackButton
},
data() {
    return {
        d: null,
        signInLogin:{
            email: '',
            password: '',
            rememberPassword: false    
        }
    }
},
methods:{
    mounted(){
        this.$store.commit('setCurrent', false)
    },
    changeRoute(path){
        if (path == 'home') {
           if(this.signInLogin.email !== '' && this.signInLogin.password !== '' ) 
             this.$router.push({ name: path }).catch(() => {})
        } else {
         this.$router.push({ name: path }).catch(() => {})
        }
    }
}
}
</script>

<style scoped>
@media screen and (max-width: 639px){
    .logo{
      max-width: 23%;
}
.container{
    height: 55vh;
}
.uk-card-body{
    min-width: 100px !important;
    box-shadow: 0px 0px 0px #000 !important;
}
}

</style>