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
                <h5 ><button type="button" class="uk-button uk-button-primary " :disabled="settings.AutoScan === null" @click="saveSettings()">Guardar</button></h5>
            </ion-col>
          </ion-row>
            
            
          </ion-toolbar>
        </ion-header>
        <ion-content fullscreen class="ion-padding">
            <label class="item" uk-tooltip="Seleccione una opción" for="check">
                <h6 >Escaneo Automatico</h6>
                <!-- <input type="checkbox" id="check" v-model="settings.AutoScan" class="checkBox"> -->
                <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label>Si<input class="uk-radio" type="radio" :value="true" name="radio2" v-model="settings.AutoScan"></label>
            <label>No<input class="uk-radio" type="radio" :value="false" name="radio2" v-model="settings.AutoScan"></label>
        </div>
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
                AutoScan: null
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
    align-items: baseline;
}
.header{
    box-shadow: 0px 0px 2px;
    display: flex;
    justify-content: space-between;
}
.checkBox{
    transform: scale(1.5);
}
label {
    padding-right: 1rem;
}
input {
    margin-left: 0.5rem;
}
button{
 padding: 0px 2.5px;
}
</style>