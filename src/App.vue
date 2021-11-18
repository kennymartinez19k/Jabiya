<template>
  <app-header v-if="current" />
  <router-view class="view-header" :class="{view: current}"/>

</template>
<script>
import AppHeader from './views/AppHeader.vue'
import { mapGetters } from 'vuex'

export default {
  components:{
    AppHeader
  },
  computed:{
    ...mapGetters([
        'current'
    ])
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
.uk-button-orange{
  background: #bf6121;
  color: #fff;
}
.view{
  height: 89vh !important;
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
