<template>
    <div class="uk-flex uk-flex-column cnt">
        <ion-loading :is-open="isOpenRef" cssClass="my-custom-class" message="Por favor Espere..." :duration="timeout"
            @didDismiss="setOpen(false)">
        </ion-loading>
        <div class="stiky">
            <p class="web-font-small" style=" font-size: 13px; font-weight: 500">
                {{loadStore?.loadNumber}}
            </p>
            <div class="
          uk-flex
          uk-flex
          uk-flex-center
          uk-flex-left
          uk-margin-remove
          uk-padding-remove
        " style="align-items: center;">
                <div class="uk-flex uk-flex-wrap web-font-small">
                    <p style="margin-right: 10px !important">
                        <span class="font-weight-medium ">Shipper: </span><span>&nbsp; {{ shipperName(loadStore)
                        }}</span>
                    </p>
                    <div></div>
                    <p>
                        <span style="font-weight: 500">Destino:</span><span>&nbsp; {{ loadStore?.firstOrdenInfo?.sector
                        }}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="container-deliver uk-margin-top">
       
            <div class="uk-padding-small uk-width-1-1 container-item">
                <div v-for="order in ordersToDisplay" :key="order"
                    class="uk-card item-deliver uk-card-default uk-card-body uk-flex"
                    :class="{ ordenCompleted: order.completed, 'order-status': order?.status === 'Delivered' }">
             
                    <div class="uk-text-left info-user ">
                        <div class="btn uk-flex">
                            <div class="uk-flex uk-flex-column uk-text-left">
                                <p v-if="order.sendingInfo && order.status !== 'Delivered'" class="uk-width-1-1">
                                    <strong class="font-weight-medium web-font-small">Enviando Informacion</strong>
                                </p>
                                <p class="uk-width-1-1 web-font-small">
                                    <span class="font-weight-medium ">Cliente: </span>
                                    <span>{{ order.client_name }}</span>
                                </p>
                            </div>
                        </div>
                        <p style="margin-right: 10px !important" class="web-font-small">
                            <span class="font-weight-medium">Orden: </span><span>{{ order.order_num }}</span>
                        </p>
                        <div class="uk-flex uk-flex-wrap web-font-small">
                            <p>
                                <span class="font-weight-medium">Cajas / Pallets:
                                </span><span>{{order?.no_of_boxes}}</span>
                            </p>
                            <p class="web-font-small">
                                <span class="font-weight-medium uk-margin-medium-left">Escaneadas: </span><span
                                    :class="{'order-delivered': order?.status === 'Delivered'}">{{order.totalOrdersScanned}}/{{order.totalQuantity}}
                                </span>
                            </p>
                        </div>
                        <p class="uk-width-1-1 web-font-small">
                            <span class="font-weight-medium">Destino: </span>
                            <span>
                                <font-awesome-icon icon="map-marker-alt" /> {{ order.address}}
                            </span>
                        </p>

                    </div>

                    <div style="width: 100%">
                        <ul uk-accordion class="uk-margin-remove uk-padding-remove">
                            <!-- uk-open -->
                            <li class="uk-margin-remove">
                                <a class="uk-accordion-title web-font-small" href="#" @click="changeText()">{{
                                textAccordionProduct
                                }}</a>
                                <div class="uk-accordion-content uk-margin-remove uk-padding-remove">
                                    <div class="details-product">
                                        <p class="item web-font-small">
                                            <span class="font-weight-medium">Producto: </span>
                                        </p>
                                        <p class="item web-font-small">
                                            <span class="font-weight-medium">Codigo QR: </span>
                                        </p>
                                        <p class="item web-font-small">
                                            <span class="font-weight-medium">Escaneadas: </span>
                                        </p>
                                    </div>
                                    <div v-for="item in order.products" :key="item.id" class="details-product">
                                        <p class="item web-font-small">{{item?.description}}</p>
                                        <p class="item web-font-small">{{item.qrCode}}</p>
                                        <p class="item web-font-small">{{item.loadScanningCounter}}/{{item.quantity}}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>


                </div>

            </div>
        </div>
        <div class="button-opt">
            <button @click="mountLoadToB2B()" :disabled="btnDisabled"
                class="uk-button uk-button-primary web-font-small">{{textButton}}</button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { IonLoading } from "@ionic/vue";
