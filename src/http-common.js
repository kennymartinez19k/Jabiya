import axios from 'axios'
let token = '';
  token = localStorage.getItem('auth')
  console.log(token)

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
    credential :"same-origin",
    headers: { 
      'Content-Type': 'application/json', 
      auth: token
    }
})

export default axiosInstance
