// import orders from "../store/Orders";
// import profiles from "../store/Profiles";
import router from "../router";
import services from "../services/index";
import { Geolocation } from "@capacitor/geolocation";
import { LocalStorage } from "../mixins/LocalStorage";
import { Storage } from "@ionic/storage";
import {profile } from '../types'

export const Mixins = {
  data() {
    return {
      profile,

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
                0.00003 ||
              Math.abs(location.longitude - this.lastLocation.longitude) >
                0.00003
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
    }, 12000);
  },

  methods: {
    async changeRouteLoads(val, load = null) {
      if (load.loadType === this.profile.container) {
        if (val == "Expecting Approval") router.push({ name: "confirm-trip" });
        if (val == "Driver Arrival") await this.driverArrival(load);
        if (val == "Approved") await this.uploadTrip(load);
        if (val == "Dispatched") await this.startLoadRoute(load);
        if (val == "Deliver-Load")
          router.push({ name: "delivery-routes" });
        if (val == "return-container")
          router.push({ name: "return-container" });
        if (val == "Delivered") this.removeInfoInStorage(load)    
  
      } else {
          if (val == "Expecting Approval") router.push({ name: "confirm-trip" });
          if (val == "Driver Arrival") await this.driverArrival(load);
          if (val == "Approved") await this.uploadTrip(load);
          if (val == "Dispatched") await this.startLoadRoute(load);
          if (val == "Deliver-Load")
            router.push({ name: "delivery-routes" });
          if (val == "Delivered") {
            this.removeInfoInStorage()
            localStorage.removeItem("loadingProgress");
            this.localStorageGps.remove(`gps ${load?.loadMapId}`);
            localStorage.removeItem(`loadStatus${load?.loadMapId}`);
          }
      }
    },
    async driverArrival(val) {
      services.loadsScanServices.driverArrival(val.loadMapId);
      let location = await this.location();
      this.localStorageGps.set(`gps ${val.loadMapId}`, true);
      this.load = val;
      services.gpsServices.updateFirstLocation(
        this.user?.id,
        location?.latitude,
        location?.longitude,
        this.load?.bay_id._id
      );
    },

    async uploadTrip(load) {
      this.localStorageGps.remove(`gps ${load?.loadMapId}`);

      if(load?.loadType == this.profile?.b2b && !load?.scanningRequired){
        await this.uploadOrDownload(load)
        
      }else if(load?.loadType == this.profile?.b2b && load?.scanningRequired){
        router.push({ name: 'orders' });
      }

      if(load?.loadType == this.profile?.container && !load?.scanningRequired){
        await this.uploadOrDownload(load)

      }else if(load?.loadType == this.profile?.container && load?.scanningRequired){
        router.push({ name: 'orders' });
      }
    },
    async startLoadRoute(val) {
      if (this.setting.maps) await this.setMap(val);
      this.localStorageGps.set(`gps ${val.loadMapId}`, true);

      localStorage.setItem(`startRoute${val.loadMapId}`, JSON.stringify(true));
      
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
      if (val?.loadingStatus?.text == "Dispatched")  return "Listo para Entregar";
    
      if (val?.loadingStatus?.text == "Loading truck") return "Cargando Vehiculo";

      if (val?.loadingStatus?.text == "Delivered") {
        localStorage.removeItem(`sendInfo${val.loadMapId}`)
        return "Viaje Entregado";
      } 
    },
    async setGps() {
      if(this.load?.loadMapId){
        return await this.localStorageGps.get(`gps ${this.load?.loadMapId}`);
      }else{
        return false
      }
    },

    async uploadOrDownload(val){
      this.localStorageGps.remove(`gps ${val.loadMapId}`)
      let totalOfBoxes = await this.setLoadTruck(val)
      await this.$services.loadsScanServices.completeLoad(val.loadMapId, totalOfBoxes ) 
      localStorage.setItem(`uploadStorage${this.load.loadMapId}`,JSON.stringify(true))
    },
    async setLoadTruck(val){
      let totalOfBoxes = 0
      for(let cont = 0; cont < val.Orders.length; cont++){
        let load = val.Orders[cont]
        let orders =  await this.$services.loadsScanServices.getProduct(load._id);
        Object.assign(val.Orders[cont], orders[0])
        let order = orders.find(x => x)
        totalOfBoxes += load.no_of_boxes
        for(var i = 0; i < order.products.length; i++){
          let prod = order.products[i]
          if(prod.scanOneByOne === "no") {
            prod.loadScanningCounter = prod.quantity
            await this.$services.loadsScanServices.scanProduct(order._id, prod._id, prod.loadScanningCounter, prod.product._id, prod.qrCode  );
          }
          else {
            for(let i = 0; i <= prod.quantity; i++){
              prod.loadScanningCounter += i
              await this.$services.loadsScanServices.scanProduct(order._id, prod._id, prod.loadScanningCounter, prod.product._id, prod.qrCode  );
            }
          }
        }
      }
      return totalOfBoxes
    },
    removeInfoInStorage(val){
      this.load = val
      localStorage.removeItem("loadingProgress");
      this.localStorageGps.remove(`gps ${val?.loadMapId}`);
      
      localStorage.removeItem(`startRoute${this.load?.loadMapId}`)
      localStorage.removeItem(`deliverLoad${this.load?.loadMapId}`)
      localStorage.removeItem(`uploadStorage${this.load?.loadMapId}`)
    },

    async setStructure(order, listOfOrders = [], listOfOrderTotal = []){
      let firstProductInfo;
      let totalOfOrders = 0;
      for (let i = 0; i < order.products.length; i++) {
        const x = order?.products[i];
          let {order_num, _id} = order
          let {name, qrCode, quantity, scanOneByOne, loadScanningCounter} = x 
          firstProductInfo = {order_num, name, _id, qrCode, quantity, scanOneByOne, loadScanningCounter}       
          listOfOrders.unshift(firstProductInfo)
  
  
          listOfOrders.forEach( x => {
            let {qrCode,  loadScanningCounter, order_num} = x
             var productQrCode = listOfOrders.filter( p => p.qrCode == x.qrCode )
              if(productQrCode){
                productQrCode.forEach(product => {
                  totalOfOrders += product.quantity
                })
              }
              let SecondProductInfo = {order_num, qrCode, totalOfOrders, loadScanningCounter}
                listOfOrderTotal.unshift(SecondProductInfo)
                totalOfOrders = 0
           })
           
           let products = []
           listOfOrderTotal.forEach(x => {
             let product = products.find(p => p.qrCode == x.qrCode)
             if(product){
                 if(x.totalOfOrders > product.totalOfOrders){
                     product.totalOfOrders = x.totalOfOrders
                 }   
             }else{
                 products.push(x)
             }
           })
           listOfOrderTotal = products
  
      }
      return {firstStructure: listOfOrders, secondStructure: listOfOrderTotal}
    }
  },
};
