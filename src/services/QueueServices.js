import { LocalStorage } from "../mixins/LocalStorage";

export const storage = {
  mixins:[LocalStorage]
}

class QueueServices {
    constructor () {
        this.queueId = "Queue"
        if (!localStorage.getItem('Queue')) {
          localStorage.setItem('Queue', "[]")
        }
    }
    dequeue = function () {
        let elements = JSON.parse(LocalStorage.methods.getLocalStorage(this.queueId))
        let result = elements.shift();
        LocalStorage.methods.setLocalStorage(this.queueId, JSON.stringify(elements)) 
        return result;
    }
    enqueue = function (e) {
        let elements = JSON.parse(LocalStorage.methods.getLocalStorage(this.queueId))
        elements.push(e);
        localStorage.setItem(this.queueId, JSON.stringify(elements)) 
    }
  
    isEmpty = function () {
      let elements = JSON.parse(localStorage.getItem(this.queueId))
      return elements?.length == 0;
    }
  
    peek = function () {
      let elements = JSON.parse(localStorage.getItem(this.queueId))
      return elements?.length > 0 ? elements[0] : undefined;
    }
    
  
    length = function () {
        let elements = JSON.parse(localStorage.getItem(this.queueId))
        return elements.length;
     }
  } 

  export default QueueServices