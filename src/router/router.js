import Router from "vue-router";
import Vue from 'vue'
import Alter from '../components/alter/alter.vue'
import Login from '../components/login/mylogin.vue'
import Home from '../components/home.vue'
Vue.use(Router)
const routerPush = Router.prototype.push            //push，replace函数返回的都是promise
Router.prototype.push = function (location,resolve,reject) {   //重写的push依然要接收执行push时的参数，
    if(resolve&&reject)
        return routerPush.call(this,location,resolve,reject)
    else
    return routerPush.call(this,location,()=>{},()=>{})
 
}

export default new Router({
    mode:"history",
    routes:[
       
        {
            path:'/home',
            name:'home',
            component:Home,
            meta:{showOther:true}  
        },
        {
            path:'/alter',
            component:Alter,
            meta:{showOther:false}  
        },
        {
            path:'/login',
            name:"login",
            component:Login,
            meta:{showOther:false}  
        },
        // {
        //     path:"*",
        //     redirect:"/login",
        //     meta:{showOther:true}  
        // },
        {
            path:"/",
            redirect:"/login",
            meta:{showOther:true}  
        }, 
    ]
})