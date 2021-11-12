<template>
  <div>
       <div class="uk-background-muted  uk-panel uk-flex uk-flex-around sticky">
              <div class="uk-padding-small">
            <p class="uk-text-middle">Tiempo</p>
           </div>
            <div class="uk-padding-small">
            <p class="uk-text-middle">Estatus</p>
            </div>
      </div>
       <div v-for="load in loads" :key="load" class="uk-flex uk-flex-around">
           <div class="uk-padding-small" style="width:40%">
             <span> {{load.hours}} </span>
            </div>
             <div class="uk-padding-small">
             <font-awesome-icon icon="truck" :class="{iconfaDeliverd:load.status === 'Delivered', iconfaDispatchedApproved:load.status === 'Dispatched Approved', iconfaDispatched:load.status === 'Dispatched', iconfaAssignedToDriver:load.status === 'Assigned to Driver'}"/>
            </div>
             <div class="uk-padding-small uk-text-right" style="width:40%">
               <span> {{load.status}} </span>
            </div>
      </div>
  </div>
</template>

<script>
export default {
  mounted(){
        this.$store.commit('setCurrent', {menuName: 'Carga de ordenes',componentName: 'home'},)
    },
  data () {
    return {
      loads: [
       { hours: '10:00 - 10:30', status: 'Delivered'},
       { hours: '12:00 - 01:30', status: 'Dispatched Approved'},
       { hours: '03:00 - 03:30', status: 'Dispatched'},
       { hours: '04:00 - 04:30', status: 'Assigned to Driver'},
       { hours: '05:00 - 05:30', status: 'Delivered'},
       { hours: '10:00 - 10:30', status: 'Delivered'},
       { hours: '12:00 - 01:30', status: 'Dispatched Approved'},
       { hours: '03:00 - 03:30', status: 'Dispatched'},
       { hours: '04:00 - 04:30', status: 'Assigned to Driver'},
       { hours: '05:00 - 05:30', status: 'Delivered'},
       { hours: '10:00 - 10:30', status: 'Delivered'},
       { hours: '12:00 - 01:30', status: 'Dispatched Approved'},
       { hours: '03:00 - 03:30', status: 'Dispatched'},
       { hours: '04:00 - 04:30', status: 'Assigned to Driver'},
       { hours: '05:00 - 05:30', status: 'Delivered'},
       { hours: '10:00 - 10:30', status: 'Delivered'},
       { hours: '12:00 - 01:30', status: 'Dispatched Approved'},
       { hours: '03:00 - 03:30', status: 'Dispatched'},
       { hours: '04:00 - 04:30', status: 'Assigned to Driver'},
       { hours: '05:00 - 05:30', status: 'Delivered'},
       { hours: '10:00 - 10:30', status: 'Delivered'},
       { hours: '12:00 - 01:30', status: 'Dispatched Approved'},
       { hours: '03:00 - 03:30', status: 'Dispatched'},
       { hours: '04:00 - 04:30', status: 'Assigned to Driver'},
       { hours: '05:00 - 05:30', status: 'Delivered'},
       { hours: '10:00 - 10:30', status: 'Delivered'},
       { hours: '12:00 - 01:30', status: 'Dispatched Approved'},
       { hours: '03:00 - 03:30', status: 'Dispatched'},
       { hours: '04:00 - 04:30', status: 'Assigned to Driver'},
       { hours: '05:00 - 05:30', status: 'Delivered'},

      ]
    }
  }

}
</script>

<style scoped>
p {
    margin: 0px;
}
.iconfaDeliverd {
   font-size: 20px;
   color: rgb(13, 99, 10);
}
.iconfaDispatchedApproved {
   font-size: 20px;
   color: rgb(5, 7, 5);
}
.iconfaDispatched {
   font-size: 20px;
   color: rgb(255, 174, 0);
}
.iconfaAssignedToDriver {
   font-size: 20px;
   color: rgb(203, 207, 203);
}
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  padding: 5px;
  border: 2px solid #564caf;
}
</style>>
