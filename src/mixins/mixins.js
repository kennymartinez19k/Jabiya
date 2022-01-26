import orders from '../store/Orders'
import router from '../router'
import services from '../services/index'
import { Geolocation } from '@capacitor/geolocation';
import { LocalStorage } from '../mixins/LocalStorage';
import { Storage} from '@ionic/storage'



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
            currentLocation: null,
            myLocation: null,
            load: null,
            localStorageGps: new Storage(),

        }
    },
    mixins: [LocalStorage],
    mounted() {
        this.localStorageGps.create();
        setInterval(async () => {
            if( !await this.localStorageGps.get(`gps ${this.load?.loadMapId}`)){
                let location = await this.location()
                console.log(location)
            }
         },30000)
    },
    methods: {
         async changeRouteLoads(val, load = null){
             var autoScan = orders.state.settings.AutoScan
             if(autoScan){
                 if(val == 'Approved') router.push({name: 'drayage-orden'})
                 if(val == 'Driver Arrival') await this.driverArrival(load)
                 if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
                 if(val == 'Dispatched') await this.setMap(load)
                 if(val == 'Deliver-Load') router.push({name: 'delivery-actions-auto'}) 
                 if(val == 'return-container')  router.push({name: 'return-container'})
                 if(val == 'Delivered') this.localStorageGps.remove(`gps ${this.load?.loadMapId}`)
             }
             else {
                if(val == 'Approved' || val == 'Loading Truck') router.push({name: 'orders'})
                if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
                if(val == 'Dispatched') this.setMap(load)
                if(val == 'Deliver-Load') router.push({name: 'delivery-routes'})
             }
         },
         async driverArrival(val){
            localStorage.setItem(`loadStatus${val.loadMapId}`, 3)
            await services.loadsScanServices.driverArrival(val.loadMapId);
            this.localStorageGps.set(`gps ${val.loadMapId}`, true)
            this.load = val
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
                localStorage.setItem(`loadStatus${val.loadMapId}`, 5)
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

