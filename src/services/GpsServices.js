import {add} from '../queue'

class GpsServices {
    constructor (http) {
      this.http = http
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

      const url = `http://preprod.flai.com.do:8756/exo/drivers/${driverId}/locations`
      
      const json = {'method': 'post', 'url': url, 'body': body}
      add(json)
      
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

      const url = `http://preprod.flai.com.do:8756/exo/drivers/${driverId}/locations/first`
      
      const json = {'method': 'post', 'url': url, 'body': body}
      add(json)
      
    }
}
  export default GpsServices
  