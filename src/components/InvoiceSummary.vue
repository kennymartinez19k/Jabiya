<template>
    <div class="container">
        <ion-loading :is-open="isOpenRef" cssClass="my-custom-class" message="Por favor Espere..." :duration="timeout"
            @didDismiss="setOpen(false)">
        </ion-loading>
        <ul uk-accordion>
            <li>
                <a class="uk-accordion-title web-font-small " href="#">Resumen De Factura</a>
                <div class="uk-accordion-content">
                    <table class="uk-table uk-table-striped uk-table-divider uk-table-hover">
                        <thead>
                            <tr>
                                <th class="web-font-small">Fecha</th>
                                <th class="web-font-small">sub-total</th>
                                <th class="web-font-small">itbs</th>
                                <th class="web-font-small">total</th>
                            </tr>
                        </thead>
                        <tbody v-for="(info, index) in summary?.invoices" :key="info">
                            <tr :id="index" :class="{ 'refund-invoice': info.moveType == 'out_refund' }">
                                <td class="web-font-small">{{ info.invoiceDate }} <br><span
                                        v-if="info.moveType == 'out_refund'">Reembolso</span></td>
                                <td class="web-font-small">{{ info.taxExcluded }}</td>
                                <td class="web-font-small">{{ info.total - info.taxExcluded }}</td>
                                <td class="web-font-small">{{info.total}}</td>
                            </tr>

                        </tbody>
                    </table>
                    <div class="uk-text-right uk-margin-top">
                        <h6 class="web-font-small"><span>Total Sin Impuestos:</span> <span>{{ summary?.currency }} {{
                                summary?.totalTax }}</span></h6>
                        <h6 class="web-font-small"><span>Impuestos:</span> <span>{{ summary?.currency }} {{
                                summary?.total - summary?.totalTax }}</span></h6>
                        <h6 class="web-font-small"> <span> Total: </span> <span class="opertion">{{ summary?.currency }}
                                {{ summary?.total }}</span></h6>
                    </div>
                </div>
            </li>

            <li>
                <a class="uk-accordion-title web-font-small " href="#">Detalles de la Factura de la Orden&nbsp;<b> {{ invoiceDetails?.invoice_origin }}</b></a>
                <div class="uk-accordion-content">
                    <p class="uk-text-left uk-margin-left">{{ invoiceDetails?.invoice_partner_display_name}} </p>
                    <p class="uk-text-left uk-margin-left">{{ invoiceDetails?.partner_address}} </p>
                    <h6><b>Factura: </b> {{ invoiceDetails?.name}} </h6>
                    <h6><b>Fecha de Factura:</b> {{ invoiceDetails?.invoice_date}} </h6>
                    <h6><b>Fecha de Vencimiento: </b>{{ invoiceDetails?.invoice_date_due}} </h6>
                    <table class="uk-table uk-table-striped uk-table-divider uk-table-hover">
                        <thead>
                            <tr>
                                <th class="web-font-small">Descripción</th>
                                <th class="web-font-small">Cantidad</th>
                                <th class="web-font-small">Unitario</th>
                                <th class="web-font-small">Importe</th>
                            </tr>
                        </thead>
                        <tbody v-for="(detail, index) in invoiceDetails?.products" :key="detail">
                            <tr :id="index" :class="{ 'refund-invoice': detail.moveType == 'out_refund' }">
                                <td class="web-font-small">{{ detail.description }} <br><span
                                        v-if="detail.moveType == 'out_refund'">Reembolso</span></td>
                                <td class="web-font-small">{{ detail.qty }}</td>
                                <td class="web-font-small">{{ detail.price_unit }}</td>
                                <td class="web-font-small">{{ detail.price_subtotal}}</td>
                            </tr>

                        </tbody>
                    </table>
                    <div class="uk-text-right uk-margin-top">
                        <h6 class="web-font-small"><span>Total Sin Impuestos:</span> <span>{{ summary?.currency }} {{
                                invoiceDetails?.subtotal }}</span></h6>
                        <h6 class="web-font-small"><span>Impuestos:</span> <span>{{ summary?.currency }} {{
                                invoiceDetails?.amount_tax }}</span></h6>
                        <h6 class="web-font-small"> <span> Total: </span> <span class="opertion">{{ summary?.currency }}
                                {{ invoiceDetails?.amount_total }}</span></h6>
                    </div>
                </div>
            </li>
        </ul>


    </div>
</template>  

<script>
import axios from "axios";
import { mapGetters } from 'vuex';
import { IonLoading } from "@ionic/vue";
import { ref } from "vue";

export default {
    alias: "Resumen de Facturas",
    name: 'Summary',
    components: {
        IonLoading,
    },
    props: {
    timeout: { type: Number, default: 15000 },
  },
    data() {
        return {
            summary: null,
            generalInformation: null,
            invoiceDetails: null
        }
    },

    setup() {
        const isOpenRef = ref(false);
        const setOpen = (state) => (isOpenRef.value = state);

      return { isOpenRef, setOpen };
    },

    async mounted() {
        if (this.summaryInvoiceStore) {
            this.generalInformation = this.summaryInvoiceStore 
            this.invoiceDetails = this.invoiceDetailsStore
        } else {
           this.generalInformation = JSON.parse( localStorage.getItem(`SummaryInvoice`))
            this.invoiceDetails = JSON.parse(localStorage.getItem(`invoiceDetails`))
        }
        await this.getSummary ()
    },
    computed: {
        ...mapGetters["summaryInvoiceStore", "invoiceDetailsStore"]
    },
    methods: {
       async getSummary () {
            this.setOpen(true);
            let result = null 
            try {
                 result =  await axios.post(`https://jabiyaerp.flai.com.do/api/invoice/resume/report/`, {
                    params: {
                        invoice_ids: this.generalInformation.summarys
                    },
                    },
                    { withCredentials: true }
                );
            } catch (error) {
                console.log(error)
            }
           this.summary = result.data.result.data
           this.setOpen(false);

        },
      
    },
}
</script>

<style  scoped>
.container {
    width: 100%;
}

th {
    font-size: 12px;
    padding: 16px 4px;
    text-align: center;
    font-weight: 500;
    color: black;
}

td {
    font-size: 12px;
    padding: 16px 4px;
    text-align: center;
    font-weight: 500;
}

h6 {
    font-size: 12px;
    margin: 5px 20px;
    display: flex;
    justify-content: space-between;
}

a {
    margin: 5px 10px 0px;
    font-size: 16px;
}

.refund-invoice {
    color: red !important;
}

a {
    padding-bottom: 0px;
}

.uk-accordion-title {
    display: flex;
    font-size: 12px;
    color: #3880ff;
}

.uk-accordion-title::before {
    content: "";
    background-image: url('../assets/down.png');
    background-size: 14px;
    background-repeat: no-repeat;
    margin-right: 7px;
    background-position: 50% 50%;
}

.uk-open>.uk-accordion-title::before {
    transform: rotate(180deg);
}
.opertion {
    border-top: 2px solid #ccc;
}
</style>>
