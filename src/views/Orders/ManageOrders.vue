<template>
    <ion-loading
      :is-open="isOpenRef"
      cssClass="my-custom-class"
      message="Por favor Espere..."
      :duration="timeout"
      @didDismiss="setOpen(false)"
    >
    </ion-loading>
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
            <!-- <div class="item">
                <img src="../../assets/invoice.png" alt="">
                <p>Ordenes con Factura</p>
            </div> -->
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";
export default {
    alias: 'Manejo de Ordenes',
    components: {
      IonLoading,
    },
    data() {
        return {
            timeout: 10000
        }
    },

    async mounted(){

        this.setOpen(true)
        let result
        try{
            result = await this.$services.manageOrders.getOrders()
        }catch(error){
            result = []
        }
        this.$store.commit('setListOrders', result)
        this.setOpen(false)
    },
    setup() {
        const isOpenRef = ref(false);
        const setOpen = (state) => (isOpenRef.value = state);

        return { isOpenRef, setOpen };
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