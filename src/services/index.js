import SingInServices from './SingInServices'
import axiosInstance from '../http-common'
import LoadsServices from './LoadsServices'
import LoadsScanServices from './LoadScanServices'
import InvoicesSevices from './InvoicesSevices'
import DeliverServices from './DeliverServices'
import RequestServices from './RequestServices'
import QueueServices from './QueueServices'
import GpsServices from './GpsServices'

export default {
    axiosInstance: axiosInstance,
    singInServices: new SingInServices(axiosInstance),
    loadsServices: new LoadsServices(axiosInstance),
    loadsScanServices: new LoadsScanServices(axiosInstance),
    invoicesSevices: new InvoicesSevices(axiosInstance),
    deliverServices: new DeliverServices(axiosInstance),
    requestServices: new RequestServices(axiosInstance),
    queueServices: new QueueServices(),
    gpsServices: new GpsServices(axiosInstance) 
    
}
