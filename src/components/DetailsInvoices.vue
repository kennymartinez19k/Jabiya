<template>
  <div class="uk-container uk-text-left">
    <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeout"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>
    <div>
      <h4 class="uk-text-small">Detalles</h4>
      <div
        class="uk-card uk-card-default uk-card-body uk-width-1-2@m"
        style="padding: 0px 8px 8px"
      >
        <p>
          <strong>Orden:</strong>&nbsp;<span>{{ customerDetails?.name }}</span>
        </p>
        <p>
          <strong>Dirección:</strong>&nbsp;<span>{{
            customerDetails?.delivery_address?.full_address
          }}</span>
        </p>
        <p>
          <strong>Cliente:</strong>&nbsp;<span>{{
            customerDetails?.client
          }}</span>
        </p>
        <p>
          <strong>Total:</strong>&nbsp;<span
            >{{ customerDetails?.currencySymbol
            }}{{ customerDetails?.amount_total }}
            <span
              v-if="showUpdating.length > 0"
              :class="{ recalculating: showUpdating.length > 0 }"
              >Se recalcula al guardar tus cambios</span
            ></span
          >
        </p>
      </div>
    </div>
    <h4 class="uk-text-small">Lista de Productos</h4>
    <div>
      <div
        class="uk-card uk-card-default uk-card-body table-scroll"
        style="padding: 0 8px"
      >
        <table
          class="
            uk-table
            uk-table-small
            uk-table-hover
            uk-table-divider
            uk-text-center
          "
        >
          <thead>
            <tr class="title">
              <th>Producto</th>
              <th>Precio</th>
              <th>Cant.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, i) in order_lines" :key="product">
              <td class="uk-table-small">{{ product.productName }}</td>
              <td class="">{{ product.currencySymbol }}{{ product.price }}</td>
              <td
                :class="{
                  showActive: product.productQuantity !== NewOrdersQuantyti[i],
                }"
              >
                {{ product.productQuantity }}
              </td>
              <font-awesome-icon
                icon="plus"
                :class="{
                  'plus-disabled':
                    product.productQuantity >= orderStoreQuantity[i] ||
                    this.customerDetails?.has_invoice,
                }"
                class="Space font-awesome"
                @click="
                  (product.productQuantity += 1),
                    showProductQuantity(
                      'plus',
                      product.productQuantity,
                      NewOrdersQuantyti[i],
                      product,
                    )
                "
              />
              <font-awesome-icon
                icon="minus"
                :class="{
                  'plus-disabled':
                    product.productQuantity == 0 ||
                    this.customerDetails?.has_invoice,
                }"
                class="Space font-awesome"
                @click="
                  (product.productQuantity -= 1),
                    showProductQuantity(
                      'min',
                      product.productQuantity,
                      NewOrdersQuantyti[i],
                      product,
                    )
                "
              />
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- This is the modal -->
    <div id="products" uk-modal>
      <div class="uk-modal-dialog uk-modal-body">
        <div class="uk-margin">
          <p>Esta seguro que desea guardar los cambios</p>
        </div>
        <div class="uk-flex uk-flex-between">
          <div>
            <button
              id="cancel"
              class="uk-button uk-modal-close button-cancel"
              type="button"
            >
              Cancelar
            </button>
          </div>
          <div>
            <button
              class="uk-button uk-button-primary uk-modal-close"
              type="button"
              @click="productQuantityChange()"
            >
              Modificar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="button-position uk-flex uk-flex-between">
      <div class="uk-margin-top">
        <button
          type="button"
          uk-toggle="target: #products"
          :disabled="btnSave"
          class="uk-button uk-button-primary"
        >
          Guardar
        </button>
      </div>
      <div class="uk-margin-top">
        <button
          :disabled="btnInvoices"
          type="button"
          class="uk-button uk-button-primary"
          @click="downloadPDF()"
        >
          Crear Factura
        </button>
      </div>
      <div class="uk-margin-top">
        <button
          :disabled="btnScan"
          type="button"
          class="uk-button uk-button-primary"
          @click="ScanOrder()"
        >
          Escanear
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";
import { mapGetters } from "vuex";
import { Mixins } from "../mixins/mixins";
export default {
  alias: "Detalles de la Orden",
  components: {
    IonLoading,
  },
  props: {
    timeout: { type: Number, default: 15000 },
  },
  mixins: [Mixins],

  data() {
    return {
      isChangeQuantity: {
        changeQuantity: null,
        exception: false,
        order_num: null,
      },
      btnSave: true,
      btnInvoices: false,
      btnScan: true,
      productOrder: null,
      OrderQuantity: null,
      order_lines: null,
      customerDetails: null,
      NewOrdersQuantyti: [],
      showUpdating: [],
      orderStoreQuantity: [],
      idInvoices: null,
    };
  },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  async beforeMount() {
    this.setOpen(true);
    this.idInvoices = this.invoicesIdStore
    try {
      const signIn = {
        jsonrpc: "2.0",
        params: { login: "jabillaodoo@gmail.com", password: "admin" },
      };
       await axios.post("https://jabiyaerp.flai.com.do/api/exo/auth/sign_in",signIn, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
    await this.productsOfOrders();
  },

  computed: {
    ...mapGetters([
      "invoicesIdStore",
      "structureToScan",
      "isChangeQuantityStore",
      "orderScan",
    ]),
  },

  watch: {
    showUpdating: {
      handler: function (newVal) {
        if (newVal.length !== 0) {
          this.btnScan = true;
          this.btnSave = false;
          this.btnInvoices = true;
        } else if (newVal.length == 0) {
          this.btnInvoices = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    async downloadPDF() {
      try {
         await axios.post(`https://jabiyaerp.flai.com.do/api/order/${this.idInvoices}/invoice`,{ withCredentials: true });
      } catch (error) {
        console.log(error);
      }
      let delay = (ms) => new Promise((res) => setTimeout(res, ms));
      var link = document.createElement("a");
      link.href = `https://jabiyaerp.flai.com.do/api/order/${this.idInvoices}/invoice/download?report_type=pdf&download=true`;
      link.download = "file.pdf";
      link.dispatchEvent(new MouseEvent("click"));
      await delay(3000);
      this.createInvoice();
    },
    async productsOfOrders() {
      try {
        //      const resultLogin = await this.$services.invoicesSevices.getLoginInvoices()
        const result = await axios.get(`https://jabiyaerp.flai.com.do/api/order/${this.idInvoices}`,{ withCredentials: true });
        this.order_lines = result.data.result.data.order_lines;
        this.customerDetails = result.data.result.data.order;
        this.NewOrdersQuantyti = result.data.result.data.order_lines.map(
          (x, i) => {
            this.orderScan[i]?.products.forEach((z) => {
              this.orderStoreQuantity.push(z.quantity);
            });
            this.OrderQuantity = x.productQuantity;
            this.productOrder = x;
            if (this.orderStoreQuantity[i] !== x.productQuantity) {
              this.isChangeQuantity.exception = true;
              this.isChangeQuantity.order_num = this.customerDetails.id;
              this.$store.commit(
                "getChageQuantityToProduct",
                this.isChangeQuantity
              );
            }
            return x.productQuantity;
          }
        );
        if (this.customerDetails.has_invoice) {
          this.btnScan = false;
          this.btnSave = true;
          this.btnInvoices = true;
        }
        if (this.OrderQuantity) {
          this.setStructureInvoices(this.OrderQuantity, this.productOrder);
        }
        if (this.isChangeQuantityStore.exception) {
          this.isChangeQuantity.changeQuantity = this.isChangeQuantityStore.changeQuantity;
        } else if (localStorage.getItem(`isChangeQuantity${this.customerDetails?.id}`)) {
          this.isChangeQuantity = JSON.parse(localStorage.getItem(`isChangeQuantity${this.customerDetails?.id}`));
        }
      } catch (error) {
        console.log(error);
      }
      this.setOpen(false);
    },

    async productQuantityChange() {
      this.setOpen(true);
      let quantityLocal = [];
      const order_lines = this.order_lines.map((x) => {
        quantityLocal.push(x.productQuantity);
        return { order_line_id: x.line_id, qty: x.productQuantity };
      });
      this.isChangeQuantity.changeQuantity = quantityLocal;
      this.isChangeQuantity.exception = true;
      this.$store.commit("getChageQuantityToProduct", this.isChangeQuantity);
      localStorage.setItem(`isChangeQuantity${this.customerDetails.id}`,JSON.stringify(this.isChangeQuantity));

      this.showUpdating = [];
      await this.pachChangeProductQuantity(order_lines);
      this.btnSave = true;
      this.btnInvoices = false;
    },

    async pachChangeProductQuantity(orderLine) {
      try {
            await axios.patch(`https://jabiyaerp.flai.com.do/api/order/${this.idInvoices}`, {
          params: {
            order_lines: orderLine,
          },
        },
        { withCredentials: true }
      );
      } catch (error) {
        console.log(error)
      }
  
      await this.productsOfOrders();
    },

    showProductQuantity(signo, value, amountCompare, product) {
      if (signo === "plus" && value == amountCompare) {
        if (
          this.order_lines.every(
            (x, i) => x.productQuantity === this.orderStoreQuantity[i]
          ) ||
          this.order_lines.every(
            (x, i) =>
              x.productQuantity === this.isChangeQuantity.changeQuantity[i]
          )
        ) {
          this.btnSave = true;
          this.showUpdating = [];
        } else {
          this.showUpdating.splice(0, 1);
        }
      } else if (signo === "plus" && !this.isChangeQuantity.changeQuantity) {
        this.btnSave = true;
        this.showUpdating.push(value);
      } else if (signo === "plus" && value == amountCompare) {
        this.btnSave = true;
        this.showUpdating.splice(0, 1);
      } else if (signo === "plus" && value < amountCompare) {
        this.btnSave = false;
        this.showUpdating.splice(0, 1);
      } else if (signo === "min" && value == amountCompare) {
        if (
          this.order_lines.every(
            (x, i) => x.productQuantity === this.orderStoreQuantity[i]
          ) ||
          this.order_lines.every(
            (x, i) =>
              x.productQuantity === this.isChangeQuantity.changeQuantity[i]
          )
        ) {
          this.btnSave = true;
          this.showUpdating = [];
        } else {
          this.showUpdating.splice(0, 1);
        }
      } else {
        this.btnSave = false;
        this.showUpdating.push(value);
      }

      this.OrderQuantity = value;
      this.productOrder = product;
      this.setStructureInvoices(this.OrderQuantity, this.productOrder);
    },

    createInvoice() {
      this.btnScan = false;
      this.btnInvoices = true;
    },
    ScanOrder() {
      this.$router.push({ name: "deliveryActions" }).catch(() => {});
    },
    async setStructureInvoices(quantity, product) {
      let structure = await this.setStructure(
        this.orderScan[0],[], [],quantity,product, this.order_lines);
      this.listOfOrders = structure.firstStructure;
      this.listOfOrderTotal = structure.secondStructure;
      let structureInvoices = {
        firstStructure: this.listOfOrders,
        secondStructure: this.listOfOrderTotal,
      };
      this.$store.commit("setStructureToScan", structureInvoices);
    },
  },
};
</script>

<style scoped>
p {
  margin: 5px 0;
}

.Space {
  margin-right: 20px;
}
.title {
  background: white;
}

td {
  padding: 5px 0px 6px;
  width: 1%;
}
th {
  font-size: 10.5px;
  color: #000;
  font-weight: bold;
}
.font-awesome {
  font-size: 15px;
  margin: 6px 9px;
}

.button-position {
  position: fixed;
  bottom: 10px;
  right: 11px;
  width: 92%;
}
.button-position-save {
  background-color: #2a307c;
  color: #fff;
}
.show-save {
  margin: 20px 0px 5px;
}
.showActive {
  background-color: rgb(208 241 217);
}

.button-cancel {
  background: #930404;
  color: #fff;
}
.recalculating {
  background-color: yellow;
}
.table-scroll {
  height: 290px;
  overflow-x: none;
  overflow-x: hidden;
  overflow-y: scroll;
}
.disabled-status {
  background-color: #fff !important;
}
.plus-disabled {
  pointer-events: none;
}
</style>
