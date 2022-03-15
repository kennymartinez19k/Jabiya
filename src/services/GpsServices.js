

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
}
  export default GpsServices
  