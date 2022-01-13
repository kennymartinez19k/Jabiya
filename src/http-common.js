import axios from 'axios'

let instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
    credential :"same-origin",
    headers: { 
      'Content-Type': 'application/json', 
    }
})
instance.interceptors.request.use(function (config) {
  let token = localStorage.getItem('auth')
  config.headers.auth =  token;
  return config;
});


export default instance
