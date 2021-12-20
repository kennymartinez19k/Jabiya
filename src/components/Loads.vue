<template>
  <div class="cnt">
    <ion-loading
    :is-open="isOpenRef"
    cssClass="my-custom-class"
    message="Por favor Espere..."
    :duration="timeout"
    @didDismiss="setOpen(false)"
  >
  </ion-loading>
  <Loading :active="loaded" color="rgb(86, 76, 175)" loader="spinner" :width="65" background-color="rgba(252, 252, 252, 0.7)"></Loading>
  <div v-for="date in dateLoad" :id="date" :key="date">
    <load-date :userOrden="loads" :date="date"/>
  </div>    
  </div>
</template>

<script>
import LoadDate from "./loadDate.vue";
import { ref } from "vue";
import { IonLoading } from "@ionic/vue";
import Loading from "vue-loading-overlay";
import moment from 'moment'
import 'moment/locale/es'
import "vue-loading-overlay/dist/vue-loading.css";
import { mapGetters } from 'vuex';
export default {
  
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);

    return { isOpenRef, setOpen };
  },
  beforeMount(){
    this.setOpen(true)
  },
  mounted(){
    window.location.href = '#Hoy'
    moment.locale('es')
    this.loads = this.allLoads.filter(x =>  x.driver == "Chofer 2" )
    this.loads[0].status = "Driver Assigned"
    this.loads[1].status = "Driver Arrival"

    console.log(this.loads)

  },
  watch:{
    allLoads: function(newVal){
      this.loads = newVal.filter(x => x.status = !"Defining Load")
      console.log(this.loads)
    }
  },
  data() {
    return {
      loaded: false,
      loads: null,
    };
  },
  computed:{
    ...mapGetters([
      'allLoads'
    ]),
    dateLoad: function () {
      var yesterday = new Date().setDate(new Date().getDate() -1 )
      yesterday = moment(new Date(yesterday)).format('ll')

      var today = 'Hoy'

      var tomorrow = new Date().setDate(new Date().getDate() +1 )
      tomorrow = moment(new Date(tomorrow)).format('ll') 

      return [yesterday, today, tomorrow]

    },
  },
  components: {
    IonLoading,
    Loading,
    LoadDate,
  },
  props: {
    timeout: { type: Number, default: 1000 },
  },
  methods: {
    setOpe(val) {
      this.loaded = val;
      setTimeout(() => {
        this.loaded = false;
      }, 2000);
    },
  },
};
</script>

<style scoped>

</style>
