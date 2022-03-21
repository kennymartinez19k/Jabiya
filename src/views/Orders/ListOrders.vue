<template>
  <div class="uk-card container">
      <div>
        <div class="menu">
        <div class="filter-Card" >
            <div class="header">
                <div class="uk-flex uk-flex-wrap uk-flex-between">
                <div uk-accordion class="uk-margin-remove uk-padding-remove">
                
                <!-- uk-open -->
                    <li class="uk-margin-remove">
                        <span v-if="isFiltered" class="isFilter">Filtrados</span>
                        <a class="uk-accordion-title " href="#">
                            Mostrar / Ocultar Filtros</a>

                        <div 
                        class="uk-accordion-content uk-margin-remove uk-padding-remove">
                            <label><span>No. de Orden</span><input v-model="filters.orderNum" class="uk-input" type="input" checked></label>
                            <label style="justify-content: center !important"><span>Estado</span> 
                                <select v-model="filters.status" class="uk-select" >
                                <option value="Created" >Creada</option>
                                <option value="Assigned">Asignada</option>
                                <option value="Delivered">Entregada</option>
                                <option value="en-route" >En Ruta</option>
                                </select>
                            </label>
                            <label><span>Fecha de Espera</span><input v-model="filters.expected_date" class="uk-input" type="date" checked></label>
                            <label><span>Nombre del Cliente</span> <input v-model="filters.client_name" class="uk-input" type="input"></label>
                            <label><span>Shipper</span><input v-model="filters.shipper" class="uk-input" type="input" checked></label>
                            <label><span>No de Carga</span><input v-model="filters.loadNumber" class="uk-input" type="input" checked></label>
                            <label><span>Nombre del Chofer</span><input v-model="filters.driver_name" class="uk-input" type="input" checked></label>
                            <label><span>Tipo de Servicio</span><input v-model="filters.serviceType" class="uk-input" type="input" checked></label>
                            <div class="uk-width-1-1 uk-flex uk-flex-right" style="padding: 0px 10px">
                                <button @click="clearFilters()" class="uk-button uk-button-red uk-button-small">Limpiar Filtros</button>
                                <button @click="setFilters()" class="uk-button uk-button-primary uk-button-small">Aplicar Filtros</button>
                            </div>
                        </div>
                    </li>
                </div>
                </div>
            </div>
        </div>
            
        </div>
        <div class="section">
            <div class="item" v-for="(order, i ) in orderToDisplay" :key="order"  v-show="i >= currentPage && i <= totalInPages" >
                <div class="icon">
                    <font-awesome-icon @click="editOrder(order)" icon="pen" class="icon-action"/>
                    <font-awesome-icon @click="openModal(order)" :class="{disabled: order.status != 'Created'}" icon="trash-alt" class="icon-action"/>
                </div>
                <span style="font-size: 10px">{{translateOrderStatus(order?.status)}}</span>
                <div class="info">
                    <p><strong> Nombre:</strong> {{order?.client_name}}</p>
                    <div class="uk-flex uk-flex-wrap">
                    <p><strong>No. de orden:</strong>{{order?.order_num}}</p>
                    <p><strong>Shipper:</strong> {{order?.customer?.name}}</p>
                    </div>
                    <div class="uk-flex uk-flex-between uk-flex-wrap" style="align-items: center">
                        <p><strong> Fecha de Espera:</strong>
                            {{setDateFormat(order?.expected_date)}} 
                            {{setLocaleHour(order?.expected_date)}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div class="uk-width-1-1" >
        <ul class="uk-pagination uk-flex-center" uk-margin>
            <li @click="changePage(-10)"><a href="#"><span uk-pagination-previous></span></a></li>
            <li v-for="(page, i) in pages" :key="page" v-show="page < 8"><a :class="{active: (i + 1) == (totalInPages / 10)} ">{{page}}</a></li>
            <li @click="changePage(10, true)"><a href="#"><span uk-pagination-next></span></a></li>
       </ul>

      </div>
        <transition name="modal">
            <div v-if="isOpenModal">
                <div class="overlay" @click.self="isOpenModal = false;">
                <div class="modal">
                    <div class="">
                    <p>Esta Seguro que Desea Eliminar Esta Orden</p>
                    <p class="uk-text-right uk-flex uk-flex-right" style="margin-top: 20px !important;">
                        <button class="uk-button uk-button-red uk-modal-close" style="margin: 0px 10px" @click="isOpenModal = false" type="button">Cancelar</button>
                        <button class="uk-button uk-button-primary uk-modal-close" @click="deleteOrder()" type="button">Eliminar</button>
                    </p>
                </div>
                
                </div>
                </div>
            </div>
        </transition>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Mixins } from '../../mixins/mixins'
import moment from "moment";

