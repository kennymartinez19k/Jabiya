<template>
  <div class="uk-container">
      <div>
          <div class="uk-card uk-card-default uk-card-hover uk-card-body" style="z-index: 0; padding: 15px 0px !important">
            <h6 class="">Entrega de Orden No. {{loadStore.numberOfOrden}}</h6>
            <h6 class="exception">Hubo Alguna Excepcion? No
              <div class="onoffswitch">
    <input type="checkbox" v-model="exception" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" tabindex="0">
    <label class="onoffswitch-label" for="myonoffswitch"></label>
              </div>
              Si
            </h6>
            <h4 class="">Acciones</h4>
              <timeline :step="step" :exception="exception"/>
            <button class="uk-button uk-button-primary uk-margin" @click="step++">Siguiente</button>
           </div> 
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Timeline from '../components/timeline.vue'
export default{
  components:{
    Timeline
  },
  computed:{
    ...mapGetters([
      'loadStore'
    ])
  },
  data(){
    return{
      step: 0,
      exception: false
    }
  }
}
</script>

<style>
.qr {
    width: 60%; 
}
.circle {
 background-color: rgb(25, 189, 33);
}
.onoffswitch {
    position: relative; width: 73px;
    display: inline-block;
    width: 45px;
    margin: 0px 5px;
    -webkit-user-select:none; -moz-user-select:none; -ms-user-select: none;
}
.onoffswitch-checkbox {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}
.onoffswitch-label {
  position: relative;
  top: 3px;
    display: block; overflow: hidden; cursor: pointer;
    height: 22px; padding: 0; line-height: 36px;
    border: 2px solid #E3E3E3; border-radius: 36px;
    background-color: #FFFFFF;
    transition: background-color 0.3s ease-in;
}
.onoffswitch-label:before {
    content: "";
    display: block; width: 20px; margin: 0px;
    background: #FFFFFF;
    position: absolute; top: 0; bottom: 0;
    right: 19px;
    border: 2px solid #E3E3E3; border-radius: 36px;
    transition: all 0.3s ease-in 0s; 
}
.onoffswitch-checkbox:checked + .onoffswitch-label {
    background-color: #02CF13;
}
.onoffswitch-checkbox:checked + .onoffswitch-label, .onoffswitch-checkbox:checked + .onoffswitch-label:before {
   border-color: #02CF13;
}
.onoffswitch-checkbox:checked + .onoffswitch-label:before {
    right: 0px; 
}
.exception{
  display: flex;
    align-items: center;
    justify-content: center;
}
</style>