import axiosInstance from '../http-common'
import EjemploService from './EjemploService'
import LoadsServices from './LoadsServices'
import SingInServices from './SingInServices'

export default {
    ejemploService: new EjemploService(axiosInstance),
    loadsServices: new LoadsServices(axiosInstance),
    singInServices: new SingInServices(axiosInstance),
}
