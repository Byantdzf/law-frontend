<template>
  <el-row class="coupon-form-wrapper">
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="发布对象">
        <el-radio-group v-model="form.allMembers">
          <el-radio v-for="item in statusItems" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="消息内容">
        <el-input v-model="form.content" type="textarea"></el-input>
      </el-form-item>
      <el-form-item class="ta-c">
        <el-button size="default" class="btn-submit" type="primary" @click="formSubmit">发布</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex'
import AppTable from '@/mixins/table'
import AppSearch from '@/mixins/search'
import AppDialog from '@/mixins/dialog'
import AppRsText from '@/components/app-table/lib/rsText'
import AppTableImgs from '@/components/app-table/lib/imgs'
export default {
  components: {
    Edit: () => import("@/pages/member/consultants/edit"),
  },
  mixins: [AppTable, AppSearch, AppDialog],
  props: {
    row: Object
  },
  data() {
    const getItems = (key) => {
      let arr = []
      for(let k in this.$t(`rs.${key}`)) {
        arr.push({
          id: +k,
          name: this.$t(`rs.${key}`)[k]
        })
      }
      return arr
    }
    let statusItems = getItems('publishObject')
    let sceneItems = getItems('couponScene')
    let typeItems = getItems('couponType')

    return {
      statusItems,
      sceneItems,
      typeItems,
      form: {
        allMembers: +this.$val(this.row, 'allMembers', 1),
        title: this.$val(this.row, 'title'),
        content: this.$val(this.row, 'content')
      },
      useTarget: '1',
      columns: [
          {
            label: '序号',
            field: 'index',
            width: 70
          },{
            label: '微信头像',
            field: 'avatarUrl',
            width: 100,
            component: AppTableImgs
          },{
            label: '微信昵称',
            field: 'name',
          },{
            label: '手机号',
            field: 'phone',
          },{
            label: '近一周登陆次数',
            field: 'loginCount',
            align: 'center',
          },{
            label: '最近登陆时间',
            field: 'createTime',
            align: 'center',
          },{
            label: '下单次数',
            field: 'orderCount',
            width: 100,
            align: 'center'
          },{
            label: '状态',
            field: 'status',
            width: 100,
            align: 'center',
            component: AppRsText,
            propsHandler ({ col, row }) {
              return {
                col,
                row,
                type: row[col.prop] == 1 ? 'success' : 'danger'
              } 
            }
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            items: ['查看'],
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, 'detail')
              }
            }
          }
        ],
        showHeaderTab: false,
        curDialogTab: ''
    }
  },
  watch: {
    useTarget() {
      this.tableSelected = []
    }
  },
  methods: {
    // 初始化页面
    initPage() {
      this.$set(this.searchFormInit, 'align', 'left')

      this.searchItems = [
        {
          labelWidth: '70px',
          label: '状态：',
          field: 'status',
          type: 2,
          options: this.$t('rs.status')
        },
        {
          label: '最近登录时间：',
          field: ['startTime', 'endTime'],
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          type: 10
        },
        {
          labelWidth: '70px',
          label: '关键词：',
          field: 'keyword',
          type: 1,
          placeholder: '微信号、微信昵称'
        },
      ]

      this.searchBtns = [
        {
          label: '确认',
          code: 'confirm'
        }
      ]
    },
    async handleBtnAction(row, type) {
        let res = {}
        let data = {}
        this.dialogIsFull = true
        switch (type) {
          case 'detail':
            this.curDialogTab = 'detail'
            this.showHeaderTab = true
            res = await this.memberView(row.id)
            data = res.data || {}
            data.id = row.id
            this.dialogForm = data
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
        }
      },
    // 表单提交
    formSubmit() {
      let params = { ...this.form }
      if(this.row && this.row.hasOwnProperty('id')) {
        params.id = this.row.id
      }
  
      this.$emit('submit', params)
    },
    ...mapActions('member', [
      'memberView',
    ])
  },
  mounted() {
    this.initPage()
  }
}

</script>

<style lang="less">
  .coupon-form-wrapper {
    .el-form-item {
      width: 600px;
    }
    .table-box {
      padding: 20px;
      border: 1px solid #f3f3f3;
      .app-form.el-form .el-form-item {
        display: inline-block;
        width: auto;
        .el-select {
          width: 120px;
        }
      }
    }
  }
</style>
