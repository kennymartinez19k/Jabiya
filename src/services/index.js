import SingInServices from './SingInServices'
import axiosInstance from '../http-common'
import LoadsServices from './LoadsServices'
import LoadsScanServices from './LoadScanServices'
import InvoicesSevices from './InvoicesSevices'
import ImagesService from './ImagesService'

// let axiosInstance = new AxiosInstance()

export default {
    axiosInstance: axiosInstance,
    singInServices: new SingInServices(axiosInstance),
    loadsServices: new LoadsServices(axiosInstance),
    loadsScanServices: new LoadsScanServices(axiosInstance),
    invoicesSevices: new InvoicesSevices(axiosInstance),
    imagesService: new ImagesService(axiosInstance),
}
