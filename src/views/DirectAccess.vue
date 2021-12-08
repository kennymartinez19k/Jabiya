<template>
  <div>
      <ul class="container uk-flex uk-flex-wrap">
          <h5 class="title uk-margin-top uk-width-1-1 uk-text-center">Seleccione la Acción que Desea Realizar</h5>
          <li class="action uk-width-1-2" @click="changeRoute('home')">
              <img src="../assets/box-truck.png" alt="">
                <p><strong>Tus Cargas</strong></p>
          </li>
          <li class="action uk-width-1-2" @click="DeliveredOrders('scan-order')">
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
    data() {
    return {
      orders: [
        {
          numberOfOrders: 1234,
          numberOfBox: 2,
          client: "Juan Martinez Soto",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 08:22')
        },
        {
          numberOfOrders: 1223,
          numberOfBox: 2,
          client: "Maria Lisbeth Alcantara Rodriguez",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 10:22')
        },
        {
          numberOfOrders: 3321,
          numberOfBox: 2,
          client: "Albert Perez",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 12:22')
        },
        {
          numberOfOrders: 4324,
          numberOfBox: 2,
          client: "Jose Abreu Pichardo",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 14:22')
        },
        {
          numberOfOrders: 3753,
          numberOfBox: 2,
          client: "Albert Perez",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 16:22')
        },
        {
          numberOfOrders: 1027,
          numberOfBox: 2,
          client: "Jose Abreu Pichardo",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 18:22')
        },
        {
          numberOfOrders: 9120,
          numberOfBox: 2,
          client: "Juan Jose Garcia",
          address: "Alma Rosa calle abreu #17",
          timeToWait: "2020-01-23",
          completed: false,
          hour: new Date('2020-12-02, 20:22')
        },
      ],
      userLoads: [
        {
          date: new Date(),
          hour: "10:00 Am",
          status: "Asignada",
          client: "Juan Perez",
          numberOfOrden: 2177,
          zone: "Rep. de colombia",
          btnAction: "Cargar Vehiculo",
          icon: "color: #1f7a18",
        },
        {
          hour: "12:00 PM",
          status: "Entregada",
          client: "Maria Hernandez",
          numberOfOrden: 1883,
          zone: "Respaldo Rodeo",
          btnAction: "Ver Orden(es)",
          icon: "color: #000000",
        },
        {
          hour: "10:00 AM",
          status: "En Ruta",
          client: "Juan Perez",
          numberOfOrden: 2238,
          zone: "Rep. de colombia",
          btnAction: "Continuar Entrega(s)",
          icon: "color: #a7a7a7",
        },
        {
          hour: "10:00 AM",
          status: "En Ruta",
          client: "Juan Perez",
          numberOfOrden: 2833,
          zone: "Rep. de colombia",
          btnAction: "Continuar Entrega(s)",
          icon: "color: #a7a7a7",
        },
        {
          hour: "10:00 AM",
          status: "Despacho Aprobado",
          client: "Juan Perez",
          numberOfOrden: 2993,
          zone: "Rep. de colombia",
          btnAction: "Comenzar Entrega(s)",
          icon: "color: #c39108",
        },
      ],
    };
  },
    methods: {
        changeRoute(val){
            this.$router.push({name: val})
        },
        DeliveredOrders(val){
            this.$store.commit('setAllOrders', this.orders)
            this.$store.commit('setAllLoads', this.userLoads)

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
.title{
  margin: 20px 10px;
}
.action img{
    width: 40%;
}
.action-element{
    font-size: 13px;
}
</style>