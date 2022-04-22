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
      <h4 class="uk-text-small">Procesar Facturas y Devoluciones</h4>
      <div
        class="uk-card uk-card-default uk-card-body uk-width-1-2@m details-order"
      >
        <p>
          <strong>Orden:</strong>&nbsp;<span>{{ customerDetails?.order?.name }}</span>
        </p>
        <p>
          <strong>Dirección:</strong>&nbsp;<span>{{
            customerDetails?.order?.delivery_address?.full_address
          }}</span>
        </p>
        <p>
          <strong>Cliente:</strong>&nbsp;<span>{{
            customerDetails?.order?.client
          }}</span>
        </p>
        <p>
          <strong>Total:</strong>&nbsp;<span
            >{{ customerDetails?.order?.currencySymbol
            }}{{customerDetails?.order?.total_invoice.toFixed(2) }}
            <span
              v-if="showUpdating.length > 0"
              :class="{ recalculating: showUpdating.length > 0 }"
              >Se recalcula al guardar tus cambios</span
            ></span
          >
        </p>
      </div>
    </div>
      <h4 class="uk-text-small text-returns">Procesar Devoluciones </h4>
      <h6 class="subtitle">(de ser necesario)</h6>

<div class=" table-thead uk-margin-left">
            <h6 class="uk-text-left uk-width-1-3 uk-text-small" :class="{'th-text': customerDetails?.order?.can_refund}">Productos Ordenados</h6>
              <h6 class="uk-text-center uk-width-1-3 uk-text-small" :class="{'th-text': customerDetails?.order?.can_refund}">Cantidad a Devolver</h6>
              <h6 class="uk-text-left uk-width-1-4 uk-text-small" :class="{'th-text': customerDetails?.order?.can_refund}"></h6>
        </div>
    <div>
      
      <div
        class="uk-card uk-card-default uk-card-body table-scroll"
      >
        
        <table
          class="
            uk-table
            uk-table-small
            uk-table-hover
            uk-table-divider
            uk-text-left
          "
        >
          <tbody>
            <tr v-for="(product, i) in order_lines" :key="product">
              <td v-if="!product.isRewardLine" :class="{'td-text': customerDetails?.order?.can_refund}" class="uk-table-small">{{ product.productName }}<br><span class="uk-text-bold">Precio:&nbsp;</span><span>{{ product.currencySymbol }}{{ product.price }} </span>  <br><span class="uk-text-bold">Ordenados:&nbsp;</span><del v-if="product.productQuantityToInvoice > 0 " class="quantity-adjustment"><span>{{product.productQuantity}}</span></del> <span v-if="product.productQuantityToInvoice == 0 "><span>{{product.productQuantity}}</span></span></td>
              <td
              v-if="!product.isRewardLine"
              class="uk-text-center"
                :class="{
                  showActive: product.productQuantityToInvoice !== NewOrdersQuantyti[i],
                  'td-text': customerDetails?.order?.can_refund
                }"
              >
               <span >{{ product.productQuantityToInvoice  }}</span>
              </td>
              <span v-if="!product.isRewardLine" class="f-span uk-margin-small">
               <font-awesome-icon
              v-if="customerDetails?.order?.can_refund"
                icon="plus"
                :class="{
                  'plus-disabled':
                    product.productQuantityToInvoice >= orderStoreQuantity[i] ||
                    !customerDetails?.order?.can_refund,
                }"
                class="Space font-awesome uk-margin-bottom"
                @click="
                  (product.productQuantityToInvoice += 1),
                    showproductQuantityToInvoice(
                      'plus',
                      product.productQuantityToInvoice,
                      NewOrdersQuantyti[i],
                      product,
                      product.productQuantity,
                    )
                "
              />
              <font-awesome-icon
              v-if="customerDetails?.order?.can_refund"
                icon="minus"
                :class="{
                  'plus-disabled':
                    product.productQuantityToInvoice == 0 ||
                    !customerDetails?.order?.can_refund,
                }"
                class="Space font-awesome uk-flex uk-flex-wrap-bottom"
                @click="
                  (product.productQuantityToInvoice -= 1),
                    showproductQuantityToInvoice(
                      'min',
                      product.productQuantityToInvoice,
                      NewOrdersQuantyti[i],
                      product,
                      product.productQuantity,

                    )
                "
              />
             </span>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- This is the modal -->
    <div id="products" uk-modal>
      <div class="uk-modal-dialog uk-modal-body">
        <div class="uk-margin">
          <p v-if="!isOriginalValue">Esta seguro que desea guardar los cambios</p>
          <p v-if="isOriginalValue">Esta seguro que desea eliminar el rembolso</p>
        </div>

        <div class="uk-flex uk-flex-right">
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
              v-if="!isOriginalValue"
             :disabled="btnChange"
              class="uk-button uk-button-primary uk-modal-close btn-modal"
              type="button"
              @click="changeProductQuantityRefudInvoiced()"
            >
              ok
            </button>
              <button
              v-if="isOriginalValue"
              class="uk-button uk-button-primary uk-modal-close btn-modal"
              type="button"
              @click="removeInvoiceRefund()"
            >
              ok
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="button-position uk-flex uk-flex-between">
      <div class=" btn-style">
        <button
          type="button"
          uk-toggle="target: #products"
          :disabled="btnSave"
          class="uk-button uk-button-primary btn-style"
        >
          Crear Devolución
        </button>
      </div>
      <div class="btn-style">
        <button 
          :disabled="btnInvoices"
          type="button"
          class="uk-button uk-button-primary btn-style" 
          @click="downloadPDFRefundInvoice()"
        >
        Descargar Facturas
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
import { Browser } from '@capacitor/browser';
export default {
  alias: "Detalles",
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
      staticQuantity: null,
      order_lines: null,
      customerDetails: null,
      NewOrdersQuantyti: [],
      showUpdating: [],
      orderStoreQuantity: [],
      idInvoices: null,
      btnChange: false,
      isOriginalValue: true,

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
    this.setOpen(false);

  },
  computed: {
    ...mapGetters([
      "invoicesIdStore",
      "structureToScan",
      "isChangeQuantityStore",
      "orderScan",
      "loadStore"
    ]),
  },

  watch: {
    showUpdating: {
      handler: function (newVal) {
        if (newVal.length !== 0) {
          this.btnSave = false;
        
          if (this.customerDetails.invoices.length > 0 && newVal.length == 0 ) {
            this.btnInvoices = false;
          } else {
            this.btnInvoices = true;
          }

        } else if (newVal.length == 0) {
          this.btnInvoices = false;

           if (this.customerDetails.invoices.length > 0 && newVal.length == 0) {
            this.btnInvoices = false;
          } else {
            this.btnInvoices = true;
          }

        }
      },
      deep: true,
    },
  },
  methods: {
    async productsOfOrders() {

      try {
         this.setOpen(true);

        //      const resultLogin = await this.$services.invoicesSevices.getLoginInvoices()
        const result = await axios.get(`https://jabiyaerp.flai.com.do/api/order/${this.idInvoices}`,{ withCredentials: true });
        this.order_lines = result.data.result.data.order_lines;
        this.customerDetails = result.data.result.data;
        this.NewOrdersQuantyti = result.data.result.data.order_lines.map(
          (x, i) => {
            this.orderScan[i]?.products.forEach((z) => {
              this.orderStoreQuantity.push(z.quantity);
            });
            this.OrderQuantity = x.productQuantityToInvoice;
            this.productOrder = x;
            if (x.productQuantityToInvoice !== 0) {
              this.isChangeQuantity.exception = true;
              this.isChangeQuantity.changeQuantity = x.productQuantityToInvoice
              this.isChangeQuantity.order_num = this.customerDetails?.order?.name;
              localStorage.setItem(`isChangeQuantity${this.customerDetails?.order?.name}`,JSON.stringify(this.isChangeQuantity));
              this.$store.commit("getChageQuantityToProduct",this.isChangeQuantity);
            }
            return x.productQuantityToInvoice;
          }
        );
        if (!this.customerDetails?.order?.can_refund || this.customerDetails?.invoices.length > 0) {
          this.btnScan = false;
          this.btnSave = true;
          this.btnInvoices = false;
        }
        
        // if (this.OrderQuantity) {
          this.setStructureInvoices(null, this.productOrder);
        // }

        if (this.isChangeQuantityStore.exception) {
          this.isChangeQuantity.changeQuantity = this.isChangeQuantityStore.changeQuantity;
        } else if (localStorage.getItem(`isChangeQuantity${this.customerDetails?.order?.name}`)) {
          this.isChangeQuantity = JSON.parse(localStorage.getItem(`isChangeQuantity${this.customerDetails?.order?.name}`));
        }
      } catch (error) {
        console.log(error);
      }
      let contProductsOdoo = 0;
        this.order_lines.forEach(x => {
            if (!x.isRewardLine && x.productQuantityToInvoice ===0) {
                contProductsOdoo++
            } else if (x.isRewardLine) {
                contProductsOdoo++
            }
        })
        if (this.order_lines.length === contProductsOdoo){
          this.isOriginalValue = true
        } else {
          this.isOriginalValue = false
        } 
    },

    async changeProductQuantityRefudInvoiced() {
      this.btnChange = true
      this.setOpen(true);
      let quantityLocal = [];
      const order_lines = this.order_lines.map((orderOdoo) => {
      quantityLocal.push(orderOdoo.productQuantityToInvoice);
      if (this.orderScan.find(products => products.products.find(product => product.description === orderOdoo.productName && orderOdoo.productQuantityToInvoice != 0)  )) {
        // qty = orderOdoo.productQuantity - orderOdoo.productQuantityToInvoice
        return  {product_id: orderOdoo.productId, set_qty: orderOdoo.productQuantityToInvoice}
      }
      });
      this.isChangeQuantity.changeQuantity = quantityLocal;
      this.isChangeQuantity.exception = true;
      this.$store.commit("getChageQuantityToProduct", this.isChangeQuantity);
      localStorage.setItem(`isChangeQuantity${this.customerDetails?.order?.name}`,JSON.stringify(this.isChangeQuantity));

      this.showUpdating = [];
      await this.createRefudInvoices(order_lines.filter( x => x != undefined));
 
    },


    async createRefudInvoices(changeRefundQty) {
         let refund_id= null;
        try {
          const result =  await axios.post(`https://jabiyaerp.flai.com.do/api/order/${this.idInvoices}/invoice/refund`, { withCredentials: true });
          refund_id = result.data.result.data.refund_id
      } catch (error) {
        console.log(error)
      }
          try {
            await axios.patch(`https://jabiyaerp.flai.com.do/api/invoice/refund/${refund_id}/update`, {
              params: {
                products: changeRefundQty,
              },
            },
            { withCredentials: true }
           );
          this.btnSave = true;
          this.btnChange = false
          this.btnInvoices = false;
          await this.productsOfOrders();
          await this.downloadPDFRefundInvoice();
      } catch (error) {
        console.log(error)
        this.btnChange = false
        await this.productsOfOrders();
        this.setOpen(false);
      }
     

    },

    async removeInvoiceRefund () {
        this.setOpen(true);
     let refundId = null
      this.customerDetails.invoices.forEach(x => { if (x.move_type == "out_refund")  refundId = x.id } )
        try {
        await axios.delete(`https://jabiyaerp.flai.com.do/api/invoice/refund/${refundId}`, { withCredentials: true });
        this.showUpdating = []
        this.isChangeQuantity.exception = false;
        this.isChangeQuantity.changeQuantity = null
        this.isChangeQuantity.order_num = null
        this.$store.commit("getChageQuantityToProduct",this.isChangeQuantity);
        localStorage.removeItem(`isChangeQuantity${this.orderScan[0].order_num}`);
        await this.productsOfOrders()
      } catch (error) {
        console.log(error)
      }
        this.setOpen(false);
    },
    
    async downloadPDFRefundInvoice() {
    this.setOpen(true);

      let selectedInvoicesId = []
      this.customerDetails.invoices.forEach(x => {
      selectedInvoicesId.push( x.id.toString())
      })
      let downloadInvoicesId = selectedInvoicesId.join();
      try {
      var urlFile =`https://jabiyaerp.flai.com.do/api/invoice/report?invoice_ids=${downloadInvoicesId}`;
      var request = new XMLHttpRequest();
      request.withCredentials= true
      request.open("GET", urlFile, true);
      request.responseType = "blob";
      Browser.open({ url:`https://jabiyaerp.flai.com.do/api/invoice/report?invoice_ids=${downloadInvoicesId}`})
     } catch (error) {
        console.log(error)
      }
      this.btnScan = false;
      this.btnInvoices = false;
      if (!this.loadStore.scanningRequired) {
        this.$router.push({ name: "delivery-actions-auto" }).catch(() => {});
      } else {
        this.$router.push({ name: "deliveryActions" }).catch(() => {});
      }
      let dwlStatus = {
        status: true,
        order: this.customerDetails?.order?.name
      }
      this.$store.commit("getInvoiceDownload",dwlStatus);
      this.setOpen(false);

    },

    showproductQuantityToInvoice(signo, value, amountCompare, product, staticQty) {
      if (signo === "plus" && value == amountCompare) {
        if (
          this.order_lines.every(
            (x,i) => x.productQuantityToInvoice === this.orderStoreQuantity[i]
          ) ||
          this.order_lines.every(
            (x,i) =>
              x.productQuantityToInvoice === this.NewOrdersQuantyti[i]
          )
        ) {
          this.btnSave = true;
          this.showUpdating = [];
        } else {
          this.showUpdating.splice(0, 1);
          this.btnSave = true;
        }
      } else if (signo === "plus" && !this.isChangeQuantity.changeQuantity) {
        this.btnSave = true;
        this.showUpdating.push(value);
      } else if (signo === "plus" && value < amountCompare) {
        this.btnSave = false;
        this.showUpdating.splice(0, 1);
      } else if (signo === "min" && value == amountCompare) {
        if (
          this.order_lines.every(
            (x, i) => x.productQuantityToInvoice === this.orderStoreQuantity[i]
          ) ||
          this.order_lines.every(
            (x,i) =>
              x.productQuantityToInvoice === this.NewOrdersQuantyti[i]
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
      this.staticQuantity = staticQty;
      this.productOrder = product;
       let contProductsOdoo = 0;
        this.order_lines.forEach(x => {
            if (!x.isRewardLine && x.productQuantityToInvoice ===0) {
                contProductsOdoo++
            } else if (x.isRewardLine) {
                contProductsOdoo++
                
            }
        })
        if (this.order_lines.length === contProductsOdoo){
          this.isOriginalValue = true
        } else {
          this.isOriginalValue = false
        }
      this.setStructureInvoices(this.OrderQuantity, this.productOrder);
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

      setRound (val) {
        return val.toFixed(2)
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
td {
  width: 43%;
}
.td-text {
  padding: 10px 12px !important;
}
.text-size{
  font-size: 17px !important
}
.th-text {
  text-align: center;
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
  background-color: #fff;
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
  margin-right: 15px;
  padding: 11px;
  font-size: 11px;
}

.recalculating {
  background-color: yellow;
}
.table-scroll {
  height: 230px;
  padding: 0 8px 45px;
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
.f-span {
  display: flex;
  flex-direction: column;
}
.text-returns {
  margin-bottom: 0px;
}
.subtitle {
  font-size: 12px; 
  margin-top: 0px;
  color: #6d6f7f;
}
.btn-style{
  padding: 10px;
  font-size: 10px;
}
.btn-modal {
  padding: 10px;
  font-size: 10px;
}
.details-order{
 padding: 0px 8px 8px;

}
.table-thead{
  display: flex;
  justify-content: space-around;
}
.quantity-adjustment{
  background-color: #efb5b5;;
  padding: 5px;
}
</style>
