import axios from 'axios'
const token =  localStorage.getItem('auth')

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
    credential :"same-origin",
    headers: { 
      'Content-Type': 'application/json', 
      auth: token
    }
})

export default axiosInstance
