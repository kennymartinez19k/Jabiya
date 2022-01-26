<template>
  <Loading
    class="loading-position"
    :active="loaded"
    color="rgb(86, 76, 175)"
    loader="spinner"
    :width="100"
    background-color="rgba(252, 252, 252, 0.7)"
  ></Loading>
  <div class="uk-flex uk-flex-center uk-flex-column uk-flex-wrap cnt">

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
        >Ingrese su número de móvil y contraseña y presione iniciar sesión para
        ingresar a su cuenta {{storage}}</span
      >

      <div class="uk-margin uk-text-left">
        <label class="uk-text-emphasis" for="email">Email / Teléfono</label>
        <div class="uk-input uk-flex form-login" style="align-items: center">
          <input
            class="uk-form-width-medium formLogin"
            v-model="login.email"
            type="text"
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
            v-model="rememberPassword"
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
        <p>{{ showErrorText }}</p>
      </div>
      <button
        type="button"
        :class="{ disabled: disabled }"
        class="uk-button uk-button-purple uk-width-1-1 uk-margin-small-bottom"
        @click="changeRoute('home')"
        style="margin-top: 15px"
      >
        Iniciar sesión
      </button>
    </form>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import { LocalStorage } from "../mixins/LocalStorage";

export default {
  components: {
    Loading,
  },
  mixins: [LocalStorage],
  data() {
    return {
      loaded: false,
      type: "password",
      iconType: "eye",
      showError: null,
      disabled: false,
      showErrorText: null,
      login: {
        email: "8094034881",
        password: "1",
      },
      storage: 0,
      rememberPassword: true,

      AutoLogin: {
        email: "",
        password: "",
      },
      result: 0

    };
  },
  watch: {
    "login.email": function (newVal) {
      if (newVal) {
        this.showError = false;
      }
    },
    "login.password": function (newVal) {
      if (newVal) {
        this.showError = false;
      }
    },
    rememberPassword: {
      handler: function (newVal) {
        if (newVal === true) {
          localStorage.removeItem("rememberData");
          localStorage.removeItem("rememberPassword");
          localStorage.setItem(
            "rememberData",
            JSON.stringify(this.login.email)
          );
          localStorage.setItem(
            "rememberPassword",
            JSON.stringify(this.login.password)
          );
    
        } else {
          localStorage.removeItem("rememberData");
          localStorage.removeItem("rememberPassword");
        }
      },
      deep: true,
    },
  },
  mounted() {
    if (JSON.parse(localStorage.getItem("rememberData"))) {
      this.rememberPassword = true;
      this.login.email = JSON.parse(localStorage.getItem("rememberData"));
      this.login.password = JSON.parse(
        localStorage.getItem("rememberPassword")
      );
    }
  },
  methods: {
    async changeRoute(path) {
      this.disabled = true;
      try {
        if (path == "home") {
          if (this.login.email !== "" && this.login.password !== "") {

            // console.log(typeof(this.login.email), '(this.login.email') var c = a.split('').find(x => x === '@')
            this.loaded = true;
            this.AutoLogin.email = String(this.login.email);
            this.AutoLogin.password = String(this.login.password);
            const resultLogin = await this.$services.singInServices.getToken(
              this.AutoLogin
            );
            this.loaded = true;
            this.$store.commit("setUserData", resultLogin);
            if (resultLogin) this.$router.push({ name: path }).catch(() => {});
          }
        } else {
          this.$router.push({ name: path }).catch(() => {});
        }
      } catch (error) {
        this.loaded = false;
        this.disabled = false;
        if (error.message === "Request failed with status code 401") {
          this.showErrorText = "Error al introducir los datos";
        } else if (error.message === "Network Error") {
          this.showErrorText = "Error de conexion, verifique que este conectado";
        }
        this.showError = true;
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
    }
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
.loading-position {
  position: absolute;
  z-index: 1;
  top: 278px;
  right: 11px;
  width: 92%;
}
.disabled {
  pointer-events: none;
}
</style>
