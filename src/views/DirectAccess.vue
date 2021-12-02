<template>
  <div>
      <ul class="container uk-flex uk-flex-wrap">
          <h5 class="uk-margin-top uk-width-1-1">Clickee la Acción que Desea Realizar</h5>
          <li class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/box-truck.png" alt="">
                <p><strong>Tus Cargas</strong></p>
          </li>
          <li class="action uk-width-1-2" @click="changeRoute('scan-order')">
              <img src="../assets/boxes.png" alt="">
                <p><strong>Entregar Ordenes</strong> </p>
          </li>
          <li class="action uk-width-1-2" @click="changeRoute()">
               <img src="../assets/invoice.png" alt="">
                <p><strong>Procesar Factura</strong> </p>
          </li>
          <li class="action uk-width-1-2" @click="changeRoute()">
              <img src="../assets/almacen.png" alt="">
                <p><strong>Reconciliacion con Almacén</strong></p>
          </li>
      </ul>
  </div>
</template>

<script>
export default {
    methods: {
        changeRoute(val){
            this.$router.push({name: val})
        }
    },

}
</script>

<style scoped>
.container{
    list-style: none;
    padding: 10px 0px;
}
.action{
    margin: 15px 0px 40px;
    padding: 10px;
}
.action img{
    width: 40%;
}
.action-element{
    font-size: 13px;
}
</style>