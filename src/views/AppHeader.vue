<template>
  <nav class="uk-navbar uk-navbar-container">
    <div class="uk-navbar-left">
      <div style="width: 50px">
        <div v-if="!iconType" class="status-server">
          <img v-if="server" src="../assets/online-icon.png" alt="">
          <img v-if="!server" src="../assets/offline-icon.png" alt="">
        </div>
        <font-awesome-icon
            v-if="iconType"
            :icon="iconType"
            @click="setDistributePage(action)"
            style="font-size: 20px; margin: 0px 15px"
          />
      </div>
      
      <h6
        class="uk-margin-remove"
        style="font-size: 14px; margin: 0px 10px !important"
      >
        {{ titlePage }}
      </h6>
      <a
        class="uk-navbar-toggle"
        style="min-height: 55px !important; padding: 0px 15px !important"
        uk-navbar-toggle-icon
        @click="openMenu"
        href="#"
      ></a>
      <div id="offcanvas-overlay" uk-offcanvas="overlay: true">
        <div class="uk-offcanvas-bar uk-padding-remove">
          <img
            src="../assets/close.png"
            class="close-navbar uk-offcanvas-close"
            alt=""
            @click="hideMenu"
            srcset=""
          />
          <div class="info-user">
            <img
              src="https://cdn-icons-png.flaticon.com/512/236/236831.png"
              style="width: 35% !important"
              alt=""
              srcset=""
            />
            <h4
              class="uk-text-light uk-margin-remove"
              style="margin: 5px 0px !important"
            >
              {{ userData?.firstName }} {{ userData?.lastName }}
            </h4>
            <h6 class="uk-tect-light uk-margin-remove">
              {{ userData?.email }}
            </h6>
          </div>
          <ul class="uk-list nav-opt uk-list-divider">
            <li @click="setCurrentPage('home')">Tus Viajes</li>
            <li v-if="userData?.userType == userType?.provider" @click="setCurrentPage('manage-orders')">Manejo de Orden</li>
            <li @click="setCurrentPage('settings')">Configuración</li>
            <li @click="setCurrentPage('version')">Version app</li>
            <li @click="setCurrentPage('sign-in')">Cerrar sesión</li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
import { userType} from '../types/index'
import Uikit from "uikit";

export default {
  
  props: {
    nameComponent: String,
  },
  
  computed: {
    ...mapGetters(["userData", "server"]),

    titlePage() {
      return this.nameComponent;
    },
  },
  watch: {
    $route: function (newVal) {
      newVal.name == "home"
        ? ((this.action = "sign-in"), (this.iconType = false))
        : newVal.name == "load-status"
        ? ((this.action = "home"), (this.iconType = "arrow-left"))
        : newVal.name == "scan-order"
        ? ((this.action = "orders"), (this.iconType = "arrow-left"))
         : newVal.name == "orders"
        ? ((this.action = "load-status"), (this.iconType = "arrow-left"))
        
        : ((this.action = "back"), (this.iconType = "arrow-left"));
    
    },
    server: function(newVal){
      this.serverStatus = newVal
    }
  },
  async mounted() {
    this.userData = JSON.parse(localStorage.getItem("userInfo"));

    if (this.nameComponent) this.titlePage = this.nameComponent;
    else "";
  },
  data() {
    return {
      userType,

      iconType: "arrow-left",
      action: "sign-in",
      positionSticky: false,
      userData: null,
      serverStatus: true

    };
  },
  methods: {
    openMenu() {
      this.positionSticky = true;
      Uikit.offcanvas("#offcanvas-overlay").show();
    },
    hideMenu() {
      this.positionSticky = false;
      Uikit.offcanvas("#offcanvas-overlay").hide();
    },
    setCurrentPage(val) {
      this.hideMenu()
      if(val == 'sign-in'){
        this.$store.commit('resetData')
        this.$router.push({ name: val }).catch(() => {});
      }
      if(val){
        this.$router.push({ name: val }).catch(() => {});
      }else{
          this.$router.push({ name: val }).catch(() => {});
          this.hideMenu();
      }
    },
     setDistributePage(val) {
      if(val == 'sign-in'){
        this.$store.commit('resetData')
        this.$router.push({ name: val }).catch(() => {});
      }
      if(this.$route.name == 'delivery-routes'){
        this.$router.push({ name: 'load-status' }).catch(() => {});
      }
      else if(this.$route.name == 'orders'){
        this.$router.push({ name: 'load-status' }).catch(() => {});
      }
      else if(this.$route.name == 'manage-orders'){
        this.$router.push({name: 'home'})
      }
      else if(this.$route.name == 'delivery-actions-auto'){
        this.$router.push({name: 'load-status'})
      }
      else if(this.$route.name == 'deliveryActions'){
        this.$router.push({name: 'delivery-routes'})
      }
      else{
        if (val == "back") this.$router.go(-1);
        else {
          this.$router.push({ name: val }).catch(() => {});
          this.hideMenu();
        }
      }
    },
  },
};
</script>

<style scoped>
* {
  color: #fff !important;
}

li {
  padding: 20px !important;
  color: rgb(0, 0, 0) !important;
  text-align: initial;
  margin: 0px !important;
}
.uk-list-divider > li:nth-child(n + 2) {
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}
.uk-offcanvas-bar {
  background: #fff;
  width: 250px;
}
.info-user {
  box-sizing: border-box;
  background: #2a307c;
  padding: 20px;
  width: 100%;
  height: 30%;
}
.uk-navbar-container {
  background: #2a307c;
}
.uk-navbar-left {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 55px;
}
.close-navbar {
  width: 25px;
  right: 5px;
  top: 10px;
}
.status-server img{
  width: 18px;
}
</style>