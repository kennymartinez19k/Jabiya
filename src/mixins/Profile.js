import { userType} from '../types'
export const Profile = {
  data() {
    return {
      user: null,
      container: {
        LoadStatus: {
          expectingApprovalProvider: {
            message: "Aprobar/Rechazar $ (Flai)",
            pastMessage: "Aprobó el Viaje $ Flai",
            route: ''
          },
          expectingApproval: {
            message: 'Aceptar/Rechazar Viaje (Chofer)',
            pastMessage: "Aceptó el Viaje (Chofer)",
            route: 'confirm-trip'
          },
          driverArrival: {
            message: "Registrar LLegada a Recoger",
            pastMessage: "Llegó a Recoger",
            route: ''
          },
          approved: {
            message: "Montar Viaje",
            pastMessage: "Monto el Viaje",
            route: 'drayage-orden'
          },
          startRoute: {
            message: "Iniciar Ruta",
            pastMessage: "Comenzo la Ruta",
            route: ''
          },
          delivered: {
            message: "Entregar Contenedor",
            pastMessage: "Contenedor Entregado",
            route: 'delivery-actions-auto'
          },
          returnContainer: {
            message: "Retornar Contenedor",
            astMessage: "Contenedor Retornado",
            route: 'return-container'
          },
        },
        pick: 'Recoger en',
        deliver: 'Entregar en',
      },
      b2b: {
        LoadStatus: {
          expectingApprovalProvider: {
            message: "Aprobar/Rechazar $ (Flai)",
            pastMessage: "Aprobó el Viaje $ Flai",
            route: ''
          },
          expectingApproval: {
            message: 'Aceptar/Rechazar Viaje (Chofer)',
            pastMessage: "Aceptó el Viaje (Chofer)",
            route: 'confirm-trip'
          },
          driverArrival: {
            message: "Registrar LLegada a Recoger",
            pastMessage: "Llegó a Recoger",
            route: ''
          },
          approved: {
            message: "Montar Viaje",
            pastMessage: "Monto el Viaje",
            route: 'drayage-orden'
          },
          startRoute: {
            message: "Iniciar Ruta",
            pastMessage: "Comenzo la Ruta",
            route: ''
          },
          delivered: {
            message: "Entregar Viaje",
            pastMessage: "Viaje Entregado",
            route: 'delivery-actions-auto'
          },
          returnContainer: {
            message: "Retornar Viaje",
            astMessage: "Viaje Retornado",
            route: 'return-container'
          },
        },
        pick: 'Warehouse',
        deliver: 'Entregar en'
      },
    };
  },
  
  methods: {
    setProfile(val) {
      if (val.loadType == "Container Pickup/Delivery") {
        localStorage.setItem('currentProfile', JSON.stringify(this.container))
      }
      if (val.loadType == "B2B Delivery"){
        localStorage.setItem('currentProfile', JSON.stringify(this.b2b))
      }
    },

    setStatus(val){
      if(val.loadType == 'Container Pickup/Delivery'){
        if (val?.loadingStatus?.text == "Defining Load") return "Definiendo Carga"
        if (val?.loadingStatus?.text == "Driver selection in progress") return "Esperando Asignación del Chofer"
        if (val?.loadingStatus?.text == "Denied Approval" && val?.approvers[0]?.status == 'REJECTED') return "Rechazado por Flai Admin";
        if (val?.loadingStatus?.text == "Denied Approval" && val?.approvers[1]?.status == 'REJECTED') return "Rechazado por Chofer";
  
        if (val?.loadingStatus?.text == "Loading Truck") return "Cargando Vehiculo";
  
        if (val?.loadingStatus?.text == "Expecting Approval" && !val?.approvers[0]?.status) return "Esperando Aprobación $ Flai";
        if (val?.loadingStatus?.text == "Expecting Approval" && val?.approvers[0]?.status) {
          let user = JSON.parse(localStorage.getItem('userInfo'))
          if(user.userType == userType.driver) return 'Esperando que Aceptes este Viaje'
          return "Esperando Chofer Acepte Viaje";
        } 
  
        if (val?.loadingStatus?.text == "Approved") return "Viaje Aprobado";
        if (val?.loadingStatus?.text == "Driver Arrival") return "Chofer Llegó a Recoger";
        if (val?.loadingStatus?.text == "Dispatched") {
          if(val.Orders.length > 1 && val.Orders.some(order => order.status == 'Delivered'))
            return 'Entregando Ordenes Restantes'

          if(localStorage.getItem(`sendInfo${val.loadMapId}`)){
            return 'Enviando Informacion'
          }
          else
            return "Listo para Entregar";
        }
        if (val?.loadingStatus?.text == "Loading truck") return "Cargando Vehiculo";
        if (val?.loadingStatus?.text == "Delivered") return "Viaje Entregado";
      }
      else{
        if (val?.loadingStatus?.text == "Defining Load") return "Definiendo Carga"
        if (val?.loadingStatus?.text == "Driver selection in progress") return "Esperando Asignación del Chofer"
        if (val?.loadingStatus?.text == "Denied Approval" && val?.approvers[0]?.status == 'REJECTED') return "Rechazado por Flai Admin";
        if (val?.loadingStatus?.text == "Denied Approval" && val?.approvers[1]?.status == 'REJECTED') return "Rechazado por Chofer";

        if (val?.loadingStatus?.text == "Loading Truck") return "Cargando Vehiculo";

        if (val?.loadingStatus?.text == "Expecting Approval" && !val?.approvers[0]?.status) return "Esperando Aprobación $ Flai";
        if (val?.loadingStatus?.text == "Expecting Approval" && val?.approvers[0]?.status) return "Esperando Chofer Acepte Viaje";

        if (val?.loadingStatus?.text == "Approved") return "Viaje Aprobado";
        if (val?.loadingStatus?.text == "Driver Arrival") return "Chofer Llegó a Recoger";
        if (val?.loadingStatus?.text == "Dispatched"){
          if(localStorage.getItem(`sendInfo${val.loadMapId}`)){
            return 'Enviando Informacion'
          }
          else
            return "Listo para Entregar";
        }
        if (val?.loadingStatus?.text == "Loading truck") return "Cargando Vehiculo";
        if (val?.loadingStatus?.text == "Delivered") return "Viaje Entregado";
      }
    }

  },
};
