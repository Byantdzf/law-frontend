import { get, postJson, putJson } from '@/utils/xhr.js'
import { getTreeData, treeToList } from "@/utils/tools"

const auth = {
  namespaced: true,
  state: {
    name: 'auth'
  },
  actions: {
    // 登录
    login: (context, payload) => postJson('/pc/mgr/login', payload, { loading: false, auth: false }),

    // 修改密码
    updatePassword: (context, payload) => putJson('/pc/mgr/update/password', payload, { loading: false }),

    // 获取登录用户导航菜单
    getMenus({ rootState }, routes) {
      return new Promise((resolve, reject) => {
        // get('/ptMenu/myMenu').then(res => {
        get('menu.json', {}, { successCode: 'any' }).then(response => {
          let data = response
          // rootState.navs = getTreeData(arrSort(data, 'id'))
          // let data = res.data || []
          if (routes && routes.length) {
            routes = treeToList(routes).map(v => v.path)
          }

          data.forEach(v => {
            if (v.url && !routes.includes(v.url)) {
              v.url = '/404'
            }
          })

          rootState.navs = getTreeData({ list: data, pid: 'parentId', cid: 'id' })
          
          resolve(rootState.navs)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 所有导航菜单
    getAllMenus() {
      return new Promise((resolve, reject) => {
        get('/ptMenu/selectAll').then(res => {
          let data = res.data || []
          data = getTreeData({ list: data, pid: 'parent', cid: 'id' })
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取某用户已被授权的菜单
    getPermissionMenus: (context, payload) => get('/ptMenu/getMenuIdByUserId', payload)
  }
}

export default auth
