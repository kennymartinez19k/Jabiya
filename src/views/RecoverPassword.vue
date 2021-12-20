<template>
  <BackButton />
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
        <h4 class="uk-text-light">Has Olvidado tu Contraseña</h4>
        <span class="uk-text-muted" style="margin-bottom: 30px; display: block"
          >Ingrese su número de teléfono móvil y la compañía a la que pertenece,
          para recuperar su contraseña.
        </span>
        <div class="uk-margin uk-text-left">
          <label class="uk-text-emphasis" for="mobile">Teléfono</label>
          <div class="uk-input uk-flex form-login" style="align-items: center">
                <input 
                  class="uk-form-width-medium"
                  type="number"
                  placeholder="(999) 000-0000"
                  v-model="accountRecovery.mobile"
                  :minlength="10"
                  :maxlength="11"
                  pattern="[A-Z]{3}[0-9]{4}"
                  required
                >
                <font-awesome-icon icon="mobile-alt" style="font-size: 15px"/>
               </div>
        </div>

        <div class="uk-margin uk-text-left">
          <label class="uk-text-emphasis" for="companyData"
            >Compañía de Trasporte</label
          >
          <input
            id="companyData"
            class="uk-input form-login"
            type="text"
            v-model="accountRecovery.companyData"
            required
            placeholder="Compañía de Trasporte"
          />
          <button
          class="
          uk-button uk-button-purple uk-width-1-1 uk-margin-small-bottom"
          style="margin: 25px 0px"
          uk-toggle="target: #modal-example"
          :class="{'disabled-button': (showMobile === true && showCompany === true) || (showMobile === false && showCompany === true)  || (showMobile === true && showCompany === false)}"
          :disabled="(showMobile === true && showCompany === true) || (showMobile === false && showCompany === true)  || (showMobile === true && showCompany === false)"
        >
          Enviar
        </button>
        </div>
      </form>
      <div id="modal-example" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
          <h4>Las Instrucciones han sido enviadas a tu WhatsApp</h4>
          <p style="font-size: 12px">
            Por favor sigue las instrucciones que te enviamos y cambia tu
            contraseña. Una vez termines vuelve a loguearse con la nueva
            contraseña.
          </p>
          <p class="uk-text-right uk-margin-small-top">
            <button
              class="uk-button uk-button-purple uk-modal-close"
              type="button"
              @click="returnSingIn()"
            >
              OK
            </button>
          </p>
        </div>
      </div>
    </div>
</template>

<script>
import BackButton from "../components/Buttons/BackButton.vue";
import {} from '../assets/img/qr.png'
export default {
  components: {
    BackButton,
  },
  data() {
    return {
      accountRecovery: {
        mobile: null,
        companyData: null,
      },
      showCompany: true,
      showMobile: true
    };
  },
  watch: {
    'accountRecovery.mobile': async function (newVal) {
        if (newVal === '') {
                this.accountRecovery.mobile = null

        }
        if (newVal !== null) {
                this.showMobile = false
        } else {
                this.showMobile = true

        }
    },
    'accountRecovery.companyData': async function (newVal) {
          if (newVal === '') {
                this.accountRecovery.companyData = null

        }
         if (newVal !== null) {
                this.showCompany = false
            } else {
                this.showCompany = true

        }
    }

  },
  methods: {
      returnSingIn () {
      this.$router.push({ name: "sign-in" }).catch(() => {});

      }
  },
};
</script>

<style scoped>
.disabled-button {
    background-color: #abacaf85;
}

.place::placeholder {
    background-image: url('../assets/img/movil.webp');
    background-size: 15px 15px;
    background-repeat: no-repeat;
    background-position: right center;

}
.cnt {
  overflow: scroll;
  width: 100%;
  height: 11.7cm;

}
@media screen and (max-width: 639px) {
  .logo {
    max-width: 23%;
    margin: 25px 0 0;
  }
  .uk-card-body {
    min-width: 100px !important;
    box-shadow: 0px 0px 0px #000 !important;
  }
}
.form-login{
    border: 1px solid #b1b1b1;
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
</style>
