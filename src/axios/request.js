import axios from "axios";
import nProgress from "nprogress";
import "nprogress/nprogress.css"

const request=axios.create({
    // baseURL:"/test", //老家
    // baseURL:"https://379e-2408-844f-1516-c35a-e9d1-d969-f131-35a0.jp.ngrok.io",    //CNC宽带,可能会变
    baseURL:"/",
    timeout:50000
})
request.interceptors.request.use(config=>{
    nProgress.start()
    return config
})
request.interceptors.response.use(success=>{
    nProgress.done()
    return success.data
},error=>{
    console.log(error)
    return Promise.reject(new Error('request Faill!!!')) 
}
)

export default request