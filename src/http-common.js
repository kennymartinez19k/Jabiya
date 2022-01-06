import user from './store/SingInStore'
import axios from 'axios'
let tokenInfo = '';
if(JSON.parse(localStorage.getItem('auth'))) {
  const token = JSON.parse(localStorage.getItem('auth'))
 tokenInfo = token?.cookie?.find(x => x)
console.log(token, 'token')
} else if (user?.state?.userData) {
  tokenInfo =  user.state.userData?.cookie[0]
  console.log(tokenInfo, '2222')
}

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
    credential :"same-origin",
    headers: { 
      'Content-Type': 'application/json', 
      auth: tokenInfo
    }
})

export default axiosInstance
