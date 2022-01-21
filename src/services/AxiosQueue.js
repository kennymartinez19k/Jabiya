import QueueServices from './QueueServices'
class AxiosQueue {
    constructor () {
     this.queueServices = new QueueServices("request")
    }
    get (url, headers, callbackSetInfo) {
      this.queueServices.enqueue({url, headers, method: "get", callbackSetInfo})
    }
    post (url, body, headers, callbackSetInfo) {
      this.queueServices.enqueue({url, body, headers, method: "post", callbackSetInfo})
    }
    patch (url, body, headers, callbackSetInfo) {
      this.queueServices.enqueue({url, body, headers, method: "patch", callbackSetInfo})
    }
}
  export default AxiosQueue
  