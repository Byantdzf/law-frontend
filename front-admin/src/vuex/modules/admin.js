import { get, post, put, del } from '@/utils/xhr.js'

const admin = {
  namespaced: true,
  actions: {
    // 角色 -- 添加
    roleQuery: (context, params) => get(`/role/list`, params),
    // 角色 -- 添加
    roleAdd: (context, params) => post(`/role/add`, params),
    // 角色 -- 更新
    roleUpdate: (context, params) => put(`/role/update`, params),
    // 角色 -- 修改状态
    roleDel: (context, ids) => del(`/role/${ids}`),

    // 管理员 -- 添加
    managerAdd: (context, params) => post(`/manager`, params),
    // 管理员 -- 更新
    managerUpdate: (context, params) => put(`/manager`, params),
    // 管理员 -- 修改状态
    managerDel: (context, ids) => del(`/manager/${ids}`),
    permsList: (context, params) => get(`/perms/list`, params),
    getslectedPerm: (context, id) => get(`/role/perm/${id}`),
    updateSelectedPerm: (context, payload) => put(`/role/perms/update/${payload.id}`, payload.params),
    managerDetail: (context, params) => get(`/manager/details`, params)
  }
}
  
export default admin
