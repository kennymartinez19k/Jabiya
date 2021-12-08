<template>
  <app-header v-if="!currentPage" :nameComponent="currentName"/>
  <router-view class="view-header" :class="{view: !currentPage}"/>

</template>
<script>
import AppHeader from './views/AppHeader.vue'

export default {
  data(){
    return{
      noHead: [
        'sign-in',
        'sign-up',
        'direct-access',
        'recover-password'
      ]
    }
  },
  components:{
    AppHeader
  },
  watch:{
    $route: function(){
      console.log(this.$route)
    }
  },
  computed:{
    currentPage: function() {
      return this.noHead.some(x => x == this.$route.name)
    },
    currentName: function() {
      if(!this.currentPage) return this.$route.matched[0]?.components?.default?.alias
      else return ''
    },

},
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
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  padding: 5px;
  border: 2px solid #564caf;
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
  height: 91vh !important;
}
.view-header{
  height: 98vh;
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
