<template>
 <ion-loading :is-open="isOpenRef" cssClass="my-custom-class" message="Por favor Espere..." :duration="timeout"
      @didDismiss="setOpen(false)">
    </ion-loading>
  <div class="container">
    <!-- <ion-loading :is-open="isOpenRef" cssClass="my-custom-class" message="Por favor Espere..." :duration="timeout"
            @didDismiss="setOpen(false)">
        </ion-loading> -->
    <ul>
      <li>
        <h2 class="uk-text-left uk-text-center">Totales Para Conciliación</h2>
        <table class="uk-table uk-table-striped uk-table-divider uk-table-hover">
          <thead>
            <tr>
              <th class="web-font-small">Productos</th>
              <th class="web-font-small">Ordenados</th>
              <th class="web-font-small">Entregados</th>
              <th class="web-font-small">A Devolver</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(details) in totalGeneral" :key="details">
              <td v-if="details?.quantity - details?.delivered > 0" class="web-font-small ">{{
                details?.product_name}}</td>
              <td v-if="details?.quantity - details?.delivered > 0" class="web-font-small">{{
                details?.quantity }}</td>
              <td v-if="details?.quantity - details?.delivered > 0" class="web-font-small">{{
                details?.delivered }}</td>
              <td v-if="details?.quantity - details?.delivered > 0" class="web-font-small uk-text-bold">{{
                details?.quantity - details?.delivered }}</td>
            </tr>
          </tbody>
        </table>
        <div v-for=" (data, i) in reconciliation" :key="data" v-show="i < 1">
          <h6 class="uk-margin-remove uk-flex uk-flex-around"><span>Total $ a Entregar en Almacén:</span> <span>RD$ {{
              separatorNumber(data.total) }}</span></h6>
        </div>
        <!-- </div> -->
      </li>
    </ul>
    <!-- <hr> -->
    <ul uk-accordion class="uk-margin-large-top">
      <li>
        <a class="uk-accordion-title" href="#" @click="changeText()">{{ textAccordion }}</a>
        <div class="uk-accordion-content">
          <table class="uk-table uk-table-striped uk-table-divider uk-table-hover">
            <thead>
              <tr>
                <th class="web-font-small">Orden</th>
                <th class="web-font-small">Productos</th>
                <th class="web-font-small">Ordenados</th>
                <th class="web-font-small">Entregados</th>
              </tr>
            </thead>
            <tbody v-for="(info, index) in reconciliation" :key="info">
              <tr v-for="prod in info?.products" :key="prod">
                <td class="web-font-small">{{ info?.order_name }}</td>
                <td class="web-font-small ">{{ prod?.product_name }}</td>
                <td class="web-font-small">{{ prod?.quantity }}</td>
                <td class="web-font-small">{{ prod?.delivered }}</td>
              </tr>
              <tr v-if="index < reconciliation.length -1">
                <td></td>
              </tr>
            </tbody>
          </table>

        </div>
      </li>
    </ul>
      </div>
</template>  

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import { Profile } from "../mixins/Profile";
import { hostEnum } from '../types'
import { Mixins } from '../mixins/mixins'
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";



export default {
  alias: "Reporte de Conciliación",
   setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  components: {
    IonLoading,
  },

  data() {
    return {
      loads: null,
      status: null,
      totalGeneral: [],
      textAccordion: 'Ver Detalles por Orden',
      timeOut: 10000

    }
  },
  mixins: [Profile, Mixins],

  computed: {
    ...mapGetters(["detailsLoadsStore", 'loadStore']),
  },

  async beforeMount() {
    this.setOpen(true);
    if (this.loadStore) {
      this.loads = this.detailsLoadsStore
    } else {
      this.loads = JSON.parse(localStorage.getItem("currentLoad"))
      this.$store.commit("setDetailsLoadsStore", JSON.stringify(this.loads))
    }
    try {
      const signIn = {
        jsonrpc: "2.0",
        params: { login: "jabillaodoo@gmail.com", password: "admin" },
      };
      await axios.post(
        `${hostEnum.odoo}/api/exo/auth/sign_in`,
        signIn,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
    await this.getReconciliation(this.loads.loadMapId);
    this.controltotal()
    this.setOpen(false);

  },

  methods: {
    async getReconciliation(id) {
      try {
        const result = await axios.get(`${hostEnum.odoo}/api/order/${id}/reconciliation/`, { withCredentials: true });
        this.reconciliation = result.data.result.data
      } catch (error) {
        console.log(error)
      }
    },
    controltotal() {
      let control = []
      this.reconciliation?.forEach(x => { x.products.forEach(z => control.push(z)) })

      control.forEach(data => {
        let x = { ...data }

        let idx = this.totalGeneral?.findIndex(p => p.product_name == x.product_name)

        if (idx > -1) {
          this.totalGeneral[idx].quantity += x.quantity
          this.totalGeneral[idx].delivered += x.delivered
        } else {
          this.totalGeneral.push(x)
        }
      })
      console.log(this.totalGeneral, 'totalGeneral')
    },
    changeText() {
      if (this.textAccordion !== 'Ver Detalles por Orden') {
        this.textAccordion = 'Ver Detalles por Orden'
      } else {
        this.textAccordion = 'Ocultar Detalles por Orden'
      }
    }
  }
}
</script>

<style scoped>
.uk-table th {
  padding: 16px 3px;
  text-align: center;
  color: black;
  font-weight: 600;
}

th {
  font-size: 11.2px;
}

.uk-table td {
  font-size: 11px;
  padding: 16px 6px;
  width: 25%
}

h6 {
  margin-bottom: 0px;
}

ul {
  list-style-type: none;
  padding: 0px !important;
}
.uk-table-hover tbody tr:hover {
  background-color: #efefef;
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
  --main-bg-color: true
}

.uk-open>.uk-accordion-title::before {
  transform: rotate(180deg);
  --main-bg-color: false
}
/* hr {
  height: 2px;
  background-color: black;
  box-shadow: 2px 4px 4px black;
  width: 96%;
  margin: 6px;
} */
</style>