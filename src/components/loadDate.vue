<template>
  <div class="uk-card uk-card-default uk-width-1-2@m container">
    <div class="uk-card-header" style="padding: 5px 30px !important; border: none">
      <div class="uk-width-expand uk-flex uk-flex-center">
        <p class="uk-text-meta uk-margin-remove-top date">
          <time datetime="2016-04-01T19:00" class="uk-text-bold uk-text-uppercase" style="font-size: 12px">{{
            date
          }}</time>
        </p>
      </div>
    </div>

    <div>
      <div
        v-for="load in userOrden"
        :key="load"
        class="uk-card uk-card-default uk-card-body"
        :class="{
          asigned: load.status == 'Asignada',
          delivered: load.status == 'Entregada',
          onWay: load.status == 'En Ruta',
          dispatch: load.status == 'Despacho Aprobado',
        }"
      >
        <h5 class="uk-text-left uk-margin-remove" style="width: 100%">
          <strong>ILS 11/23/2021 1:30PM Gate 01</strong>
        </h5>
        <div class="uk-flex uk-flex-between">
          <div class="uk-text-left info-user">
            <p>
              <strong> Estado: </strong><span>{{ load.status }}</span>
            </p>
            <p>
              <strong>Cliente: </strong> <span>{{ load.client }}</span>
            </p>
            <p>
              <strong>No. de Orden(es): </strong
              ><span>{{ load.numberOfOrden }}</span>
            </p>
            <p>
              <strong>Zona: </strong><span>{{ load.zone }}</span>
            </p>
          </div>
          <div class="btn">
            <div>
                
              <div style="margin-top: 1px">
                <img
                  v-if="load.status == 'Asignada'"
                  src="../assets/asigned.png"
                  class="icon-load"
                  alt=""
                />
                <img
                  v-if="load.status == 'Entregada'"
                  src="../assets/delivery.png"
                  class="icon-load"
                  alt=""
                />
                <img
                  v-if="load.status == 'En Ruta'"
                  src="../assets/road.png"
                  class="icon-load"
                  alt=""
                />
                <img
                  v-if="load.status == 'Despacho Aprobado'"
                  src="../assets/warehouse.png"
                  class="icon-load"
                  alt=""
                />
              </div>
            </div>
            <button class="uk-button " @click="setLoad(load)">
              {{ load.btnAction }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userOrden: Array,
    date: String,
  },
  methods: {
    setLoad(valueOrder) {
      this.$store.commit("setloadStore", valueOrder);
      console.log(valueOrder, "valueo");
      switch (valueOrder?.status) {
        case "Entregada":
          this.setDelivered();
          break;
        case "Asignada":
          this.setAsigned();
          break;
        case "En Ruta":
          this.setOnWay();
          break;
        case "Despacho Aprobado":
          this.setDispached();
          break;
      }
    },
    setAsigned() {
      this.$router.push({ name: "orders" }).catch(() => {});
    },
    setDelivered() {
      this.$router.push({ name: "orders" }).catch(() => {});
    },
    setOnWay() {
      this.$router.push({ name: "delivery-routes" }).catch(() => {});
    },
    setDispached() {
      this.$router.push({ name: "orders" }).catch(() => {});
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
  align-items: center;
  padding: 16px 10px;
}
.container {
  padding: 5px 14px 5px;
  box-shadow: 0px 0px;
}
.uk-button {
  padding: 0px 5px !important;
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
}
.asigned {
  color: rgb(73 73 73);
}
.asigned button {
  color:green;
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

.delivered {
  color: rgb(130, 127, 127) !important;
}
.delivered button {
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

.dispatch {
  color: #000;
}
.dispatch button {
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
</style>
