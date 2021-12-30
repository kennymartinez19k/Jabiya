<template>
  <div class="">
    <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeout"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>
    <div v-for="(loadsByDate, i) in loads" :key="i">
      <div class="uk-card uk-card-default uk-width-1-2@m container">
        <div
          class="uk-card-header"
          style="padding: 5px 30px !important; border: none"
        >
          <div class="uk-width-expand uk-flex uk-flex-center">
            <p class="uk-text-meta uk-margin-remove-top date">
              <time
                datetime="2016-04-01T19:00"
                class="uk-text-bold uk-text-uppercase"
                style="font-size: 12px"
                >{{ loadsByDate[0] }}</time
              >
            </p>
          </div>
        </div>
        <div>     
          <div
            v-for="load in loadsByDate"
            v-show="loadsByDate.length > 1 && typeof load == 'object'"
            :key="load"
            class="uk-card uk-card-default uk-card-body"
            :class="{
              'assigned': load.loadingStatus?.text == 'Approved',
              'delivered': load.loadingStatus?.text == 'Delivered',
              'driver-arrival': load.loadingStatus?.text == 'Driver Arrival',
              'orange-flashing': load.loadingStatus?.text == 'Dispatched',
              expectingApprove: load.loadingStatus?.text == 'Expecting Approval',
              'approved': load.loadingStatus?.text == 'Approved'
            }"
          >  
            <h5 class="uk-text-left uk-margin-remove" style="width: 100%">
              <strong>{{ load?.loadNumber }}</strong>
            </h5>
            <div class="uk-flex uk-flex-between">
              <div class="uk-text-left info-user">
                <p>
                  <strong> Estado:</strong>
                  <span v-if="load?.loadingStatus?.text == 'Approved'">Aprobada</span>
                  <span v-if="load?.loadingStatus?.text == 'Delivered'">Entregada</span>
                  <span v-if="load?.loadingStatus?.text == 'Driver Arrival'">En Ruta</span>
                  <span v-if="load?.loadingStatus?.text == 'Dispatched'"
                    >Despacho Aprobado</span
                  >
                  <span v-if="load?.loadingStatus?.text == 'Defining Load'">Definiendo Contenedor</span>

                  <span v-if="load?.loadingStatus?.text == 'Expecting Approval'"
                    >Esperando tu Aprobacion</span
                  >
                </p>
                <p>
                  <strong>Cliente: </strong>
                   <span v-for="info in load.shipper" :key="info">
                     {{info.name }}
                    </span>
                </p>
                <p>
                  <strong>No. de Orden(es): </strong
                  ><span>{{ load?.Orders?.length }}</span>
                </p>
                <p>
                  <strong>Sector 1a Orden: </strong>
                  <span>{{ load?.firstOrdenSector }}</span>
                </p>
              </div>
              <div class="btn">
                <div>
                  <div style="margin-top: 1px">
                    <img
                      v-if="load?.loadingStatus?.text == 'Approved'"
                      src="../assets/cargo.png"
                      class="icon-load"
                      alt=""
                    />
                    <img
                      v-if="load?.loadingStatus?.text == 'Delivered'"
                      src="../assets/delivery.png"
                      class="icon-load"
                      alt=""
                    />
                    <img
                      v-if="load?.loadingStatus?.text == 'Driver Arrival'"
                      src="../assets/road.png"
                      class="icon-load"
                      alt=""
                    />
                    <img
                      v-if="load?.loadingStatus?.text == 'Dispatched'"
                      src="../assets/warehouse.png"
                      class="icon-load"
                      alt=""
                    />
                    <img
                      v-if="load?.loadingStatus?.text == 'Expecting Approval'"
                      src="../assets/approve-container.png"
                      class="icon-load"
                      alt=""
                    />
                  </div>
                </div>
                <button class="uk-button" @click="setLoad(load)">
                  <span v-if="load?.loadingStatus?.text == 'Approved'"
                    >Montar Viaje</span
                  >
                  <span v-if="load?.loadingStatus?.text == 'Delivered'">Ver Ordenes</span>
                  <span v-if="load?.loadingStatus?.text == 'Driver Arrival'"
                    >Continuar Entrega(s)</span
                  >
                  <span v-if="load?.loadingStatus?.text == 'Dispatched'"
                    >Comenzar Entrega(s)</span
                  >
                  <span v-if="load?.loadingStatus?.text == 'Expecting Approval'"
                    >Aceptar / Rechazar Viaje</span
                  >
                </button>
              </div>
            </div>
          </div>
          <div v-show="loadsByDate.length <= 1" style="height: 50px">
            <span >No Existen Viajes Disponibles</span>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div ref="infinitescrolltrigger" id="scoll-trigger"></div>
      <div class="circle-loader" v-if="showloader"></div>
    </footer>
  </div>
