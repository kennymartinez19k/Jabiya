import axios from 'axios'
import EjemploService from './EjemploService'
import LoadsServices from './LoadsServices'
import SingInServices from './SingInServices'

const token = 'connect.sid=s%3AxDR6dcCLopVQID3Qan32zeK6CHwp1Evs.K1iZ%2BfO8SOe22u3tmkwkjg3acN1j1GV4cOBxFbjCACM; Path=/; Expires=Fri, 24 Dec 2021 01:14:42 GMT; HttpOnly'
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
