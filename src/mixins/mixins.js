import orders from '../store/Orders'
import router from '../router'
export const Mixins = {
    methods: {
         changeRouteLoads(val){
             var autoScan = orders.state.settings.AutoScan
             if(autoScan){
                 if(val == 'Approved') router.push({name: 'drayage-orden'})
                 if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
                 if(val == 'Deliver-Load') router.push({name: 'deliveryActions'})
                 if(val == 'Dispatched') this.setMap()

             }
             else {
                if(val == 'Approved' || val == 'Loading Truck') router.push({name: 'orders'})
                if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
                if(val == 'Deliver-Load') router.push({name: 'delivery-routes'})
             }
         },

         setMap(){
            window.open("https://www.google.com/maps/dir/'18.475615,-69.957918'/'18.478645,-69.966486'")
         }

    },
   
}

