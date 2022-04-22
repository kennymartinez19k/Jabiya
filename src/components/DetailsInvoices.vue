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
      <h4 class="uk-text-small">Procesar Facturas y Devolución</h4>
      <div
        class="uk-card uk-card-default uk-card-body uk-width-1-2@m"
        style="padding: 0px 8px 8px"
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
            }}{{ customerDetails?.order?.amount_total }}
            <span
              v-if="showUpdating.length > 0"
              :class="{ recalculating: showUpdating.length > 0 }"
              >Se recalcula al guardar tus cambios</span
            ></span
          >
        </p>
      </div>
    </div>
    <div class="uk-flex uk-flex-between uk-flex-middle">
      <h4 class="uk-text-small">Lista de Productos</h4>
      <div>
      <button 
                :disabled="btnInvoices"
                type="button"
                class="uk-button uk-button-primary" style="padding: 7px 10px"
                @click="downloadPDFRefundInvoice()"
              >
              Descargar Facturas
              </button>
      </div>
            
    </div>
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
            uk-text-left
          "
        >
          <thead>
            <tr class="title">
              <th :class="{'th-text': customerDetails?.order?.can_refund}">Productos Ordenados</th>
              <th :class="{'th-text': customerDetails?.order?.can_refund}">Cantidad a Devolver</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, i) in order_lines" :key="product">
              <td  :class="{'td-text': customerDetails?.order?.can_refund}" class="uk-table-small">{{ product.productName }}<br><span class="uk-text-bold">Precio:&nbsp;</span>{{ product.currencySymbol }}{{ product.price }}  <br><span class="uk-text-bold">Ordenados:&nbsp;</span> {{product.productQuantity}}</td>
              <td
              class="uk-text-center"
                :class="{
                  showActive: product.productQuantityInvoiced !== NewOrdersQuantyti[i],
                  'td-text': customerDetails?.order?.can_refund
                }"
              >
                {{ product.productQuantity - product.productQuantityInvoiced  }}
              </td>
              <span class="f-span uk-margin-small">
               <font-awesome-icon
              v-if="customerDetails?.order?.can_refund"
                icon="plus"
                :class="{
                  'plus-disabled':
                    product.productQuantityInvoiced == 0 ||
                    !customerDetails?.order?.can_refund,
                }"
                class="Space font-awesome uk-margin-bottom"
                @click="
                  (product.productQuantityInvoiced -= 1),
                    showproductQuantityInvoiced(
                      'min',
                      product.productQuantityInvoiced,
                      NewOrdersQuantyti[i],
                      product,
                    )
                "
              />
              <font-awesome-icon
              v-if="customerDetails?.order?.can_refund"
                icon="minus"
                :class="{
                  'plus-disabled':
                    product.productQuantityInvoiced >= orderStoreQuantity[i] ||
                    !customerDetails?.order?.can_refund,
                }"
                class="Space font-awesome uk-flex uk-flex-wrap-bottom"
                @click="
                  (product.productQuantityInvoiced += 1),
                    showproductQuantityInvoiced(
                      'plus',
                      product.productQuantityInvoiced,
                      NewOrdersQuantyti[i],
                      product,
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
<div id="invoicesPdf" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <h5 class="uk-modal-title">Detalles</h5>
        <p>Su factura  fue descargada en la carpeta de <strong style="font-size: 17px !important">"Documents"</strong> de su teléfono </p>
        <p class="uk-text-right">
            <button class="uk-button uk-button-primary uk-modal-close" type="button">Aceptar</button>
        </p>
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
             :disabled="btnChange"
              class="uk-button uk-button-primary uk-modal-close"
              type="button"
              @click="changeProductQuantityRefudInvoiced()"
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
          Crear Devolución
        </button>
      </div>
      <!-- <div class="uk-margin-top">
        <button  v-if="customerDetails?.order?.can_refund"
          :disabled="btnInvoices"
          type="button"
          class="uk-button uk-button-primary"
          @click="downloadPDFRefundInvoice()"
        >
         Descargar Facturas
        </button>
          <button v-if="customerDetails?.order?.can_refund"
          type="button"
          class="uk-button uk-button-primary"
          @click="downloadPDFRefundInvoice()"
        >
          Descargar Facturas
        </button> --
      </div> -->
      <div class="uk-margin-top">
        <button
          :disabled="btnScan"
          type="button"
          class="uk-button uk-button-primary"
          @click="ScanOrder()"
        >
          Entregar Orden
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
import { Filesystem, Directory } from "@capacitor/filesystem";
import UIkit from "uikit";
import moment from "moment";
import "moment/locale/es";

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
      order_lines: null,
      customerDetails: null,
      NewOrdersQuantyti: [],
      showUpdating: [],
      orderStoreQuantity: [],
      idInvoices: null,
      btnChange: false,
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
          this.btnSave = false;
          if (this.customerDetails.invoices.length > 0 && newVal.length == 0) {
          this.btnScan = false;
            this.btnInvoices = false;
          } else {
          this.btnScan = true;
            this.btnInvoices = true;
          }
        } else if (newVal.length == 0) {
          this.btnInvoices = false;
           if (this.customerDetails.invoices.length > 0 && newVal.length == 0) {
          this.btnScan = false;
            this.btnInvoices = false;
          } else {
          this.btnScan = true;
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
        //      const resultLogin = await this.$services.invoicesSevices.getLoginInvoices()
        const result = await axios.get(`https://jabiyaerp.flai.com.do/api/order/${this.idInvoices}`,{ withCredentials: true });
        this.order_lines = result.data.result.data.order_lines;
        this.customerDetails = result.data.result.data;
        console.log(result.data,'result.data.result.data.order_lines')
        this.NewOrdersQuantyti = result.data.result.data.order_lines.map(
          (x, i) => {
            this.orderScan[i]?.products.forEach((z) => {
              this.orderStoreQuantity.push(z.quantity);
            });
            this.OrderQuantity = x.productQuantityInvoiced;
            this.productOrder = x;
            if (this.orderStoreQuantity[i] !== x.productQuantityInvoiced) {
              this.isChangeQuantity.exception = true;
              this.isChangeQuantity.changeQuantity = x.productQuantityInvoiced
              this.isChangeQuantity.order_num = this.customerDetails?.order?.id;
              localStorage.setItem(`isChangeQuantity${this.customerDetails?.order?.id}`,JSON.stringify(this.isChangeQuantity));
              this.$store.commit("getChageQuantityToProduct",this.isChangeQuantity);
            }
            return x.productQuantityInvoiced;
          }
        );
        console.log(this.NewOrdersQuantyti,'this.NewOrdersQuantyti')
        if (!this.customerDetails?.order?.can_refund || this.customerDetails?.invoices.length > 0) {
          this.btnScan = false;
          this.btnSave = true;
          this.btnInvoices = false;
        }
        
        if (this.OrderQuantity) {
          this.setStructureInvoices(this.OrderQuantity, this.productOrder);
        }

        if (this.isChangeQuantityStore.exception) {
          this.isChangeQuantity.changeQuantity = this.isChangeQuantityStore.changeQuantity;
        } else if (localStorage.getItem(`isChangeQuantity${this.customerDetails?.order?.id}`)) {
          this.isChangeQuantity = JSON.parse(localStorage.getItem(`isChangeQuantity${this.customerDetails?.order?.id}`));
        }
      } catch (error) {
        console.log(error);
      }
      this.setOpen(false);
    },

    async changeProductQuantityRefudInvoiced() {
      this.btnChange = true
      this.setOpen(true);
      let quantityLocal = [];
      const order_lines = this.order_lines.map((x) => {
        quantityLocal.push(x.productQuantityInvoiced);
        let qty = null
        if (this.orderScan.find(products => products.products.find(product => product.description === x.productName)  )) {
           qty = x.productQuantity - x.productQuantityInvoiced
        }
        return  {product_id: x.productId, set_qty: qty}
        
      });
      this.isChangeQuantity.changeQuantity = quantityLocal;
      this.isChangeQuantity.exception = true;
      this.$store.commit("getChageQuantityToProduct", this.isChangeQuantity);
      localStorage.setItem(`isChangeQuantity${this.customerDetails?.order?.id}`,JSON.stringify(this.isChangeQuantity));

      this.showUpdating = [];
      await this.createRefudInvoices(order_lines);
      this.btnSave = true;
      this.btnChange = false
      this.btnInvoices = false;
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
      } catch (error) {
        console.log(error)
      }
      await this.productsOfOrders();
      await this.downloadPDFRefundInvoice();

    },
    // async c () {
    //   // este es la confirmacion debo ponerlo cuando escane todo
    //     try {
    //      await axios.post(`https://jabiyaerp.flai.com.do/api/order/${this.idInvoices}/post`,{ withCredentials: true });
    //   } catch (error) {
    //     console.log(error);
    //   }

    //   this.btnScan = false;
    //   this.btnInvoices = true;
    // },

    async downloadPDFRefundInvoice() {
      let selectedInvoicesId = []
      this.customerDetails.invoices.forEach(x => {
      selectedInvoicesId.push( x.id.toString())
      })
      let downloadInvoicesId = selectedInvoicesId.join();
      console.log(downloadInvoicesId,'downloadInvoicesId')
      let date = moment(new Date()).format("DD-MM-YYYY,h:mm:ss");
      let invoices = `Inv${date}.pdf`
      var urlFile =`https://jabiyaerp.flai.com.do/api/invoice/report?invoice_ids=${downloadInvoicesId}/download?report_type=pdf&download=true`;
      var request = new XMLHttpRequest();
      request.open("GET", urlFile, true);
      request.responseType = "blob";
    
      request.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function (e) {
          Filesystem.writeFile({
            path: invoices,
            data: e.target.result,
            directory: Directory.Documents,
            recursive: true,
          })
            .then((result) => {
              const path = result.uri;
              console.log(path);
              UIkit.modal('#invoicesPdf').show();
            })
            .catch((error) => {
              console.log(error);
            });


            const contents =  Filesystem.getUri({
            path: invoices,
            directory: Directory.Documents,
            recursive: true,
          }).then((result) => {
              const path = result.uri;
              console.log(path);
              // UIkit.modal('#invoicesPdf').show();
            })
            .catch((error) => {
              console.log(error);
            });            
            console.log('data:', contents);


        };
      };
      request.send();
      this.btnScan = false;
      this.btnInvoices = false;
  //         var link = document.createElement("a");
  //         // https://jabiyaerp.flai.com.do/api/invoice/report?invoice_ids=${downloadInvoicesId}/download?report_type=pdf&download=true
  // link.href = `https://jabiyaerp.flai.com.do/api/invoice/report?invoice_ids=${downloadInvoicesId}/download?report_type=pdf&download=true`;
  //     link.download = "file.pdf";
  //     // link.target = "_self"
  //     // link.dispatchEvent(new TouchEvent("click"));
  //     link.dispatchEvent(new MouseEvent("click"));
      
    },

    showproductQuantityInvoiced(signo, value, amountCompare, product) {
      if (signo === "plus" && value == amountCompare) {
        if (
          this.order_lines.every(
            (x,i) => x.productQuantityInvoiced === this.orderStoreQuantity[i]
          ) ||
          this.order_lines.every(
            (x) =>
              x.productQuantityInvoiced === this.isChangeQuantity.changeQuantity
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
      } else if (signo === "plus" && value < amountCompare) {
        this.btnSave = false;
        this.showUpdating.splice(0, 1);
      } else if (signo === "min" && value == amountCompare) {
        if (
          this.order_lines.every(
            (x, i) => x.productQuantityInvoiced === this.orderStoreQuantity[i]
          ) ||
          this.order_lines.every(
            (x) =>
              x.productQuantityInvoiced === this.isChangeQuantity.changeQuantity
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

    ScanOrder() {
      this.btnScan = true
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

.td-text {
  padding: 10px 12px !important;
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
.f-span {
  display: flex;
  flex-direction: column;
}
</style>
