/**
 * 公共方法 $axios
 * @method $axios
 * @param[String] url 接口请求地址
 * @param[String] path 请求路径
 * @param[String] method 请求方法 默认GET
 * @param[Object] headers 请求头
 * @param[Boolean] loading 是否需要loading 默认true
 * @param[Boolean] auth 是否需要token验证 默认true
 * @param[Number|String] successCode 接口返回成功状态码 默认2, 等于any时，所有状态都当成功处理
 * @param[String] contentType 默认application/x-www-form-urlencoded
*/

import axios from 'axios'
import bus from './bus'
import SYSTEM from '@/utils/system'

let tasks = []

const Ajax = function(options = {}) {
  return new Promise((resolve, reject) => {
    let {
      url = SYSTEM.baseUrl,
      path = '',
      method = 'get',
      headers,
      params,
      timeout = 60000,
      successCode = 2,
      loading = true,
      auth = true,
      contentType = 'application/x-www-form-urlencoded; charset=utf-8'
    } = options
    
    // 合并header
    headers = Object.assign({
      'Content-Type': contentType,
      'authentication': auth ? SYSTEM.userToken() : null
    }, headers)
    
    // axios config
    let config = {
      url: url + path,
      method,
      headers,
      timeout
    }

    if (method.toUpperCase() === 'GET') {
      config.params = params
    } else {
      config.data = params
    }

    if (headers['Content-Type'].indexOf('x-www-form-urlencoded') > -1) {
      config.transformRequest = [function (data) {
        let ret = []
        for (let it in data) {
          ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]))
        }
        return ret.join('&')
      }]
    }

    // 是否显示loading
    if (loading) {
      tasks.push(path)
      tasks.length === 1 && bus.$emit('loading', true)
    }

    const hideLoading = () => {
      if (loading) {
        tasks = tasks.filter(v => v != path)
        !tasks.length && bus.$emit('loading', false)
      }
    }

    axios(config).then(res => {
      const data = res ? res.data : null
      const code = data ? data.code : -1

      hideLoading()
      
      if (code === successCode || successCode === 'any') {
        resolve(data)
      } else {
        code === 3 && bus.$emit('reLogin')
        bus.$emit('message', {
          type: 'error',
          msg: data ? data.msg : 'data is null'
        })
        reject(res)
      }
      
    }).catch(err => {
      const status = err && err.response ? err.response.status : 0

      hideLoading()
      status === 401 && bus.$emit('reLogin')
      bus.$emit('message', {
        type: 'error',
        msg: err.message || '服务异常！'
      })
      reject(err)
    })
  })
} 

const get = (path, params, opt) => Ajax({
  path,
  params,
  ...opt,
  method: 'get'
})

const post = (path, params, opt) => Ajax({
  path,
  params,
  ...opt,
  method: 'post'
})

const del = (path, params, opt) => Ajax({
  path,
  params,
  ...opt,
  method: 'delete'
})

const put = (path, params, opt) => Ajax({
  path,
  params,
  ...opt,
  method: 'put'
})

const postJson = (path, params, opt) => {

  // 后台需要将参数全部转string （待改进） --- start
  if (params) {
    for (let key in params) {
      if(typeof(params[key]) == 'number') {
        params[key] = String(params[key])
      }
    }
  }
  // 后台需要将参数全部转string --- end

  params = params ? JSON.stringify(params) : ''

  return Ajax({
    path,
    params,
    ...opt,
    method: 'post',
    contentType: 'application/json'
  })
}

export {
  get,
  post,
  postJson,
  put,
  del
}