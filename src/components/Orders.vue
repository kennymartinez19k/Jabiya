<template>
  <div class=" cnt uk-flex uk-flex-column uk-flex-between">
      <div class="uk-card uk-card-default uk-width-1-2@m container">
        <div
          v-for="order in orders"
          :key="order"
          class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between uk-margin-top"
        >
          <div class="uk-text-left info-user">
           <p class="uk-margin-remove"><strong>Numero de Orden:</strong>&nbsp;<span class="uk-text-light">{{order.numberOrder}}</span></p>
            <p class="uk-margin-remove"><strong>Numero de cajas:</strong>&nbsp;<span class="uk-text-light"></span>{{order.boxNumber}}</p>
            <p class="uk-margin-remove"><strong>Nombre del cliente:</strong>&nbsp;<span class="uk-text-light">{{order.customerName}}</span></p>
            <p class="uk-margin-remove"><strong>Dirección</strong>&nbsp;<span class="uk-text-light">{{order.direction}}</span></p>
            <p class="uk-margin-remove"><strong>Tiempo esperado:</strong>&nbsp;<span class="uk-text-light">{{order.waitTime}}</span></p>
          </div>
            <div>
                <button class="uk-button uk-text-light uk-button-purple">Escanear</button>
            </div>
         
        </div>
      </div>
    
        <slide-unlock
        ref="vueslideunlock"
        :auto-width="true"
        :circle="true"
        :disabled="false"
        :noanimate="false"
        :height="50"
        :completedBg="completed"
        class="slide"
        text="slide to unlock"
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
            completed: 'background-color: #2a307c !important',
            orders: [
                {
                    id: 1,
                    numberOrder: '1123213123',
                    boxNumber: 1,
                    customerName: 'Juan Perez', 
                    direction: 'Repebublica de colombia',
                    waitTime:  '2021-11-03'
                },
                {
                    id: 2,
                    numberOrder: '1123213123',
                    boxNumber: 1, customerName: 'Juan Perez', 
                    direction: 'Repebublica de colombia',
                    waitTime:  '2021-11-03'
                },
                {
                    id: 3,
                    numberOrder: '1123213123',
                    boxNumber: 1, customerName: 'Juan Perez', 
                    direction: 'Repebublica de colombia',
                    waitTime:  '2021-11-03'
                },
                {
                    id: 4,
                    numberOrder: '1123213123',
                    boxNumber: 1, customerName: 'Juan Perez', 
                    direction: 'Repebublica de colombia',
                    waitTime:  '2021-11-03'
                },
                {
                     id: 5,
                    numberOrder: '1123213123',
                    boxNumber: 1, customerName: 'Juan Perez', 
                    direction: 'Repebublica de colombia',
                    waitTime:  '2021-11-03'
                },
                {
                     id: 6,
                    numberOrder: '1123213123',
                    boxNumber: 1, customerName: 'Juan Perez', 
                    direction: 'Repebublica de colombia',
                    waitTime:  '2021-11-03'
                },
            ]
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
.slide{
    background: #2a307c;
     position: fixed;
    width: 96% !important;
    bottom: 5px;
    height: 40px;
}
.slide .slideunlock.is-complete .slideunlock-progressbar {
    background-color: #2a307c;
}
.slide:first-child{
    background-color: #2a307c;
}
.container {
  padding: 10px 14px 5px;
  box-shadow: 0px 0px;
}
.uk-card{
  padding: 20px 10px;
}
.cnt {
  height: 100%;
  overflow: scroll;
}
.uk-button {
  padding: 0px 5px !important;
  font-size: 12px;
}
.p {
  font-size: 13px;
}



</style>