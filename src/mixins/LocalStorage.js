import { Storage} from '@ionic/storage'

export const LocalStorage = {
  data() {
    return {
      localStorage: new Storage(),
      queueId: "Queue"
    }
  },
  async mounted() {
      this.localStorage.create();
    if (!await this.localStorage.get(this.queueId)) {
      this.localStorage.set('Queue', "[]")
    }

  },
  methods: {
    async enqueue(value) {
      let element = JSON.parse(await this.localStorage.get(this.queueId))
      element.push(value)
      await this.localStorage.set(this.queueId, JSON.stringify(element));
    },

    async dequeue() {
        let elements = JSON.parse(await this.localStorage.get(this.queueId))
        let result = elements.shift();
        await this.localStorage.set(this.queueId, JSON.stringify(elements)) 
        return result;
    },
    async peek(){
      let elements =  JSON.parse(await this.localStorage.get(this.queueId))
      return elements?.length > 0 ? elements[0] : undefined;
    },
    async all(){
      let elements =  JSON.parse(await this.localStorage.get(this.queueId))
      return elements
    },
    async clear(){
      this.localStorage.clear()
    }
  }
};