import { ref } from "vue";
import { Mixins } from '../mixins/mixins'
import axios from "axios";
import { hostEnum } from '../types'
export default {
    alias: 'Detalles de las Ordenes',
    mixins: [Mixins],
    components: {
        IonLoading
    },
    setup() {
        const isOpenRef = ref(false);
        const setOpen = (state) => (isOpenRef.value = state);

        return { isOpenRef, setOpen };
    },
    data() {
        return {
            hostEnum,


            status: null,
            load: null,
            orders: null,
            completed: "background-color: #2a307c !important",
            listOrderDetails: [],
            listOfOrderTotal: [],
            textButton: 'Montar Viaje',
            timeout: 10000,
            ordersToDisplay: [],
            filterOrders: false,
            textAccordionProduct: 'Mostrar Productos',
            btnDisabled: false

        };
    },

    watch: {
       
        filterOrders: function (newVal) {
            this.filterByOrders(newVal)
        },
        orders: {
            handler: function (newVal) {
                if (newVal.every(x => x.isSelectedDeliver == true)) {
                    this.selectAllOrders = true
                } else {
                    this.selectAllOrders = false
                }
            }, deep: true
        },
    },
    computed: {
        ...mapGetters(["loadStore", "orderScan", "orderDetailsStore", "invoicesIdStore"]),

    },
    async mounted() {
        this.setOpen(true)
        try {
            this.load = await this.$services.loadsServices.getLoadDetails(this.loadStore.loadMapId);
            this.load.firstOrdenInfo = this.loadStore?.Orders[0]

        } catch (error) {
            if (this.loadStore?.loadMapId) {
                this.load = { ...this.loadStore };
            } else {
                this.load = JSON.parse(localStorage.getItem('DeliveryCharges'));
            }
        }
        this.$store.commit("setloadStore", this.load)
        this.orders = this.load?.Orders
        this.load.firstOrdenInfo = this.load?.Orders[0]
        this.orders = this.load?.Orders
        this.btnDisabled = false

        if (localStorage.getItem('sendInfoOrders')) {

            let sendingInfoOrders = JSON.parse(localStorage.getItem('sendInfoOrders'))

            let failSendInfo

            JSON.parse(localStorage.getItem('failSendInfo')) ?
                failSendInfo = JSON.parse(localStorage.getItem('failSendInfo'))
                : false


            this.orders?.forEach(order => {
                order.sendingInfo = sendingInfoOrders?.some(x => x == order.order_num)

                if ((order?.status == 'Delivered' && order?.sendingInfo) || failSendInfo) {
                    order.sendingInfo = false

                    let orders = []
                    if (localStorage.getItem('sendInfoOrders')) {
                        orders = JSON.parse(localStorage.getItem('sendInfoOrders'))
                    }

                    let orderForDelete = orders?.findIndex(x => x == order?.order_num)

                    if (orderForDelete > -1) {
                        orders.splice(orderForDelete, 1)
                    }

                    localStorage.setItem('sendInfoOrders', JSON.stringify(orders))

                    localStorage.removeItem('failSendInfo')

                }


            })
        }

        this.filterByOrders(false)
        this.setOpen(false)
       
        this.orders.map(x => {
            x.totalQuantity = 0
            x.totalOrdersScanned = 0

            x.products.forEach(z => {
                x.totalQuantity += z.quantity
                x.totalOrdersScanned += z.loadScanningCounter
            })
        })
        if (this.orderDetailsStore) {
            this.orderDetailsStore.forEach(x => {
                this.orders.forEach(order => {
                    if (!order.sendingInfo && order.order_num === x.order_num && !(order.products.every(prod => prod.loadScanningCounter >= prod.quantity))) {
                        order.isSelectedDeliver = true
                        this.orderForScan(order)
                    }
                })
            })
        }
        
        this.$store.commit("getInvoiceDownload", { status: false, order: null });
    },
    methods: {

        async mountLoadToB2B() {
            this.btnDisabled = true
            this.setOpen(true)
            await this.uploadOrDownload(this.load)
            this.setOpen(false)
            console.log('eilson')
            this.btnDisabled = false

        },
        

        shipperName(val) {
            var shipper = val?.shipper?.find(x => x.name)
            return shipper?.name
        },

        filterByOrders(val) {
            if (val) {
                this.ordersToDisplay = this.orders
            } else {
                this.ordersToDisplay = this.orders.filter(order => order.status != 'Delivered')
            }
        },

        changeText() {
            if (this.textAccordionProduct !== 'Mostrar Productos') {
                this.textAccordionProduct = 'Mostrar Productos'
            } else {
                this.textAccordionProduct = 'Ocultar Productos'
            }
        },

     

    },
};
</script>

