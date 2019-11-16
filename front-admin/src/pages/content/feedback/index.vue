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
          <span class="title">意见反馈列表</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary" @click="handleMultiMark">标记为已处理</el-button>
          <el-button type="danger" @click="handleMultiDel">删除</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/feedback"
        columnType="selection"
        :params="tableParams"
        :columns="columns"
        @selection-change="tableSelect"
      />
    </el-card>
    <app-dialog
      :width="dialogWidth"
      :height="dialogHeight"
      :title="dialogTitle"
      :visible="dialogVisible"
      @close="closeDialog"
    >
      <component
        v-if="dialogVisible"
        :is="dialogComponent"
        :row="dialogForm"
        @submit="formSubmit"
        @cancel="closeDialog"
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
  import AppTableImgs from '@/components/app-table/lib/imgs'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    components: {
      Detail: () => import("./detail"),
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        columns: [
          {
            label: '序号',
            field: 'index',
            width: 70
          },{
            label: '反馈人昵称',
            field: 'userName',
          },{
            label: 'ID号',
            field: 'id',
          },{
            label: '反馈时间',
            field: 'feedBackTime',
          },{
            label: '反馈内容',
            field: 'content',
          },{
            label: '状态',
            field: 'dealStatus',
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
            label: '处理人',
            field: 'dealer'
          },{
            label: '处理时间',
            field: 'dealTime'
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 200,
            type: 'button',
            formater: (row) => {
              let arr = ['查看', '删除']
              if (row.dealStatus != 1) {
                arr = ['标记为已处理', ...arr]
              }
              return arr
            },
            on: {
              click: ({ row, index }) => {
                let types = ['detail', 'del']
                if (row.dealStatus != 1) {
                  types = ['mark', ...types]
                }
                this.handleBtnAction(row, types[index])
              }
            }
          }
        ]
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            label: '反馈时间：',
            field: ['startTime', 'endTime'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10
          },
          {
            label: '状态：',
            field: 'dealStatus',
            type: 2,
            options: this.$t('rs.dealStatus')
          },
          {
            label: '关键词：',
            field: 'keyword',
            type: 1
          }
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
          if ('id' in form) {
            await this.feedbackUpdate(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('修改成功')
          }
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        try {
          switch (type) {
            case 'detail':
              this.dialogWidth = '600px'
              this.dialogTitle = '反馈意见详情'
              this.dialogForm = row
              this.dialogComponent = 'Detail'
              this.dialogVisible = true
              break;
            case 'mark':
              await this.$confirm('确认将此意见反馈标记为已处理吗?', '温馨提示', { type: 'warning' })
              await this.feedbackMark(row.id)
              this.$msgSuccess('操作成功！')
              this.refreshTable()
              break;
            case 'del':
              await this.$confirm('确认删除此意见反馈吗?', '温馨提示', { type: 'warning' })
              await this.feedbackDel(row.id)
              this.$msgSuccess('操作成功！')
              this.refreshTable()
              break;
          }
        } catch (error) {
          
        }
      },
      async handleMultiDel() {
        if (this.tableSelected.length) {
          try {
            let ids = this.tableSelected.map(v => v.id).join(',')
            await this.$confirm('确认删除选中的意见反馈吗?', '温馨提示', { type: 'warning' })
            await this.feedbackDel(ids)
            this.$msgSuccess('操作成功！')
            this.refreshTable()
          } catch (error) {
            
          }
        } else {
          this.$msgError('请选择需要删除的数据')
        }
      },
      async handleMultiMark() {
        if (this.tableSelected.length) {
          try {
            let ids = this.tableSelected.map(v => v.id).join(',')
            await this.$confirm('确认将选中的意见反馈标记为已处理吗?', '温馨提示', { type: 'warning' })
            await this.feedbackMark(ids)
            this.$msgSuccess('操作成功！')
            this.refreshTable()
          } catch (error) {
            
          }
        } else {
          this.$msgError('请选择需要标记的数据')
        }
      },
      ...mapActions('content', [
        'feedbackAdd',
        'feedbackUpdate',
        'feedbackMark',
        'feedbackDel',
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>
