<template>
  <div class="uk-flex uk-flex-column cnt">
    <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeout"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>
    <div class="stiky">
      <p
        style="font-size: 13px ; font-weight: 500"
        class="web-font-small"
      >
        {{ loadStore?.loadNumber }}
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
        <div class="uk-flex uk-flex-wrap web-font-small">
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Shipper: </span
            ><span>&nbsp; {{ shipperName(loadStore) }}</span>
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span
            ><span>&nbsp; {{ loadStore?.firstOrdenInfo.sector }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="container-main">
      <header>
        <div uk-margin class="sub-header">
          <div class="filter-checkbox">
            <span class="filter-message web-font-small">
              Ver Ordenes: &nbsp; Pendientes
            </span>
            <div class="onoffswitch">
              <input
                type="checkbox"
                v-model="filterOrders"
                name="onoffswitch"
                class="onoffswitch-checkbox"
                id="myonoffswitch"
                tabindex="0"
              />
              <label class="onoffswitch-label" for="myonoffswitch"></label>
            </div>
            <span class="filter-message web-font-small"> Todas </span>
          </div>
        </div>
      </header>
      <div
        class="uk-padding-small container-item"
        style="margin-bottom: 96px !important"
      >
        <div class="uk-flex select-all web-font-small">
          <input
            type="checkbox"
            class="uk-checkbox"
            v-model="selectAllOrders"
            id="all-orders"
          />
          &nbsp;
          <label for="all-orders"
            >&nbsp;<strong class="web-font-small"
              >Seleccionar Todas las Ordenes</strong
            ></label
          >
        </div>
        <div
          v-for="order in ordersToDisplay"
          :key="order"
          class="
            uk-card
            item-upload
            uk-card-default uk-card-body uk-flex uk-flex-between
          "
          :class="{
            ordenCompleted: order.completed,
            'order-status': order?.totalOrdersScanned === order?.totalQuantity,
          }"
        >
          <div
            v-if="order?.totalOrdersScanned !== order?.totalQuantity"
            class="order-select"
          >
            <input
              @click="orderForScan(order)"
              v-model="order.isSelected"
              type="checkbox"
              class="uk-checkbox"
            />
          </div>
          <div v-else class="order-completed">
            <font-awesome-icon icon="check" />
          </div>
          <div class="uk-text-left info-user">
            <div class="btn uk-flex">
              <div class="uk-flex uk-flex-column uk-text-left">
                <span
                  v-if="order.completed"
                  style="
                    display: flex;
                    position: relative;
                    top: -4px;
                    color: green;
                  "
                >
                  <strong class="web-font-small">Completado </strong>
                  <font-awesome-icon
                    icon="check"
                    style="font-size: 14px; margin: 3px"
                  />
                </span>
                <p class="uk-width-1-1 web-font-small">
                  <span class="font-weight-medium">Cliente: </span>
                  <span>{{ order.client_name }}</span>
                </p>
              </div>
            </div>
            <p style="margin-right: 10px !important" class="web-font-small">
              <span class="font-weight-medium">Orden: </span
              ><span>{{ order.order_num }}</span>
            </p>
            <div class="uk-flex uk-flex-wrap web-font-small">
              <p>
                <span class="font-weight-medium">Cajas / Pallets: </span
                ><span>{{ order?.no_of_boxes }}</span>
              </p>
              <p>
                <span class="font-weight-medium uk-margin-medium-left"
                  >Escaneadas: </span
                ><span
                  :class="{ 'order-delivered': order?.status === 'Delivered' }"
                  >{{ order?.totalOrdersScanned }}/{{
                    order?.totalQuantity
                  }}</span
                >
              </p>
            </div>
            <p class="uk-width-1-1 web-font-small">
              <span class="font-weight-medium">Destino: </span>
              <span>
                <font-awesome-icon icon="map-marker-alt" />
                {{ order.address }}</span
              >
            </p>
          </div>
          <div style="width: 100%">
            <ul uk-accordion class="uk-margin-remove uk-padding-remove">
              <!-- uk-open -->
              <li class="uk-margin-remove">
                <a class="uk-accordion-title web-font-small" href="#"
                  >Mostrar/Ocultar Productos</a
                >
                <div
                  class="
                    uk-accordion-content uk-margin-remove uk-padding-remove
                  "
                >
                  <div class="details-product">
                    <p class="item web-font-small">
                      <span class="font-weight-medium">Producto: </span>
                    </p>
                    <p class="item web-font-small">
                      <span class="font-weight-medium">Codigo QR: </span>
                    </p>
                    <p class="item web-font-small">
                      <span class="font-weight-medium">Escaneadas: </span>
                    </p>
                  </div>
                  <div
                    v-for="item in order.products"
                    :key="item.id"
                    class="details-product web-font-small"
                  >
                    <p class="item">{{ item?.name }}</p>
                    <p class="item">{{ item?.qrCode }}</p>
                    <p class="item">
                      {{ item?.loadScanningCounter }}/{{ item?.quantity }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="button-opt">
      <button
        @click="scan()"
        :disabled="showButton === true"
        class="uk-button uk-button-primary"
      >
        Escanear y Cargar Camion
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Mixins } from "../mixins/mixins";
import { IonLoading } from "@ionic/vue";
import { ref } from "vue";

