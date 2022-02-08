<template>
  <div class="uk-flex uk-flex-between uk-flex-column cnt">
    <div class="stiky">
      <p style="font-size: 13px !important; font-weight: 500">
        {{ load?.loadNumber }}
      </p>
      <div
        class="
          uk-flex
          uk-flex
          uk-flex-center
          uk-flex-left
          uk-margin-remove
          uk-padding-remove
        "
        style="align-items: center"
      >
        <div class="uk-flex uk-flex-wrap">
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Shipper: </span
            ><span>&nbsp; {{ shipperName(load) }}</span>
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span
            ><span>&nbsp; {{ load?.firstOrdenSector?.sector }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="uk-card uk-card-default uk-width-1-2@m uk-margin-medium-bottom allScreen">
      <div
        v-for="order in orders"
        :key="order"
        class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
      >
        <div class="uk-text-left info-user uk-flex uk-flex-wrap">
          <div class="btn uk-flex">
            <div class="uk-flex uk-flex-column uk-text-center">
              <p
                style="font-size: 16px !important;"
                class="uk-width-1-1"
              >
                <span class="font-weight-medium">Cliente: </span>
                <span>{{ order.client_name }}</span>
              </p>
            </div>
            <span>
              <img src="../assets/box.png" alt="" />
            </span>
          </div>
          <p class="uk-width-1-1">
            <strong>Dirección: </strong><span>{{ order?.sector}}</span>
          </p>
          <p class="uk-width-1-2">
            <strong> Orden: </strong
            ><span>{{ order?.order_num }}</span>
          </p>
          <p class="uk-width-1-2">
            <strong>Cajas / Pallets: </strong>{{ order?.no_of_boxes }}<span></span>
          </p>
          <div
            class="uk-flex uk-width-1-1 uk-flex-between"
            style="margin-top: 10px"
          >
            <div class="uk-width-1-2">
              <div
                class="uk-flex-column"
                style="align-items: center; display: inline-flex"
              >
                <img src="../assets/map.png" class="img-scan" alt="" />
                <span>Ver Ruta</span>
              </div>
            </div>
            <div class="uk-width-1-2">
              <div
                class="uk-flex-column"
                @click="scan(order)"
                style="align-items: center; display: inline-flex"
              >
                <img src="../assets/parcel.png" class="img-scan" alt="" />
                <span>Entregar Orden</span> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  <div class="slide-div">
    <slide-unlock
      ref="vueslideunlock"
      :auto-width="true"
      :circle="true"
      :disabled="false"
      :noanimate="false"
      :width="400"
      :height="40"
      :completedBg="completed"
      class="slide box-slide"
      text="Cargar e Iniciar Ruta"
      success-text="Activando"
      @completed="complete(orders)"
      textSize="10px"
    />
  </div>
  </div>
</template>

<script>
import SlideUnlock from "vue-slide-unlock";
import { Geolocation } from "@capacitor/geolocation";
import { mapGetters } from "vuex";
export default {
  alias: 'Entregar Ordenes',
  data() {
    return {
      status: null,
      result: null,
      load: null,
      orders: null,
      completed: "background-color: #2a307c !important",
    };
  },
  components: {
    SlideUnlock,
  },
  computed: {
    ...mapGetters(["loadStore", "orderScan"]),
  },
  mounted() {
    this.load = this.loadStore;
    this.orders = this.load.Orders
  },
  methods: {
        async location () {
        try {
          const geo = await Geolocation.getCurrentPosition();
          this.location1.latitude = geo.coords.latitude
          this.location1.longitude = geo.coords.longitude
        } catch (e) {
          console.log(e)
        
        }
    },
    complete(val) {
      this.scan(val);
    },
    scan(val) {
      let orderScan = []
      if (val.length) {
        orderScan = val
      } else {
        orderScan.push(val)
      }
      let listProducts = [];
      let listProductTotal = [];
      let totalOfProducts = 0;


      for (let i = 0; i < this.orders.length; i++) {
        const order = this.orders[i];
        
        for (let i = 0; i < order.products.length; i++) {
          const prod = order.products[i];
          let {name, qrCode, quantity, scanOneByOne, loadScanningCounter} = prod
          listProducts.unshift({name, qrCode, quantity, scanOneByOne, loadScanningCounter})
        }
      }
      for (let i = 0; i < listProducts.length; i++) {
        const product = listProducts[i];
        let {qrCode,  loadScanningCounter, order_num} = product
        var productQrCode = listProducts.filter( p => p.qrCode == product.qrCode )
           if(productQrCode){
             productQrCode.forEach(prod => {
               totalOfProducts += prod.quantity
             })
           }
            listProductTotal.unshift( {order_num, qrCode, totalOfProducts, loadScanningCounter})
             totalOfProducts = 0
      }

      console.log(listProducts, listProductTotal, totalOfProducts)
      this.$store.commit("scanOrder", orderScan);
      this.$router.push({ name: "deliveryActions" }).catch(() => {});
    },

  
    
    shipperName(val){
      var shipper = val?.shipper?.find(x => x.name)
      return shipper?.name
    },
  },
};
</script>

<style scoped>

.uk-card {
  padding: 20px 10px;
}
.uk-card-body {
  margin-bottom: 10px;
  align-items: center;
  padding: 16px 15px;
}
.slide {
  position: fixed;
  width: 97% !important;
  bottom: 5px;
  height: 40px;
  --su-size-text: 18px;
}
.slide-div {
  background: #ffffff !important;
  height: 70px;
  width: 100%;
  position: absolute;
  bottom: 0px;
}
.status {
  font-weight: 500;
  font-size: 14px;
}
.btn {
  display: flex;
  align-items: baseline;
  width: 100%;
}
.btn img {
  width: 20px;
  position: relative;
  top: -2px;
  margin-left: 5px;
}

.scan-code img {
  width: 28px;
  position: relative;
  top: -2px;
  left: 4px;
}

.truckSpan {
  max-width: 100%;
}
.truck {
  max-width: 100%;
  transform: scaleX(-1);
  width: 70px;
  display: flex;
}

.img-scan {
  width: 39px;
}
.icon-load {
  width: 35%;
  margin-right: 20px;
  transform: scaleX(-1);
}
.btn-scan {
  margin-top: 12px;
  box-shadow: 0px -0.5px 3px #000;
  border: 0px;
  color: #fff;
  padding: 3px;
  background: #2a307c;
}
.stiky {
  color: rgb(255, 255, 255) !important;
  z-index: 2;
  border-top: 1px solid #313575;
  font-size: 12px !important;
  padding: 0px 10px 5px !important;
 background: #2a307c;
 font-weight: 300 !important;
 text-align: center;
  box-shadow: 1px 0px 5px #898989;
}
.info-header {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.status {
  font-weight: 300;
  font-size: 12px;
}
.box-slide {
  background-image: url('../assets/parcel.png');
    background-size: 25px 25px;
    background-repeat: no-repeat;
    background-position: 81%
}
.allScreen{
  height: 80vh;
  overflow: scroll;
}
</style>
