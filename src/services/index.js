import axios from 'axios'
import EjemploService from './EjemploService'
import LoadsServices from './LoadsServices'
import SingInServices from './SingInServices'

const token = 'connect.sid=s%3AK5VcQcnef88Cpw61YKmt_jvBgbfvR6pc.nCNfabVUDu8NTMyXSMefGsAUDqHm5nYEe1iyKft5Rio; Path=/; Expires=Wed, 22 Dec 2021 23:57:03 GMT; HttpOnly'

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
