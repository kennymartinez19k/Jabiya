export const Profile = {
  data() {
    return {
      user: null,
      container: {
        LoadStatus: {
          expectingApprovalProvider: {
            message: "Aprobar $ Viaje Flai",
            pastMessage: "Aprobó el Viaje $ Flai",
          },
          expectingApproval: {
            message: 'Aprobar Viaje (Chofer)',
            pastMessage: "Aprobó el Viaje (Chofer)",
          },
          driverArrival: {
            message: "Registrar LLegada a Recoger",
            pastMessage: "Llegó a Recoger",
          },
          approved: {
            message: "Montar Viaje",
            pastMessage: "Monto el Viaje",
          },
          startRoute: {
            message: "Iniciar Ruta",
            pastMessage: "Comenzo la Ruta",
          },
          delivered: {
            message: "Entregar Contenedor",
            pastMessage: "Contenedor Entregado",
          },
          returnContainer: {
            message: "Retornar Contenedor",
            astMessage: "Contenedor Retornado",
          },
        },
      },
      eCommerce: {
        LoadStatus: {
          expectingApprovalProvider: {
            message: "Aprobar $ Viaje Flai 1",
            pastMessage: "Aprobó el Viaje $ Flai 1",
          },
          expectingApproval: {
            message: "Aprobar Viaje 1",
            pastMessage: "Aprobó el Viaje 1",
          },
          driverArrival: {
            message: "Registrar LLegada a Recoger 1",
            pastMessage: "Llegó a Recoger 1",
          },
          approved: {
            message: "Montar Viaje 1",
            pastMessage: "Monto el Viaje 1",
          },
          startRoute: {
            message: "Iniciar Ruta 1",
            pastMessage: "Comenzo la Ruta 1",
          },
          delivered: {
            message: "Entregar Contenedor 1",
            pastMessage: "Contenedor Entregado 1",
          },
          returnContainer: {
            message: "Retornar Contenedor 1",
            astMessage: "Contenedor Retornado 1",
          },
        },
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
