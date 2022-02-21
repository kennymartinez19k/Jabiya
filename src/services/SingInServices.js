

class SingInServices {
    constructor (http, setting) {
      this.http = http;
      this.settingsLocalStore = setting
    }

    setURL(val){
      this.settingsLocalStore = val
    }
  
    async getToken (signIn) {
      console.log(`${this.settingsLocalStore.url}/exo/authenticate`, signIn)
      localStorage.removeItem('auth');
      const result = await this.http.post(`${this.settingsLocalStore.url}/exo/authenticate`, signIn)
      localStorage.setItem('auth', result.data.data.cookie[0]);
      localStorage.setItem('userInfo', JSON.stringify(result.data.data));

      return result.data.data
    }
  }
  export default SingInServices
  