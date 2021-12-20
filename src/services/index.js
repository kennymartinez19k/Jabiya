import axios from 'axios'
import EjemploService from './EjemploService'
import LoadsServices from './LoadsServices'
import SingInServices from './SingInServices'


const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',

  }
})


export default {
    ejemploService: new EjemploService(axiosInstance),
    loadsServices: new LoadsServices(axiosInstance),
    singInServices: new SingInServices(axiosInstance),
}
