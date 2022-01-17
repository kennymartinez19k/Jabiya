<template>
  <div class="uk-flex uk-flex-column cnt">
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
    <div
      class="
        uk-padding-small uk-width-1-2@m uk-card uk-card-default uk-text-left
      "
      style="margin-bottom: 50px !important"
    >
      <h6 class="uk-text-center">Detalles del Viaje</h6>
      <p>
        <strong>Estado del Viaje:</strong>
        {{loadStatus(load)}}
      </p>

      <p>
        <strong>Sector:</strong>
        {{ load?.firstOrdenSector?.sector }}
      </p>
      <p>
        <strong>Fecha:</strong>
        {{ load?.dateTime?.date }}
      </p>
      
      <div>
        <h6  class="font-weight-medium" style="font-size: 14px">Ordenes: {{orders?.length}}</h6>
      </div>

      <div
        v-for="order in orders"
        :key="order"
        class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between"
        :class="{ ordenCompleted: order?.completed }"
      >
        <div class="uk-text-left info-user uk-flex uk-flex-wrap">
          <p style="margin-right: 10px !important">
                <span class="font-weight-medium">Cliente: </span>
                <span>{{ order.client_name }}</span>
              </p>
          <p class="uk-width-1-2">
            <span class="font-weight-medium">Orden: </span
            ><span>{{ order.order_num }}</span>
          </p>
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Cajas / Pallets: </span
            >{{ order.products?.length }}<span></span>
          </p>
          <p class="">
            <span class="font-weight-medium">Conductor: </span
            >{{ order.loadDetails.driverName }}<span></span>
          </p>
          <p class="uk-width-1-1">
            <span class="font-weight-medium">Destino: </span>
            <font-awesome-icon icon="map-marker-alt" />&nbsp;<span>
              {{order.city}}. {{order.sector}}
              </span>
          </p>
        </div>
      </div>
    </div>

    <div id="modal-center" class="uk-flex-top" uk-modal>
      <div
        class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
        style="padding: 40px 10px 5px !important"
      >
        <button class="uk-modal-close-default" type="button" uk-close></button>

        <h5 class="uk-text-center" style="padding: 20px 0px">
          Esta Seguro Que Deseea Rechazar Este Viaje?
        </h5>
        <div
          class="uk-modal-footer uk-flex uk-flex-around uk-padding-remove"
          style="padding: 10px 0px !important"
        >
          <button
            class="uk-button uk-button-transparent uk-modal-close"
            type="button"
          >
            Cancelar
          </button>
          <button
            href="#modal-group-1"
            @click="acceptOrRejectLoad(load.loadMapId, load.__v, 'REJECT')"
            class="uk-button button-reject uk-modal-close"
            uk-toggle
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
    <div class="button-opt">
      <a href="#modal-center" uk-toggle class="uk-button uk-button-red"
        >Rechazar Viaje&nbsp;
        <font-awesome-icon icon="ban" style="color: #fff; font-size: 14px" />
      </a>
      <button
        @click="acceptOrRejectLoad(load.loadMapId, load.__v, 'ACCEPTED')"
        class="uk-button uk-button-green"
      >
        Aceptar Viaje &nbsp;
        <font-awesome-icon icon="check" style="color: #fff; font-size: 14px" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  alias: `Aprobar Viaje`,
  data() {
    return {
      status: null,
      result: null,
      load: null,
      orders: null,
    };
  },
  computed: {
    ...mapGetters(["loadStore", "orderScan", "loads", "products"]),

    productsBox: function () {
      if (this.products?.length !== 0) {
        return this.products[0]?.quantity;
      }
      return null;
    },
    messageStatusLoad: function () {
      var status = this.orders?.some((x) => x.completed);
      if (status) return "Desmontar Viaje";
      return "Montar Viaje";
    },
  },
  mounted() {
    if (this.loadStore) {
      this.load = this.loadStore;
      this.orders = this.loadStore.Orders
      console.log(this.orders)
    }
    console.log(this.orders);
    if (this.orderScan) {
      this.completedOrden();
    }
    this.orderObj();
  },
  methods: {
    orderObj() {
      this.orders?.sort((a) => {
        if (a?.completed == true) {
          return 1;
        } else {
          return -1;
        }
      });
    },
    uploadOrDownload() {
      this.orders.map((x) => (x.completed = !x.completed));
    },

    completedOrden() {
      this.orders.forEach((x) => {
        if (x.numberOfOrders == this.orderScan.numberOfOrders) {
          x.completed = this.orderScan?.completed;
        } else x.completed = false;
      });
    },
    async acceptOrRejectLoad(id, version, status) {
      
      var user = JSON.parse(localStorage.getItem("userInfo"));
      const result = await this.$services.loadsServices.acceptOrRejectLoad(
        id,
        version,
        user.id,
        status
      );
      console.log(result);
      if (result) {
        if(status == 'REJECT')  this.$router.push({ name: "home" });
        else this.$router.push({ name: "load-status" });
      }
    },
    shipperName(val) {
      var shipper = val?.shipper[0]?.name;
      return shipper;
    },
    loadStatus(val){
      if(val?.loadingStatus?.text == 'Delivered') return 'Entregada'
      if(val?.loadingStatus?.text == 'Driver Arrival') return 'En Ruta'
      if(val?.loadingStatus?.text == 'Dispatched') return 'Despacho Aprobado'
      if(val?.loadingStatus?.text == 'Expecting Approval') return 'Esperando tu Aprobacion'
      if(val?.loadingStatus?.text == 'Approved' && val?.approvers?.every(x => x.status == 'ACCEPTED'))
        return 'Aprobada'
      if(val?.loadingStatus?.text == 'Approved' && val?.approvers?.some(x => x.status != 'ACCEPTED'))
        return 'Rechazada'
      
    },
  },
};
</script>

