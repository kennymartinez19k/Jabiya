
class SingInServices {
    constructor (http) {
      this.http = http;
    this.settingsLocalStore =  JSON.parse(localStorage.getItem('setting'));

    }
  
    async getToken (signIn) {
      localStorage.removeItem('auth');
      const result = await this.http.post(`${this.settingsLocalStore.url}/exo/authenticate`, signIn)
      localStorage.setItem('auth', result.data.data.cookie[0]);
      localStorage.setItem('userInfo', JSON.stringify(result.data.data));

      return result.data.data
    }

  }
  export default SingInServices
  