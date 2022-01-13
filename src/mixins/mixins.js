import orders from '../store/Orders'
import router from '../router'
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
         changeRouteLoads(val){
             var autoScan = orders.state.settings.AutoScan
             if(autoScan){
                 if(val == 'Approved') router.push({name: 'drayage-orden'})
                 if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
                 if(val == 'Deliver-Load') router.push({name: 'delivery-actions-auto'})
                 if(val == 'Dispatched') this.setMap()

             }
             else {
                if(val == 'Approved' || val == 'Loading Truck') router.push({name: 'orders'})
                if(val == 'Expecting Approval') router.push({name: 'confirm-trip'})
                if(val == 'Deliver-Load') router.push({name: 'delivery-routes'})
                if(val == 'Dispatched') this.setMap()
             }
         },

         setMap(){
            window.open("https://www.google.com/maps/dir/'18.475615,-69.957918'/'18.478645,-69.966486'")
         },
         callProfile(){
             let user = 'container'
             this.profile(user)
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

