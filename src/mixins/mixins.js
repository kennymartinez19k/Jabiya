import orders from "../store/Orders";
import router from "../router";
import services from "../services/index";
import { Geolocation } from "@capacitor/geolocation";
import { LocalStorage } from "../mixins/LocalStorage";
import { Storage } from "@ionic/storage";

export const Mixins = {
  data() {
    return {
      myLocation: null,
      load: null,
      localStorageGps: new Storage(),
      lastLocation: {
        latitude: 0,
        longitude: 0,
      },
      user: null,
      setting: null,
    };
  },
  mixins: [LocalStorage],
  mounted() {
    this.$store.dispatch("SettingStorage");
    this.setting = JSON.parse(localStorage.getItem("setting"));

    this.user = JSON.parse(localStorage.getItem("userInfo"));
    this.localStorageGps.create();

    setInterval(() => {
      this.setGps().then((res) => {
        if (res) {
          Geolocation.getCurrentPosition().then((myLocation) => {
            let location = myLocation.coords;
            if (
              Math.abs(location.latitude - this.lastLocation.latitude) >
                0.0001 ||
              Math.abs(location.longitude - this.lastLocation.longitude) >
                0.0001
            ) {
              this.lastLocation = { ...location };
              services.gpsServices.updateLocation(
                this.user.id,
                location.latitude,
                location.longitude,
                this.load.bay_id._id
              );
            }
          });
        }
      });
    }, 30000);
  },

  methods: {
    async changeRouteLoads(val, load = null) {
      var autoScan = orders.state.settings.AutoScan;
      if (autoScan) {
        if (val == "Expecting Approval") router.push({ name: "confirm-trip" });
        if (val == "Driver Arrival") await this.driverArrival(load);
        if (val == "Approved") this.uploadTrip(load);
        if (val == "Dispatched") await this.startLoadRoute(load);
        if (val == "Deliver-Load")
          router.push({ name: "delivery-actions-auto" });
        if (val == "return-container")
          router.push({ name: "return-container" });
        if (val == "Delivered") {
          localStorage.removeItem("loadingProgress");
          this.localStorageGps.remove(`gps ${load?.loadMapId}`);
          localStorage.removeItem(`loadStatus${load?.loadMapId}`);
        }
      } else {
        if (val == "Approved" || val == "Loading Truck")
          router.push({ name: "orders" });
        if (val == "Expecting Approval") router.push({ name: "confirm-trip" });
        if (val == "Dispatched") this.setMap(load);
        if (val == "Deliver-Load") router.push({ name: "delivery-routes" });
      }
    },
    async driverArrival(val) {
      localStorage.setItem(`loadStatus${val.loadMapId}`, 3);
      services.loadsScanServices.driverArrival(val.loadMapId);
      let location = await this.location();
      this.localStorageGps.set(`gps ${val.loadMapId}`, true);
      this.load = val;
      services.gpsServices.updateFirstLocation(
        this.user.id,
        location.latitude,
        location.longitude,
        this.load.bay_id._id
      );
    },

    uploadTrip(load) {
      router.push({ name: "drayage-orden" });
      this.localStorageGps.remove(`gps ${load?.loadMapId}`);
    },
    async startLoadRoute(val) {
      if (this.setting.maps) await this.setMap(val);
      this.localStorageGps.set(`gps ${val.loadMapId}`, true);

      localStorage.setItem(`loadStatus${val.loadMapId}`, 5);
    },

    async setMap(val) {
      let order = val.Orders.find((x) => !x.isReturn);
      let latitude;
      let longitude;
      if (!order) {
        latitude = val.warehouse.location.lat;
        longitude = val.warehouse.location.lng;
      } else {
        latitude = order.latitude;
        longitude = order.longitude;
      }
      this.myLocation = await this.location();
      if (this.myLocation) {
        window.open(
          `https://www.google.com/maps/dir/${this.myLocation.latitude},${this.myLocation.longitude}/${latitude},${longitude}/`
        );
      }
    },
    async location() {
      try {
        const coordinates = await Geolocation.getCurrentPosition();
        return {
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
        };
      } catch (e) {
        console.log(e);
      }
    },

    loadStatus(val) {
      if (val?.loadingStatus?.text == "Expecting Approval" && !val?.approvers[0].status) return "Esperando Aprobación $ Flai";
      if (val?.loadingStatus?.text == "Expecting Approval" && val?.approvers[0].status) return "Esperando Aprobación del Chofer";
      if (val?.loadingStatus?.text == "Approved") return "Viaje Aprobado";
      if (val?.loadingStatus?.text == "Driver Arrival") return "Chofer Llegó a Recoger";
      if (val?.loadingStatus?.text == "Dispatched") return "Listo Para Entregar";
      if (val?.loadingStatus?.text == "Loading truck") return "Cargando Vehiculo";
      if (val?.loadingStatus?.text == "Delivered") return "Viaje Entregado";
    },
    async setGps() {
      return await this.localStorageGps.get(`gps ${this.load?.loadMapId}`);
    },
  },
};
