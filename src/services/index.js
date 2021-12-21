import axios from 'axios'
import EjemploService from './EjemploService'
import LoadsServices from './LoadsServices'
import SingInServices from './SingInServices'

const token = 'connect.sid=s%3AsCjKfg2VR_bL2Q2NjPnbhHf4pb_w7GEo.MMn38Mlnbn%2F2sDQ2vwrFf6JME71c%2B8gRA6jO%2Bwclpmo; Path=/; Expires=Wed, 22 Dec 2021 01:48:54 GMT; HttpOnly'

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
    credential :"same-origin",
    headers: { 
        'Content-Type': 'application/json', 
        auth: token
      }
})


export default {
    ejemploService: new EjemploService(axiosInstance),
    loadsServices: new LoadsServices(axiosInstance),
    singInServices: new SingInServices(axiosInstance),
}
