<template>
  <div class="uk-container uk-text-left">
    <ion-loading :is-open="isOpenRef" cssClass="my-custom-class" message="Por favor Espere..." :duration="timeout"
      @didDismiss="setOpen(false)">
    </ion-loading>
    <div>
      <h4 class="uk-text-small web-title-small">
        Procesar Facturas y Devoluciones
      </h4>
      <div class="
          uk-card uk-card-default uk-card-body
          item-info
          uk-width-1-2@m
          details-order
        ">
        <p class="web-sub-title-small">
          <strong>Orden:</strong>&nbsp;<span>{{
          customerDetails?.order?.name
          }}</span>
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
          <strong>Total:</strong>&nbsp;<span>
            <span v-if="customerDetails?.invoices.length > 0"> {{ customerDetails?.order?.currencySymbol }}{{
            formatCurrency(customerDetails?.order?.total_invoice)}}</span>
            <span v-else :class="{total:showUpdating.length > 0 }"> {{ customerDetails?.order?.currencySymbol }}{{
            formatCurrency(customerDetails?.order?.amount_total) }}</span>&nbsp;
            <span v-if="showUpdating.length > 0" :class="{ recalculating: showUpdating.length > 0 }">Se recalcula al
              Crear la Factura</span></span>
        </p>
      </div>
    </div>
    <h4 class="uk-text-small text-returns web-title-small">
      Procesar Devoluciones
    </h4>
    <h6 class="subtitle">(de ser necesario)</h6>

    <div class="table-thead">
      <h6 class="uk-text-left uk-text-small web-sub-title-small"
        :class="{ 'th-text': customerDetails?.order?.can_refund, 'h6-text': !customerDetails?.order?.can_refund }">
        Productos Ordenados
      </h6>
      <h6 class="uk-text-left uk-text-small web-sub-title-small order"
        :class="{ 'th-text': customerDetails?.order?.can_refund, 'order-space': !customerDetails?.order?.can_refund, 'h6-text': !customerDetails?.order?.can_refund }">
        Ordenados
      </h6>
      <h6 class="uk-text-left uk-text-small web-sub-title-small order"
        :class="{ 'th-text': customerDetails?.order?.can_refund, 'order-space': !customerDetails?.order?.can_refund, 'h6-text': !customerDetails?.order?.can_refund }">
        Devolver
      </h6>
      <h6 class="uk-text-left uk-text-small" :class="{ 'th-text-space': customerDetails?.order?.can_refund }">
        &nbsp;&nbsp;&nbsp;</h6>
    </div>
    <div>
      <div class="uk-card uk-card-default uk-card-body table-scroll">
        <table class="
            uk-table uk-table-small uk-table-hover uk-table-divider uk-text-left
          ">
          <tbody>
            <tr v-for="(product, i) in order_lines" :key="product">
              <td v-if="!product.isRewardLine" :class="{ 'td-text': customerDetails?.order?.can_refund }"
                class="uk-table-small uk-text-start">
                {{ product.productName }}<br /><span>{{
                product.currencySymbol }}{{ formatCurrency(product.price) }} </span>
                <br />
              </td>
              <td :class="{ 'td-text': customerDetails?.order?.can_refund }" class="uk-text-center">
                <span><span>{{ orderStoreQuantity[i] }}</span></span>
              </td>
              <td v-if=" !product.isRewardLine" class="uk-text-center" :class="{
                'show-active2':
                  product.qty_to_deliver !== NewOrdersQuantyti[i],
                'td-text': customerDetails?.order?.can_refund,
              'show-active': orderStoreQuantity[i] - product.qty_to_deliver  !== 0 && customerDetails?.invoices.length > 0
              }">
                <span>{{ orderStoreQuantity[i] - product.qty_to_deliver }}</span>
              </td>
              <span v-if="customerDetails?.order?.can_refund && !product.isRewardLine" class="f-span uk-margin-small">
                <font-awesome-icon v-if="customerDetails?.order?.can_refund" icon="plus" :class="{
                  'plus-disabled':
                    orderStoreQuantity[i] - product.qty_to_deliver >=
                      orderStoreQuantity[i] ||
                    !customerDetails?.order?.can_refund,
                }" class="Space font-awesome uk-margin-bottom" @click="
                  (product.qty_to_deliver -= 1),
                    showproductQuantityToInvoice(
                      'plus',
                      product.qty_to_deliver,
                      NewOrdersQuantyti[i],
                      product,
                      orderStoreQuantity[i]
                    )
                " />
                <font-awesome-icon v-if="customerDetails?.order?.can_refund" icon="minus" :class="{
                  'plus-disabled':
                  orderStoreQuantity[i] - product.qty_to_deliver == 0 ||
                    !customerDetails?.order?.can_refund,
                }" class="Space font-awesome uk-flex uk-flex-wrap-bottom" @click="
                  (product.qty_to_deliver += 1),
                    showproductQuantityToInvoice(
                      'min',
                      product.qty_to_deliver,
                      NewOrdersQuantyti[i],
                      product,
                      orderStoreQuantity[i]
                    )
                " />
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
          <p>
            Asegúrese que procesó todas las devoluciones.
          </p>
          <p>
            ¿Procedemos a generar la <b>Factura FINAL</b>?
          </p>
        </div>

        <div class="uk-flex uk-flex-around">
          <div>
            <button id="cancel" class="uk-button uk-modal-close button-cancel" type="button">
              No
            </button>
          </div>
          <div>
            <button class="uk-button uk-button-primary uk-modal-close btn-modal" type="button"
              @click="changeProductQuantityRefudInvoiced()">
              Si
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="button-position uk-flex uk-flex-between btn-position">
      <div class="btn-style">
        <button type="button" uk-toggle="target: #products" :disabled="btnSave"
          class="uk-button uk-button-primary btn-style">
          Crear Factura
        </button>
      </div>
      <div class="btn-style">
        <button :disabled="btnInvoices" type="button" class="uk-button uk-button-primary btn-style"
          @click="printInvoicesBluetooth()">
          <!-- Descargar Facturas -->
          Imprimir
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
import { PrintV } from "printv";
import { hostEnum, loginOdooEnum } from '../types'
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
      hostEnum,
      loginOdooEnum, 


      isChangeQuantity: {
        changeQuantity: null,
        exception: false,
        order_num: null,
      },
      btnSave: false,
      btnInvoices: true,
      productOrder: null,
      orderQuantity: null,
      staticQuantity: null,
      order_lines: null,
      customerDetails: null,
      NewOrdersQuantyti: [],
      showUpdating: [],
      orderStoreQuantity: [],
      idInvoices: {
        orderId: null,
        loadsId: null
      },
      isOriginalValue: true,
      dataPrinter: null,
      invoiceStructure:
        "[L]\n" +
        "[L]{{invoice_partner_display_name}}\n{{partner_address}}\n\n\n" +
        "[L]<b>Factura {{name}}</b>\n" +
        "[L]<b>Fecha de Factura</b> {{invoice_date}}\n" +
        "[L]<b>Fecha de Vencimiento</b> {{invoice_date_due}}\n" +
        "[L]<b>Origen</b> {{invoice_origin}}\n" +
        "[C]<b>------------------------------------------------</b>\n" +
        "[L]<b> Descripcion </b>[L]<b> Cantidad </b>[R]<b> Unitario </b>[R]<b> Importe </b>\n\n" +
        "{{products}}" +
        "[C]<b>------------------------------------------------</b>\n" +
        "[L][L][R]<b>Subtotal</b> RD${{subtotal}}\n" +
        "[L][L][R]--------------------------\n" +
        "[L][L][R]<b>ITBS</b>     RD${{amount_tax}}\n" +
        "[L][L][R]--------------------------\n" +
        "[L][L][R]<b>Total</b>    RD${{amount_total}}\n" +
        "[L][L][R]<b>--------------------------</b>\n" +
        "[L] \n" +
        "[L]Por favor utilice la siguiente referencia al realizar su pago\n\n" +
        "[L]<b>{{payment_reference}}</b>\n\n" +
        "[R]Plazo  de pago: Pago inmediato \n" +
        "[L]\n" +
        "[L]\n" +
        "[C]<b>------------------------------------------------</b>\n" +
        "[R]Firma   \n",
    };
  },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  async beforeMount() {
    this.setOpen(true);
    if (this.invoicesIdStore.orderId) {
      this.idInvoices = this.invoicesIdStore
    } else {
      this.idInvoices = JSON.parse(localStorage.getItem("getOrdersToInvoicesId"))
    }
    try {
      const signIn = {
        jsonrpc: "2.0",
        params: { login: loginOdooEnum.login, password: loginOdooEnum.password },
      };
      await axios.post(
        `${hostEnum?.odoo}/api/exo/auth/sign_in`,
        signIn,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
    if (!this.orderScan?.length) {
      let orders = JSON.parse(localStorage.getItem("scanOrder"));
      this.$store.commit("scanOrder", orders);
    }
    localStorage.removeItem("SummaryInvoice");
    await this.productsOfOrders();

    this.setOpen(false);
  },
  computed: {
    ...mapGetters([
      "invoicesIdStore",
      "structureToScan",
      "isChangeQuantityStore",
      "orderScan",
      "loadStore",
      "createToInvoiceStore",
    ]),
  },

  methods: {
    async productsOfOrders() {
      try {
        this.setOpen(true);

        const result = await axios.get(
          `${hostEnum?.odoo}/api/order/${this.idInvoices.orderId}/`,
          { withCredentials: true }
        );
        this.order_lines = result.data.result.data.order_lines;
        this.customerDetails = result.data.result.data;
        this.NewOrdersQuantyti = result.data.result.data.order_lines.map(
          (x, i) => {
            this.orderScan[i]?.products.forEach((z) => {
              this.orderStoreQuantity.push(z.quantity);
            });
            this.orderQuantity = x.qty_to_deliver;
            this.productOrder = x;
 
              if (this.orderScan[i]?.products?.some(order => order.name == x.productId && order.quantity !== x.qty_to_deliver)) {
              this.isChangeQuantity.exception = true;
              this.isChangeQuantity.changeQuantity = x.qty_to_deliver;
              this.isChangeQuantity.order_num = this.customerDetails?.order?.name;
              localStorage.setItem(
                `isChangeQuantity${this.customerDetails?.order?.name}`,
                JSON.stringify(this.isChangeQuantity)
              );
              this.$store.commit(
                "getChageQuantityToProduct",
                this.isChangeQuantity
              );
            } else if (
                this.order_lines?.every((x) => this.orderScan[i]?.products?.some(order => order.name == x.productId && order.quantity === x.qty_to_deliver))
            ) {
              localStorage.removeItem(
                `isChangeQuantity${this.orderScan[0].order_num}`
              );
              this.$store.commit("getChageQuantityToProduct", {
                exception: false,
                changeQuantity: null,
                order_num: null,
              });
            }
            
            return x.qty_to_deliver;
          }
        );
       
        if (!this.customerDetails?.order?.can_refund){ 
          this.btnSave = true;
          this.btnInvoices = false;
        } else {
          this.btnSave = false;
          this.btnInvoices = true;
        }

        this.setStructureInvoices(null, this.productOrder);

        if (this.isChangeQuantityStore.exception) {
          this.isChangeQuantity.changeQuantity =
            this.isChangeQuantityStore.changeQuantity;
        } else if (
          localStorage.getItem(
            `isChangeQuantity${this.customerDetails?.order?.name}`
          )
        ) {
          this.isChangeQuantity = JSON.parse(
            localStorage.getItem(
              `isChangeQuantity${this.customerDetails?.order?.name}`
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
      let contProductsOdoo = 0;
      this.order_lines?.forEach((x) => {
        if (!x.isRewardLine && x.productQuantityToInvoice === 0) {
          contProductsOdoo++;
        } else if (x.isRewardLine) {
          contProductsOdoo++;
        }
      });
      if (this.order_lines.length === contProductsOdoo) {
        this.isOriginalValue = true;
      } else {
        this.isOriginalValue = false;
      }
      this.setOpen(false);

    },

    async changeProductQuantityRefudInvoiced() {
      this.setOpen(true);
      let quantityLocal = [];
      const order_lines = this.order_lines.map((orderOdoo) => {
        quantityLocal.push(orderOdoo.qty_to_deliver);
       
        if (
          this.orderScan.find((prod) =>
            prod.products.find(
              (product) =>
                product.name == orderOdoo.productId &&
                this.orderStoreQuantity.every(qty => qty !== orderOdoo.qty_to_deliver) 
            )
          )
        ) {
          return {
            order_line_id: orderOdoo.line_id,
            set_qty: orderOdoo.qty_to_deliver,
          };
        } else {
          return {
            order_line_id: orderOdoo.line_id,
            set_qty: orderOdoo.qty_to_deliver,
          };
        }

      });
      this.isChangeQuantity.changeQuantity = quantityLocal;
      this.isChangeQuantity.exception = true;
      this.isChangeQuantity.order_num = this.customerDetails?.order?.name;
      this.$store.commit("getChageQuantityToProduct", this.isChangeQuantity);
      localStorage.setItem(
        `isChangeQuantity${this.customerDetails?.order?.name}`,
        JSON.stringify(this.isChangeQuantity)
      );
      this.$store.commit("isCreateToInvoice", true);

      localStorage.setItem(
        `isCreateToInvoice${this.customerDetails?.order?.name}`,
        JSON.stringify(true)
      );
      this.showUpdating = [];
        this.setOpen(false);
    

      await this.createRefudInvoices(order_lines.filter((x) => x != undefined));
    },

    async createRefudInvoices(changeRefundQty) {
      try {
        await axios.patch(
          `${hostEnum?.odoo}/api/order/${this.idInvoices.orderId}/`,
          {
            params: {
              load_map_id: this.idInvoices.loadsId,
              order_lines: changeRefundQty,
            },
          },
          { withCredentials: true }
        );
        this.btnSave = true;
        this.btnInvoices = false;
        await this.productsOfOrders();
      } catch (error) {
        console.log(error);
        await this.productsOfOrders();
        this.setOpen(false);
      }
    },

    async printInvoicesBluetooth() {
      this.setOpen(true);
      this.summary();
      let selectedInvoicesId = [];
      this.customerDetails.invoices.forEach((x) => {
        selectedInvoicesId.push(x.id.toString());
      });
      let downloadInvoicesId = selectedInvoicesId.join();
      this.getInvoicesPrint(downloadInvoicesId);
      this.btnInvoices = false;
      if (!this.loadStore?.scanningRequired) {
        this.$router.push({ name: "delivery-actions-auto" }).catch(() => {});
      } else {
        this.$router.push({ name: "deliveryActions" }).catch(() => {});
      }
      let dwlStatus = {
        status: true,
        order: this.customerDetails?.order?.name,
      };
      this.$store.commit("getInvoiceDownload", dwlStatus);
      localStorage.setItem(`getInvoiceDownload${this.customerDetails?.order?.name}`, JSON.stringify(dwlStatus))
      await this.productsOfOrders();

      this.setOpen(false); 
    },

    showproductQuantityToInvoice(
      signo,
      value,
      amountCompare,
      product,
      staticQty
    ) {
      if (signo === "plus" && value == amountCompare) {
        if (
          this.order_lines.every(
            (x, i) => x.qty_to_deliver === this.orderStoreQuantity[i]
          ) ||
          this.order_lines.every(
            (x, i) => x.qty_to_deliver === this.NewOrdersQuantyti[i]
          )
        ) {
          this.showUpdating = [];
        } else {
          this.showUpdating.splice(0, 1);
        }
      } else if (signo === "plus" && !this.isChangeQuantity.changeQuantity) {
        this.showUpdating.push(value);
      } else if (signo === "plus" && value < amountCompare) {
        this.showUpdating.push(value);

      } else if (signo === "min" && value == amountCompare) {
        if (
          this.order_lines.every(
            (x, i) => x.qty_to_deliver === this.orderStoreQuantity[i]
          ) ||
          this.order_lines.every(
            (x, i) => x.qty_to_deliver === this.NewOrdersQuantyti[i]
          )
        ) {
          this.showUpdating = [];
        } else {
          this.showUpdating.splice(0, 1);
        }
      } else {
        this.showUpdating.push(value);
      }

      this.orderQuantity = value;
      this.staticQuantity = staticQty;
      this.productOrder = product;
      let contProductsOdoo = 0;
      this.order_lines.forEach((x) => {
        if (!x.isRewardLine && x.productQuantityToInvoice === 0) {
          contProductsOdoo++;
        } else if (x.isRewardLine) {
          contProductsOdoo++;
        }
      });
      if (this.order_lines.length === contProductsOdoo) {
        this.isOriginalValue = true;
      } else {
        this.isOriginalValue = false;
      }
      this.setStructureInvoices(this.orderQuantity, this.productOrder);
    },

    async setStructureInvoices(quantity, product) {
      let structure = await this.setStructure(
        this.orderScan[0],
        [],
        [],
        quantity,
        product,
        this.order_lines
      );
      this.listOfOrders = structure.firstStructure;
      this.listOfOrderTotal = structure.secondStructure;
      let structureInvoices = {
        firstStructure: this.listOfOrders,
        secondStructure: this.listOfOrderTotal,
      };
      this.$store.commit("setStructureToScan", structureInvoices);
      localStorage.setItem("setStructureToScan", JSON.stringify(structureInvoices))
    },

    async getInvoicesPrint(valuePrint) {
      // try {
        let products = "";
        let plusData = []
        this.$store.commit("getInvoiceDetails", valuePrint);
        localStorage.setItem('invoiceDetails', JSON.stringify(valuePrint));
        console.log(valuePrint,'qqqqqqqqqq')
        const result = await axios.get(`${hostEnum?.odoo}/api/invoice/${valuePrint}/order/${this.idInvoices.orderId}/report/`, { withCredentials: true });
        let invoice = result.data.result.data;
        console.log(invoice,'wwwwwwwwwwwwwwwwww')
        invoice.products.forEach((product, i) => {
          let plus = ''
          let dataDescription = ''
          let dataQty = ''
          let dataPrice_unit = ''
          let dataPrice_subtotal = ''
          for (let x = 0; x <= product.description.length; x++) {
            if (x > 15 && product.description[x] != undefined) {
              plus += product.description[x]
               product.description.slice(x)
            } else if (product.description[x] != undefined) {
              dataDescription += product.description[x]
            }
            dataQty = product.invoiced_qty
            dataPrice_unit = product.price_unit
            dataPrice_subtotal = product.price_subtotal
          }
          plusData.push(plus)
           if(product.description.length < 15) {
            dataDescription +=  this.characterControl(product.description.length, 15, true)
          } 
         
          if (product.invoiced_qty < 100) {
            dataQty += this.characterControl(dataQty,3,false,'qty')
          }
          if (product.price_unit) {
            let qtySlice = null
            if (JSON.stringify(dataPrice_unit).split('').some(x => x == '.')) {
              let deletePoint = JSON.stringify(dataPrice_unit).split('').filter((item) => item !== '.')
              qtySlice = JSON.parse(deletePoint.join('') )
           } else {
              qtySlice = dataPrice_unit
            }
            dataPrice_unit += this.characterControl(qtySlice,4,false,'unit')
          }
          
          product.description = dataDescription
          product.qty = dataQty
          product.price_unit = dataPrice_unit
          product.price_subtotal = dataPrice_subtotal
          products += "[L]" + product.description + "[R] " + product.qty + "[R] RD$" +product.price_unit + "[R] RD$" +product.price_subtotal + "\n" + plusData[i] + "\n\n";
        });
        let template = this.invoiceStructure
          .replace("{{name}}", invoice.name)
          .replace("{{invoice_date}}", invoice.invoice_date)
          .replace("{{invoice_date_due}}", invoice.invoice_date_due)
          .replace("{{invoice_origin}}", invoice.invoice_origin)
          .replace("{{subtotal}}", this.separatorNumber(invoice.subtotal))
          .replace("{{amount_tax}}", this.separatorNumber(invoice.amount_tax))
          .replace("{{amount_total}}", this.separatorNumber(invoice.amount_total))
          .replace("{{payment_reference}}", invoice.payment_reference)
          .replace(
            "{{invoice_partner_display_name}}",
            invoice.invoice_partner_display_name
          )
          .replace("{{partner_address}}", invoice.partner_address)
          .replace("{{products}}", products)
        this.dataPrinter = template;
        this.testingPrint();
      // } catch (error) {
      //   console.log(error, "error print");
      // }
    },
    characterControl(qty, maxQty, text, type) {
      let data = ''
      let i = 0
      if (text) {
        i = qty
      } else {
 
        if (qty < 10) {
          i = 0
        } else if (qty >= 10 && qty < 100 && type == 'qty'){
          i = 1
        } else if (qty >= 10 && qty < 100 && type == 'unit') {
          i = 1
        } else if (qty >= 100 && qty < 1000) {
          i = 2
        } else if (qty >= 1000 && qty < 10000) {
          i = 3
        } else (
          i = 5
        )
      }
      for (i; i <= maxQty; i++) {
        data += ' '
      }
      return data
    },

    testingPrint() {
      PrintV.blPrint({ value: this.dataPrinter });
    },

    summary () {
       let selectedInvoicesId = []
      this.customerDetails.invoices.forEach(x => {
      selectedInvoicesId.push( x.id.toString())
      })
      let summaryInvoice = {
        orderId :  this.customerDetails.order.name,
        summarys: selectedInvoicesId
      }
      this.$store.commit("getSummaryInvoice", summaryInvoice);
      localStorage.setItem(`SummaryInvoice`,JSON.stringify(summaryInvoice));
      this.$router.push({ name: "summary" }).catch(() => {});
    }
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
  width: 27%;
}
.td-text {
  padding: 10px 5px !important;
}
.text-size {
  font-size: 17px !important;
}
.th-text {
  text-align: center;
  width: 45%;
  }
  .h6-text {
      width: 30% !important;
  }
  .th-text-space {
    text-align: center;
      width: 15% !important;
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
.show-active {
  color: red;
  font-weight: bold;
  font-size: 16px;
}
.show-active2 {
  color: red;
  font-weight: bold;
  font-size: 16px;
}

.button-cancel {
  background: #de2828;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
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
h4 {
  margin-bottom: 0px !important;
}
.text-returns {
  margin-bottom: 0px !important;
}
.subtitle {
  font-size: 12px;
  margin-top: 0px;
  color: #6d6f7f;
}
.btn-style {
  padding: 10px;
  font-size: 10px;
}
.btn-retorn {
  padding: 10px;
  font-size: 10px;
  color: #fff;
  background-color: #de2828;
}
.btn-modal {
  font-size: 17px;
  font-weight: 600;
}
.details-order {
  padding: 0px 8px 8px;
}
.table-thead {
  display: flex;
  justify-content: space-around;
}
.quantity-adjustment {
  background-color: #efb5b5;
  padding: 5px;
}
.order {
  display: flex;
  align-items: center;
}
.order-space {
  justify-content: space-around;
}
.uk-table-hover tbody tr:hover  {
  background-color: #efefef;
}
.total {
  text-decoration: line-through;
}
@media (min-width: 550px) {
  .details-order {
    max-width: 550px;
  }
  .btn-position {
    justify-content: center !important;
  }
  .table-scroll {
    height: 320px !important;
  }
  .web-title-small {
    font-size: 20px;
  }
  .web-sub-title-small {
    font-size: 18px;
  }

  p strong {
    font-size: 16px !important;
  }
  span {
    font-size: 16px !important;
  }
  td {
    font-size: 16px !important;
  }
  .btn-style {
    font-size: 13px;
    margin: 0px 35px;
  }
}
@media (min-width: 767px) {
  .order {
    margin-left: 42px;
  }
  .f-span {
    align-items: center;
  }
}
@media (min-width: 1439px) {
  .order {
    padding-left: 52px;
  }
}
</style>
