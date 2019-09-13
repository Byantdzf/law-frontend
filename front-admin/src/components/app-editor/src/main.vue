<template>
  <div class="app-editor">
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  import '../../../../public/static/UE/ueditor.config.js'
  import '../../../../public/static/UE/ueditor.all.min.js'
  import '../../../../public/static/UE/lang/zh-cn/zh-cn.js'
  import '../../../../public/static/UE/ueditor.parse.js'

  const UE = window.UE || {}
  
  export default {
    name: "app-editor",
    props: {
      value: {
        type: String,
        default: ''
      },
      config: {
        type: Object
      },
      index: [String, Number],
      row: Object,
      col: Object,
      field: String,
    },
    data() {
      return {
        editor: null,
        UEConfig: {
          //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
          toolbars:[['Source', 'bold', 'italic', 'underline', 'forecolor', 'backcolor', 'fontborder', 'fontfamily', 'fontsize', 'Undo', 'Redo','Bold','test', '|', 'removeformat', 'formatmatch', 'autotypeset' , 
          'rowspacingtop', 'rowspacingbottom', 'lineheight', '|', 
          'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'simpleupload', 'insertvideo']],
          //focus时自动清空初始化时的内容
          autoClearinitialContent: false,
          //关闭字数统计
          wordCount: false,
          //关闭elementPath
          elementPathEnabled: false,
          //超出高度出现滚动条
          autoHeightEnabled: true,
          catchRemoteImageEnable: false,
          initialFrameWidth: 'auto',
          //默认的编辑区域高度
          initialFrameHeight: 300,
          scaleEnabled: true,
          //更多其他参数，请参考ueditor.config.js中的配置项
          serverUrl: process.env.BASE_URL + 'ueditor/controller'
        },
        content: ''
      }
    },
    computed: {
      editorContent() {
        let c = this.content
        if(this.editor) {
          c = this.editor.getContent()
        }
        return c
      }
    },
    watch: {
      // 监听value值变化
      value (newval) {
        this.content = newval;
      }
    },
    methods: {
      
    },
    activated() {
      if(this.editor) {
        this.editor.destroy()
      }
      let _this = this
      let config = { ...this.UEConfig, ...this.config }
      this.editor = UE.getEditor("editor", config) // 初始化UE
      this.editor.addListener("ready", function() {
        let _val = _this.value ? JSON.parse(JSON.stringify(_this.value)) : ''
        _this.editor.setContent(_val) // 确保UE加载完成后，放入内容。
      });

      this.editor.addListener("contentChange", function() {
        const content = _this.editor.getContent()
        _this.content = content
        _this.$emit("change", {
          index: _this.index,
          value: content,
          field: _this.field || '',
          row: _this.row || '',
          col: _this.col || ''
        })
      })
    },
    deactivated() {
      this.editor.destroy()
    }
  }
</script>
<style lang="less">
.app-editor {
  .edui-box {
    line-height: 22px;
  }
}
</style>