<style scoped>
:root {
    --su-size-text: 12px;
}

p {
    margin: 2px 0px !important;
}

.button-opt {
    background: #ffffff !important;
    border-top: 1px solid #e2e2e2;
    width: 100%;
    position: absolute;
    bottom: 0px;
    display: flex;
    justify-content: space-around;
    padding: 10px 0px;
}

.button-opt button {
    line-height: 15px;
}

.uk-card {
    padding: 20px 10px;
}

.uk-card-body {
    flex-wrap: wrap;
    margin-bottom: 10px;
    padding: 10px 11px;
    border: 0.1px solid #e5e5e5;
}

.status {
    font-size: 12px;
}

.btn {
    display: flex;
    align-items: baseline;
    width: 100%;
    justify-content: flex-start;
}

.btn img {
    width: 30px;
    position: relative;
    top: -2px;
    margin-left: 5px;
}


.stiky {
    color: rgb(255, 255, 255) !important;
    z-index: 2;
    border-top: 1px solid #313575;
    font-size: 12px !important;
    padding: 0px 10px 5px !important;
    background: #2a307c;
    font-weight: 300 !important;
    text-align: center;
    box-shadow: 1px 0px 5px #898989;
}


.info-header {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.info-user {
    padding-right: 5px;
    width: 90%;
}

.ordenCompleted {
    background: rgba(18, 216, 18, 0.6);
}

.box-slide {
    background-image: url('../assets/parcel.png');
    background-size: 25px 25px;
    background-repeat: no-repeat;
    background-position: 81%
}

.select-all {
    align-items: center;
    padding: 10px 11px;
}

.select-all input {
    transform: scale(1.1);
}

.select-all input :focus-visible {
    outline: 0px dotted #333;
}

.select-all label {
    font-weight: 600;
}

li {
    list-style-type: none;
}

.uk-accordion-title {
    display: flex;
    margin: 5px 0px;
    font-size: 12px;
    color: #3880ff;
    padding: 5px;

}

.uk-accordion-title::before {
    content: "";
    margin-left: 7px;
    background-image: url('../assets/down.png');
    height: 17px;
    background-size: 14px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    padding-right: 18px;
}

.uk-open>.uk-accordion-title::before {
    transform: rotate(180deg);
}

.details-product {
    display: flex;
    justify-content: space-around;
}

.details-product .item {
    width: 33%;
}

.order-status {
    background: #e0fae080;
}

.order-delivered {
    font-weight: 700;
    color: green
}

header {
    height: 60px;
    /* 64 + 16px */
    position: sticky;
    -webkit-position: sticky;
    top: -16px;
    z-index: 1;
    text-align: center;
    -webkit-backface-visibility: hidden;
}

header::before,
header::after {
    content: '';
    display: block;
    height: 16px;
    position: sticky;
    -webkit-position: sticky;
}

/* SHADOW */
header::before {
    top: 28px;
    /* shadow is at bottom of element, so at 48 + 16 = 64px */
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
}

/* COVER */
header::after {
    background: linear-gradient(white 10%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.4) 70%, transparent);
    z-index: 2;
}

.uk-padding-small {
    padding: 0px 15px 15px;
}

.container-item {
    margin-bottom: 40px
}

@media (min-width: 600px) {
      .container-deliver {
        width: 90%;
        margin: 10px auto
    }

    .container-item {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 45px !important;
    }

    .item-deliver {
        width: 100%;
    }
}

@media (min-width: 900px) {
    .item-deliver {
        width: 49%;
    }
}
</style>
