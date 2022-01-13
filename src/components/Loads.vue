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
    <div
      v-for="(loadsByDate, i) in loads"
      :key="i"
      style="border-top: 1px dashed"
    >
      <div class="uk-card uk-card-default uk-width-1-2@m container">
        <div
          class="uk-card-header"
          style="padding: 5px 30px !important; border: none"
        >
          <div class="uk-width-expand uk-flex uk-flex-center">
            <p :id="loadsByDate[0]" :class="{'show-date': loadsByDate[0] === 'HOY' }" class="uk-text-meta uk-margin-remove-top date">
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
            @click="setLoad(load)"
          >
            <p class="uk-text-left uk-margin-remove" style="width: 100%">
              <strong>{{ load?.loadNumber }}</strong>
            </p>
            <div class="uk-flex uk-flex-between">
              <div class="uk-text-left info-user">
                <p>
                  <strong>No. de Orden(es): </strong
                  ><span>{{ load?.Orders?.length }}</span>
                </p>
                <p>
                  <strong>Cliente: </strong>
                  <span v-for="info in load.shipper" :key="info">
                    {{ info.name }}
                  </span>
                </p>
                <p>
                  <strong>Sector 1a Orden: </strong>
                  <span>{{ load?.firstOrdenSector?.sector }}</span>
                </p>
                <p>
                  <strong>Estado </strong>
                  <span>{{ loadStatus(load) }}</span>
                </p>
              </div>
              <div style="padding-right: 5px">
                <font-awesome-icon icon="arrow-right" style="font-size: 20px" />
              </div>
            </div>
          </div>
          <div v-show="loadsByDate.length <= 1" style="height: 50px">
            <span>No Tiene Viajes Asignados Para Este Día</span>
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
import { Mixins } from "../mixins/mixins";

export default {
  components: {
    IonLoading,
  },
  props: {
    timeout: { type: Number, default: 1000 },
  },
  mixins: [Mixins],
  data() {
    return {
      days: {
        tomorrow: null,
        today: null,
        yesterday: null,
      },
      loaded: false,
      loads: [],
      dateAvalaible: [],
      date: new Date(),
      dateMoment: moment(new Date()).format('MM/DD/YYYY'),
    };
  },

  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  async beforeMount() {
    this.setOpen(true);
  },
  async mounted() {
    
    window.location.href = "#HOY";
    moment.locale("es");
    await this.scrollTrigger();
  },
  computed: {
    ...mapGetters(["allLoads", "settings"]),
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
            if (!this.days.tomorrow) {
              contDate = this.date.setDate(this.date.getDate() + 1);
              this.days.tomorrow = contDate;
            } else if (!this.days.today) {
              contDate = this.date.setDate(this.date.getDate() - 1);
              this.days.today = contDate;
            } else {
              contDate = this.date.setDate(this.date.getDate() - 1);
            }
            var date = moment(contDate).format("MM/DD/YYYY");
            const result = await this.$services.loadsServices.getLoadsbyDate(
              date
            );
            result.forEach(async (x) => {
              const resultByDate =
                await this.$services.loadsServices.getLoadDetails(x.loadMapId);
              x.firstOrdenSector = x.Orders.find((order) => order);
              Object.assign(x, resultByDate);
            });
            if (!result.length || this.loads.length < 3) {
              await this.scrollTrigger();
            } else {
              console.log(result);
            }
            if (date === moment(new Date()).format('MM/DD/YYYY')) {
              date = 'HOY'
            }
                result.unshift(date)
            this.loads.push(result)
            
            this.showloader = true;
            setTimeout(() => {
              this.showloader = false;
            }, 1000);
          }
        });
      });
      console.log(this.loads);
      observer.observe(this.$refs.infinitescrolltrigger);
    },
    async setLoad(val) {
      console.log(val);
      this.$store.commit("setloadStore", val);
      this.$router.push({ name: "load-status" }).catch(() => {});
    },
    changeRoute(path) {
      this.$router.push({ name: path }).catch(() => {});
    },

    loadIsReject(val) {
      if (
        val?.loadingStatus?.text == "Approved" &&
        val?.approvers?.some((x) => x.status != "ACCEPTED")
      )
        return false;
      else return true;
    },
    loadIsAccepted(val) {
      if (
        val?.loadingStatus?.text == "Approved" &&
        val?.approvers?.every((x) => x.status == "ACCEPTED")
      )
        return true;
      else return false;
    },

    shipperName(val) {
      var shipper = val?.shipper?.find((x) => x.name);
      return shipper?.name;
    },
    loadStatus(val) {
      if (val?.loadingStatus?.text == "Expecting Approval") return "Esperando Aprobacion";
      if (val?.loadingStatus?.text == "Approved") return "Aprobada";
      if (val?.loadingStatus?.text == "Driver Arrival") return "LLegada del Conductor";
      if (val?.loadingStatus?.text == "Dispatched") return "Despacho Aprobado";
      if (val?.loadingStatus?.text == "Loading truck") return "Cargando Vehiculo";
      if (val?.loadingStatus?.text == "Delivered") return "Entregada";
    },
  },
};
</script>

<style scoped>
p {
  margin: 3px 0px !important;
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
.info-user {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.info-user p {
  margin-right: 10px !important;
}
.info-user strong {
  font-size: 12px !important;
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

.only-black,
.delivered,
.driver-arrival,
.approved {
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
.reject-img {
  width: 80px;
}

.show-date{
  color: red;
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
