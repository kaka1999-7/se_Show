import vuex from 'vuex'
import Vue from 'vue'
import { reqHeaderItemList, reqLeftItemList,reqData } from "../axios/api";
Vue.use(vuex)

const state={
    headerItemList:[],
    leftItemList:[],
    baseData:[]
}
const mutations={
    REQHEADERITEMLIST(state,data){
        state.headerItemList=data
        // console.log(data)
    },
    REQLEFTITEMLIST(state,data){
        state.leftItemList=data
        // console.log(data)
    },
    REQDATA(state,data){
        state.baseData=data
        // console.log(data)
    },
}
const actions={
   async reqHeaderItemList({commit}){
       let res=await reqHeaderItemList()    //可携带参数
       if(res.code=200){
        commit('REQHEADERITEMLIST',res.data)
       }
      
    },
    async reqLeftItemList({commit}){
        let res=await reqLeftItemList()    //可携带参数
        if(res.code=200){
         commit('REQLEFTITEMLIST',res.data)
        }
     },
     async reqData({commit}){
        let res=await reqData()    //可携带参数
        if(res.code=200){
            // if(res.data)
            // console.log(res)
             commit('REQDATA',res.baseData)
        }
     }
}
const getters={

}
export default new vuex.Store({
    state,
    mutations,
    actions,
    getters
}) 
