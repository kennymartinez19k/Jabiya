<template>
    <div>
        <div class="uk-card uk-padding uk-flex uk-flex-between uk-flex-wrap">
            <div class="item" @click="changeRoute('order-registration')">
                <img src="../../assets/online-shopping.png" alt="">
                <p>Crear Orden</p>
            </div>
            <div  @click="changeRoute('list-orders')" class="item">
                <img src="../../assets/check-list.png" alt="">
                <p>Ver Todas las Ordenes</p>
            </div>
            <div class="item">
                <img src="../../assets/invoice.png" alt="">
                <p>Ordenes con Factura</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    alias: 'Manejo de Ordenes',

    async mounted(){
        let result = await this.$services.manageOrders.getOrders()
        console.log(result)
    },
    methods:{
        changeRoute(path){
            this.$router.push({name: path})
        }
    }

}
</script>

<style scoped>
.item{
 width: 120px;
 min-width: 110px;
 margin-bottom: 50px;
}
img{
    width: 50%;
}
</style>