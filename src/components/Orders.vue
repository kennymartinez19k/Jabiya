<template>
  <div class="uk-flex uk-flex-column uk-flex-between cnt">
      <div class="uk-card uk-card-default uk-width-1-2@m container">
      <div>
        <div
          v-for="order in orders"
          :key="order"
          class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        >
          <div class="uk-text-left info-user uk-flex uk-flex-wrap">
            <div class="btn uk-flex">
              <span>
                <img src="../assets/package.png" alt="">
              </span>
              <div class="uk-flex uk-flex-column uk-text-center">
              <p style="font-size: 16px !important; font-weight: 600" class="uk-width-1-1"><span>{{order.client}}</span></p>

              </div>
              <span></span>
              
          </div>
            <p class="uk-width-1-1"><strong>Direccion: </strong><span>{{order.address}}</span></p>
            <p class="uk-width-1-2"><strong> No. de Orden: </strong><span>{{order.numberOfOrders}}</span></p>
            <p class="uk-width-1-2"><strong>No. de Cajas: </strong>{{order.numberOfBox}}<span></span></p>
          </div>
          <div class="uk-flex uk-flex-column">
            <img src="../assets/parcel.png" alt="">
            <span>Escanear</span>
          </div>
  
        </div>
      </div>
    </div>
    
        <slide-unlock
        ref="vueslideunlock"
        :auto-width="true"
        :circle="true"
        :disabled="false"
        :noanimate="false"
        :width="400"
        :height="40"
        :completedBg="completed"
        class="slide"
        text="Escaneo Corrido"
        success-text="success"
        @completed="complete(orders)"
        textSize="10px"
    />
  </div>
</template>

<script>
import SlideUnlock from "vue-slide-unlock"
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
export default {
    data(){
        return{
            result: null,
            completed: 'background-color: #2a307c !important',
            orders:[
                {
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'Juan Martinez Soto',
                    address: 'Sto Dgo Este, Alma Rosa 2da calle abreu #17',
                    timeToWait: '2020-01-23'
                },{
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'Maria Lisbeth Alcantara Rodriguez',
                    address: 'Sto Dgo Este, Alma Rosa 2da calle abreu #17' ,
                    timeToWait: '2020-01-23'
                },
                {
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'Albert Perez',
                    address: 'Sto Dgo Este, Alma Rosa 2da calle abreu #17' ,
                    timeToWait: '2020-01-23'
                },{
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'Jose Abreu Pichardo',
                    address: 'Sto Dgo Este, Alma Rosa 2da calle abreu #17' ,
                    timeToWait: '2020-01-23'
                },{
                    numberOfOrders: 1223,
                    numberOfBox: 2,
                    client: 'Juan Jose Garcia',
                    address: 'Sto Dgo Este, Alma Rosa 2da calle abreu #17' ,
                    timeToWait: '2020-01-23'
                },

    
                
            ]
        }
    },
    components: {
        SlideUnlock,
    },
     mounted(){
        this.$store.commit('setCurrent', {menuName: 'Lista de ordenes',componentName: 'orders'},)
    },
    methods: {
    //     async location () {
    //     alert('papaeeeeeeeeeeeeeeeep')
    //     try {
    //       const geo = await Geolocation.getCurrentPosition();
    //       this.location1.latitude = geo.coords.latitude
    //       this.location1.longitude = geo.coords.longitude
    //       // this.successCallback ( this.location1)
    //         console.log('Current position:', this.location1);
    //     } catch (e) {
    //       console.log('Current position:', this.location1);
    //       alert('papap' + e.toString() + ' ' + e.message)
    //       alert('papap' + this.location1?.timestamp)
    //     }
    // }, 
    complete(val){
      this.scan(val)
    },
    scan(val){
        this.$store.commit('scanOrder', val )
        this.$router.push({ name: 'about' }).catch(() => {})
    },
    async scanOrder() {
        if(await this.checkPermission()){
          BarcodeScanner.hideBackground(); 
  
          const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

          if (result.hasContent) {
              this.result = result.content
              this.stopScan()
          }
        }
    },
    async stopScan(){
        BarcodeScanner.showBackground();
        BarcodeScanner.stopScan();
    },
    async checkPermission() {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (status.granted) {
        // the user granted permission
        return true;
      }

      return false;
    }
  }


}
</script>

<style scoped>

.slide .slideunlock.is-complete .slideunlock-progressbar {
    background-color: #2a307c;
}
.slide:first-child{
    background-color: #2a307c;
}
.cnt {
  height: 100%;
  overflow: scroll;
}
.uk-card{
  padding: 20px 10px;
}
.uk-card-body{
  box-shadow: 0px 0.5px 1.2px;
  margin-bottom: 10px;
  align-items: center;
  padding: 16px 15px;
}
.slide{
    position: fixed;
    width: 97% !important;
    bottom: 5px;
    height: 40px;
}

.btn{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
}
.btn img{
  width: 50px
}

.scan-code img{
      width: 28px;
    position: relative;
    top: -2px;
    left: 4px;
}

</style>