<style scoped>
:root {
  --su-size-text: 12px;
}
.slideunlock .slideunlock-text {
  font-size: var(--su-size-text);
}
p {
  margin: 2px 0px !important;
}
.slide .slideunlock.is-complete .slideunlock-progressbar {
  background-color: #2a307c;
}
.button-opt {
  background: #ffffff !important;
  border-top: 1px solid #b1b1b1;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  padding: 10px;
  position: absolute;
  bottom: 0px;
}
.button-opt button {
  padding: 10px 5px !important;
  align-items: center;
  display: flex;
}
.button-reject{
  background: #930404;
    color: #fff;
}
.uk-card {
  padding: 5px 10px;
}
.uk-card-body {
  margin-bottom: 10px;
  align-items: center;
  padding: 10px 11px;
  border: 0.1px solid #e5e5e5;
}
.slide {
  position: fixed;
  width: 97% !important;
  bottom: 5px;
  height: 40px;
  --su-size-text: 18px;
}
.status {
  font-size: 12px;
}
.btn {
  display: flex;
  align-items: baseline;
  width: 100%;
  justify-content: flex-start;
}
.btn img {
  width: 30px;
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
  width: 70px;
  display: flex;
}


.img-scan {
  width: 39px;
}
.icon-load {
  width: 35%;
  margin-right: 20px;
}
.btn-scan {
  margin-top: 12px;
  box-shadow: 0px -0.5px 3px #000;
  border: 0px;
  color: #fff;
  padding: 3px;
  background: #2a307c;
}

.info-header {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.ordenCompleted {
  background: rgba(233, 255, 233, 0.6);
}
.box-slide {
  background-image: url("../assets/parcel.png");
  background-size: 25px 25px;
  background-repeat: no-repeat;
  background-position: 80%;
}
.uk-button{
  padding: 5px 10px !important;
    align-items: center;
    display: flex;
    border-radius: 5px;
}
.uk-button-green{
  background: green;
  color: #fff
}
.uk-button-red{
  background: #930404;
  color: #fff;
}
</style>
