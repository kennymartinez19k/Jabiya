import orders from '../store/Orders'
import router from '../router'
export const Mixins = {
    methods: {
         changeRouteLoads(val){
             var autoScan = orders.state.settings.AutoScan
             if(autoScan){
                 if(val == 'Approved') router.push({name: 'drayage-orden'})
                 if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
             }
             else {
                if(val == 'Approved' || val == 'Loading Truck') router.push({name: 'orders'})
                if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
             }
         }

    },
   
}

