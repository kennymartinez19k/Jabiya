<template>
  <nav class="uk-navbar uk-navbar-container">
    <div class="uk-navbar-left">
            <font-awesome-icon icon="home" @click="setCurrentPage('direct-access')" style="font-size: 20px; margin: 0px 15px"/>
            <h6 class="uk-margin-remove" style="margin: 0px 10px !important">{{titlePage}}</h6>
            <a  class="uk-navbar-toggle" style="min-height: 60px !important; padding: 0px 15px !important" uk-navbar-toggle-icon  @click="openMenu" href="#"></a>
    <div id="offcanvas-overlay" uk-offcanvas="overlay: true">
    <div class="uk-offcanvas-bar uk-padding-remove">
            <img src="../assets/close.png" class="close-navbar uk-offcanvas-close" alt="" @click="hideMenu" srcset="">
        <div class="info-user">
            <img src="https://cdn-icons-png.flaticon.com/512/236/236831.png" style="width: 35% !important" alt="" srcset="">
            <h4 class="uk-text-light uk-margin-remove" style="margin: 5px 0px !important">Chofer 11</h4>
            <h6 class="uk-tect-light uk-margin-remove">Chofer11@gmail.com</h6>
        </div>
        <ul class="uk-list nav-opt uk-list-divider">
            <li @click="setCurrentPage('home')">Tus Cargas</li>
            <li @click="setCurrentPage('about')">Seleccione el idioma</li>
            <li @click="setCurrentPage('sign-in')">Cerrar sesión</li>
            <li @click="setCurrentPage('about')">Version app</li>
        </ul>
    </div>
</div>
    </div>
</nav>
</template>

<script>
import Uikit from 'uikit'
export default {
    props:{
        nameComponent: String
    },
computed:{
    
    titlePage(){
        if(this.nameComponent){
            return this.nameComponent
        }
        return ''
    }
},
data() {
    return {
        positionSticky: false
    }
},
methods:{
    openMenu(){
      this.positionSticky = true
      Uikit.offcanvas('#offcanvas-overlay').show();  
    },
    hideMenu(){
        this.positionSticky = false
        Uikit.offcanvas('#offcanvas-overlay').hide();
    },
    setCurrentPage(val) {
        this.$router.push({ name: val}).catch(() => {})
        this.hideMenu()
        
    },
}
}
</script>

<style scoped>
*{
    color: #fff !important
}

li{
    padding: 20px !important;
    color: rgb(0, 0, 0) !important;
    text-align: initial;
    margin: 0px !important;
}
.uk-list-divider>li:nth-child(n+2) {
    padding-top: 10px;
    border-top: 1px solid #e0e0e0
}
.uk-offcanvas-bar{
    background: #fff;
    width: 250px
}
.info-user{
    box-sizing: border-box;
    background: #2a307c;
    padding: 20px;
    width: 100%;
    height: 30%;
}
.uk-navbar-container{
    background: #2a307c;
}
.uk-navbar-left{
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 55px;
}
.close-navbar{
    width: 25px;
    right: 5px;
    top: 10px;
}
</style>