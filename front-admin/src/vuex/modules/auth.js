import { get, post } from '@/utils/xhr.js'
import { getTreeData } from "@/utils/tools"

const auth = {
  namespaced: true,
  state: {
    name: 'auth'
  },
  actions: {
    // 登录
    login: (context, payload) => post('sysuserLogin/loginAdmin', payload, { loading: false }),

    // 获取导航菜单
    getMenus({ rootState }, payload) {
      return new Promise((resolve, reject) => {
        get('ptMenu/selectAll', payload).then(res => {
        // get('menu.json', payload, { successCode: 'any' }).then(response => {
          // let data = response
          // rootState.navs = getTreeData(arrSort(data, 'id'))
          let data = res.data || []
          rootState.navs = getTreeData({ list: data, pid: 'parent', cid: 'id' })
          resolve(rootState.navs)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default auth
