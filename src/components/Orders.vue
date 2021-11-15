<template>
  <div class="uk-flex uk-flex-column uk-flex-between cnt">
      <div>
          <div class="uk-child-width-1-2@s uk-grid-match" uk-grid>
              <div>
                <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-text-bold uk-text-left">
                    <p class="uk-margin-remove">Numero de Orden: <span class="uk-text-light">1123213123</span></p>
                    <p class="uk-margin-remove">Numero de cajas: <span class="uk-text-light">1</span></p>
                    <p class="uk-margin-remove">Nombre del cliente: <span class="uk-text-light">Juan Perez</span></p>
                    <p class="uk-margin-remove">Direccion <span class="uk-text-light">Republica de colombia</span></p>
                    <p class="uk-margin-remove">Tiempo esperado: <span class="uk-text-light">2021-11-03</span></p>
                    <div>
                        <button class="uk-button uk-text-light uk-button-purple">Escanear</button>
                    </div>
                </div>
            </div>
          </div>
          <div class="uk-child-width-1-2@s uk-grid-match" uk-grid>
              <div>
                <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-text-bold uk-text-left">
                    <p class="uk-margin-remove">Numero de Orden: <span class="uk-text-light">1123213123</span></p>
                    <p class="uk-margin-remove">Numero de cajas: <span class="uk-text-light">1</span></p>
                    <p class="uk-margin-remove">Nombre del cliente: <span class="uk-text-light">Juan Perez</span></p>
                    <p class="uk-margin-remove">Direccion <span class="uk-text-light">Republica de colombia</span></p>
                    <p class="uk-margin-remove">Tiempo esperado: <span class="uk-text-light">2021-11-03</span></p>
                    <div>
                        <button class="uk-button uk-text-light uk-button-purple">Escanear</button>
                    </div>
                </div>
            </div>
          </div>
          <div class="uk-child-width-1-2@s uk-grid-match" uk-grid>
              <div>
                <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-text-bold uk-text-left">
                    <p class="uk-margin-remove">Numero de Orden: <span class="uk-text-light">1123213123</span></p>
                    <p class="uk-margin-remove">Numero de cajas: <span class="uk-text-light">1</span></p>
                    <p class="uk-margin-remove">Nombre del cliente: <span class="uk-text-light">Juan Perez</span></p>
                    <p class="uk-margin-remove">Direccion <span class="uk-text-light">Republica de colombia</span></p>
                    <p class="uk-margin-remove">Tiempo esperado: <span class="uk-text-light">2021-11-03</span></p>
                    <div>
                        <button class="uk-button uk-text-light uk-button-purple">Escanear</button>
                    </div>
                </div>
            </div>
          </div>
          <div class="uk-child-width-1-2@s uk-grid-match" uk-grid>
              <div>
                <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-text-bold uk-text-left">
                    <p class="uk-margin-remove">Numero de Orden: <span class="uk-text-light">1123213123</span></p>
                    <p class="uk-margin-remove">Numero de cajas: <span class="uk-text-light">1</span></p>
                    <p class="uk-margin-remove">Nombre del cliente: <span class="uk-text-light">Juan Perez</span></p>
                    <p class="uk-margin-remove">Direccion <span class="uk-text-light">Republica de colombia</span></p>
                    <p class="uk-margin-remove">Tiempo esperado: <span class="uk-text-light">2021-11-03</span></p>
                    <div>
                        <button class="uk-button uk-text-light uk-button-purple">Escanear</button>
                    </div>
                </div>
            </div>
          </div>
          <div class="uk-child-width-1-2@s uk-grid-match" uk-grid>
              <div>
                <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-text-bold uk-text-left">
                    <p class="uk-margin-remove">Numero de Orden: <span class="uk-text-light">1123213123</span></p>
                    <p class="uk-margin-remove">Numero de cajas: <span class="uk-text-light">1</span></p>
                    <p class="uk-margin-remove">Nombre del cliente: <span class="uk-text-light">Juan Perez</span></p>
                    <p class="uk-margin-remove">Direccion <span class="uk-text-light">Republica de colombia</span></p>
                    <p class="uk-margin-remove">Tiempo esperado: <span class="uk-text-light">2021-11-03</span></p>
                    <div>
                        <button class="uk-button uk-text-light uk-button-purple">Escanear</button>
                    </div>
                </div>
            </div>
          </div>
          <div class="uk-child-width-1-2@s uk-grid-match" uk-grid>
              <div>
                <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-text-bold uk-text-left">
                    <p class="uk-margin-remove">Numero de Orden: <span class="uk-text-light">1123213123</span></p>
                    <p class="uk-margin-remove">Numero de cajas: <span class="uk-text-light">1</span></p>
                    <p class="uk-margin-remove">Nombre del cliente: <span class="uk-text-light">Juan Perez</span></p>
                    <p class="uk-margin-remove">Direccion <span class="uk-text-light">Republica de colombia</span></p>
                    <p class="uk-margin-remove">Tiempo esperado: <span class="uk-text-light">2021-11-03</span></p>
                    <div>
                        <button class="uk-button uk-text-light uk-button-purple">Escanear</button>
                    </div>
                </div>
            </div>
          </div>
          
      </div>
    
        <slide-unlock
        ref="vueslideunlock"
        :auto-width="true"
        :circle="true"
        :disabled="false"
        :noanimate="false"
        :width="400"
        :height="40"
        :completedBg="completed"
        class="slide"
        text="Escaneo Corrido"
        success-text="success"
        @completed="complete()"
        textSize="10px"
    />
  </div>
</template>

<script>
import SlideUnlock from "vue-slide-unlock"
export default {
    data(){
        return{
            completed: 'background-color: #2a307c !important'
        }
    },
    components: {
        SlideUnlock
    },
     mounted(){
        this.$store.commit('setCurrent', {menuName: 'Lista de ordenes',componentName: 'orders'},)
    },

}
</script>

<style scoped>

.slide .slideunlock.is-complete .slideunlock-progressbar {
    background-color: #2a307c;
}
.slide:first-child{
    background-color: #2a307c;
}
.cnt {
  height: 100%;
  overflow: scroll;
}
</style>