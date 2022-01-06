<template>
  <div class="uk-container uk-text-left">
    <div>
      <h4 class="uk-text-small">Detalles</h4>
      <div
     
        class="uk-card uk-card-default uk-card-body uk-width-1-2@m"
        style="padding: 0px 8px 8px"
      >
        <p><strong>Orden:</strong>&nbsp;<span>{{customerDetails?.name}}</span></p>
        <p><strong>Dirección:</strong>&nbsp;<span>{{customerDetails?.delivery_address?.full_address}}</span></p>
        <p><strong>Cliente:</strong>&nbsp;<span>Juan Perez</span></p>
        <p><strong>Total:</strong>&nbsp;<span>{{customerDetails?.amount_total}}</span></p>
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
          <tbody v-for="product in order_lines" :key="product">
            <tr>
              <td class="uk-table-small  ">{{product.productName}}</td>
              <td class=" ">{{product.currencySymbol}}{{product.price}}</td>
              <td class=" ">{{product.productQuantity}}</td>
              <font-awesome-icon icon="plus" class="Space font-awesome" @click="product.productQuantity += 1, showButton()" />
               <font-awesome-icon icon="minus"  class="Space font-awesome" @click="product.productQuantity -= 1, showButton()" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>

<!-- This is the modal -->
<div id="Products" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <h5 class="uk-modal-title">Verificacion</h5>
        <div class="uk-margin">
          <p>Esta seguro que desea guardar los cambios</p>
        </div>
        <div class="uk-flex uk-flex-around ">
            <div>
              <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            </div>
            <div>
            <button class="uk-button uk-button-primary uk-modal-close" type="button" @click="productQuantityChange()">Save</button>
            </div>
        </div>
    </div>
</div>
<!-- <img src="'../assets/products.png'" alt=""> -->
<div class="uk-margin-top">
      <button v-if="buttonShow" uk-toggle="target: #Products" type="buttom" class="uk-button">
        Guardar
      </button>
    </div>
    <div class="uk-margin-top  button-position">
      <button type="buttom" class="uk-button" @click="alertButtom()">
        Crear Factura
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import {} from '../assets/products.png'
import { mapGetters } from 'vuex'
export default {
  alias: "Detalles de la Orden",
  data() {
    return {
      cont: null,
      buttonShow: null,
      total: null,
      order_lines: null,
      customerDetails: null,
    };
  },
  async mounted () {
    await this.products()
  },
  computed: {
    ...mapGetters(["invoicesIdStore"])
  },
  methods: {
 
    alertButtom(){
      alert('cargando factura')
    },
     async products () {
        const result = await axios.get(`https://jabiyaerp.flai.com.do/api/order/${this.invoicesIdStore}`, {withCredentials: true })
        console.log(result.data.result.data.order, 'producto')
        this.order_lines = result.data.result.data.order_lines
        this.customerDetails = result.data.result.data.order
      },
    
    async productQuantityChange (){
      this.buttonShow = false
      //  const chageQuantity = {
      //     "params": {
      //         "order_lines": [{"order_line_id": 186, "qty": 5} ]
      //     }
      // }
// ${this.invoicesIdStore}
      const result = await axios.patch('https://jabiyaerp.flai.com.do/api/order/71', {withCredentials: true }, {
          "params": {
              "order_lines": [{"order_line_id": 186, "qty": 5} ]
          }
      })
     console.log(result)

    },
    showButton () {
      this.buttonShow = true
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
/* th{
  padding: 0px;
} */

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
button{
 background-color: #2a307c !important;
 color: #fff;
 width: 100%;
}
.button-position{
  position: fixed;
  bottom: 10px;
  right: 91px;
}


</style>
