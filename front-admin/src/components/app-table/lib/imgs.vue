<template>
  <div class="app-table-imgs">
    <el-image 
      v-for="(item, idx) in imgs"
      :key="idx"
      :src="`${item[srcKey]}?x-oss-process=image/resize,m_fill,w_66,h_66`"
      :preview-src-list="urls"
      @click.native="cellClick(item, idx)"
    >
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
  </div>  
</template>

<script>
  import { isArray, isString, isPlainObject } from 'lodash-es'
  export default {
    name: 'app-table-imgs',
    inheritAttrs: false, 
    props: {
      row: Object,
      col: Object,
      items: [Array, String],
      srcKey: {
        type: String,
        default: 'fileUrl'
      },
      nameKey: {
        type: String,
        default: 'fileName'
      }
    },
    computed: {
      imgs() {
        let items = this.items || this.row[this.col.prop] 
        let arr = isString(items) ? items.split(',').filter(v => v) : (isArray(items) ? items : [])

        return arr.reduce((res, cur) => {
          if(isString(cur)) {
            res.push({
              [this.srcKey]: cur,
              [this.nameKey]: cur
            }) 
          } else if(isPlainObject(cur)) {
            res.push(cur)
          }

          return res
        }, [])
      },
      urls() {
        return this.imgs.map(v => v[this.srcKey])
      }
    },
    methods: {
      cellClick(item, index) {
        this.$emit('click', {
          item,
          index,
          row: this.row,
          col: this.col
        })
      }
    }
  }
</script>

<style lang="less">
  .app-table-imgs__item {
    display: inline-block;
    max-width: 50px;
    max-height: 50px;
    vertical-align: middle;
    img {
      width: 100%;
    }
    & + .app-table-imgs__item {
      margin-left: 8px;
    }
  }
</style>


