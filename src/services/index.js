import SingInServices from './SingInServices'
import axiosInstance from '../http-common'
import LoadsServices from './LoadsServices'
import LoadsScanServices from './LoadScanServices'
import InvoicesSevices from './InvoicesSevices'

export default {
    singInServices: new SingInServices(axiosInstance),
    loadsServices: new LoadsServices(axiosInstance),
    loadsScanServices: new LoadsScanServices(axiosInstance),
    invoicesSevices: new InvoicesSevices(axiosInstance),
    
}
