import axios from 'axios'

class GpsServices {
    constructor (http) {
      this.http = http;
      this.settingsLocalStore;
    }
    
    setURL(val){
      this.settingsLocalStore = val
    }

    async updateLocation (driverId, lat, lng, bayId){
      
      const body = {
        "lat": lat,
        "lng": lng,
        "manufacturerName": "samsung",
        "modelNo": "SM-N970U",
        "serialNo": "unknown",
        "battery": "67",
        "GPSAccuracy": "18",
        "imei": "",
        "color": "blue",
        "bayId": bayId
    }
        this.http.post(`${this.settingsLocalStore.url}/exo/drivers/${driverId}/locations`, body).then(res => {
          console.log(res)
        })
    }

    async updateFirstLocation (driverId, lat, lng, bayId){

      const body = {
        "lat": lat,
        "lng": lng,
        "manufacturerName": "samsung",
        "modelNo": "SM-N970U",
        "serialNo": "unknown",
        "battery": "67",
        "GPSAccuracy": "18",
        "imei": "",
        "color": "red",
        "bayId": bayId
      }
      this.http.post(`${this.settingsLocalStore.url}/exo/drivers/${driverId}/locations/first`, body).then(res => {
        console.log(res)
      })
    }

    async getTokenGps(){
      let formData = new FormData()
      formData.append("apikey", "f3b5dc73aceff4bf1439f4f6367f0905")
      formData.append("token", "")
      formData.append("username", "roa57113@gmail.com")
      formData.append("password", "exo@dmin")
      
      let headers = {
          "Content-Type": "multipart/form-data",
      }
      
      axios.post('http://api.redgps.com/api/v1/gettoken', formData, headers).then(res => {
          console.log(res)
      }).catch(error => {
          console.log(error.response.data)
      })
    }
}
  export default GpsServices
  