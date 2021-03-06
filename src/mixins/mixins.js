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
      localStorage: new Storage(),

      lastLocation: {
        latitude: 0,
        longitude: 0,
      },
      user: null,
      setting: null,
      hasUbicationServer: false
    };
  },
  mixins: [LocalStorage],
  async mounted() {
    this.$store.dispatch("SettingStorage");
    this.setting = JSON.parse(localStorage.getItem("setting"));

    this.user = JSON.parse(localStorage.getItem("userInfo"));
    this.localStorageGps.create();
    this.localStorage.create()

  },

  methods: {
    async changeRouteLoads(val, load = null) {
      if (load.loadType === this.profile.container) {
        if (val == "Expecting Approval") router.push({ name: "confirm-trip" });
        if (val == "Driver Arrival") await this.driverArrival(load);
        if (val == "Approved") await this.uploadTrip(load);
        if (val == "Dispatched") await this.startLoadRoute(load);
        if (val == "Deliver-Load") {
          load.scanningRequired 
          ? router.push({ name: "delivery-routes" }) 
          : router.push({ name: "delivery-actions-auto" }) 
        }
        if (val == "return-container") router.push({ name: "return-container" });
        if (val == "Delivered") await this.removeInfoInStorage(load)    
      } else {
        if (val == "Expecting Approval") router.push({ name: "confirm-trip" });
        if (val == "Driver Arrival") await this.driverArrival(load);
        if (val == "Approved") await this.uploadTrip(load);
        if (val == "Dispatched") await this.startLoadRoute(load);
        if (val == "Deliver-Load") router.push({ name: "delivery-routes" });
        if (val == "Delivered") await this.removeInfoInStorage(load)
      }
    },
    async driverArrival(load) {
      this.load = load;
      await services.loadsScanServices.driverArrival(this.load.loadMapId);
      try{
        localStorage.setItem(`gps ${this.load.loadMapId}`, true);
        if(this.load.Vehicles[0].gpsProvider == 'Flai Mobile App' || !this.load?.Vehicles[0]?.gpsProvider){
          let location = await JSON.parse(localStorage.getItem('ubication'))
          services.gpsServices.updateFirstLocation(
            this.user?.id,
            location?.latitude,
            location?.longitude,
            this.load?.bay_id?._id
          );
          this.localStorage.set('serverUp' , "true")
        }
        else{
          // send gps services
          await services.gpsProviderServices.createGps(this.load)
        }
      } catch(error){
        this.localStorage.set('serverUp' , "false")
      }
    },

    async uploadTrip(load) {
      if(load.Vehicles[0].gpsProvider == 'Flai Mobile App' || !load.Vehicles[0].gpsProvider){
        localStorage.removeItem(`gps ${load.loadMapId}`);
      }else{
        localStorage.removeItem(`gps ${load.loadMapId}`);
        await services.gpsProviderServices.stopGps(load.Vehicles[0].gpsId)
      }
      
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
    async startLoadRoute(load) {
      if (this.setting.maps) await this.setMap(load);
      localStorage.setItem(`gps ${load?.loadMapId}`, true);
      if(load?.Vehicles[0]?.gpsProvider == 'Flai Mobile App' || !load?.Vehicles[0]?.gpsProvider){
        console.log('flai')
      }else{
        await services.gpsProviderServices.startGps(load?.Vehicles[0]?.gpsId)
      }
      localStorage.setItem(`startRoute${load.loadMapId}`, JSON.stringify(true));
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
      if (val?.loadingStatus?.text == "Expecting Approval" && !val?.approvers[0].status) return "Esperando Aprobaci??n $ Flai";
      if (val?.loadingStatus?.text == "Expecting Approval" && val?.approvers[0].status) return "Esperando Aprobaci??n del Chofer";
      if (val?.loadingStatus?.text == "Approved") return "Viaje Aprobado";
      if (val?.loadingStatus?.text == "Driver Arrival") return "Chofer Lleg?? a Recoger";
      if (val?.loadingStatus?.text == "Dispatched")  return "Listo para Entregar";
      if (val?.loadingStatus?.text == "Loading truck") return "Cargando Vehiculo";
      if (val?.loadingStatus?.text == "Delivered") {
        localStorage.removeItem(`sendInfo${val.loadMapId}`)
        return "Viaje Entregado";
      } 
    },
    async setGps() {
      if(this.load?.loadMapId){
        return await localStorage.getItem(`gps ${this.load?.loadMapId}`);
      }else{
        return false
      }
    },

    async uploadOrDownload(val){
      localStorage.removeItem(`gps ${val.loadMapId}`);

      let totalOfBoxes = await this.setLoadTruck(val)
      await this.$services.loadsScanServices.completeLoad(val.loadMapId, totalOfBoxes ) 
      localStorage.setItem(`uploadStorage${this.load.loadMapId}`,JSON.stringify(true))
      let delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(2000);

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
    async removeInfoInStorage(val) {
      this.load = val
      let statusGpsProvider = JSON.parse(localStorage.getItem(`gpsProvider ${this.load.loadMapId}`))
      if(this.load.Vehicles[0].gpsProvider == 'Flai Mobile App' || !this.load?.Vehicles[0]?.gpsProvider){
        localStorage.removeItem(`gps ${this.load.loadMapId}`);
      }else if(statusGpsProvider){
        await services.gpsProviderServices.stopGps(this.load.Vehicles[0].gpsId)
        localStorage.removeItem(`gps ${this.load.loadMapId}`);

      }
      localStorage.removeItem(`loadStatus${this.load?.loadMapId}`);
      localStorage.removeItem(`startRoute${this.load?.loadMapId}`)
      localStorage.removeItem(`deliverLoad${this.load?.loadMapId}`)
      localStorage.removeItem(`uploadStorage${this.load?.loadMapId}`)
    },

    async setStructure(order, listOfOrders = [], listOfOrderTotal = [], quantityToInvoice = null, currentProdutFromInvoicesOdoo = null, productsOdoo = null){
      let firstProductInfo;
      let totalOfOrders = 0;
      for (let i = 0; i < order.products.length; i++) {
        const currentProductExo = order?.products[i];

          let {order_num, _id} = order
        let { name, qrCode, quantity, scanOneByOne, loadScanningCounter } = currentProductExo
        
          if (productsOdoo !== null) {
            if (currentProductExo.name == currentProdutFromInvoicesOdoo?.productId && quantityToInvoice !== null) {
                let productIndexOdoo = productsOdoo.findIndex(curretProductOdoo => curretProductOdoo.productId == currentProductExo.name)
                quantity = productsOdoo[productIndexOdoo]?.productQuantity - quantityToInvoice 

            } else {
              
                if (productsOdoo.findIndex(curretProductOdoo => curretProductOdoo.productId == currentProductExo.name && !curretProductOdoo.isRewardLine )>= 0) {
                  let productIndexOdoo = productsOdoo.findIndex(curretProductOdoo => curretProductOdoo.productId == currentProductExo.name)
                  quantity = productsOdoo[productIndexOdoo]?.productQuantity - productsOdoo[productIndexOdoo]?.productQuantityToInvoice
                }
            
            }

          }
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
    },

    async setUrl(){
      let setting = await JSON.parse(localStorage.getItem('setting'))
      this.$services.singInServices.setURL(setting)
      this.$services.loadsServices.setURL(setting) 
      this.$services.loadsScanServices.setURL(setting)
      this.$services.invoicesSevices.setURL(setting)
      this.$services.deliverServices.setURL(setting)
      this.$services.gpsServices.setURL(setting)
      this.$services.driverVehicleAssignment.setURL(setting)
      this.$services.exceptionServices.setURL(setting)
    },

    translateOrderStatus(status){
      if(status == "Assigned") return "Asignada"
      if(status == "en-route") return "En Ruta"
      if(status == "Delivered") return "Entregada"
      if(status == "Delivered with exceptions") return "Entregada Con Excepciones"
      if(status == "Created") return "Creada"
    }
  },
};
