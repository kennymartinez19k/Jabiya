import axiosInstance from '../http-common'
import LoadsServices from './LoadsServices'
import LoadsScanServices from './LoadScanServices'
import SingInServices from './SingInServices'

export default {
    loadsServices: new LoadsServices(axiosInstance),
    singInServices: new SingInServices(axiosInstance),
    loadsScanServices: new LoadsScanServices(axiosInstance),
    
}