</template>

<script>
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";
import moment from "moment";
import "moment/locale/es";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      days:{
        tomorrow: null,
        today: null,
        yesterday: null
      },
      loaded: false,
      loads: [],
      dateAvalaible: [],
      date: new Date(),
    };
  },
  components: {
    IonLoading,
  },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  beforeMount() {
    this.setOpen(true);
  },
  async mounted() {
    window.location.href = "#Hoy";
    moment.locale("es");
    await this.scrollTrigger();
      // this.allLoads.forEach((x, i) => {
    //  if(i === 0) x.status = "Driver Assigned"
    // }
    // )
    
  },
  computed: {
    ...mapGetters(["allLoads", "settings"]),
    dateLoad: function () {
      var today = "Hoy";
      var yesterday = "27/12/2021";

      return [yesterday, today];
    },
  },
  props: {
    timeout: { type: Number, default: 1000 },
  },
  methods: {
    setOpe(val) {
      this.loaded = val;
      setTimeout(() => {
        this.loaded = false;
      }, 2000);
    },
    async scrollTrigger() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(async (entry) => {
          var contDate;
          if (entry.intersectionRatio > 0) {
            if(!this.days.tomorrow) {
              contDate = this.date.setDate(this.date.getDate() + 1);
              this.days.tomorrow = contDate
            } 
            else if(!this.days.today){
               contDate = this.date.setDate(this.date.getDate() - 1);
               this.days.today = contDate
            }
            else { 
              contDate = this.date.setDate(this.date.getDate() - 1);
            }
            var date = moment(contDate).format("MM/DD/YYYY");
            const result = await this.$services.loadsServices.getLoadsbyDate(date);
            result.forEach(async x => {
              const resultByDate = await this.$services.loadsServices.getLoadDetails(x.loadMapId);
              x.firstOrdenSector = x.Orders[0].sector
              Object.assign(x, resultByDate)
              console.log(x)

            })
            if (!result.length) {
              await this.scrollTrigger();
            }
            else {
              console.log(result)
            }
            result.unshift(date)
            this.loads.push(result)
            console.log(this.loads)
            
            this.showloader = true;
            setTimeout(() => {
              this.currentPage += 1;
              this.showloader = false;
            }, 1000);
          }
        });
      });
      console.log(this.loads)
      observer.observe(this.$refs.infinitescrolltrigger);
    },
    async setLoad(val) {
      console.log(val)
      await this.getLoadsId(val);
      this.$store.commit("setloadStore", val);
      if (this.settings?.AutoScan) {
        if (val?.loadingStatus?.text == "Approved") this.changeRoute("orders-auto-scan");
        if (val?.loadingStatus?.text == "Driver Arrival") this.changeRoute("delivery-actions-auto");
      } else {
        if (val?.loadingStatus?.text == "Approved") this.changeRoute("orders");
        if (val?.loadingStatus?.text == "Driver Arrival") this.changeRoute("delivery-routes");
      }
        if (val?.loadingStatus?.text == "Expecting Approval") this.changeRoute("travel-confirmation");

    },
    changeRoute(path) {
      this.$router.push({ name: path }).catch(() => {});
    },
    async getLoadsId(val) {
      console.log('llamando endpoint')
      console.log(val)
      this.$store.commit("scanOrder", val.Orders);
    },
  },
};
</script>

