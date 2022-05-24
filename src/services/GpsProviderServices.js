import axios from 'axios'

class GpsProviderServices {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore;
    }
    
    setURL(val){
      this.settingsLocalStore = val
    }

    async createGps(load){
      let cookie = localStorage.getItem('auth')
      let hdr = {
        headers:{
          "auth": cookie
        }
      }
      let body = {
          "driverId": load?.Vehicles[0]?.driver_id._id,
          "vehicleGpsId": load?.Vehicles[0]?.gpsId,
          "loadMapId":  load.loadMapId,
          "bayId": load.bay_id._id,
          "gpsProvider": load?.Vehicles[0]?.gpsProvider
      }
      
      axios.post(`http://flai.hopto.org/gps-provider/gps`, body, hdr).then(() => {
          this.startGps(body.vehicleGpsId)
      }).catch(error => {
          console.log(error.message)
      })
    }
    async startGps(gpsId){
      console.log('heyyyyyyyyyyyyy')
      let cookie = localStorage.getItem('auth')
      let hdr = {
        headers:{
          "auth": cookie
        }
      }
      let body = {
        "action":"startGps"
      }
      axios.put(`http://flai.hopto.org/gps-provider/gps/${gpsId}`, body, hdr).then((res) => {
          console.log(res, 'res')
          localStorage.setItem(`gpsProvider ${res?.data?.loadMapId}`, JSON.stringify(true))
      }).catch(error => {
          console.log(error.message)
      })
    }

    async stopGps(gpsId){
      let cookie = localStorage.getItem('auth')
      let hdr = {
        headers:{
          "auth": cookie
        }
      }
      let body = {
        "action":"stopGps"
      }
      
      axios.put(`http://flai.hopto.org/gps-provider/gps/${gpsId}`, body, hdr).then((res) => {
          localStorage.setItem(`gpsProvider ${res?.data?.loadMapId}`, JSON.stringify(false))

      }).catch(error => {
          console.log(error.message)
      })
    }


    async getVehicleGpsId(gpsId){
      try{
        let res = await axios.get(`http://flai.hopto.org/gps-provider/gps`)
        return res.data.find(x => x.vehicleGpsId == gpsId)
      }catch(error){
        console.log(error.message)
      }
      }
}
  export default GpsProviderServices
  