<template>
  <el-row class="app-upload">
		<ul class="file-list" v-if="showFileList">
			<li
        v-for="(item, index) in files"
        class="file-item"
        :key="index"
        @click="handleItemClick(item)"
      >
        <a class="file-con">
          <el-image 
            v-if="fConfig.preview"
            class="file-img"
            :alt="item[fConfig.nameKey]"
            :src="`${item[fConfig.urlKey]}`"
            :preview-src-list="files.map(v => v[fConfig.urlKey])"
          />
          <el-button
            v-else
            size="small"
            plain
          >
            {{ item[fConfig.nameKey] }}
          </el-button>
        </a>
        <i
          v-if="!readonly"
          class="file-btn-del el-icon-remove"
          @click.stop="removeFile(index)"
        >
        </i>
				<el-input
          v-if="fConfig.remark && !readonly"
          v-model="item[fConfig.remarkKey]"
          class="file-remark"
          size="mini"
        >
        </el-input>
			</li>     
		</ul>    
		<el-upload
      class="inline-item"
			:action="action || `${ baseUrl }/applets/lawyer/multiUpload`"
			:before-upload="beforeUpload"
			:on-success="handleUploadSuccess"
			:on-error="handleUploadError"
      :disabled="readonly"
			:show-file-list="false"
      :headers="headers"
    >
      <el-row class="file-item" v-if="fConfig.preview && fConfig.max == 1 && files && files[0]">
        <img
          class="file-img"
          :src="`${files[0][fConfig.urlKey]}`"
          :title="files[0][fConfig.nameKey]"
        />
        <i
          v-if="!readonly"
          class="file-btn-del el-icon-remove"
          @click.stop="removeFile(0)"
        >
        </i>
      </el-row>
      <el-button
        v-if="showUploadBtn"
        :class="['upload-btn', { 'icon-btn': fConfig.btnIcon }, fConfig.btnIcon]"
        :loading="uploading"
        :type="`${ fConfig.btnIcon ? 'default' : 'primary' }`"
        size="small"
      >
        {{ uploading ? '正在上传' : '点击上传' }}
      </el-button>
		</el-upload>
    <div class="el-upload__tip" v-if="fConfig.tips">
      <template v-if="fConfig.tips !== true">
        <span>{{ fConfig.tips }}</span>
      </template>
      <template v-else>
        <span v-if="fConfig.fileType">只能上传{{ fConfig.fileType }}类型文件</span>
        <i v-if="fConfig.fileType && fConfig.fileSize">，</i>
        <span v-if="fConfig.fileSize">文件大小不能超过{{ fConfig.fileSize }}KB</span>
      </template>
    </div>
  </el-row>
</template>

