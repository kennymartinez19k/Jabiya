import axios from 'axios'
let token = '';
if(JSON.parse(localStorage.getItem('auth'))) 
  token = JSON.parse(localStorage.getItem('auth'))
const tokenInfo = token?.cookie?.find(x => x)

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
    credential :"same-origin",
    headers: { 
      'Content-Type': 'application/json', 
      auth: tokenInfo
    }
})

export default axiosInstance
