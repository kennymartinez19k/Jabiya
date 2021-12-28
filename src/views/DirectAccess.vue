<template>
  <div class="container">
         <div class="">
    <ion-loading
    :is-open="isOpenRef"
    cssClass="my-custom-class"
    message="Por favor Espere..."
    :duration="timeout"
    @didDismiss="setOpen(false)"
  >
  </ion-loading>
  <Loading :active="loaded" color="rgb(86, 76, 175)" loader="spinner" :width="65" background-color="rgba(252, 252, 252, 0.7)"></Loading>
  </div>
      <ul class="uk-flex uk-flex-wrap uk-margin-remove" style="padding: 10px 0px; list-style: none">
          <h5 class="title uk-width-1-1 uk-text-center">{{$t('directAccess.titleAccess')}}</h5>
          <li class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/box-truck.png" alt="">
                <p class="name-action"><strong>{{$t('directAccess.titleTravel')}}</strong></p>
          </li>
          <li v-if="showProfile === true" class="action uk-width-1-2" @click="changeRoute('orders-auto-scan')">
               <img src="../assets/cargo.png" alt="">
                <p class="name-action"><strong>{{$t('directAccess.titleMount')}}</strong> </p>
          </li>
          <li  v-else  class="action uk-width-1-2" @click="changeRoute('orders')">
               <img src="../assets/cargo.png" alt="">
                <p class="name-action"><strong>{{$t('directAccess.titleMount')}}</strong> </p>
          </li>
          <li v-if="settings?.AutoScan" :class="{'disabledAccess': !hasStatus('Driver Arrival')}" class="action uk-width-1-2" @click="changeRoute('delivery-actions-auto')">
              <img src="../assets/deliver-container.png" alt="">
            <p class="name-action"><strong>{{$t('directAccess.titleDelivery')}}</strong> </p>
          </li>
          <li v-else :class="{'disabledAccess': !hasStatus('Driver Arrival')}" class="action uk-width-1-2" @click="changeRoute('deliveryActions')">
            <img src="../assets/deliver-container.png" alt="">
            <p class="name-action"><strong>{{$t('directAccess.titleDelivery')}}</strong> </p>
          </li>
          <li v-if="settings?.AutoScan === false" class="action uk-width-1-2" @click="changeRoute('')">
               <img src="../assets/invoice.png" alt="">
                <p class="name-action"><strong>{{$t('directAccess.titleInvoices')}}</strong> </p>
          </li>
          <li v-if="settings?.AutoScan === false" class="action uk-width-1-2" @click="changeRoute()">
              <img src="../assets/almacen.png" alt="">
                <p class="name-action"><strong>{{$t('directAccess.titleReconciliation')}}</strong></p>
          </li>
          <li class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/reject-container.png" alt="">
                <p class="name-action"><strong>{{$t('directAccess.titleProcessNo')}}</strong></p>
          </li>
           <li class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/return-container.png" alt="">
                <p class="name-action"><strong>{{$t('directAccess.titleReturn')}}</strong></p>
          </li>
      </ul>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Loading from "vue-loading-overlay";
import { IonLoading } from "@ionic/vue";
import "vue-loading-overlay/dist/vue-loading.css";
import Uikit from 'uikit'

export default {
  components: {
    IonLoading,
    Loading,
  },
    data() {
    return {
      load: null,
      loaded: false,
      Loads: null,
      check: null,
    };
  },
  computed:{
    ...mapGetters([
      'settings', "userData", "languageStore", "rolStore"
    ]),
  },
  async beforeMount(){
    this.$store.commit("setloadStore", null);
    this.$store.commit("scanOrder", null);
    
    this.$emit(
        "deliveryActions",
        ``
      );
    await this.call()
  
  },
  async mounted (){
      this.$i18n.locale = this.languageStore
      await this.permiso()
  },
 

  methods: {
    ...mapActions([
      'hasPermission'
    ]),
    async permiso(){
     let a = await this.hasPermission('autoScan')
      if (a === true) {
        this.showProfile = a
      } else if (a === false) {
        this.showProfile = a
      }
    },
    async call(){
       this.loaded = true;
       this.Loads = await this.$services.loadsServices.getLoads();
       this.loaded = false;
       console.log(this.Loads)
    },
    openMenu(){
      this.positionSticky = true
      Uikit.offcanvas('#offcanvas-overlay').show();  
    },
    hideMenu(){
        this.positionSticky = false
        Uikit.offcanvas('#offcanvas-overlay').hide();
    },
    
    async changeRoute(val){
      if (await this.Loads){
        this.$store.commit('setAllLoads', this.Loads)
        this.$router.push({name: val})
      }
    },
    setCurrentPage(val) {
        this.$router.push({ name: val}).catch(() => {})
        this.hideMenu()
    },
    hasStatus(val){
      return this.Loads?.some(x => x.status == val)
    }
  },

}
</script>

<style scoped>
.container{
  background: #fff;
  height: 100vh;
  padding-top: 20px;
}

.action{
    margin: 17px 0px;
    position: relative;
}
.title{
  margin: 0px 10px 10px;
}
.action img{
    width: 45%;
}
.action-element{
    font-size: 13px;
}
.name-action{
  padding: 0px 10px
}
.close-navbar{
    width: 25px;
    right: 5px;
    top: 10px;
}
.uk-list-divider>li:nth-child(n+2) {
    padding-top: 10px;
    border-top: 1px solid #e0e0e0
}
.info-user{
    box-sizing: border-box;
    background: #2a307c;
    padding: 20px;
    width: 100%;
    height: 30%;
}
.uk-offcanvas-bar{
    background: #fff;
    width: 250px
}

.disabledAccess{
  pointer-events: none;
}
.disabledAccess .disabled{
    background: rgba(255, 255, 255, 0.4);
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
}
</style>