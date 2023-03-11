import Mock from 'mockjs'

import {headerItemList,leftItemList,data} from './data.js'

// Mock.mock('mock/headerItemList',{code:200,data:headerItemList})
// Mock.mock('mock/leftItemList',{code:200,data:leftItemList})
Mock.mock('mock/data',{code:200,data:data})