<style scoped>
p {
  margin: 7px 0px !important;
}
.uk-card {
  padding: 20px 10px;
}
.uk-card-body {
  border-radius: 2px;
  margin-bottom: 15px;
  border: 0.1px solid #e5e5e5;
  align-items: center;
  padding: 16px 10px;
}
.container {
  padding: 5px 14px 5px;
  box-shadow: 0px 0px;
}
.uk-button {
  padding: 10px 5px !important;
  font-size: 12px;
}

.date {
  background: #2535ff21;
  color: #000;
  border-radius: 5px;
  padding: 1px 10px;
}
.icon-load {
  width: 60px;
  margin-bottom: 10px;
}
.check-load {
  position: absolute;
  z-index: 1;
  right: 69px;
  width: 24px;
  top: 34px;
  color: #00b200;
  font-size: 22.5px;
}
.btn {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-left: 10px;
  min-width: 125px;
}
button {
  font-size: 9px !important;
  line-height: 15px;
}
.assigned {
  color: rgb(73 73 73);
}
.assigned button {
  color: green;
  border: 1px solid #009b08;
  font-weight: 700;
  box-shadow: 0px 0.5px 2px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  display: inline-block;
  padding: 5px 10px;
  -webkit-animation: glowing 800ms infinite;
}
body {
  background: black;
}

@-webkit-keyframes glowing {
  0% {
    background-color: transparent;
    -webkit-box-shadow: 0 0 1px #146d02;
  }
  50% {
    background-color: transparent;
    -webkit-box-shadow: 0 0 5px #025a11;
  }
  100% {
    background-color: transparent;
    -webkit-box-shadow: 0 0 0px #02691c;
  }
}

.only-black, .delivered, .driver-arrival, .approved {
  color: rgb(130, 127, 127) !important;
}
.delivered button,
.driver-arrival button,
.approved button,
.expectingApprove button {
  background: #ffffff;
  color: rgb(73, 73, 73);
  border: 1px solid rgb(136, 136, 136);
  /* color: #252525; */
  font-weight: 700;
}
.onWay {
  color: rgb(73 73 73);
}

.onWay button {
  color: green;
  background: #fff;
  font-weight: 700;
  border: 1px solid #3c6e3c;
}

.orange-flashing {
  color: rgb(199, 194, 194);
}
.orange-flashing button {
  box-shadow: 0px 0.5px 3px #c58002;
  color: #af7202;
  background: #ffffff;
  border: 1px solid #ccc;
  font-weight: 700;
  -webkit-animation: onWays 800ms infinite;
}
@-webkit-keyframes onWays {
  0% {
    -webkit-box-shadow: 0 0 1px #c58002;
  }
  50% {
    -webkit-box-shadow: 0 0 5px #a06800;
  }
  100% {
    -webkit-box-shadow: 0 0 0px #d38a02;
  }
}
a {
  text-decoration: none;
  color: #fff;
}
.rainbow-button {
  width: calc(20vw + 6px);
  height: calc(8vw + 6px);
  background-image: linear-gradient(
    90deg,
    #00c0ff 0%,
    #ffcf00 49%,
    #fc4f4f 80%,
    #00c0ff 100%
  );
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-size: 3vw;
  font-weight: bold;
}
.rainbow-button:after {
  content: attr(alt);
  width: 20vw;
  height: 8vw;
  background-color: #191919;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rainbow-button:hover {
  animation: slidebg 2s linear infinite;
}

@keyframes slidebg {
  to {
    background-position: 20vw;
  }
}
footer {
  position: relative;
  width: 400px;
  height: 100px;
}

footer .circle-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top: 5px solid #fff;
  animation: animate 1.5s infinite linear;
}
footer #scroll-trigger {
  height: 50px;
}
</style>
