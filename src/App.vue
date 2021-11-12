<template>
  <app-header v-if="current"/>
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  font-size: 12px;
}
.uk-button-purple{
  background: #2a307c;
  color: #fff;
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

#nav {
  padding: 10px;

}
</style>
