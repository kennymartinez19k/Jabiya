import orders from '../store/Orders'
import router from '../router'
import { Geolocation } from '@capacitor/geolocation';


export const Mixins = {
    data(){
        return{
            container:{
                Loads:{
                    ButtonSendActionMessage: 'Iniciar Ruta',
                },
                Orders:{},
                deliveryActions:{}
            },
        }
    },
    methods: {
         async changeRouteLoads(val, load = null){
             var autoScan = orders.state.settings.AutoScan
             if(autoScan){
                 if(val == 'Approved') router.push({name: 'drayage-orden'})
                 if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
                 if(val == 'Dispatched') await this.setMap(load)
                 if(val == 'Deliver-Load') {
                    router.push({name: 'delivery-actions-auto'})
                 } 
                 if(val == 'return-container') {
                    let id = `startLoad${load.loadMapId}`
                    localStorage.removeItem(id)
                     router.push({name: 'return-container'})
                 }
             }
             else {
                if(val == 'Approved' || val == 'Loading Truck') router.push({name: 'orders'})
                if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
                if(val == 'Dispatched') this.setMap(load)
                if(val == 'Deliver-Load') router.push({name: 'delivery-routes'})
             }
         },

         async setMap(val){
            let latitude = val?.Orders[0].latitude
            let longitude = val?.Orders[0].longitude
            let myLocation = await this.location()
            window.open(`https://www.google.com/maps/dir/'${myLocation.latitude},${myLocation.longitude}'/${latitude},${longitude}/`)
            this.$store.commit("setStartRoute", true);
            let id = `startLoad${val.loadMapId}`
            localStorage.setItem(id, 1)

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

