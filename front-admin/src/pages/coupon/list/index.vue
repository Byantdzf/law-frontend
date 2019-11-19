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
          <span class="title">优惠券</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary" @click="handleBtnAction({}, 'add')">新增</el-button>
          <el-button type="danger" @click="handleMultiDel">删除</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/pc/coupon/pool"
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
      :full="dialogIsFull"
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
  import AppHtmlText from '@/components/app-table/lib/htmlText'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    components: {
      Edit: () => import("../form"),
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        columns: [
          {
            label: '编号',
            field: 'index',
            width: 70
          },{
            label: '优惠券名称',
            field: 'couponName',
          },{
            label: '优惠券种类',
            field: 'scene',
            formater: ({ scene }) => this.$t('rs.couponScene')[scene]
          },{
            label: '类型',
            field: 'type',
            width: 80,
            formater: ({ type }) => this.$t('rs.couponType')[type]
          },{
            label: '描述',
            field: 'remark',
          },{
            label: '发放总数',
            field: 'sendCount',
            width: 80,
            align: 'center'
          },{
            label: '领取总数',
            field: 'getCount',
            width: 80,
            align: 'center'
          },{
            label: '使用总数',
            field: 'useCount',
            width: 80,
            align: 'center'
          },{
            label: '未使用总数',
            field: 'remainCount',
            width: 90,
            align: 'center'
          },{
            label: '起止时间',
            field: 'rangeStartTime',
            component: AppHtmlText,
            propsHandler ({ col, row }) {
              const html = `
                <p>${row.rangeStartTime}</p>
                <p>${row.rangeEndTime}</p>
              `
              return {
                col,
                row,
                html
              } 
            }
          },{
            label: '状态',
            field: 'dataStatus',
            width: 70,
            align: 'center',
            rs: 'status',
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
            width: 100,
            type: 'button',
            // default: '修改',
            items: ['修改', '删除'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, ['edit', 'del'][index])
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
            label: '优惠券种类',
            field: 'scene',
            type: 2,
            options: this.$t('rs.couponScene')
          },
          {
            label: '有效时间',
            field: ['rangeStartTime', 'rangeEndTime'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10
          },
          {
            label: '名称',
            field: 'couponName',
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
          if ('id' in form) {
            await this.couponUpdate(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('修改成功')
          } else {
            await this.couponAdd(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('添加成功')
          }
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        let res = {}
        switch (type) {
          case 'del':
            await this.$confirm('确认删除此优惠券吗?', '温馨提示', { type: 'warning' })
            await this.couponDel(row.id)
            this.$msgSuccess('操作成功！')
            this.refreshTable()
            break;
          case 'add':
            this.dialogIsFull = true
            this.dialogTitle = '新增优惠券'
            this.dialogForm = null
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
          case 'edit':
            this.dialogIsFull = true
            this.dialogTitle = '编辑优惠券'
            this.dialogForm = row
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
        }
      },
      async handleMultiDel() {
        if (this.tableSelected.length) {
          try {
            let ids = this.tableSelected.map(v => v.id).join(',')
            await this.$confirm('确认删除选中的优惠券吗?', '温馨提示', { type: 'warning' })
            await this.couponDel(ids)
            this.$msgSuccess('操作成功！')
            this.refreshTable()
          } catch (error) {
            
          }
        } else {
          this.$msgError('请选择需要删除的数据')
        }
      },
      ...mapActions('system', [
        'couponAdd',
        'couponUpdate',
        'couponDel'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>