<script>
  import { Upload } from 'element-ui'
  import { isArray, isString, isPlainObject } from 'lodash-es'
  import SYSTEM from '@/utils/system'
  export default {
    name: 'app-upload',
    components: {
      [Upload.name]: Upload
    },
    props: {
      action: String,
      field: String,
      value: [String, Array, Object],
      index: [String, Number],
      row: Object,
      col: Object,
      readonly: Boolean,
      config: Object
    },
    data() {
      return {
        baseUrl: SYSTEM.baseUrl,
        headers: {
          'Authorization':  'Bearer ' + SYSTEM.userToken()
        },
        files: [],
        uploading: false
      }
    },
    computed: {
      fConfig() {
        let opt = {
          // 最大上传个数
          max: '',
          // 是否可预览（图片缩略图）
          preview: false,
          // 上传文件备注
          remark: false,
          // 是否提示（可上传文件类型和文件大小 String, Boolean）
          tips: false,
          // 达到最大上传个数是否隐藏上传按钮
          hideBtn: false,
          // 上传按钮图标
          btnIcon: '',
          // 限定上传文件类型
          fileType: '',
          // 限定上传文件大小
          fileSize: 1024 * 1024 * 5,
          // 输出的数据类型  string，array, arrayString, object 
          dataType: 'string',
          
          urlKey: 'fileUrl',
          nameKey: 'fileName',
          remarkKey: 'remark'
        }

        return Object.assign({}, opt, this.config)
      },
      showFileList() {
        return this.files.length && (!this.fConfig.preview || (!this.fConfig.max || this.fConfig.max > 1))
      },
      showUploadBtn() {
        return this.files.length < this.fConfig.max || !this.fConfig.max || (this.files.length == this.fConfig.max && !this.fConfig.hideBtn)
      }
    },
    watch: {
      value: {
        handler(newval) {
          this.initFiles(newval)
        },
        deep: true
      }
    },
    methods: {
      initFiles(data) {
        if(isString(data) && data) {
          this.files = data.split(',').map(v => ({
            [this.fConfig.nameKey]: v,
            [this.fConfig.urlKey]: v
          }))
        } else if(isPlainObject(data)) {
          let isNull = true
          for(let k in data) {
            if(data[k]) {
              isNull = false
            }
          }
          if(isNull) {
            this.files = []
          } else {
            this.files = [data]
          }
        }else if(isArray(data)) {
          if(data.every(v => isString(v))) {
            this.files = data.map(v => ({
              [this.fConfig.nameKey]: v,
              [this.fConfig.urlKey]: v
            }))
          } else {
            this.files = data || []
          }
        }
      },
      //上传之前的事件
      beforeUpload(file) {
        let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        let typePass = ~this.fConfig.fileType.indexOf(fileType) || !this.fConfig.fileType
        let sizePass = file.size < this.fConfig.fileSize || !this.fConfig.fileSize
        let limitNotice = this.conver(this.fConfig.fileSize)

        !typePass && this.$msgError(`上传文件只能是 ${ this.fConfig.fileType } 格式!`)
        !sizePass && this.$msgError(`上传文件大小不能超过 ${ limitNotice }!`)

        if (typePass && sizePass) {
          this.uploading = true
        }

        return typePass && sizePass
      },
      conver(limit) {  
        let size = ''
        if( limit < 0.1 * 1024 ) { //如果小于0.1KB转化成B  
          size = limit.toFixed(2) + 'B'
        } else if(limit < 0.1 * 1024 * 1024 ) {//如果小于0.1MB转化成KB  
          size = (limit / 1024).toFixed(2) + 'KB'
        } else if(limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB  
          size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
        } else { //其他转化成GB  
          size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
        }  
          
        var sizestr = size + ''
        var len = sizestr.indexOf('.')
        var dec = sizestr.substr(len + 1, 2)

        if(dec == '00') {//当小数点后为00时 去掉小数部分 
          return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
        }

        return sizestr
      },
      // 上传成功的事件
      handleUploadSuccess(res, file) {
        let fileName = file.name
        let fileUrl = res.data || ''
        let len = this.files.length
        let fileItem = {
          [this.fConfig.urlKey]: fileUrl,
          [this.fConfig.nameKey]: fileName
        }

        this.uploading = false

        this.fConfig.remark && (fileItem[this.fConfig.remarkKey] = '')
        
        len == this.fConfig.max && this.files.shift()

        this.files.push({ ...fileItem })

        this.filesChange()
      },
      // 上传失败
      handleUploadError() {
        this.uploading = false
        this.$msgError('上传失败，请稍后再试！')
      },
      // 点击预览
      handleItemClick(file) {
        this.$emit('nodeClick', file)
      },
      // 删除事件
      removeFile(index) {
        this.files.splice(index, 1)
        this.filesChange()
      },
      filesChange() {
        let data = {
          object: this.files[0],
          string: this.files.map(v => v[this.fConfig.urlKey]).join(','),
          array: this.files,
          arrayString: this.files.map(v => v[this.fConfig.urlKey])
        }[this.fConfig.dataType]

        this.$emit('change', {
          index: this.index,
          value: data,
          field: this.field || '',
          row: this.row || '',
          col: this.col || ''
        })
      }
    },
    mounted() {
      this.initFiles(this.value)
    }
  }
</script>

<style lang="less">
.app-upload {
  font-size: 0;
  .inline-item,
  .el-upload {
    display: inline-block;
    position: relative;
    vertical-align: middle;
  }
  .file-img {
    display: inline-block;
    width: 66px;
    height: 66px;
    padding: 2px;
    border-radius: 4px;
    vertical-align: middle;
    border-width: 1px;
    border-style: dashed;
  }
  .upload-btn {
    position: relative;
    vertical-align: middle;
    &.icon-btn {
      width: 66px;
      height: 66px;
      padding: 0;
      font-size: 0;
      background: none;
      border-style: dashed;
      text-align: center;
      &::before {
        font-size: 20px;
      }
    }
  }
  .file-list {
    display: inline-block;
    margin-right: 10px;
    vertical-align: middle;
    line-height: 1;
  }
  .file-item {
    display: inline-block;
    position: relative;
    & + .file-item {
      margin-left: 10px;
    }
    & + .upload-btn {
      margin-left: 10px;
    }
    &:hover {
      .file-btn-del {
        display: block;
        cursor: pointer;
      }
    }
    .file-btn-del {
      display: none;
      position: absolute;
      font-size: 18px;
      top: -6px;
      right: -6px;
      color: red;
    }
    .file-remark {
      display: block;
      margin-top: 5px;
      .el-input__inner {
        display: block;
        max-width: 100px;
        height: 25px;
      }
    }
  }
  .file-con {
    display: block;
    position: relative;
    width: 100%;
    .el-button {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .el-upload__tip {
    height: 28px;
    line-height: 28px;
  }
}
</style>