export default {
    alias: 'Lista de Ordenes',
    mixins: [Mixins],
    computed:{
        ...mapGetters(['listOrdersStore']),

        pages(){
            let res = this.orderToDisplay.length / 10
            if(Math.ceil(res) < 1){
                return 1
            }
            return Math.ceil(res)
        },
        
    },
    data() {
        return {
            orders: [],
            orderToDisplay: [],
            totalInPages: 10,
            currentPage: 0,
            totalOrders: null,
            filter: false,
            order: null,

            filters:{
                expected_date: null,
                orderNum: null,
                status: null,
                client_name: null,
                shipper: null,
                loadNumber: null,
                driver_name: null,
                serviceType: null
            },
            isFiltered: false,
            isOpenModal: false

        }
    },

    async mounted() {
        this.orders = this.listOrdersStore?.data
        this.orderToDisplay = [...this.orders]
        this.totalOrders = this.orders?.length        
    },
  
    methods:{
        changePage(val, plus){
            if(plus && this.totalInPages < this.totalOrders){
                this.totalInPages = this.totalInPages + val
                this.currentPage = this.currentPage + val

            }else if(!plus && this.currentPage > 0){
                this.totalInPages = this.totalInPages + val
                this.currentPage = this.currentPage + val
            }
            
        },
        setLocaleHour(val){
            let date = moment(val).utc().format("YYYY-MM-DD HH:mm")
            return moment(date).format('hh:mm A')
        },
        setDateFormat(val){
            return moment(val).format('MM/DD/YYYY')
        },
        editOrder(order){
            this.$store.commit('editOrder', order)
            this.$router.push({name: 'order-registration'})
        },
        openModal(order){
            this.order = order
            this.isOpenModal = true
        },
        async deleteOrder(){
            let i = this.orderToDisplay.findIndex(x => x.order_num == this.order.order_num)
            this.orderToDisplay.splice(i, 1)
            await this.$services.manageOrders.deleteOrder(this.order._id)
            let result = await this.$services.manageOrders.getOrders()
            this.orderToDisplay = result?.data
            this.isOpenModal = false
            this.order = null
        },
        async setFilters(){
             let {expected_date, orderNum , client_name, status, shipper, loadNumber, driver_name, serviceType} = this.filters
               
               if(expected_date || orderNum || client_name || status || shipper || loadNumber || driver_name || serviceType){
                   this.isFiltered = true
                   let result = await this.$services.manageOrders.getOrdersFilter(
                       expected_date, 
                       orderNum, 
                       client_name, 
                       status, 
                       shipper, 
                       loadNumber,
                       driver_name, 
                       serviceType
                   )
                   this.orderToDisplay = result.data
               }else{
                   this.clearFilters()
                   
               }
                 
        },
        clearFilters(){
            let filter = {
                expected_date: null,
                orderNum: null,
                status: null,
                client_name: null,
                shipper: null,
                loadNumber: null,
                driver_name: null,
                serviceType: null
            }

            this.isFiltered = false
            this.filters = {...filter}
            this.orderToDisplay = [...this.orders]
        }
    }
}
</script>

<style scoped>
p{
    margin: 2px 10px 2px 0px;
}
.uk-button-small{
    padding: 5px 10px;
    margin: 5px
}
.container{
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.item{
    margin: 10px 0px;
    border-radius: 10px;
    box-shadow: 0px 0px 1px #000;
    padding: 10px;
    text-align: initial;
    position: relative;
}
.icon{
    display: flex;
    width: 65px;
    position: absolute;
    right: 0px;
}
.icon-action{
    margin-left:  10px;
    font-size: 18px;
}
.info{
    margin-top: 10px;
}
.active{
    color: #0000f0;
    background: #d0d8ff;
}

.uk-pagination{
    align-items: baseline;
    margin: 10px 15px 10px 0px;
    margin-right: 0px;
    margin-bottom: 10px;
}
.uk-pagination li{
    margin: 0px 4px
}

.filter-Card{
    position: relative;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    padding: 0px 0px 10px;
    border-bottom: 1px solid rgb(223, 223, 223);
}

.filter-Card .header{
    font-size: 10px;
}

.filter-Card .header label{
    margin: 5px;
}
.filter-Card .header label input{
    margin: 0px 2px;
    transform: scale(0.9);
}

.uk-accordion-title{
  display: flex;
  justify-content: flex-end;
  margin: 10px 0px 10px;
  font-size: 10px;
  color: #3880ff;
}
.uk-accordion-title::before {
    content: "";
    margin-left: 5px;/* revision*/
    margin-right: 5px;
    background-image: url('../../assets/down.png');
    height: 17px;
    background-size: 15px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    
}
.uk-open>.uk-accordion-title::before {
  transform: rotate(180deg);
}
.uk-accordion-content {
    border: 1px solid #ccc;
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0px 10px !important;
    justify-content: space-between;
}

.uk-accordion-content label{
    width: 45%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
.uk-accordion-content select{
    width: 88%;
}
.uk-accordion-content span{
    margin: 0px 10px;
}
.isFilter{
    position: absolute;
    left: 0px;
}

.uk-pagination>*>* {
    display: block;
    padding: 7px 8px;
    color: #999;
    transition: color .1s ease-in-out;
}

.disabled{
    pointer-events: none;
    color: #ccc
}


.modal {
  width: 500px;
  margin: 0px auto;
  padding: 20px 15px;
  margin: 0px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 3px;
  transition: all 0.2s ease-in;
  font-family: Helvetica, Arial, sans-serif;
}
.modal .item{
    width: 47%;
}
.fadeIn-enter {
  opacity: 0;
}

.fadeIn-leave-active {
  opacity: 0;
  transition: all 0.2s step-end;
}

.fadeIn-enter .modal,
.fadeIn-leave-active.modal {
  transform: scale(1.1);
}


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #00000094;
  z-index: 999;
  transition: opacity 0.2s ease;
}

</style>