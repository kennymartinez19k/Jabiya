<template>
    <BackButton/>
            <form class="uk-card uk-card-default uk-padding-remove uk-card-large uk-card-body uk-width-1-3@s"  style="padding: 40px 20px !important;">
               <h4 class="uk-text-light uk-padding-remove">Crea una cuenta</h4>
              <p class="uk-text-muted">si ya estas registrado, regresa a la pantalla anterio  y uso el boton de iniciar sesion</p>
            <div class="uk-margin">
                <input class="uk-input uk-form-width-medium" v-model="signUpLogin.firstName" type="text" style="width: 100%" placeholder="Primer Nombre">
            </div>
            <div class="uk-margin">
                <input class="uk-input uk-form-width-medium" v-model="signUpLogin.lastName" type="text" style="width: 100%" placeholder="Primer Apellido">
            </div>
            <div class="uk-margin">
                <input class="uk-input uk-form-width-medium" v-model="signUpLogin.email" type="email" style="width: 100%" placeholder="Correo Electronico">
            </div>
            <div class="uk-margin">
                <input class="uk-input uk-form-width-medium" v-model="signUpLogin.password" type="password" style="width: 100%" placeholder="Contraseña">
            </div>
            <div class="uk-margin">
                <input class="uk-input uk-form-width-medium" v-model="signUpLogin.phoneNumber" type="text" style="width: 100%" placeholder="Numero Telefono">
            </div>
            <div class="uk-margin">
                <input class="uk-input uk-form-width-medium" v-model="signUpLogin.company" type="text" style="width: 100%" placeholder="Cual es su Compañia">
            </div>
            <div class="uk-margin">
                <label class="terms uk-text-light"><input v-model="signUpLogin.terms" style="margin-right: 5px" class="uk-checkbox" type="checkbox" checked>Aceptar terminos y condiciones</label>
            </div>
            
            <button class="uk-button uk-width-1-1 uk-button-purple uk-text-white" style="margin-top: 15px" @click="go">Registrarse</button>
        </form>
</template>

<script>
import BackButton from '../components/Buttons/BackButton.vue'

export default {
components: {
    BackButton,
  },
  mounted(){
        this.$store.commit('setCurrent', false)
    },
  data() {
      return {
          signUpLogin:{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              phoneNumber: null,
              company: '',
              terms: false
          }
      }
  },
  methods: {
    go(){
        this.$router.push({ name: 'home' }).catch(() => {})
    }  
  },
}

</script>

<style scoped>
@media screen and (max-width: 639px){
.container{
    height: 55vh;
}
.uk-card-body{
    min-width: 100px !important;
}

.uk-card-body{
    min-width: 100px !important;
    box-shadow: 0px 0px 0px #000 !important;
}
}
.terms{
    display: block;
    text-align: initial;
    margin: 10px 0px 5px 3px
}
</style>