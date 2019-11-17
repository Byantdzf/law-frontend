import { post, postJson, del, put, putJson } from '@/utils/xhr.js'

const content = {
  namespaced: true,
  actions: {
    // 广告 -- 添加
    advAdd: (context, params) => postJson(`/pc/mgr/adv`, params),
    // 广告 -- 修改
    advUpdate: (context, params) => putJson(`/pc/mgr/adv`, params),
    // 广告 -- 删除
    advDel: (context, ids) => del(`/pc/mgr/adv/${ids}`),

    // 文章 -- 添加
    articleAdd: (context, params) => postJson(`/pc/mgr/article`, params),
    // 文章 -- 修改
    articleUpdate: (context, params) => postJson(`/pc/mgr/article/update`, params),
    // 文章 -- 删除
    articleDel: (context, ids) => del(`/pc/mgr/article/${ids}`),

    // 敏感词 -- 添加
    sensitiveAdd: (context, params) => postJson(`/sensitive`, params),
    // 敏感词 -- 修改
    sensitiveUpdate: (context, params) => put(`/sensitive`, params),
    // 敏感词 -- 删除
    sensitiveDel: (context, ids) => del(`/sensitive/${ids}`),

    // 反馈信息 -- 添加
    feedbackAdd: (context, params) => postJson(`/feedback`, params),
    // 反馈信息 -- 修改
    feedbackUpdate: (context, params) => put(`/feedback`, params),
    // 反馈信息 -- 标记
    feedbackMark: (context, ids) => put(`/feedback/mark/${ids}`),
    // 反馈信息 -- 删除
    feedbackDel: (context, ids) => del(`/feedback/${ids}`),

    // 分块法律服务 -- 添加
    blockAdd: (context, params) => post(`/blockLaw`, params),
    // 分块法律服务 -- 修改
    blockUpdate: (context, params) => put(`/blockLaw`, params),
    // 分块法律服务 -- 删除
    blockDel: (context, ids) => del(`/blockLaw/${ids}`),

    // 分类 -- 添加
    categoryAdd: (context, params) => post(`/category`, params),
    // 分类 -- 修改
    categoryUpdate: (context, params) => put(`/category`, params),
    // 分类 -- 删除
    categoryDel: (context, ids) => del(`/category/${ids}`),

    // 模板 -- 添加
    templateAdd: (context, params) => post(`/template`, params),
    // 模板 -- 修改
    templateUpdate: (context, params) => put(`/template`, params),
    // 模板 -- 删除
    templateDel: (context, ids) => del(`/template/${ids}`),
  }
}
  
export default content
