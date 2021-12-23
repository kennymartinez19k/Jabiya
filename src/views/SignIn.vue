<template>
  <Loading
    :active="loaded"
    color="rgb(86, 76, 175)"
    loader="spinner"
    :width="65"
    background-color="rgba(252, 252, 252, 0.7)"
  ></Loading>
  <div class="uk-flex uk-flex-right uk-flex-column uk-flex-wrap cnt">
    <form
      class="
        uk-card
        uk-card-default
        uk-padding-remove
        uk-card-large
        uk-card-body
        uk-width-1-3@s
      "
      style="padding: 0px 20px !important; min-width: 400px"
    >
      <img class="logo" src="../assets/logo.png" alt="" />
      <h4 class="uk-text-light">Entrar a su cuenta</h4>
      <span class="uk-text-muted" style="margin-bottom: 30px; display: block"
        >Ingrese su número de móvil y contraseña y presione iniciar seción para
        ingresar a su cuenta</span
      >

      <div class="uk-margin uk-text-left">
        <label class="uk-text-emphasis" for="email">Email</label>
        <div class="uk-input uk-flex form-login" style="align-items: center">
          <input
            class="uk-form-width-medium formLogin"
            v-model="login.email"
            type="email"
            placeholder="ejemplo@email.com"
            required
          />
          <font-awesome-icon icon="envelope" style="font-size: 15px" />
        </div>
      </div>
      <div class="uk-margin uk-text-left">
        <label class="uk-text-emphasis" for="companyData">Contraseña</label>
        <div class="uk-input uk-flex form-login" style="align-items: center">
          <input
            class="uk-form-width-medium"
            v-model="login.password"
            :type="type"
            style="width: 100%"
            placeholder="Contraseña"
            required
          />
          <font-awesome-icon
            :icon="iconType"
            @click="showPassword"
            style="font-size: 15px"
          />
        </div>
      </div>
      <div class="uk-margin uk-flex uk-flex-between">
        <label class="terms uk-text-light"
          ><input
            v-model="login.rememberPassword"
            style="margin-right: 5px"
            class="uk-checkbox"
            type="checkbox"
            checked
          />Recordar contraseña</label
        >
        <router-link to="/recover" class="show-link"
          >¿Olvidaste tu contraseña?</router-link
        >
      </div>
       <div v-if="showError" class="uk-alert-warning" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p>Revisar los datos</p>
        </div>
      <button
        type="button"
        class="uk-button uk-button-purple uk-width-1-1 uk-margin-small-bottom"
        @click="changeRoute('direct-access')"
        style="margin-top: 15px"
      >
        Iniciar sesión
      </button>
    </form>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
export default {
  components: {
    Loading,
  },
  data() {
    return {
      loaded: false,
      type: "password",
      iconType: "eye",
      showError: null,
      login: {
        email: "admin@flai.com.do",
        password: "1",
        rememberPassword: false,
      },
      AutoLogin: {
        email: "",
        password: "",
      },
    };
  },
  watch: {
      'login.email': function (newVal) {
          if (newVal) {
              this.showError = false
              
          }
      },
        'login.password': function (newVal) {
          if (newVal) {
              this.showError = false
              
          }
      }
  },
  methods: {
    async changeRoute(path) {
      try {
        if (path == "0") {
          if (this.login.email !== "" && this.login.password !== "") {
            this.loaded = true;
            this.AutoLogin.email = this.login.email;
            this.AutoLogin.password = this.login.password;
            const resultLogin = await this.$services.singInServices.getToken(
              this.AutoLogin
            );
            console.log(resultLogin)
            this.loaded = false;

            if (resultLogin)
              this.$router.push({ name: path }).catch(() => {});
          }
        } else {
          this.$router.push({ name: path }).catch(() => {});
        }
      } catch (error) {
        this.loaded = false;
       this.showError = true
        // alert(error);
      }
    },
    showPassword() {
      if (this.type === "password") {
        this.type = "text";
        this.iconType = "eye-slash";
      } else {
        this.type = "password";
        this.iconType = "eye";
      }
    },
  },
};
</script>

<style scoped>
.place {
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
@media screen and (max-width: 639px) {
  .logo {
    max-width: 23%;
  }
  .uk-card-body {
    min-width: 100px !important;
    box-shadow: 0px 0px 0px #000 !important;
  }
}
.form-login input {
  width: 100%;
  height: 30px;
  border: 0px;
}
.form-login input:focus-visible {
  border: 0px;
  outline: none;
}
.uk-input:focus {
  outline: 0 !important;
  background-color: #fff;
  color: #666;
  border: 1px solid red;
}
.form-login {
  border: 1px solid #b1b1b1;
}
</style>