export default {
  alias: `Montar Viaje`,
  mixins: [Mixins],
  components: {
    IonLoading,
  },
  data() {
    return {
      status: null,
      showButton: true,
      load: null,
      completed: "background-color: #2a307c !important",
      orders: null,
      listOfOrders: [],
      listOfOrderTotal: [],
      listOrderDetails: [],
      selectAllOrders: false,
      ordersToDisplay: [],
      filterOrders: false,
    };
  },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },

  computed: {
    ...mapGetters([
      "loadStore",
      "orderScan",
      "loads",
      "allLoadsStore",
      "products",
      "structureToScan",
      "orderDetailsStore",
    ]),
  },
  watch: {
    selectAllOrders: function (newVal) {
      if (newVal == true) {
        this.orders.forEach((x) => {
          if (!x.isSelected) {
            x.isSelected = true;
            this.orderForScan(x);
          }
        });
      } else {
        if (this.orders.every((order) => order.isSelected)) {
          this.orders.map((x) => (x.isSelected = false));
          this.orders.forEach((x) => {
            this.listOrderDetails = this.listOrderDetails.filter(
              (p) => p.order_num != x.order_num
            );
            this.listOfOrders = this.listOfOrders.filter(
              (p) => p.order_num != x.order_num
            );
            this.listOfOrderTotal = this.listOfOrderTotal.filter(
              (p) => p.order_num != x.order_num
            );
          });
        }
      }
    },
    orders: {
      handler: function (newVal) {
        if (newVal.every((x) => x.isSelected == true)) {
          this.selectAllOrders = true;
        } else {
          this.selectAllOrders = false;
        }
      },
      deep: true,
    },
    listOfOrders: {
      handler: function (newVal) {
        if (newVal.length === 0) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      },
      deep: true,
    },
    filterOrders: function (newVal) {
      this.filterByOrders(newVal);
    },
  },

  async mounted() {
    this.setOpen(true);
    try {
      this.load = await this.$services.loadsServices.getLoadDetails(
        this.loadStore.loadMapId
      );
    } catch (error) {
      this.load = this.loadStore;
    }
    this.orders = this.load.Orders;
    this.filterOrders = this.orders.every(
      (order) => order.status == "Delivered"
    );

    this.load.firstOrdenSector = this.orders[0]?.sector;
    this.orderObj();
    this.setOpen(false);
    this.orders.map((x) => {
      x.totalQuantity = 0;
      // x.isSelected = false
      x.totalOrdersScanned = 0;
      x.products.forEach((z) => {
        x.totalQuantity += z.quantity;
        x.totalOrdersScanned += z.loadScanningCounter;
      });
    });

    if (this.orderDetailsStore) {
      this.orderDetailsStore.forEach((x) => {
        this.orders.forEach((order) => {
          if (
            order.order_num === x.order_num &&
            !order.products.every(
              (prod) => prod.loadScanningCounter >= prod.quantity
            )
          ) {
            order.isSelected = true;
            this.orderForScan(order);
          } else {
            order.isSelected = false;
          }
        });
      });
    }
    this.filterByOrders(false);
  },
  methods: {
    orderObj() {
      this.orders.sort((a) => {
        if (a.completed == true) {
          return 1;
        } else {
          return -1;
        }
      });
    },

    scan() {
      this.$emit("setNameHeader", "Escaneo Corrido");
      this.$store.commit("scanOrder", this.listOrderDetails);
      this.$store.commit("setOrderDetails", this.listOrderDetails);
      let allProducts = [];

      let structure = {
        firstStructure: this.listOfOrders,
        secondStructure: this.listOfOrderTotal,
      };

      for (let i = 0; i < this.orders.length; i++) {
        const order = this.orders[i];

        order.products.forEach((x) => {
          x.order_num = order.order_num;
          allProducts.push(x);
        });
      }

      localStorage.setItem(
        `allProducts${this.load.loadMapId}`,
        JSON.stringify(allProducts)
      );
      this.$store.commit("setStructureToScan", structure);
      this.$router.push({ name: "scan-order" }).catch(() => {});
    },

    async orderForScan(order, allOrders = false) {
      if (
        this.listOfOrders.some((x) => x.order_num == order.order_num) &&
        !allOrders
      ) {
        this.listOrderDetails = this.listOrderDetails.filter(
          (x) => x.order_num != order.order_num
        );
        this.listOfOrders = this.listOfOrders.filter(
          (x) => x.order_num != order.order_num
        );
        this.listOfOrderTotal = this.listOfOrderTotal.filter(
          (x) => x.order_num != order.order_num
        );
      } else {
        this.listOrderDetails.push(order);
        let structure = await this.setStructure(
          order,
          this.listOfOrders,
          this.listOfOrderTotal
        );
        this.listOfOrders = structure.firstStructure;
        this.listOfOrderTotal = structure.secondStructure;
      }
    },

    shipperName(val) {
      var shipper = val?.shipper?.find((x) => x);
      return shipper?.name;
    },
    firstOrderSector(val) {
      var shipper = val?.shipper?.find((x) => x);
      return shipper?.name;
    },

    totalOrdersScanned(val) {
      let structure = localStorage.getItem(JSON.stringify(this.load));
      let loadScanned = 0;
      if (structure) {
        structure?.firstStructure.forEach((prod) => {
          if (prod.order_num == val.order_num)
            loadScanned += prod.loadScanningCounter;
        });
      }
      return loadScanned;
    },

    filterByOrders(val) {
      if (val) {
        this.ordersToDisplay = this.orders;
      } else {
        this.ordersToDisplay = this.orders.filter(
          (order) => order?.totalOrdersScanned < order?.totalQuantity
        );
      }
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
  border-top: 1px solid #e2e2e2;
  width: 100%;
  position: absolute;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  padding: 10px 0px;
}
.button-opt button {
  line-height: 15px;
}
.uk-card {
  padding: 20px 10px;
}
.uk-card-body {
  flex-wrap: wrap;
  margin-bottom: 10px;
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
.info-user {
  padding-right: 5px;
  width: 90%;
}
.ordenCompleted {
  background: rgba(233, 255, 233, 0.6);
}
.box-slide {
  background-image: url("../assets/parcel.png");
  background-size: 25px 25px;
  background-repeat: no-repeat;
  background-position: 81%;
}
.select-all {
  align-items: center;
  width: 100%;
  padding: 10px 11px;
}
/* .select-all input{
  transform: scale(1.1);
} */
.select-all input :focus-visible {
  outline: 0px dotted #333;
}
.select-all label {
  font-weight: 600;
}
li {
  list-style-type: none;
}
.uk-accordion-title {
  display: flex;
  margin: 5px 0px;
  font-size: 12px;
  color: #3880ff;
  padding: 5px;
}
.uk-accordion-title::before {
  content: "";
  margin-left: 7px;
  background-image: url("../assets/down.png");
  height: 17px;
  background-size: 14px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  padding-right: 18px;
}
.uk-open > .uk-accordion-title::before {
  transform: rotate(180deg);
}
.order-select {
  width: 10%;
  display: flex;
  padding: 8px 0px;
}
.details-product {
  display: flex;
  justify-content: space-around;
}
.details-product .item {
  width: 33%;
}
.order-status {
  background: #e0fae080;
}

header {
  height: 60px; /* 64 + 16px */
  position: sticky;
  -webkit-position: sticky;
  top: -16px;
  z-index: 1;
  text-align: center;
  -webkit-backface-visibility: hidden;
}

header::before,
header::after {
  content: "";
  display: block;
  height: 16px;
  position: sticky;
  -webkit-position: sticky;
}

/* SHADOW */
header::before {
  top: 28px; /* shadow is at bottom of element, so at 48 + 16 = 64px */
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
}

/* COVER */
header::after {
  box-shadow: 0px 0px 1px rgb(0 0 0 / 50%);
  background: linear-gradient(
    white 10%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0.4) 70%,
    transparent
  );
  z-index: 2;
}

/* HEADER CONTENT */
header > .sub-header {
  background: rgb(255, 255, 255);
  height: 44px;
  position: sticky;
  -webkit-position: sticky;
  top: 0px;
  margin-top: -16px;
  /* content should fall over shadow and cover */
  z-index: 3;
}
.onoffswitch-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.onoffswitch-label {
  position: relative;
  top: 3px;
  display: block;
  overflow: hidden;
  cursor: pointer;
  height: 22px;
  padding: 0;
  line-height: 36px;
  border: 2px solid #e3e3e3;
  border-radius: 36px;
  background-color: #ffffff;
  transition: background-color 0.3s ease-in;
}
.onoffswitch-label:before {
  content: "";
  display: block;
  width: 20px;
  margin: 0px;
  background: #ffffff;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 19px;
  border: 2px solid #e3e3e3;
  border-radius: 36px;
  transition: all 0.3s ease-in 0s;
}
.onoffswitch-checkbox:checked + .onoffswitch-label {
  background-color: #02cf13;
}
.onoffswitch-checkbox:checked + .onoffswitch-label,
.onoffswitch-checkbox:checked + .onoffswitch-label:before {
  border-color: #02cf13;
}
.onoffswitch-checkbox:checked + .onoffswitch-label:before {
  right: 0px;
}
.onoffswitch {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50px;
}
.filter-checkbox {
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
  width: 100% !important;
}
.filter-message {
  padding: 9px;
  font-size: 10px;
  font-weight: 600;
}
.uk-padding-small {
  padding: 0px 15px 15px;
}
.order-completed {
  color: green;
  font-size: 16px;
  margin-right: 5px;
}

@media (min-width: 600px) {
  .container-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
  }
  .item-upload {
    width: 49%;
  }
}

@media (min-width: 900px){
  .container-main {
    width: 90%;
    margin: 0px auto;
  }
}
</style>
