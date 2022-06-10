<template>
   <div class="uk-padding-remove">
      <div class="info-user">
        <img
          src="https://cdn-icons-png.flaticon.com/512/236/236831.png"
          style="width: 35% !important"
          alt=""
          srcset=""
        />
        <h4
          class=" uk-margin-remove title web-font-small"
          style="margin: 5px 0px !important"
        >
          {{ userData?.firstName }} {{ userData?.lastName }}
        </h4>
        <h6 class="title web-font-small">
          {{ userData?.email }}
        </h6>
      </div>
      <ul class="uk-list nav-opt uk-list-divider">
        <li class="opt web-font-small" @click="setCurrentPage('home')">Tus Viajes</li>
        <li class="opt web-font-small" @click="setCurrentPage('settings')">Configuración</li>
        <li class="opt web-font-small" @click="setCurrentPage('version')">Version app</li>
        <li class="opt web-font-small" @click="setCurrentPage('sign-in')">Cerrar sesión</li>
      </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed:{
         ...mapGetters(["userData"]),
    },
    mounted(){
        this.$store.commit("setUserData")
    },
    methods: {
        setCurrentPage(val) {
            if(val == 'sign-in'){
                this.$store.commit('resetData')
                this.$router.push({ name: val }).catch(() => {});
            }
            if(val){
                this.$router.push({ name: val }).catch(() => {});
            }else{
                this.$router.push({ name: val }).catch(() => {});
            }
        },
    },
}
</script>

<style scoped>


.info-user {
  box-sizing: border-box;
  background: #2a307c;
  padding: 20px;
  width: 100%;
  height: 30%;
}
.uk-list-divider > li:nth-child(n + 2) {
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}
.opt{
  cursor: pointer;
  padding: 10px 0px;
}
.opt:hover{
  background: #f4f4f4
}
.opt:focus{
    background: #2a307c;
}
.title{
  color: #fff
}


</style>