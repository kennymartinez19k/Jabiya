<template>
  <Loading :active="loaded" color="rgb(86, 76, 175)" loader="spinner" :width="65" background-color="rgba(252, 252, 252, 0.7)"></Loading>
    <div class="uk-flex uk-flex-right uk-flex-column uk-flex-wrap cnt">
        <form class="uk-card uk-card-default uk-padding-remove uk-card-large uk-card-body uk-width-1-3@s" style="padding: 0px 20px !important; min-width: 400px">
            <img class="logo" src="../assets/logo.png" alt="">
            <h4 class="uk-text-light">Entrar a su cuenta</h4>
            <span class="uk-text-muted" style="margin-bottom: 30px; display: block">Ingrese su número de móvil y contraseña y presione iniciar seción para ingresar a su cuenta</span>

            <div class="uk-margin uk-text-left">
               <label class="uk-text-emphasis" for="mobile">Email</label>
               <div class="uk-input uk-flex form-login" style="align-items: center">
                <input class="uk-form-width-medium formLogin" v-model="signInLogin.email" type="email" placeholder="Example@email.com" required>
                <font-awesome-icon icon="mobile-alt" style="font-size: 15px"/>
               </div>
            </div>
            <div class="uk-margin uk-text-left">
                <label class="uk-text-emphasis" for="companyData">Contraseña</label>
                <div class="uk-input uk-flex form-login" style="align-items: center">
                    <input  class="uk-form-width-medium" v-model="signInLogin.password" :type="type" style="width: 100%" placeholder="Contraseña" required>
                    <font-awesome-icon :icon="iconType" @click="showPassword" style="font-size: 15px"/>
                </div>
            </div>
            <div class="uk-margin uk-flex uk-flex-between">
                <label class="terms uk-text-light"><input v-model="rememberPassword" style="margin-right: 5px" class="uk-checkbox" type="checkbox" checked>Recordar contraseña</label>
                <router-link to="/recover" class="show-link">¿Olvidaste tu contraseña?</router-link>
            </div>
            <button class="uk-button uk-button-purple uk-width-1-1 uk-margin-small-bottom" @click="changeRoute()" type="button" style="margin-top: 15px">Iniciar sesión</button>
        </form>
    </div>
</template>
 
<script>
import Loading from 'vue-loading-overlay';
import axios from 'axios'
export default {
components:{
    Loading,
},
data() {
    return {
        loaded: false,
        type: 'password',
        iconType: 'eye',
        signInLogin:{
            email: '',
            password: '', 
        },
        rememberPassword: false   
    }
},
methods:{
    async changeRoute(path){
        if (path == 'direct-access') {
           if(this.signInLogin.email !== '' && this.signInLogin.password !== '' ) {   
            const result = await axios.post('http://preprod.flai.com.do:8756/exo/authenticate', this.signInLogin)
            if(result) this.$router.push({ name: "settings" }).catch(() => {})
        }
        } else {
         this.$router.push({ name: "settings" }).catch(() => {})
        }
    },
    showPassword(){
        if (this.type === 'password') {
        this.type = 'text'
        this.iconType = 'eye-slash'
        } else {
        this.type = 'password'
        this.iconType = 'eye'
      }
    }
}
}
</script>

<style scoped>
.place{
    background-image: url(/img/call.5b440c14.png);
    background-position: 96%;
    background-size: 15px;
    background-repeat: no-repeat;
}
.show-link {
    color: #de871c;

}
.show-link:hover {
    color: #de871c;
    text-decoration-line: line;
    font-size: 14px;
    
}

.cnt {
  overflow: scroll;
  width: 100%;
  height: 13cm;
}
@media screen and (max-width: 639px){
    .logo{
      max-width: 23%;
}
.uk-card-body{
    min-width: 100px !important;
    box-shadow: 0px 0px 0px #000 !important;
}
}
.form-login input{
    width: 100%;
    height: 30px;
    border: 0px;
}
.form-login input:focus-visible {
    border: 0px;
    outline: none;
}
.uk-input:focus{
    outline: 0 !important;
    background-color: #fff;
    color: #666;
    border: 1px solid red;
}
.form-login{
    border: 1px solid #b1b1b1;
}

</style>