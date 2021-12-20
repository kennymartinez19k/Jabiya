<template>
  <div>
      <ion-app>
      <div class="ion-page">
        <ion-header translucent class="header">
          <ion-toolbar>
            <ion-row style="align-items: baseline; padding: 0px 10px">
            <ion-col class="uk-text-left">
              <h6>Configuracion</h6>
            </ion-col>
            <ion-col class="uk-text-right" >
                <h5 ><a @click="saveSettings()">Guardar</a></h5>
            </ion-col>
          </ion-row>
            
            
          </ion-toolbar>
        </ion-header>
        <ion-content fullscreen class="ion-padding">
            <label class="item" for="check">
                <h6 >Escaneo Automatico</h6>
                <input type="checkbox" id="check" v-model="settings.AutoScan" class="checkBox">
            </label>
        </ion-content>
      </div>
    </ion-app>
  </div>
</template>

<script>
export default {
    data(){
        return{
            settings:{
                AutoScan: false
            }
        }
    },
    mounted(){
        this.$store.commit("setSettings", this.settings)
    },
    methods: {
        saveSettings(){
            this.$store.commit("setSettings", this.settings)
            this.$router.push({name: "direct-access"})
        }
    },
}
</script>

<style scoped>
.item{
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    align-items: center;
}
.header{
    box-shadow: 0px 0px 2px;
    display: flex;
    justify-content: space-between;
}
.checkBox{
    transform: scale(1.5);
}
</style>