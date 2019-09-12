<template>
  <div class="ib page-area-col infinite-list-wrapper" :style="`height: ${ boxHeight }px;`">
    <ul class="pt-10 pb-10" v-infinite-scroll="loadMore">
      <li
        v-for="(item, index) in list"
        :class="['item', { active: currentIndex == index, 'is-edit': item.isEdit }]"
        :key="index"
        :style="`height: ${ itemHeight }px;line-height: ${ itemHeight }px;`"
        @click="handleItemClick(item, index)"
        @dblclick.stop="handleItemBdClick(item, index)"
      >
        <template v-if="item.isEdit">
          <el-input class="item-input" v-model="item.name" @click.native.stop></el-input>
          <span class="btn-group">
            <i class="cl-primary" @click="handleSave(item, index)">保存</i>
            <i class="cl-danger" @click="handleCancel(item, index)">取消</i>
          </span>
        </template>
        <template v-else>
          <!-- <span>{{ item.name }}</span> -->
          <el-tooltip
            :disabled="itemShowTooltip(item.name)"
            :content="item.name"
            placement="top"
            effect="light"
          >
            <span class="ib con">{{ item.name }}</span>
          </el-tooltip>
        </template>
      </li>
      <li class="pt-20">
        <el-button
          v-if="showAddBtn && !hasNewOne"
          class="w100"
          icon="el-icon-plus"
          type="primary"
          plain
          @click="handleAdd"
        >
          新增
        </el-button>
      </li>
    </ul>     
  </div>
</template>

<script>
  import Vue from 'vue'
  import { InfiniteScroll } from 'element-ui'
  import { mapActions } from 'vuex'
  Vue.use(InfiniteScroll)

  export default {
    props: {
      items: {
        type: Array,
        required: true
      },
      count: {
        type: Number,
        default: 15
      },
      itemHeight: {
        type: Number,
        default: 40
      },
      currentIndex: {
        type: Number,
        default: 0
      },
      showAddBtn: Boolean,
      level: [Number, String],
      type: [Number, String],
      parentId: [Number, String]
    },
    data() {
      return {
        list: [],
        hasNewOne: false,
        hasEditOne: false,
        editRow: null
      }
    },
    computed: {
      boxHeight() {
        return this.count * this.itemHeight
      }
    },
    watch: {
      items() {
        this.init()
      }
    },
    methods: {
      // 初始化
      init() {
        this.prevIndex = -1
        this.list = []
        this.listAll = this.items.map(v => {
          v.isEdit = false
          return v
        })

        this.list = this.listAll.splice(0, this.count)
      },
      itemShowTooltip(str = '') {
        const itemEl = document.querySelector('.page-area-col ul li')
        const len = str.gblen()
        if (itemEl && (len * 8 > itemEl.offsetWidth)) {
          return false
        }

        return true
      },
      // 加载更多
      loadMore() {
        if(this.listAll.length) {
          this.list = this.list.concat(this.listAll.splice(0, this.count))
        }
      },
      // 单击切换
      handleItemClick(item, index) {
        if (this.currentIndex !== index) {
          this.$emit('change', { item, index })
          this.$emit('update:currentIndex', index)
        }
      },
      // 双击切换编辑状态
      handleItemBdClick(item, index) {
        if (item.id && !item.isEdit) {
          if (~this.prevIndex) {
            this.$set(this.list, this.prevIndex, Object.assign(this.editRow, { isEdit: false }))
          }
          this.$set(this.list, index, Object.assign(item, { isEdit: true }))
          this.prevIndex = index
          this.editRow = { ...item }
          this.hasEditOne = true
        }
      },
      // 点击添加按钮
      handleAdd() {
        this.list.push({
          name: '',
          isEdit: true
        })
        // 存在新添加且未保存的
        this.hasNewOne = true
      },
      // 点击取消
      handleCancel(item, index) {
        if (item.hasOwnProperty('id')) {
          this.$set(this.list, index, Object.assign(item, {
            name: this.editRow.name,
            isEdit: false
          }))
          this.hasEditOne = false
          this.prevIndex = -1
        } else {
          this.list.pop()
          this.hasNewOne = false
        }
      },
      // 点击保存
      async handleSave(item, index) {
        let params = {
          name: item.name,
          parentId: this.parentId,
          type: this.type,
          level: this.level
        }

        if (!params.name) {
          this.$msgError('请输入名称')
          return false
        }

        if (item.hasOwnProperty('id')) {
          params.id = item.id
          this.countryCityUpdate(params).then(() => {
            this.$msgSuccess('编辑成功')
            this.$set(this.list, index, Object.assign(item, { isEdit: false }))
            this.hasNewOne = false
            this.prevIndex = -1
            this.$emit('listUpdate', { item, index })
          })
        } else {
          this.countryCityAdd(params).then(res => {
            this.$msgSuccess('添加成功')
            item.isEdit = false
            item.id = res.data
            this.hasNewOne = false
            this.$emit('listUpdate', { item, index })
          })
        }
      },
      ...mapActions('data', [
        'countryCityAdd',
        'countryCityUpdate'
      ])
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="less">
  .infinite-list-wrapper {
    overflow: auto;
    .item {
      position: relative;
      padding: 0 10px;
      border-radius: 4px;
      
      cursor: pointer;
      &.is-edit {
        .el-input__inner {
          border: 0;
          padding-left: 0;
          padding-right: 70px;
        }
      }
      .con {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .btn-group {
      position: absolute;
      top: 0;
      right: 6px;
      i {
        padding: 0 4px;
        font-style: normal;
      }
    }
  }
</style>