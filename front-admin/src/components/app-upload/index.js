/** 
 * app-upload-file
 * @prop {String} field *form表单属性字段
 * @prop {String, Array, Object} value *form表单属性字段
 * @prop {Object} row  table列表的行
 * @prop {Object} col  table列表的列
 * @prop {Boolean}  config.remark 描述输入框 true or false
 * @prop {Number String} config.max 限制上传文件的数量 "1" or 1 
 * @prop {Boolean} config.preview  是否是缩略图 默认false
 * @prop {Boolean} config.hideBtn  上传达到上限个数时，是否隐藏上传按钮 默认false
 * @prop {Boolean, String} config.tips  是否显示提示语 默认false
 * @prop {String} config.fileType  jpg,jpeg,png,gif,bmp,pdf,JPG,JPEG,PBG,GIF,BMP,PDF,txt ,doc ,..限制文件类型
 * @prop {Number String} config.fileSize  限制文件大小 2048 1024 512 
 * @prop {String} config.btnIcon  上传按钮图标class 
 * @prop {String} config.urlKey  文件路径字段名 imgUrl or fileUrl 按字段需求传 默认fileUrl
 * @prop {String} config.nameKey  文件名称字段名 按字段需求传 默认fileName
 * @prop {String} config.remarkKey  文件描述的段名 remark or content 等等
 * @prop {String ,Array} config.dataType   返回数据类型 'string' or 'array' or 'object'
 * @method change  value变化触发事件 { field, value, row, col }
*/

import AppUploadFile from './src/main.vue'

export default AppUploadFile

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppUploadFile.name, AppUploadFile)
}
