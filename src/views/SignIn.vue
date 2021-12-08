<template>
  <Loading :active="loaded" color="rgb(86, 76, 175)" loader="spinner" :width="65" background-color="rgba(252, 252, 252, 0.7)"></Loading>

    <div class="uk-flex uk-flex-center uk-flex-wrap container">
        <form class="uk-card uk-card-default uk-padding-remove uk-card-large uk-card-body uk-width-1-3@s" style="padding: 40px 20px !important; min-width: 400px">
            <img class="logo" src="../assets/logo.png" alt="">
            <h4 class="uk-text-light">Entrar a su cuenta</h4>
            <span class="uk-text-muted" style="margin-bottom: 30px; display: block">Ingrese su número de móvil y contraseña y presione iniciar seción para ingresar a su cuenta</span>

            <div class="uk-margin uk-text-left">
               <label class="uk-text-emphasis" for="mobile">Teléfono</label>
                <input class="uk-input uk-form-width-medium place" v-model="signInLogin.mobile" type="number" style="width: 100%" placeholder="(809) ___ - ____ " required>
            </div>
            <div class="uk-margin uk-text-left">
                <label class="uk-text-emphasis" for="companyData">Contraseña</label>
                <input class="uk-input uk-form-width-medium" v-model="signInLogin.password" type="password" style="width: 100%" placeholder="Contraseña" required>
            </div>
            <div class="uk-margin uk-flex uk-flex-between">
                <label class="terms uk-text-light"><input v-model="signInLogin.rememberPassword" style="margin-right: 5px" class="uk-checkbox" type="checkbox" checked>Recordar contraseña</label>
                <router-link to="/recover" class="show-link">¿Olvidaste tu contraseña?</router-link>
            </div>
            <button class="uk-button uk-button-purple uk-width-1-1 uk-margin-small-bottom" @click="changeRoute('direct-access')" style="margin-top: 15px">Iniciar sesión</button>
        </form>
    </div>
</template>

<script>
import Loading from 'vue-loading-overlay';


export default {
components:{
    Loading
},
data() {
    return {
        loaded: false,
        signInLogin:{
            mobile: '',
            password: '',
            rememberPassword: false    
        }
    }
},
methods:{
    changeRoute(path){
        if (path == 'direct-access') {
           if(this.signInLogin.mobile !== '' && this.signInLogin.password !== '' ) {
            this.loaded = true
            this.$router.push({ name: path }).catch(() => {})
        }
        } else {
         this.$router.push({ name: path }).catch(() => {})
        }
    }
}
}
</script>

<style scoped>
.place::placeholder {
    background-image: url('../assets/img/movil.webp');
    background-size: 15px 15px;
    background-repeat: no-repeat;
    background-position: right center;

}
.show-link {
    color: #de871c;

}
.show-link:hover {
    color: #de871c;
    text-decoration-line: line;
    font-size: 14px;
    
}
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