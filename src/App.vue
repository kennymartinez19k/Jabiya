<template>
  <app-header v-if="!currentPage" :nameComponent="currentName"/>

  <router-view class="view-header" @setNameHeader="setName($event)" :class="{view: !currentPage}"/>
</template>
<script>
import { mapGetters } from 'vuex'
import AppHeader from './views/AppHeader.vue'
import {queue, remove} from './queue'
import {LocalStorage} from './mixins/LocalStorage'


export default {
  data(){
    return{
      stopScan:  false,
      noHead: [
        'sign-in',
        'sign-up',
        'recover-password'
      ],
      nameOrder: null,
      result: 0,
      sendingBI: false
    }
  },
  components:{
    AppHeader
  },
  mixins: [LocalStorage],
  computed:{
    ...mapGetters([
      'settingsStore'
    ]),
    currentPage: function() {
      return this.noHead.some(x => x == this.$route.name)
    },
    currentName: function() {
      if(!this.currentPage){
        var Route = this.$route.matched[0]?.components?.default?.alias
        if(Route) return Route
        else return this.nameOrder
      }
      return ''
    },
},
  async mounted(){
    
    let waitInterval = 2000
    setInterval( async () => {
      if(queue.length > 0){
        let enqueueItem = remove()
        await this.enqueue(enqueueItem)
      }
      let queueItem = await this.peek()
      if(queueItem){
        if(queueItem.formInfo){
          waitInterval = 4000
        }else{
          waitInterval = 2000
        }
        try{
          let res = await this.$services.requestServices.request(queueItem)
          if(res){
            console.log(res)
            this.dequeue()
          }
        } 
        catch(error){
          console.log(error)
        }
      }
  }, waitInterval)
},
methods:{
  setName(val){
    this.nameOrder = val
  },
}
}
</script>
<style>
#app {
  font-size: 12px;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  font-size: 12px;
}
p {
  margin: 4px 0px;
}
h5{
   color: #5c5c5c !important
}
.uk-text-gray{
  color: #666666;
}

.uk-button-purple{
  background: #2a307c;

  color: #fff;
}
.uk-button-transparent{
  color: #1f1f1f;
    background: white;
    border: 1px solid;
}
button{
  border-radius: 5px !important
}
.uk-button-red{
  background: #be1515;
  color: #fff
}
.uk-button-orange{
  background: #bf6121;
  color: #fff;
}
.view{
  height: 92vh !important;
}
.view-header{
  height: 100%;
  overflow-y: scroll;
    overflow-x: hidden;
}
html body{
  height: 100vh;
  padding: 0;
  margin: 0;

}
strong{
  font-size: 13px !important;
  font-weight: 600 !important;
}
.btn-button{
  font-size: 10px !important
}
#nav {
  padding: 10px;

}
.font-weight-medium{
  font-weight: 500 !important;
}
.cnt {
  height: 100% !important;
  overflow: scroll;
}
.uk-button-transparent{
  color: #1f1f1f;
    background: white;
    border: 1px solid;
    border: 1px solid #4a4a4a;
}
.uk-button{
  line-height: 15px;
  font-size: 10px;
  padding: 10px 10px;
}

:focus:not([tabindex^='-']) {
    outline: 0px dotted #333;
    outline-offset: 1px;
}
.stiky {
  color: rgb(255, 255, 255) !important;
  z-index: 2;
    border-top: 1px solid #313575;
  font-size: 12px !important;
  padding: 0px 10px 5px !important;
 background: #2a307c;
 font-weight: 300 !important;
 text-align: center;
  box-shadow: 1px 0px 5px #898989;
}
.uk-button-green{
  background: green;
  color: #fff
}
.uk-button-blue{
  background: #0f7ae5;
  color: #fff
}
</style>
