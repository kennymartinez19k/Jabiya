import orders from '../store/Orders'
import router from '../router'
import { Geolocation } from '@capacitor/geolocation';


export const Mixins = {
    data(){
        return{
            netQueue: [],
            container:{
                Loads:{
                    ButtonSendActionMessage: 'Iniciar Ruta',
                },
                Orders:{},
                deliveryActions:{}
            },
            myLocation: null
        }
    },
    methods: {
         async changeRouteLoads(val, load = null){
             var autoScan = orders.state.settings.AutoScan
             if(autoScan){
                 if(val == 'Approved') router.push({name: 'drayage-orden'})
                 if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
                 if(val == 'Dispatched') await this.setMap(load)
                 if(val == 'Deliver-Load') router.push({name: 'delivery-actions-auto'}) 
                 if(val == 'return-container')  router.push({name: 'return-container'})
             }
             else {
                if(val == 'Approved' || val == 'Loading Truck') router.push({name: 'orders'})
                if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
                if(val == 'Dispatched') this.setMap(load)
                if(val == 'Deliver-Load') router.push({name: 'delivery-routes'})
             }
         },

         async setMap(val){
            let order = val.Orders.find(x => !x.isReturn)
            let latitude
            let longitude
            if(!order) {
                latitude = val.warehouse.location.lat
                longitude = val.warehouse.location.lng
            }
            else{
                latitude = order.latitude
                longitude = order.longitude
            }
            this.myLocation =  await this.location()
            if(this.myLocation){
                window.open(`https://www.google.com/maps/dir/${this.myLocation.latitude},${this.myLocation.longitude}/${latitude},${longitude}/`)
                localStorage.setItem(`loadStatus${val.loadMapId}`, 4)
            }

         },
         async location () {
            try {
                const coordinates = await Geolocation.getCurrentPosition();
                return {latitude: coordinates.coords.latitude, longitude: coordinates.coords.longitude};
            } catch (e) {
              console.log(e)
            
            }
         },

         profile(user){
             if(user == 'container'){
                 return this.container
             }
         },
         loadStatus(val){
            if(val == 'Expecting Approval') return 'Esperando Aprobacion'
            if(val == 'Approved') return 'Aprobada'
            if (val == 'Driver Arrival') return 'LLegada del Conductor'
            if(val == 'Dispatched') return 'Despacho Aprobado'
            if(val == 'Loading truck') return 'Cargando Vehiculo'
            if(val == 'Delivered') return 'Entregada'
          },

    },
   
}

