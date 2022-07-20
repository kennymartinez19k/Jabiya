import axios from 'axios'

class GpsProviderServices {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore;
    }
    
    setURL(val){
      this.settingsLocalStore = val
    }

    async createGps(load, action = null){
      let cookie = localStorage.getItem('auth')
      let setting = JSON.parse(localStorage.getItem('setting'))

      let hdr = {
        headers:{
          "auth": cookie,
          "hostname": setting.url
        }
      }
      let body = {
          "driverId": load?.Vehicles[0]?.driver_id._id,
          "vehicleGpsId": load?.Vehicles[0]?.gpsId,
          "loadMapId":  load.loadMapId,
          "bayId": load.bay_id._id,
          "gpsProvider": load?.Vehicles[0]?.gpsProvider
      }

      console.log(hdr)
      
      axios.post(`http://flai.hopto.org/gps-provider/status-vehicle`, body, hdr).then((res) => {
          console.log(res)
          // if(action === 'startGps'){
          //   this.startGps(load)
          // }else if(action == 'stopGps'){
          //   this.stopGps(load)
          // }
      }).catch(error => {
          console.log(error.message)
      })
    }
    async startGps(load){
      let gpsId = load?.Vehicles[0]?.gpsId
      let setting = JSON.parse(localStorage.getItem('setting'))

      let cookie = localStorage.getItem('auth')
      let hdr = {
        headers:{
          "auth": cookie,
          "hostname": setting.url,
        }
      }
      let body = {
        "action":"startGps",
        "driverId": load?.Vehicles[0]?.driver_id._id,
        "vehicleGpsId": load?.Vehicles[0]?.gpsId,
        "loadMapId":  load.loadMapId,
        "bayId": load.bay_id._id,
        "gpsProvider": load?.Vehicles[0]?.gpsProvider
      }
      axios.put(`http://flai.hopto.org/gps-provider/status-vehicle/${gpsId}`, body, hdr).then((res) => {
          console.log(res)
          localStorage.setItem(`gpsProvider ${res?.data?.loadMapId}`, JSON.stringify(true))
          localStorage.setItem(`gps-track${load.loadMapId}`, JSON.stringify({lat: res.data.lat, lng: res.data.lng}))
      }).catch(error => {
          console.log(error.message)
          // this.createGps(load, 'startGps')
      })
    }

    async stopGps(load){
      let gpsId = load?.Vehicles[0]?.gpsId
      let setting = JSON.parse(localStorage.getItem('setting'))
      let cookie = localStorage.getItem('auth')
      let hdr = {
        headers:{
          "auth": cookie,
          "hostname": setting.url,
        }
      }
      let body = {
        "action":"stopGps",
        "driverId": load?.Vehicles[0]?.driver_id._id,
        "vehicleGpsId": load?.Vehicles[0]?.gpsId,
        "loadMapId":  load.loadMapId,
        "bayId": load.bay_id._id,
        "gpsProvider": load?.Vehicles[0]?.gpsProvider
      }
      
      axios.put(`http://flai.hopto.org/gps-provider/status-vehicle/${gpsId}`, body, hdr).then((res) => {
          localStorage.setItem(`gpsProvider ${res?.data?.loadMapId}`, JSON.stringify(false))

      }).catch(error => {
          console.log(error.message)
          // this.createGps(load, 'stopGps')

      })
    }


    async getVehicleGpsId(load){
      let gpsId = load?.Vehicles[0]?.gpsId
      let setting = JSON.parse(localStorage.getItem('setting'))
      let cookie = localStorage.getItem('auth')

      let hdr = {
        headers:{
          "auth": cookie,
          "hostname": setting.url,
        }
      }
      let body = {
        "action":"stopGps",
        "driverId": load?.Vehicles[0]?.driver_id._id,
        "vehicleGpsId": load?.Vehicles[0]?.gpsId,
        "loadMapId":  load.loadMapId,
        "bayId": load.bay_id._id,
        "gpsProvider": load?.Vehicles[0]?.gpsProvider
      }
      
      try{
        let res = await axios.post(`http://flai.hopto.org/gps-provider/status-vehicle/${gpsId}`, body, hdr)
        if(res.data){
          return res.data
        }else{
          let result = JSON.parse(localStorage.getItem(`gps-track${load.loadMapId}`))
          return result
        }
      }catch(error){
        console.log(error.message)
        let result = JSON.parse(localStorage.getItem(`gps-track${load.loadMapId}`))
        return result
       }
      }
}
  export default GpsProviderServices
  