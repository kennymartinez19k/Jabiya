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
        <p><strong>Orden:</strong>&nbsp;<span>{{customerDetails?.name}}</span></p>
        <p><strong>Dirección:</strong>&nbsp;<span>{{customerDetails?.delivery_address?.full_address}}</span></p>
        <p><strong>Cliente:</strong>&nbsp;<span>{{customerDetails?.client}}</span></p>
        <p><strong>Total:</strong>&nbsp;<span>{{customerDetails?.currencySymbol}}{{customerDetails?.amount_total}} 
          <span v-if="showUpdating.length > 0" :class="{recalculating:showUpdating.length > 0}">Se recalcula al guardar tus cambios</span></span></p>
      </div>
    </div>
      <h4  class="uk-text-small">Lista de Productos</h4>
  <div>
      <div class="uk-card uk-card-default uk-card-body table-scroll" style="padding: 0 8px">
        <table class="uk-table uk-table-small uk-table-hover uk-table-divider uk-text-center">
          <thead>
            <tr class="title">
              <th>Producto</th>
              <th>Precio</th>
              <th>Cant.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, i) in order_lines" :key="product">
              <td class="uk-table-small  ">{{product.productName}}</td>
              <td class=" ">{{product.currencySymbol}}{{product.price}}</td>
              <td :class="{showActive: product.productQuantity !== NewOrdersQuantyti[i]}">{{product.productQuantity}}</td>
              <span >
              <font-awesome-icon icon="plus" class="Space font-awesome" @click="product.productQuantity += 1 && product.productQuantity < NewOrdersQuantyti[i], showProductQuantity(product.productQuantity, NewOrdersQuantyti[i], product)" />
               <font-awesome-icon icon="minus"  class="Space font-awesome" @click="product.productQuantity -= 1, showProductQuantity(product.productQuantity, NewOrdersQuantyti[i], product)" />
              </span>
              <!-- <pre>{{product.productQuantity}} </pre> -->
            </tr>
            
          </tbody>
          <!-- <tfoot>
            <td>Anterior</td>
            <td class="uk-text-right">1/1</td>
            <td></td>
            <td>Siguiente</td>
          </tfoot> -->
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
              <button id="cancel" class="uk-button uk-modal-close button-cancel " type="button">Cancelar</button>
            </div>
            <div>
            <button class="uk-button uk-button-primary uk-modal-close" type="button" @click="productQuantityChange()">Modificar</button>
            </div>
        </div>
    </div>
</div>
<!-- This is the modal -->
<div id="invoices" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-margin">
          <h5>Factura</h5>
          <p>Esta seguro que desea guardar los cambios</p>
        </div>
        <div class="uk-flex uk-flex-right">
            <div>
            <button class="uk-button uk-button-primary uk-modal-close" type="button" @click="createInvoice()">Imprimir</button>
            </div>
        </div>
    </div>
</div>
<div class="button-position uk-flex uk-flex-between">
    <div class="uk-margin-top">
      <button type="button" uk-toggle="target: #products" :disabled="btnSave"  class="uk-button uk-button-primary">
       Guardar
      </button>
    </div>
    <div class="uk-margin-top">
      <button :disabled="btnInvoices" uk-toggle="target: #invoices" type="button" class="uk-button uk-button-primary">
        Crear Factura
      </button>
    </div>
     <div class="uk-margin-top">
      <button :disabled="btnScan" type="button" class="uk-button uk-button-primary" @click="ScanOrder()">
        Escanear 
      </button>
    </div>
</div>

  </div>
</template>

<script>
import axios from 'axios'
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";
import { mapGetters } from 'vuex'
export default {
  alias: "Detalles de la Orden",
    components: {
    IonLoading
  },
    props: {
    timeout: { type: Number, default: 15000 },
  },
  data() {
    return {
      cont: null,
      btnSave: true,
      btnInvoices: false,
      btnScan: true,
      total: null,
      order_lines: null,
      customerDetails: null,
      NewOrdersQuantyti: [],
      showUpdating: [],
    };
  },
   setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  async beforeMount() {
    this.setOpen(true);
    await this.productsOfOrders()
  },
 
  computed: {
    ...mapGetters(["invoicesIdStore", "structureToScan"]),

  
  },
  watch: {
    btnSave: {
      handler: function (newVal) {
        if (!newVal) {
          this.btnScan = true
          this.btnInvoices = true
        } else {
          this.btnInvoices = false
        }

      }, deep: true
    }

  },
  methods: {
      async productsOfOrders () {
        const result = await axios.get(`https://jabiyaerp.flai.com.do/api/order/${this.invoicesIdStore}`, {withCredentials: true })
        this.order_lines = result.data.result.data.order_lines
        this.NewOrdersQuantyti = result.data.result.data.order_lines.map(x => {
          return x.productQuantity
        })
        this.customerDetails = result.data.result.data.order;
      this.setOpen(false);
     },
    
     async productQuantityChange (){
      this.btnSave = true
      this.btnInvoices = false
      this.setOpen(true);

      const order_lines = this.order_lines.map(x => { 
        return {order_line_id: x.line_id, qty: x.productQuantity}
      })

     await this.servicesToApi (order_lines)
    },

    async servicesToApi (orderLine) {
       const result = await axios.patch(`https://jabiyaerp.flai.com.do/api/order/${this.invoicesIdStore}`, {
        params: {
          order_lines: orderLine
        }
       }, {withCredentials: true })
       console.log(result, 'productQuantityChange')
       await this.productsOfOrders()
    },
    showProductQuantity (value, index, product) {
     
      console.log(value, 'value')
      console.log(index, 'index')
      console.log(this.NewOrdersQuantyti, 'this.NewOrdersQuantyti')
      if (value >= index) {
       this.btnSave = true
       this.showUpdating.splice(0, 1)
      } else {
        this.btnSave = false
        this.showUpdating.push(false)
      }
      this.setStructureInvoices(value, product)
    },
    createInvoice () {
      alert('imprimiendo')
      this.btnScan = false
      this.btnInvoices = true

    },
    ScanOrder () {
        this.$router.push({ name: "deliveryActions" }).catch(() => {});
    },
    setStructureInvoices (quantity, product) {
        console.log(quantity,'quantity')
        console.log(product,'product')
        console.log(this.structureToScan,'this.structureToScan')
      // this.structureToScan.firstStructure.forEach(x => {
      //   if (x !== product) {
      //     x.quantity = quantity
      //   }
      // });
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
.title {
  /* position: fixed; */
  background: white;
}

td{
  padding: 5px 0px 6px;
  width: 1%;
}
th{
  font-size: 10.5px;
  color: #000;
  font-weight: bold;
}
.font-awesome{
  font-size: 15px;
  margin: 6px 9px;
}

.button-position{
  position: fixed;
  bottom: 10px;
  right: 11px;
  width: 92%;
}
.button-position-save{
   background-color: #2a307c;
 color: #fff;
}
.show-save {
 margin: 20px 0px 5px;
}
.showActive{
  background-color: rgb(208 241 217);
}

.button-cancel{
  background: #930404;
  color: #fff
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
.disabled-status{
  background-color: #fff !important;
}

</style>
