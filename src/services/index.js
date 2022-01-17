import SingInServices from './SingInServices'
import axiosInstance from '../http-common'
import LoadsServices from './LoadsServices'
import LoadsScanServices from './LoadScanServices'
import InvoicesSevices from './InvoicesSevices'
import DeliverServices from './DeliverServices'

// let axiosInstance = new AxiosInstance()

export default {
    axiosInstance: axiosInstance,
    singInServices: new SingInServices(axiosInstance),
    loadsServices: new LoadsServices(axiosInstance),
    loadsScanServices: new LoadsScanServices(axiosInstance),
    invoicesSevices: new InvoicesSevices(axiosInstance),
    deliverServices: new DeliverServices(axiosInstance),
}
