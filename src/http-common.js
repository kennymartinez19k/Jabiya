import axios from 'axios'
const token =  JSON.parse(localStorage.getItem('auth'))

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
    credential :"same-origin",
    headers: { 
      'Content-Type': 'application/json', 
      auth: token.cookie
    }
})

export default axiosInstance
