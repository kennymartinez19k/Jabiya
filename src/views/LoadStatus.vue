<template>
<div class="">
 <div class="stiky">
      <p style="font-size: 13px !important; font-weight: 500">
        {{ loads?.loadNumber }}
      </p>
      <div
        class="
          uk-flex
          uk-flex
          uk-flex-center
          uk-flex-left
          uk-margin-remove
          uk-padding-remove
        "
        style="align-items: center"
      >
        <div class="uk-flex uk-flex-wrap">
          <p style="margin-right: 10px !important">
            <span class="font-weight-medium">Shipper: </span
            ><span>&nbsp; {{ shipperName(loads) }}</span>
          </p>
          <div></div>
          <p>
            <span style="font-weight: 500">Destino:</span
            ><span>&nbsp; {{ loads?.firstOrdenSector?.sector }}</span>
          </p>
        </div>
      </div>
    </div>
  <div class="container">
   
    <ul class="progressbar">
      <li
        :class="{
          disabled: !loadStatus.expectingApproval && loadStatus.step < 1,
        }"
      >
        <div
          @click="
            changeRoute('Expecting Approval')
          "
          class="uk-card uk-card-default uk-card-body uk-width-1-2@m item"
        >
          <h6>Aprobar Viaje</h6>
        </div>
        <div class="icon-item">
          <img
            v-if="loadStatus.step <= 1"
            src="../assets/checklist.png"
          />
          <img
            v-else
            src="../assets/checklist-checked-box.png"
          />
        </div>
        <div class="disabled-container"></div>
      </li>
      <li>
        <div
          @click="changeRoute('Approved')"
          class="uk-card uk-card-default uk-card-body uk-width-1-2@m item"
        >
          <h6>Montar Viaje</h6>
        </div>
        <div class="icon-item">
          <img
            v-if="loadStatus.step <= 2"
            src="../assets/checklist.png"
            alt=""
            srcset=""
          />
          <img
            v-else
            src="../assets/checklist-checked-box.png"
            alt=""
            srcset=""
          />
        </div>
        <div class="disabled-container"></div>
      </li>
      <li>
        <div
          @click="changeRoute('Dispatched')"
          class="uk-card uk-card-default uk-card-body uk-width-1-2@m item"
        >
          <h6>Iniciar Ruta</h6>
        </div>
        <div class="icon-item">
          <img
            v-if="loadStatus.step <= 2"
            src="../assets/checklist.png"
            alt=""
            srcset=""
          />
          <img
            v-else
            src="../assets/checklist-checked-box.png"
            alt=""
            srcset=""
          />
        </div>
        <div class="disabled-container"></div>
      </li>
      <li class="">
        <div
          @click="changeRoute('Deliver-Load')"
          class="uk-card uk-card-default uk-card-body uk-width-1-2@m item"
        >
          <h6>Entregar Contenedor</h6>
        </div>
        <div class="icon-item">
          <img
            v-if="loadStatus.step <= 3"
            src="../assets/checklist.png"
            alt=""
            srcset=""
          />
          <img
            v-else
            src="../assets/checklist-checked-box.png"
            alt=""
            srcset=""
          />
        </div>
        <div class="disabled-container"></div>
      </li>
        <li class="">
        <div
          class="uk-card uk-card-default uk-card-body uk-width-1-2@m item"
        >
          <h6>Regresar Contenedor</h6>
        </div>
        <div class="icon-item">
          <img
            v-if="loadStatus.step <= 3"
            src="../assets/checklist.png"
            alt=""
            srcset=""
          />
          <img
            v-else
            src="../assets/checklist-checked-box.png"
            alt=""
            srcset=""
          />
        </div>
        <div class="disabled-container"></div>
      </li>
      <li>
        <div
          @click="setInvoice()"
          class="uk-card uk-card-default uk-card-body uk-width-1-2@m item"
        >
          <h6>Realizar Factura</h6>
        </div>
        <div class="icon-item">
          <img
            v-if="loadStatus.step <= 4"
            src="../assets/checklist.png"
            alt=""
            srcset=""
          />
          <img
            v-else
            src="../assets/checklist-checked-box.png"
            alt=""
            srcset=""
          />
        </div>
        <div class="disabled-container"></div>
      </li>

    </ul>
  </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import {Mixins} from '../mixins/mixins'

export default {
  alias: 'Seleccione el Siguiente Paso',
  data() {
    return {
      step: 0,
      loads: [],
    };
  },
  mixins: [Mixins],
  computed: {
    ...mapGetters(["loadStore"]),
    loadStatus() {
      let statusLoad = {};
      if (this.loads?.loadingStatus?.text == "Approved")
        statusLoad.approved = true;
      statusLoad.step = 1;
      if (this.loads?.loadingStatus?.text == "Expecting Approval")
        statusLoad.expectingApproval = true;
      statusLoad.step = 2;

      return statusLoad;
    },
  },
  mounted() {
    this.loads = this.loadStore;
  },
  methods: {
    changeRoute(val) {
     this.changeRouteLoads(val)
    },
    setInvoice () {
      this.$router.push({ name: "invoices-orders" }).catch(() => {});

    },
    shipperName(val){
      var shipper = val?.shipper?.find(x => x.name)
      return shipper?.name
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  padding: 0px 10px;
  display: flex;
  flex-direction: row;
  z-index: 1;
}
.progressbar {
  list-style: none;
  display: flex;
  padding: 0px;
  width: 100%;
  margin-top: 20px;
  flex-direction: column;
}
.progressbar li {
  float: left;
  width: 100%;
  display: flex;
  height: 80px;
  position: relative;
  text-align: center;
}
.progressbar h6{
  margin: 0px;
}
.progressbar li .item {
  height: 40px;
  width: 73%;
  margin-right: 10px;
  padding: 10px 0px;
  box-shadow: none;
  border: 1px solid #c0bdbd;
}
.progressbar li .icon-item {
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.icon-item img {
  width: 30px;
  height: 30px;
}
p{
  margin: 2px 0px !important
}
.progressbar {
  counter-reset: step;
}
.progressbar li:before {
  content: counter(step);
  counter-increment: step;
  width: 25px;
  height: 25px;
  border: 2px solid #bebebe;
  display: block;
  margin: 0 8px 0px 4px;
  border-radius: 50%;
  line-height: 27px;
  background: white;
  color: #bebebe;
  text-align: center;
  font-weight: bold;
}
.progressbar li:after {
  content: "";
  position: absolute;
  width: 1%;
  height: 100%;
  background: #979797;
  top: 15px;
  left: 5%;
  z-index: -1;
}
.progressbar li:last-child:after {
  content: none;
}
.progressbar li.active + li:after {
  background: #3aac5d;
}

.progressbar li.active + li:before {
  border-color: #3aac5d;
  background: #3aac5d;
  color: white;
}
.active + li:before {
  background: #3aac5d;
}
.disabled {
  pointer-events: none;
  position: relative;
}
.disabled .disabled-container {
  background: rgba(255, 255, 255, 0.6);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
}
</style>