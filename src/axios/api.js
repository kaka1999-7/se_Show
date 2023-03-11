import request from './request'

export const reqHeaderItemList=(params)=>request({
    url:"mock/headerItemList",
    method:"get",
    data:params||{}
})
export const reqLeftItemList=(params)=>request({
    url:"mock/leftItemList",
    method:"get",
    data:params||{}
})
// 获取主数据
export const reqData=(params)=>request({
    url:"/basedata",
    method:"get",
    data:params||{}
})
// 上传文件
export const postFile=(params)=>request({
    url:"/upload",
    method:"post",
    data:params||{}
})
// 请求合并文件
export const merge=(params)=>request({
    url:"/merge",
    method:"get",
    params:params||{}
})
// 请求账号
export const getAccount=(params)=>request({
    url:"/loginps",
    method:"get",
    params:params||{}
})
// 更新主数据
export const upDate=(params)=>request({
    url:"/update",
    method:"post",
    data:params||{}
})
// 
export const deleteFile=(params)=>request({
    url:"/delete",
    method:"post",
    data:params||{}
})