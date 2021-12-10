import axios from 'axios'
import EjemploService from './EjemploService'
import LoadsServices from './LoadsServices'
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-type': 'application/json'
  }
})

export default {
    ejemploService: new EjemploService(axiosInstance),
    loadsServices: new LoadsServices(axiosInstance),
}
