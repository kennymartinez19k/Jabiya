class QueueServices {
    constructor (queueId) {
        this.queueId = "Queue_" + queueId
        if (!localStorage.getItem(this.queueId)) {
          localStorage.setItem(this.queueId, "[]")
        }
    }
   
    dequeue = function () {
        let elements = JSON.parse(localStorage.getItem(this.queueId))
        let result = elements.shift();
        localStorage.setItem(this.queueId, JSON.stringify(elements)) 
        return result;
    }
  
    enqueue = function (e) {
        let elements = JSON.parse(localStorage.getItem(this.queueId))
        elements.push(e);
        localStorage.setItem(this.queueId, JSON.stringify(elements)) 
    }
  
    isEmpty = function () {
      let elements = JSON.parse(localStorage.getItem(this.queueId))
      return elements.length == 0;
    }
  
    peek = function () {
      let elements = JSON.parse(localStorage.getItem(this.queueId))
      return elements.length > 0 ? elements[0] : undefined;
    }
    
  
    length = function () {
        let elements = JSON.parse(localStorage.getItem(this.queueId))
        return elements.length;
     }
  } 

  export default QueueServices