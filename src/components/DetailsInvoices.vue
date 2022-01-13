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
        <p><strong>Total:</strong>&nbsp;<span>{{customerDetails?.currencySymbol}}{{customerDetails?.amount_total}} <span v-if="showUpdating">Se recalcula al guardar tus cambios</span></span></p>
      </div>
    </div>
      <h4  class="uk-text-small">Lista de Productos</h4>
  <div>
      <div class="uk-card uk-card-default uk-card-body" style="padding: 0 8px">
        <table class="uk-table uk-table-small uk-table-hover uk-table-divider uk-text-center">
          <thead>
            <tr class="">
              <th>Producto</th>
              <th>Precio</th>
              <th>Cant.</th>
            </tr>
          </thead>
          <tbody v-for="(product, i) in order_lines" :key="product">
            <tr>
              <td class="uk-table-small  ">{{product.productName}}</td>
              <td class=" ">{{product.currencySymbol}}{{product.price}}</td>
              <td :class="{showActive: product.productQuantity !== NewOrdersQuantyti[i]}">{{product.productQuantity}}</td>
              <font-awesome-icon icon="plus" class="Space font-awesome" @click="product.productQuantity += 1 && product.productQuantity < NewOrdersQuantyti[i], showButton(product.productQuantity, i)" />
               <font-awesome-icon icon="minus"  class="Space font-awesome" @click="product.productQuantity -= 1, showButton(product.productQuantity,i)" />
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
<div id="Products" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <h5 class="uk-modal-title">verificación</h5>
        <div class="uk-margin">
          <p>Esta seguro que desea guardar los cambios</p>
        </div>
        <div class="uk-flex uk-flex-between">
            <div>
              <button id="cancel" class="uk-button uk-modal-close button-cancel show-modal" type="button">Cancelar</button>
            </div>
            <div>
            <button class="uk-button button-position-save uk-modal-close  show-modal" type="button" @click="productQuantityChange()">Modificar</button>
            </div>
        </div>
    </div>
</div>
<div class="button-position uk-flex uk-flex-between">
<div class="uk-margin-top">
      <button v-if="buttonShow" uk-toggle="target: #Products" type="buttom" class="uk-button button-position-save">
        Guardar
      </button>
    </div>
    <div class="uk-margin-top">
      <button type="buttom" class="uk-button button-position-save" @click="alertButtom()">
        Crear Factura
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
    timeout: { type: Number, default: 1000 },
  },
  data() {
    return {
      cont: null,
      buttonShow: false,
      total: null,
      order_lines: null,
      customerDetails: null,
      NewOrdersQuantyti: [],
      showUpdating: false
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
    ...mapGetters(["invoicesIdStore"]),

  
  },
  methods: {
      async productsOfOrders () {
        const result = await axios.get(`https://jabiyaerp.flai.com.do/api/order/${this.invoicesIdStore}`, {withCredentials: true })
        console.log(result.data.result.data, 'productsOfOrders')
        this.order_lines = result.data.result.data.order_lines
        this.NewOrdersQuantyti = result.data.result.data.order_lines.map(x => {
          return x.productQuantity
        })
        this.customerDetails = result.data.result.data.order
      },
    
    async productQuantityChange (){
      this.buttonShow = false
      this.setOpen(true);

       const order_lines = this.order_lines.map(x => { 
        return {order_line_id: x.line_id, qty: x.productQuantity}
      })

     await this.servicesToapi (order_lines)
    },

    async servicesToapi (orderLine) {
       const result = await axios.patch(`https://jabiyaerp.flai.com.do/api/order/${this.invoicesIdStore}`, {
        params: {
          order_lines: orderLine
        }
       }, {withCredentials: true })
       console.log(result, 'productQuantityChange')
       await this.productsOfOrders()
    },
    showButton (value, index) {
     
      console.log(value, 'value')
      console.log(index, 'index')
      console.log(this.NewOrdersQuantyti, 'this.NewOrdersQuantyti')
      if (this.NewOrdersQuantyti.some(x => x === value)) {
      this.buttonShow = false
      this.showUpdating = false
      } else {
         this.buttonShow = true
      this.showUpdating = true
      }
      
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

td{
  padding: 5px 0px 6px;
  width: auto;
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
   background-color: #2a307c !important;
 color: #fff;
}
.show-save {
 margin: 20px 0px 5px;
}
.showActive{
  background-color: rgb(208 241 217);
}
.show-modal{
  padding: 0px 10px;
}
.button-cancel{
  border-style: outset;
}

</style>
