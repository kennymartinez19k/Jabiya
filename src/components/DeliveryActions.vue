<template>
  <div class="uk-container">
      <div>
          <div class="uk-card uk-card-default uk-card-hover uk-card-body" style="z-index: 0; padding: 15px 0px !important">
            <h3 class="uk-card-title">Acciones</h3>
              <timeline :step="step"/>
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
      ''
    ])
  },
  data(){
    return{
      step: 0
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
</style>