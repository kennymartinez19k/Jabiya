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
      eCommerce: {
        LoadStatus: {
          expectingApprovalProvider: {
            message: "Aprobar $ Viaje Flai 1",
            pastMessage: "Aprobó el Viaje $ Flai 1",
            route: ''
          },
          expectingApproval: {
            message: "Aprobar Viaje 1",
            pastMessage: "Aprobó el Viaje 1",
            route: 'confirm-trip'
          },
          driverArrival: {
            message: "Registrar LLegada a Recoger 1",
            pastMessage: "Llegó a Recoger 1",
            route: ''
          },
          approved: {
            message: "Montar Viaje 1",
            pastMessage: "Monto el Viaje 1",
            route: 'orders'
          },
          startRoute: {
            message: "Iniciar Ruta 1",
            pastMessage: "Comenzo la Ruta 1",
            route: ''
          },
          delivered: {
            message: "Entregar Contenedor 1",
            pastMessage: "Contenedor Entregado 1",
            route: 'delivery-routes'
          },
          returnContainer: {
            message: "Retornar Contenedor 1",
            astMessage: "Contenedor Retornado 1",
            route: ''
          },
        },
        pick: 'Warehouse',
        deliver: 'Entregar en'
      },
    };
  },
  mounted() {
    this.setProfile();
  },

  methods: {
    setProfile() {
      let setting = JSON.parse(localStorage.getItem("setting"))
      
      if (setting.profile == "container") {
        this.currentProfile = { ...this.container };
      }
      if (setting.profile == "eCommerce"){
        this.currentProfile = { ...this.eCommerce };
      }
    },

  },
};
