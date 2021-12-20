<template>
  <app-header v-if="!currentPage" :nameComponent="currentName"/>
  <router-view class="view-header" @deliveryActions="setName($event)" :class="{view: !currentPage}"/>
</template>
<script>
import { mapGetters } from 'vuex'
import AppHeader from './views/AppHeader.vue'

export default {
  data(){
    return{
      stopScan:  false,
      noHead: [
        'sign-in',
        'sign-up',
        'settings',
        'direct-access',
        'recover-password'
      ],
      nameOrder: null
    }
  },
  components:{
    AppHeader
  },
  watch:{
    $route: function(newVal){
      console.log(newVal.name)
    },
  },
  computed:{
    ...mapGetters([
      'settings'
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
methods:{
  setName(val){
    this.nameOrder = val
    console.log(this.nameOrder)
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
  overflow: scroll;
  /* background: #fff; */
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
  height: 100%;
  overflow: scroll;
}
.uk-button-transparent{
  color: #1f1f1f;
    background: white;
    border: 1px solid;
    border: 1px solid #4a4a4a;
}
</style>
