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
          <span class="title">敏感词管理</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary" @click="handleBtnAction({}, 'add')">新增</el-button>
          <el-button type="danger" @click="handleMultiDel">删除</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/sensitive"
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
      Edit: () => import("./edit")
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
            label: '敏感词',
            field: 'sensitiveName',
          },{
            label: '状态',
            field: 'status',
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
            label: '更新时间',
            field: 'updateTime'
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            items: ['修改', '删除'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, index == 0 ? 'edit' : 'del')
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
            label: '关键词：',
            field: 'keyWord',
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
            await this.sensitiveUpdate(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('修改成功')
          } else {
            await this.sensitiveAdd(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('添加成功')
          }
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        try {
          switch (type) {
            case 'add':
              this.dialogWidth = '600px'
              this.dialogTitle = '新增敏感词'
              this.dialogForm = null
              this.dialogComponent = 'Edit'
              this.dialogVisible = true
              break;
            case 'edit':
              this.dialogWidth = '600px'
              this.dialogTitle = '编辑敏感词'
              this.dialogForm = row
              this.dialogComponent = 'Edit'
              this.dialogVisible = true
              break;
            case 'del':
              await this.$confirm('确认删除此敏感词吗?', '温馨提示', { type: 'warning' })
              await this.sensitiveDel(row.id)
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
            await this.$confirm('确认删除选中的敏感词吗?', '温馨提示', { type: 'warning' })
            await this.sensitiveDel(ids)
            this.$msgSuccess('操作成功！')
            this.refreshTable()
          } catch (error) {
            
          }
        } else {
          this.$msgError('请选择需要删除的数据')
        }
      },
      ...mapActions('content', [
        'sensitiveAdd',
        'sensitiveUpdate',
        'sensitiveDel'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>
