<template>
  <el-row class="coupon-form-wrapper">
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="发布对象">
        <el-radio-group v-model="form.allMembers">
          <el-radio v-for="item in statusItems" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.allMembers==0">
          <app-table 
            ref="appTable"
            url="/mng/message/member/list"
            :filter="true"
            :selectedRowKeys="selectedRowKeys"
            :columns="columns"
            @selection-change="tableSelect"
            
        />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="消息内容">
        <el-input v-model="form.content" type="textarea"></el-input>
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
    let selectedRows = this.row.receiverId.split(",")

    return {
      statusItems,
      sceneItems,
      typeItems,
      selectedRowKeys: selectedRows,
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
            label: '角色',
            field: 'avatarUrl',
            width: 100,
            component: AppTableImgs
          },{
            label: '昵称',
            field: 'name',
          },{
            label: 'ID',
            field: 'phone',
          }
        ],
        showHeaderTab: false,
        curDialogTab: '',
        // tableParams: {
        //     ...this.tableParams,
        //     name: this.$val(this.row, 'receiver', 1)
        // }
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
