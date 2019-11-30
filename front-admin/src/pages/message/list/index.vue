<template>
  <el-row>
    <el-card class="search-card">
      <app-form
        class="app-search"
        :init="searchFormInit"
        :items="searchItems"
        :btns="searchBtns"
        @confirm="confirmSearch"
        @reset="confirmSearch"
        ref="searchForm"
      />
    </el-card>
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">信息推送</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary"  @click="handleBtnAction({}, 'add')">新增</el-button>
          <el-button type="primary" @click="handleBtnAction({}, 'edit')" >修改</el-button>
          <el-button type="primary" @click="delMessage">删除</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/platform/msg/show/msg"
        columnType="selection"
        :params="tableParams"
        :columns="columns"
        :columns-props="columnsProps"
        @selection-change="tableSelect"
      />
    </el-card>
    <app-dialog
      :width="dialogWidth"
      :height="dialogHeight"
      :title="dialogTitle"
      :visible="dialogVisible"
      :full="dialogIsFull"
      @close="closeDialog"
    >
      <component
        v-if="dialogVisible"
        :is="dialogComponent"
        :row="dialogForm"
        @submit="submit"
        @cancel="closeDialog"
        :dialogIsFull="dialogIsFull"
        ref="dialogComponent"
      />
    </app-dialog>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import AppTable from '@/mixins/table'
  import AppDialog from '@/mixins/dialog'
  import AppSearch from '@/mixins/search'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    components: {
      Detail: () => import("./detail.vue"),
      Edit: () => import("./edit.vue"),
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        columns: [
          {
            label: '编号',
            field: 'index',
            width: 100
          },{
            label: '类型',
            field: 'msgType',
            formater: ({ msgType }) => this.$t('rs.msgType')[msgType]
          },{
            label: '标题',
            field: 'title',
          },{
            label: '内容',
            field: 'content',
          },{
            label: '发送用户',
            field: 'receiver',
          },{
            label: '发送时间',
            field: 'createTime',
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            items: ['查看','修改'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row,index == 0 ? 'view' : 'edit')
              }
            }
          }
        ],
        columnsProps: {
          minWidth: 100,
        },
        selectedRows: []
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            label: '&nbsp;',
            field: 'operateDetails',
            type: 1,
          },
        ]

        this.searchBtns = [
          {
            label: '确认',
            code: 'confirm'
          }, {
            label: '重置',
            code: 'reset',
            type: 'default'
          }
        ]
      },
      // 表单提交
      async formSubmit(form) {
        try {
          const searchForm = this.$refs.searchForm
          const tenantId = this.$val(form, 'tenant.id')
          let params = form
          await this.addMessage(params)
          this.refreshTable()
        } catch (e) {
          // error
        }
      },
      async formChangeSubmit(form) {
        try {
          const searchForm = this.$refs.searchForm
          const tenantId = this.$val(form, 'tenant.id')
          form.id = this.dialogForm.id;
          let params = form
          await this.updateMessage(params)
          this.refreshTable()
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        let res = {}
        switch (type) {
          case 'detail':
            // this.dialogWidth = '800px'
            res = await this.getMessageDetail(row.id)
            this.dialogForm = res.data || {}
            this.dialogComponent = 'Detail'
            this.dialogVisible = true
            break;
          case 'view':
            this.dialogIsFull = true
            this.dialogTitle = '消息详情'
            res = await this.getMessageDetail(row.id)
            this.dialogForm = res.data
            this.dialogComponent = 'Detail'
            this.dialogVisible = true
            this.submit = ()=>{}
            break;
          case 'edit':
            this.dialogIsFull = true
            this.dialogTitle = '消息修改'
            res = await this.getMessageDetail(row.id)
            this.dialogForm = res.data
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            this.submit = this.formChangeSubmit
            break;
          case 'add':
            this.dialogIsFull = true
            this.dialogTitle = '新增信息'
            this.dialogForm = null
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            this.submit = this.formSubmit
            break;
        }
      },
      tableSelect(val){
        this.selectedRows = val
      },
      async delMessage(){
        let names = this.selectedRows.map(item=>item.title).join("、");
        let tips = `确认删除消息${names}吗`
        await this.$confirm(tips, '温馨提示', { type: 'warning' })
        let idList = this.selectedRows.map(item=>item.id).join(",")
        await this.removeMessage(idList);
        this.refreshTable()
      },
      ...mapActions('message', [
        'addMessage',
        'removeMessage',
        'updateMessage',
        'getMessageDetail'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>
